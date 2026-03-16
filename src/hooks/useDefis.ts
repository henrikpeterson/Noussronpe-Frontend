// src/hooks/useDefis.ts
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface ConnectedUser {
  id: number;
  username: string;
  Nom?: string;
  isOnline: boolean;
}

interface Challenge {
  from_username: string;
  from_id?: number;
  message: string;
}

export const useDefis = () => {
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);
  const [challengeReceived, setChallengeReceived] = useState<Challenge | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const navigate = useNavigate();
  const token = localStorage.getItem('students_access_token');

  useEffect(() => {
    if (!token) {
      console.warn('Pas de token → websocket impossible');
      return;
    }

    const ws = new WebSocket(`ws://192.168.1.69:8000/ws/lobby/?token=${token}`);

    ws.onopen = () => console.log('Connecté au lobby');

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Liste complète au démarrage (synchronisation)
        if (data.type === 'connected_users') {
          setConnectedUsers(
            data.users.map((u: any) => ({
              id: u.id,
              username: u.username,
              Nom: u.Nom,
              isOnline: true,
            }))
          );
        }

        // Nouvel arrivant
        if (data.type === 'user_connected') {
          setConnectedUsers((prev) => {
            if (prev.some(u => u.username === data.username)) return prev;
            return [...prev, {
              id: data.id,
              username: data.username,
              Nom: data.Nom,
              isOnline: true,
            }];
          });
        }

        // Départ
        if (data.type === 'user_disconnected') {
          setConnectedUsers((prev) => prev.filter(u => u.username !== data.username));
        }

        // Défi reçu
        if (data.type === 'challenge.sent') {
          setChallengeReceived({
            from_username: data.from_username,
            from_id: data.from_id,
            message: data.message || `${data.from_username} te défie !`,
          });
          toast(`${data.from_username} te défie !`, { icon: '⚔️' });
        }

        // Acceptation
        if (data.type === 'challenge.accepted') {
          toast.success(`${data.to_username} a accepté ton défi !`);
          if (data.session_id) navigate(`/game/${data.session_id}`);
        }

        // Refus
        if (data.type === 'challenge.rejected') {
          toast.error(`${data.to_username} a refusé ton défi 😔`);
        }
      } catch (e) {
        console.error('Erreur parsing :', e);
      }
    };

    ws.onclose = () => console.log('Déconnecté');
    setSocket(ws);

    return () => ws.close();
  }, [token, navigate]);

  // Envoyer un défi
  const sendChallenge = useCallback((targetUsername: string) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      toast.error('WebSocket non connecté');
      return;
    }

    socket.send(JSON.stringify({
      action: 'send_challenge',
      data: {
        target_username: targetUsername
      }
    }));

    toast.custom(`Défi envoyé à ${targetUsername} !`);
  }, [socket]);

  // Accepter / refuser
  const respondToChallenge = useCallback((accept: boolean) => {
    if (!socket || !challengeReceived) return;

    const action = accept ? 'accept_challenge' : 'reject_challenge';

    socket.send(JSON.stringify({
      action,
      data: {
        from_username: challengeReceived.from_username
      }
    }));

    setChallengeReceived(null);

    if (accept) {
      toast.success('Défi accepté !');
    } else {
      toast('Défi refusé');
    }
  }, [socket, challengeReceived]);

  return {
    connectedUsers,
    challengeReceived,
    sendChallenge,
    respondToChallenge,
  };
};