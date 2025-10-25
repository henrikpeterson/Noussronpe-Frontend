import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BookOpen, Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

//const { toast } = useToast();

import api from '../api';
import { useNavigate } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import motifBackground from "@/assets/Motifs_Educatif3.png"; 

// 📝 Nouveau schéma
const registerSchema = z
  .object({
    Prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
    Nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Veuillez entrer une adresse email valide").optional() .or(z.literal("")),
    Sexe: z.enum(["Masculin", "Féminin"], {
      required_error: "Veuillez sélectionner votre sexe",
    }),
    NumeroTel: z
      .string()
      .min(8, "Numéro de téléphone invalide")
      .regex(/^[0-9+]+$/, "Le numéro ne doit contenir que des chiffres"
      ),

    Age: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().min(5, "Âge trop bas").max(25, "Âge invalide")
    ),

    Class: z.string().min(1, "La classe est requise"),
    etablissement: z.string().min(2, "Veuillez entrer le nom de l'établissement"),
    acceptTerms: z
      .boolean()
      .refine((val) => val === true, "Vous devez accepter les conditions d'utilisation"),
  })
 

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      Prenom: "",
      Nom: "",
      email: "",
     
      NumeroTel: "",
     
      Sexe: undefined,
      Age: 0,
      Class: "",
      etablissement: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
     console.log("🚨 onSubmit appelé !");
     console.log("Données du formulaire:", data);

    try{
      const payload = {
        Nom: data.Nom,
        Prenom: data.Prenom,
        NumeroTel: data.NumeroTel,
        Age: data.Age,
        Sexe: data.Sexe,
        etablissement: data.etablissement,
        Class: data.Class,
        email:data.email
      };
       
      const response = await api.post("/auth/users/", payload);

      console.log("Compte créé:", response.data)
      toast({
        title: "Compte créé avec succès 🎉",
        description: "Tu peux maintenant te connecter à ton espace.",
      });

      navigate("/login");
      form.reset();

    }catch (error: any){
      console.error("Erreur :", error.response?.data || error.message);
      toast({
        title: "Erreur",
        description: "Impossible de créer le compte. Vérifie les informations.",
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
      >
      </div>

         <div className="relative w-full max-w-md text-sky-600">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-blue-700 mb-2">
              INSCRIPTION
            </h1>
            <p className="text-gray-600 font-bold">
              Créez votre compte pour commencer
            </p>
          </div>


          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="Prenom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input placeholder="Prénom" {...field} className="h-10 pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Nom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom" {...field} className="h-10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Sexe */}
                <FormField
                  control={form.control}
                  name="Sexe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sexe</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sexe" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Masculin">Masculin</SelectItem>
                          <SelectItem value="Féminin">Féminin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Âge */}
                <FormField
                  control={form.control}
                  name="Age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Ex : 15" 
                          value={field.value || ""} // ✅ Gère la valeur undefined/nulle
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                          className="h-10" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>


              {/* Classe */}
              <FormField
                control={form.control}
                name="Class"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Classe</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex : 3ème" {...field} className="h-10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Établissement */}
              <FormField
                control={form.control}
                name="etablissement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Établissement</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de l'établissement" {...field} className="h-10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                  control={form.control}
                  name="NumeroTel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de téléphone</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+22890000000" {...field} className="h-10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    )}
                  />
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (facultatif)</FormLabel>
                    {/*petite mention explicative */}
                    <p className="text-xs text-gray-500 mb-1">
                      Si vous n’avez pas d’adresse email, laissez ce champ vide.
                    </p>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="exemple@email.com (facultatif)"
                          {...field}
                          className="h-10 pl-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Conditions d'utilisation */}
              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm">
                        J'accepte les{" "}
                        <Link to="/terms" className="text-red-600 hover:text-orange-500">
                          conditions d'utilisation
                        </Link>{" "}
                        et la{" "}
                        <Link to="/privacy" className="text-red-600 hover:text-orange-500">
                          politique de confidentialité
                        </Link>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {/* Bouton inscription */}
              <Button
                type="submit"
                className="w-full h-10 bg-blue-500 hover:bg-blue-600"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Création du compte..." : "Créer mon compte"}
              </Button>
            </form>
          </Form>

          {/* Lien vers connexion */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Déjà un compte ?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-500 font-bold">
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        {/* Retour à l'accueil */}
        <div className="text-center mt-6">
          <Link to="/" className="text-gray-600 hover:text-gray-800 text-sm">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
