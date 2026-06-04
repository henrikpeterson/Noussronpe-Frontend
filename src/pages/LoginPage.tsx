import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LogIn, Phone, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import api from '../api';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// ✅ Schéma de connexion basé sur ton fichier d'origine
const loginSchema = z.object({
  Nom: z.string().min(2, "Entre ton nom complet"),
  NumeroTel: z.string().min(8, "Numéro trop court").max(15, "Numéro invalide"),
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

      //  Stocker le token JWT pour l'authentification

      localStorage.setItem('students_access_token', response.data.access);

      localStorage.setItem('students_refresh_token', response.data.refresh);

      //  Récupérer les informations de l'utilisateur connecté
      const userResponse = await api.get("/auth/users/me/", {
        headers: { Authorization: `Bearer ${response.data.access}` },
      });

      //  Stocker les informations de l'utilisateur
      localStorage.setItem("students_user", JSON.stringify(userResponse.data));
      console.log("Élève connecté:", response.data);

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
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-[40px] shadow-2xl flex flex-col md:flex-row overflow-hidden min-h-[600px]">
        
        {/* --- COLONNE GAUCHE (50%) : DESIGN & MOTIFS --- */}
        <div className="md:w-1/2 bg-blue-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Motifs géométriques (Identiques au Register pour la cohérence) */}
          <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-40"></div>
          <div className="absolute top-1/4 right-10 w-20 h-20 border-4 border-white/20 rotate-45 rounded-3xl"></div>
          <div className="absolute bottom-1/4 left-10 w-12 h-12 bg-white/10 rounded-full"></div>

          <div className="relative z-10">
            <h2 className="text-3xl font-black italic tracking-tighter">REVIZ+</h2>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Illustration de connexion */}
            <img 
              src="https://illustrations.popsy.co/blue/studying.svg" 
              className="max-h-80 w-auto object-contain drop-shadow-2xl animate-in zoom-in duration-700" 
              alt="Login illustration" 
            />
          </div>

          <div className="relative z-10">
            <p className="text-xl font-bold opacity-80 italic max-w-xs">
              "Heureux de te revoir ! Prêt pour une nouvelle leçon ?"
            </p>
          </div>
        </div>

        {/* --- COLONNE DROITE (50%) : FORMULAIRE COMPACT --- */}
        <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white">
          <div className="w-full max-w-sm mx-auto">
            
            <div className="mb-10">
              <h1 className="text-4xl font-black text-slate-900 mb-2">Connexion</h1>
              <p className="text-slate-500 text-lg font-medium">
                Entre tes accès pour continuer.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                
                <FormField
                  control={form.control}
                  name="Nom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-slate-700">Ton Nom complet</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-4 top-4 h-6 w-6 text-slate-400" />
                          <Input 
                            placeholder="Ex: Jean Dupont" 
                            {...field} 
                            className="h-14 rounded-2xl border-2 bg-slate-50 pl-12 font-bold focus:bg-white transition-all"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 font-bold text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="NumeroTel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-slate-700">Numéro de téléphone</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-4 top-4 h-6 w-6 text-slate-400" />
                          <Input 
                            type="tel" 
                            placeholder="+228 90 00 00 00" 
                            {...field} 
                            className="h-14 rounded-2xl border-2 bg-slate-50 pl-12 font-bold focus:bg-white transition-all"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 font-bold text-xs" />
                    </FormItem>
                  )}
                />

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={form.formState.isSubmitting}
                    className="w-full h-16 rounded-2xl text-xl font-black bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-[0.98]"
                  >
                    {form.formState.isSubmitting ? "Connexion..." : "Se connecter"}
                    <ChevronRight className="ml-2 h-6 w-6" />
                  </Button>
                </div>
              </form>
            </Form>

            <div className="mt-8 text-center">
              <p className="text-slate-500 font-bold">
                Nouveau ici ? 
                <Link to="/register" className="text-blue-600 ml-2 hover:underline font-black">
                  Créer un compte
                </Link>
              </p>
              <div className="mt-6">
                <Link to="/" className="text-slate-400 text-sm font-bold hover:text-slate-600 transition-all">
                  ← Retour à l'accueil
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}