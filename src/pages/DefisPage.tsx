import { useDefis } from '@/hooks/useDefis';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const DefisPage = () => {
  const { connectedUsers, challengeReceived, sendChallenge, respondToChallenge} = useDefis();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-12 text-indigo-900">
          Défis en direct 🔥
        </h1>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Joueurs connectés ({connectedUsers.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connectedUsers.map((u) => (
              <motion.div
                key={u.Nom}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg flex flex-col items-center gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center text-2xl font-bold">
                  {u.username[0].toUpperCase()}
                </div>
                <span className="text-xl font-semibold">{u.username}</span>
                <button
                  onClick={() => sendChallenge(u.username)}
                  className="bg-white text-indigo-600 px-6 py-3 rounded-full font-bold hover:bg-indigo-100 transition transform hover:scale-105"
                >
                  Défier
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pop-up défi reçu */}
        {challengeReceived && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-10 max-w-lg w-full shadow-2xl border-4 border-indigo-500"
            >
              <h2 className="text-3xl font-bold text-center mb-6 text-indigo-800">
                Défi reçu !
              </h2>
              <p className="text-center text-xl mb-10">
                <span className="font-extrabold text-purple-600">{challengeReceived.from_username}</span> te défie !
              </p>

              <div className="flex gap-6 justify-center">
                <button
                  onClick={() => respondToChallenge(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-10 py-5 rounded-2xl text-xl font-bold transition transform hover:scale-105 shadow-lg"
                >
                  Accepter !
                </button>
                <button
                  onClick={() => respondToChallenge(false)}
                  className="bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-2xl text-xl font-bold transition transform hover:scale-105 shadow-lg"
                >
                  Refuser
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DefisPage;