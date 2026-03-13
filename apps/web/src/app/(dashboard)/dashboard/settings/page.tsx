"use client";

import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"member" | "admin">("member");
  const [isInviting, setIsInviting] = useState(false);

  // MCP Keys state
  const [newKeyName, setNewKeyName] = useState("");
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: org, isLoading } = useQuery(
    trpc.organization.getCurrent.queryOptions()
  );

  const removeMember = useMutation(
    trpc.organization.removeMember.mutationOptions({
      onSuccess: () => {
        toast.success("Membre retiré");
        queryClient.invalidateQueries({ queryKey: [["organization", "getCurrent"]] });
      },
      onError: (err) => { toast.error(err.message); },
    })
  );

  const updateRole = useMutation(
    trpc.organization.updateMemberRole.mutationOptions({
      onSuccess: () => {
        toast.success("Rôle mis à jour");
        queryClient.invalidateQueries({ queryKey: [["organization", "getCurrent"]] });
      },
      onError: (err) => { toast.error(err.message); },
    })
  );

  const cancelInvitation = useMutation(
    trpc.organization.cancelInvitation.mutationOptions({
      onSuccess: () => {
        toast.success("Invitation annulée");
        queryClient.invalidateQueries({ queryKey: [["organization", "getCurrent"]] });
      },
      onError: (err) => { toast.error(err.message); },
    })
  );

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setIsInviting(true);

    await authClient.organization.inviteMember(
      { email: inviteEmail.trim(), role: inviteRole },
      {
        onSuccess: () => {
          toast.success(`Invitation envoyée à ${inviteEmail}`);
          setInviteEmail("");
          queryClient.invalidateQueries({ queryKey: [["organization", "getCurrent"]] });
        },
        onError: (err) => { toast.error(err.error.message || "Erreur lors de l'invitation"); },
      }
    );
    setIsInviting(false);
  }

  const { data: mcpKeys, isLoading: isLoadingKeys } = useQuery(
    trpc.mcpKey.listKeys.queryOptions()
  );

  const createKey = useMutation(
    trpc.mcpKey.createKey.mutationOptions({
      onSuccess: (data) => {
        setRevealedKey(data.key);
        setNewKeyName("");
        queryClient.invalidateQueries({ queryKey: [["mcpKey", "listKeys"]] });
      },
      onError: (err) => { toast.error(err.message); },
    })
  );

  const deleteKey = useMutation(
    trpc.mcpKey.deleteKey.mutationOptions({
      onSuccess: () => {
        toast.success("Clé supprimée");
        queryClient.invalidateQueries({ queryKey: [["mcpKey", "listKeys"]] });
      },
      onError: (err) => { toast.error(err.message); },
    })
  );

  function handleCopyKey() {
    if (!revealedKey) return;
    navigator.clipboard.writeText(revealedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const currentMember = org?.members.find(
    (m) => m.userId === session?.user.id
  );
  const isOwnerOrAdmin = ["owner", "admin"].includes(currentMember?.role ?? "");

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="w-[96%] mx-auto pt-5 pb-8 max-w-2xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-[18px] font-semibold text-zinc-50 font-sans tracking-[-0.002em]">
              Paramètres
            </h1>
            <p className="text-zinc-400 text-xs pt-1">{org?.name}</p>
          </div>
        </div>

        <div className="space-y-14">
      {/* Membres */}
      <section>
        <h2 className="text-sm font-medium text-zinc-300 mb-3">
          Membres ({org?.members.length ?? 0})
        </h2>
        <div className="rounded-xl border border-zinc-800/50 overflow-hidden">
          {org?.members.map((member, i) => (
            <div
              key={member.id}
              className={`flex items-center justify-between px-4 py-3 ${
                i !== 0 ? "border-t border-zinc-800/50" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={`https://www.tapback.co/api/avatar/${encodeURIComponent(member.user.email ?? "user")}.webp`}
                  alt={member.user.name ?? "Avatar"}
                  className="h-8 w-8 rounded-full object-cover shrink-0"
                />
                <div>
                  <p className="text-sm font-medium text-zinc-200">
                    {member.user.name}
                    {member.userId === session?.user.id && (
                      <span className="ml-2 text-xs text-zinc-500">{member.role.charAt(0).toUpperCase() + member.role.slice(1)}</span>
                    )}
                  </p>
                  <p className="text-xs text-zinc-500">{member.user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {currentMember?.role === "owner" && member.role !== "owner" && member.userId !== session?.user.id ? (
                  <select
                    value={member.role}
                    onChange={(e) =>
                      updateRole.mutate({ memberId: member.id, role: e.target.value as "admin" | "member" })
                    }
                    className="h-10 text-xs bg-zinc-900/50 border-none text-zinc-300 rounded-[12px] px-3"
                  >
                    <option value="member">member</option>
                    <option value="admin">admin</option>
                  </select>
                ) : member.userId !== session?.user.id ? (
                  <span className="text-xs text-zinc-400 capitalize">{member.role}</span>
                ) : null}
                {isOwnerOrAdmin && member.role !== "owner" && member.userId !== session?.user.id && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeMember.mutate({ memberId: member.id })}
                    className="h-10 rounded-[12px] border-none bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                  >
                    Retirer
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Invitations en attente */}
      {(org?.invitations?.length ?? 0) > 0 && (
        <section>
          <h2 className="text-sm font-medium text-zinc-300 mb-3">
            Invitations en attente
          </h2>
          <div className="rounded-xl border border-zinc-800/50 overflow-hidden">
            {org?.invitations.map((inv, i) => (
              <div
                key={inv.id}
                className={`flex items-center justify-between px-4 py-3 ${
                  i !== 0 ? "border-t border-zinc-800/50" : ""
                }`}
              >
                <div>
                  <p className="text-sm text-zinc-300">{inv.email}</p>
                  <p className="text-xs text-zinc-500">Rôle : {inv.role}</p>
                </div>
                {isOwnerOrAdmin && (
                  <button
                    onClick={() => cancelInvitation.mutate({ invitationId: inv.id })}
                    className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    Annuler
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Inviter un membre */}
      {isOwnerOrAdmin && (
        <section>
          <h2 className="text-sm font-medium text-zinc-300 mb-3">
            Inviter un membre
          </h2>
          <form onSubmit={handleInvite} className="flex gap-2 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="inviteEmail" className="text-zinc-400">Email</Label>
              <Input
                id="inviteEmail"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="collaborateur@exemple.com"
                className="h-10 bg-zinc-900/50 border-none rounded-[12px] text-zinc-50 placeholder:text-zinc-600"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Rôle</Label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as "member" | "admin")}
                className="h-10 bg-zinc-900/50 border-none text-zinc-300 rounded-[12px] px-3 text-xs"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <Button type="submit" disabled={isInviting} className="h-10 rounded-[12px]">
              {isInviting ? "Envoi..." : "Inviter"}
            </Button>
          </form>
        </section>
      )}

      {/* Clés API MCP */}
      <section>
        <h2 className="text-sm font-medium text-zinc-300 mb-1">
          Clés API MCP
        </h2>
        <p className="text-xs text-zinc-500 mb-3">
          Utilisez ces clés pour connecter des agents IA (Claude, n8n, etc.) à votre espace Signed.
        </p>

        {/* Liste des clés */}
        {isLoadingKeys ? (
          <Skeleton className="h-16 w-full mb-3" />
        ) : (mcpKeys?.length ?? 0) > 0 ? (
          <div className="rounded-xl border border-zinc-800/50 overflow-hidden mb-4">
            {mcpKeys?.map((key, i) => (
              <div
                key={key.id}
                className={`flex items-center justify-between px-4 py-3 ${i !== 0 ? "border-t border-zinc-800/50" : ""}`}
              >
                <div>
                  <p className="text-sm font-medium text-zinc-200">{key.name}</p>
                  <p className="text-xs text-zinc-500">
                    Créée le {new Date(key.createdAt).toLocaleDateString("fr-FR")}
                    {key.lastUsedAt && (
                      <> · Utilisée le {new Date(key.lastUsedAt).toLocaleDateString("fr-FR")}</>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => deleteKey.mutate({ id: key.id })}
                  className="text-xs text-red-500 hover:text-red-400 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-600 mb-4">Aucune clé pour le moment.</p>
        )}

        {/* Formulaire de création */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newKeyName.trim()) return;
            createKey.mutate({ name: newKeyName.trim() });
          }}
          className="flex gap-2 items-end"
        >
          <div className="flex-1 space-y-2">
            <Label htmlFor="keyName" className="text-zinc-400">Nom de la clé</Label>
            <Input
              id="keyName"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Mon agent Claude"
              className="h-10 bg-zinc-900/50 border-none rounded-[12px] text-zinc-50 placeholder:text-zinc-600"
              required
            />
          </div>
          <Button type="submit" disabled={createKey.isPending} className="h-10 rounded-[12px]">
            {createKey.isPending ? "Génération..." : "Générer une clé"}
          </Button>
        </form>
      </section>
        </div>
      </div>

      {/* Modal affichage clé en clair */}
      <Dialog open={!!revealedKey} onOpenChange={(open) => { if (!open) setRevealedKey(null); }}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-50">
          <DialogHeader>
            <DialogTitle className="text-zinc-50">Votre clé MCP</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-zinc-400">
              Copiez cette clé maintenant. Elle ne sera plus affichée.
            </p>
            <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 font-mono text-sm text-zinc-200 break-all select-all">
              {revealedKey}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCopyKey} className="flex-1 rounded-[12px]">
                {copied ? "Copié !" : "Copier la clé"}
              </Button>
              <Button variant="outline" onClick={() => setRevealedKey(null)} className="rounded-[12px] border-none text-zinc-300 hover:bg-zinc-800">
                Fermer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
