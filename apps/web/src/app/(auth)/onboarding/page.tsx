"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function OnboardingPage() {
  const [orgName, setOrgName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Si l'user a déjà une org active → dashboard directement
  useEffect(() => {
    authClient.organization.list().then((res) => {
      const firstOrg = res?.data?.[0];
      if (firstOrg?.id) {
        authClient.organization.setActive({ organizationId: firstOrg.id }).then(() => {
          window.location.replace("/dashboard");
        });
      } else {
        setChecking(false);
      }
    }).catch(() => {
      setChecking(false);
    });
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = orgName.trim();
    if (!trimmed || trimmed.length < 2) return;

    setIsLoading(true);

    const slug =
      trimmed
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-") +
      "-" +
      Math.random().toString(36).slice(2, 7);

    try {
      const { data, error } = await authClient.organization.create({ name: trimmed, slug });

      if (error || !data?.id) {
        toast.error(error?.message ?? "Erreur lors de la création");
        setIsLoading(false);
        return;
      }

      await authClient.organization.setActive({ organizationId: data.id });
      toast.success(`Organisation "${trimmed}" créée !`);
      window.location.replace("/dashboard");
    } catch {
      toast.error("Une erreur est survenue");
      setIsLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0E0E10]">
        <div className="text-zinc-400 text-sm">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0E0E10]">
      <div className="w-full max-w-md rounded-2xl bg-[#0C0C0D] p-8 border border-zinc-800">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-zinc-50 mb-2">Bienvenue sur Signed</h1>
          <p className="text-zinc-400 text-sm">
            Commence par créer ton organisation pour accéder au dashboard.
          </p>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orgName" className="text-zinc-300">
              Nom de ton organisation
            </Label>
            <Input
              id="orgName"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Studio Acme, Freelance John..."
              className="bg-zinc-900 border-zinc-700 text-zinc-50 placeholder:text-zinc-600"
              required
              minLength={2}
            />
            <p className="text-xs text-zinc-600">
              Il peut s'agir de ton nom, de ton studio ou de ta société.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || orgName.trim().length < 2}
          >
            {isLoading ? "Création..." : "Créer mon organisation"}
          </Button>
        </form>
      </div>
    </div>
  );
}
