import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import api from '../api';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

// ✅ Schéma strict pour forcer l'affichage des erreurs
const registerSchema = z.object({
  Prenom: z.string().min(2, "Ton prénom est obligatoire"),
  Nom: z.string().min(2, "Ton nom est obligatoire"),
  Sexe: z.enum(["Masculin", "Féminin"], { required_error: "Sélectionne ton sexe" }),
  Age: z.preprocess((val) => (val === "" ? undefined : Number(val)), 
    z.number({ invalid_type_error: "Indique ton âge" }).min(5, "Minimum 5 ans").max(25, "Maximum 25 ans")),
  Class: z.string().min(1, "Sélectionne ta classe"),
  etablissement: z.string().min(2, "Nom de l'école obligatoire"),
  NumeroTel: z.string().min(8, "Numéro invalide"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  acceptTerms: z.boolean().refine((val) => val === true, "Tu dois accepter les conditions"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { 
      Prenom: "", Nom: "", Sexe: undefined, 
      Age: undefined, Class: "", etablissement: "", 
      NumeroTel: "", email: "", acceptTerms: false 
    },
  });

  const classes = ["6eme", "5eme", "4eme", "3eme", "Seconde CD", "Seconde A4", "1ere D", "1ere C", "1ere A4", "Terminale D", "Terminale C", "Terminale A4"];

  const steps = [
    { id: 1, fields: ["Prenom", "Nom"], title: "Comment t'appelles-tu ?", sub: "Remplis tes informations.", img: "https://illustrations.popsy.co/blue/shaking-hands.svg" },
    { id: 2, fields: ["Sexe"], title: "Ton sexe ?", sub: "Clique sur ton profil.", img: "https://illustrations.popsy.co/blue/digital-nomad.svg" },
    { id: 3, fields: ["Class"], title: "Ta classe ?", sub: "Choisis dans la liste.", img: "https://illustrations.popsy.co/blue/back-to-school.svg" },
    { id: 4, fields: ["Age", "etablissement"], title: "Ton parcours ?", sub: "Âge et École.", img: "https://illustrations.popsy.co/blue/graduating.svg" },
    { id: 5, fields: ["NumeroTel"], title: "Contact ?", sub: "Ton numéro de téléphone.", img: "https://illustrations.popsy.co/blue/searching-on-phone.svg" },
    { id: 6, fields: ["acceptTerms"], title: "Terminé !", sub: "Accepte pour créer ton compte.", img: "https://illustrations.popsy.co/blue/success.svg" }
  ];

  const handleNext = async () => {
    const fields = steps[step - 1].fields;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isValid = await form.trigger(fields as any);
    if (isValid) setStep(step + 1);
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await api.post("/auth/users/", data);
      toast({ title: "Bienvenue !", description: "Compte créé avec succès." });
      navigate("/login");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({ title: "Erreur", description: "Vérifie tes informations ou ton numéro.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-[40px] shadow-2xl flex flex-col md:flex-row overflow-hidden min-h-[650px]">
        
        {/* GAUCHE : DESIGN (50%) */}
        <div className="md:w-1/2 bg-blue-600 p-12 text-white flex flex-col justify-between relative">
          <div className="relative z-10">
            <h2 className="text-3xl font-black italic">REVIZ+</h2>
            <div className="mt-4 flex gap-1">
              {steps.map((s) => (
                <div key={s.id} className={`h-1.5 flex-1 rounded-full ${s.id <= step ? 'bg-white' : 'bg-white/20'}`} />
              ))}
            </div>
          </div>
          <div className="relative z-10 flex justify-center">
            <img src={steps[step-1].img} className="max-h-72 object-contain" alt="step" />
          </div>
          <p className="text-xl font-bold opacity-70 italic">Étape {step} / 6</p>
        </div>

        {/* DROITE : FORMULAIRE (50%) */}
        <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-black text-slate-900 leading-none">{steps[step-1].title}</h1>
              <p className="text-slate-500 text-lg mt-2">{steps[step-1].sub}</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {step === 1 && (
                  <div className="space-y-4">
                    <FormField control={form.control} name="Prenom" render={({ field }) => (
                      <FormItem><FormLabel>Prénom</FormLabel><FormControl><Input placeholder="Prénom" {...field} className="h-14 rounded-2xl border-2 px-6" /></FormControl><FormMessage className="text-red-500 font-bold" /></FormItem>
                    )}/>
                    <FormField control={form.control} name="Nom" render={({ field }) => (
                      <FormItem><FormLabel>Nom</FormLabel><FormControl><Input placeholder="Nom" {...field} className="h-14 rounded-2xl border-2 px-6" /></FormControl><FormMessage className="text-red-500 font-bold" /></FormItem>
                    )}/>
                  </div>
                )}

                {step === 2 && (
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="Sexe" render={({ field }) => (
                      <>
                        <div onClick={() => field.onChange("Masculin")} className={`cursor-pointer p-6 rounded-[2rem] border-4 flex flex-col items-center ${field.value === "Masculin" ? "border-blue-500 bg-blue-50" : "border-slate-100"}`}>
                          <span className="text-4xl">👦</span><span className="font-bold">GARÇON</span>
                        </div>
                        <div onClick={() => field.onChange("Féminin")} className={`cursor-pointer p-6 rounded-[2rem] border-4 flex flex-col items-center ${field.value === "Féminin" ? "border-pink-400 bg-pink-50" : "border-slate-100"}`}>
                          <span className="text-4xl">👧</span><span className="font-bold">FILLE</span>
                        </div>
                        <div className="col-span-2 text-center"><FormMessage className="text-red-500 font-bold" /></div>
                      </>
                    )}/>
                  </div>
                )}

                {step === 3 && (
                  <div className="grid grid-cols-3 gap-2">
                    <FormField control={form.control} name="Class" render={({ field }) => (
                      <>
                        {classes.map((c) => (
                          <div key={c} onClick={() => field.onChange(c)} className={`cursor-pointer py-3 rounded-xl border-2 text-center text-xs font-bold ${field.value === c ? "bg-green-600 border-green-700 text-white" : "bg-green-50 border-green-200 text-green-700"}`}>
                            {c}
                          </div>
                        ))}
                        <div className="col-span-3 text-center"><FormMessage className="text-red-500 font-bold" /></div>
                      </>
                    )}/>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <FormField control={form.control} name="Age" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ton âge</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Ex: 15" {...field} className="h-14 rounded-2xl border-2 px-6" />
                        </FormControl>
                        <FormMessage className="text-red-500 font-bold" />
                      </FormItem>
                    )}/>
                    <FormField control={form.control} name="etablissement" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Établissement</FormLabel>
                        <FormControl><Input placeholder="Nom de l'école" {...field} className="h-14 rounded-2xl border-2 px-6" /></FormControl>
                        <FormMessage className="text-red-500 font-bold" />
                      </FormItem>
                    )}/>
                  </div>
                )}

                {step === 5 && (
                  <FormField control={form.control} name="NumeroTel" render={({ field }) => (
                    <FormItem><FormLabel>Numéro de téléphone</FormLabel><FormControl><Input placeholder="+228..." {...field} className="h-14 rounded-2xl border-2 px-6" /></FormControl><FormMessage className="text-red-500 font-bold" /></FormItem>
                  )}/>
                )}

                {step === 6 && (
                  <FormField control={form.control} name="acceptTerms" render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 p-6 border-2 rounded-2xl">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-bold cursor-pointer">J'accepte les conditions d'utilisation</FormLabel>
                      <FormMessage className="text-red-500 font-bold" />
                    </FormItem>
                  )}/>
                )}

                <div className="pt-6 space-y-3">
                  <Button 
                    type="button"
                    onClick={step === 6 ? form.handleSubmit(onSubmit) : handleNext} 
                    className="w-full h-16 rounded-2xl text-xl font-black bg-blue-600 hover:bg-blue-700"
                  >
                    {step === 6 ? "Créer mon compte" : "Continuer"}
                  </Button>
                  {step > 1 && (
                    <button type="button" onClick={() => setStep(step - 1)} className="w-full text-slate-400 font-bold">Retour</button>
                  )}
                  {step === 1 && (
                    <p className="text-center text-slate-500 font-bold">
                      Déjà un compte ? <Link to="/login" className="text-blue-600 ml-1 hover:underline">CONNECTE TOI</Link>
                    </p>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}