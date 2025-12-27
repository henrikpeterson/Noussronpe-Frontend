import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

//import { teacherApi } from '../teacherApi.tsx';
import teacherApi from '../../../teacherApi';


interface TeacherLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TeacherLoginModal = ({ open, onOpenChange }: TeacherLoginModalProps) => {
  const [nom, setNom] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Appel au VRAI endpoint de login
      const response = await teacherApi.post('/auth/teacher-login/', {
        Nom:nom,
        NumeroTel:phone
      });

      const { access, refresh, user } = response.data;

      // VÉRIFICATION : L'utilisateur est-il staff/enseignant ?
      if (!user.is_staff) {
        toast.error("Accès non autorisé", {
          description: "Cet espace est réservé aux enseignants uniquement"
        });
        return;
      }

      // Sauvegarde des tokens
      localStorage.setItem('teacher_access_token', response.data.access);
      localStorage.setItem('teacher_refresh_token', response.data.refresh);
      localStorage.setItem('teacher_user', JSON.stringify(user));
      
      console.log("Enseignant connecté:", response.data);
      
      toast.success("Connexion réussie !", {
        description: `Bienvenue ${user.Nom || user.Prenom}`
      });

      onOpenChange(false);
      navigate("/espace-enseignant");

    } catch (error: any) {
      console.error("Erreur login:", error);

      if (error.response?.status === 401) {
        toast.error("Identifiants incorrects", {
          description: "Vérifiez votre numéro et mot de passe"
        });
      } else {
        toast.error("Erreur de connexion", {
          description: error.response?.data?.detail || "Impossible de se connecter"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Connexion Enseignant</span>
            <div className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              Personnel uniquement
            </div>
          </DialogTitle>
          
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom complet</Label>
            <Input
              id="nom"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Votre nom complet"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Numéro de téléphone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Votre numéro de téléphone"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Utilisez les mêmes identifiants que pour l'application
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};


export default TeacherLoginModal;