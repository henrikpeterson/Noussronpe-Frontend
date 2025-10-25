import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from '../api';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import motifBackground from "@/assets/Motifs_Educatif3.png"; // 👈 ton motif

// ✅ Nouveau schéma pour nom et téléphone
const loginSchema = z.object({
  Nom: z.string().min(2, "Veuillez entrer votre nom complet"),
  NumeroTel: z
    .string()
    .min(8, "Numéro trop court")
    .max(15, "Numéro invalide")
    .regex(/^[0-9+ ]+$/, "Le numéro doit contenir uniquement des chiffres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      Nom: "",
      NumeroTel: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log("Données de connexion:", data);
    // TODO: Implémenter la logique de connexion avec nom & téléphone

    try {
      const payload ={
        Nom: data.Nom,
        NumeroTel: data.NumeroTel,
      }
      
      

      const response = await api.post("/auth/login/", payload);

      // ✅ Stocker le token JWT pour l'authentification
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      // ✅ Récupérer les informations de l'utilisateur connecté
      const userResponse = await api.get("/auth/users/me/", {
        headers: { Authorization: `Bearer ${response.data.access}` },
      });

      // ✅ Stocker les informations de l'utilisateur
      localStorage.setItem("user", JSON.stringify(userResponse.data));


      console.log("Compte créé:", response.data)
      toast({
        title: "Connexion reussie avec succes",
        description: "Amuse toi bien",
      });

      navigate("/");
      form.reset();

    } catch (error: any){
      console.error("Erreur :", error.response?.data || error.message);
      toast({
        title: "Erreur",
        description: "Numero de telephone ou Nom incorrecte. Vérifie tes informations.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundColor: "#06257aff", // bleu foncé
          backgroundImage: `url(${motifBackground})`,
          backgroundRepeat: "repeat",
          backgroundSize: "500px",
        }}
      ></div>

      <div className="relative w-full max-w-md text-sky-600">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-blue-700 mb-2">
              CONNEXION
            </h1>
            <p className="text-gray-600 font-bold">
              Accédez à votre espace d'apprentissage
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Champ nom */}
              <FormField
                control={form.control}
                name="Nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom complet</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Ex: Koffi Mawuli"
                        {...field}
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Champ téléphone */}
              <FormField
                control={form.control}
                name="NumeroTel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de téléphone</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Ex: +228 90 00 00 00"
                        {...field}
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full h-12 bg-sky-500 hover:bg-sky-400"
              >
                {form.formState.isSubmitting
                  ? "Connexion..."
                  : "Se connecter"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Pas encore de compte ?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-500 font-bold"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
