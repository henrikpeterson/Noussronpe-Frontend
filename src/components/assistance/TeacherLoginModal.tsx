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
import { teacherCredentials } from "@/data/assistance";
import { useNavigate } from "react-router-dom";

interface TeacherLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TeacherLoginModal = ({ open, onOpenChange }: TeacherLoginModalProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === teacherCredentials.username && password === teacherCredentials.password) {
      toast.success("Connexion réussie !", {
        description: "Bienvenue dans votre espace enseignant"
      });
      localStorage.setItem("isTeacher", "true");
      onOpenChange(false);
      navigate("/espace-enseignant");
    } else {
      toast.error("Identifiants incorrects", {
        description: "Veuillez vérifier votre identifiant et mot de passe"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connexion Enseignant 👨‍🏫</DialogTitle>
          <DialogDescription>
            Accédez à votre espace pour répondre aux demandes des élèves
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="username">Identifiant</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Votre identifiant"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Se connecter
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Demo: identifiant "enseignant" / mot de passe "demo123"
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherLoginModal;
