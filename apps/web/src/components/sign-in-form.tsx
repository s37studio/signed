"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface SignInFormProps {
  onSwitchToSignUp?: () => void;
}

export default function SignInForm({ onSwitchToSignUp }: SignInFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.email({ email, password });

      if (error) {
        toast.error(error.message ?? "Erreur de connexion");
        setIsLoading(false);
        return;
      }

      // Récupère les orgs de l'user et active la première
      const orgsRes = await authClient.organization.list();
      const firstOrg = orgsRes?.data?.[0];

      if (firstOrg?.id) {
        await authClient.organization.setActive({ organizationId: firstOrg.id });
        toast.success("Connexion réussie");
        window.location.replace("/dashboard");
      } else {
        // Pas d'org → onboarding
        toast.success("Connexion réussie");
        window.location.replace("/onboarding");
      }
    } catch {
      toast.error("Une erreur est survenue");
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full mt-10 max-w-md p-6">
      <h1 className="mb-6 text-center text-3xl font-bold text-zinc-50">Welcome Back</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowPassword((p) => !p)}
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Connexion..." : "Sign In"}
        </Button>
      </form>

      {onSwitchToSignUp && (
        <div className="mt-4 text-center">
          <Button
            variant="link"
            onClick={onSwitchToSignUp}
            className="text-zinc-400 hover:text-zinc-50"
          >
            Pas encore de compte ? S'inscrire
          </Button>
        </div>
      )}
    </div>
  );
}
