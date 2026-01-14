"use client";

import { Lock, Eye, EyeOff } from "lucide-react";

import { usePasswordSettings } from "@/features/proposals/hooks/use-password-settings";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type ProposalPasswordSettingsProps = {
  hasPassword: boolean;
  onPasswordChange: (password: string | null) => void;
};

export function ProposalPasswordSettings({
  hasPassword,
  onPasswordChange,
}: ProposalPasswordSettingsProps) {
  const {
    isEditing,
    newPassword,
    showPassword,
    setIsEditing,
    setNewPassword,
    handleSave,
    handleRemove,
    handleCancel,
    toggleShowPassword,
  } = usePasswordSettings(onPasswordChange);

  if (!isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Protection par mot de passe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {hasPassword
                  ? "Cette proposition est protégée par un mot de passe"
                  : "Cette proposition n'est pas protégée"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setIsEditing(true)}>
                {hasPassword ? "Modifier" : "Ajouter"}
              </Button>
              {hasPassword && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleRemove}
                >
                  Supprimer
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Lock className="h-4 w-4" />
          {hasPassword ? "Modifier le mot de passe" : "Ajouter un mot de passe"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">
            {hasPassword ? "Nouveau mot de passe" : "Mot de passe"}
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Entrez un mot de passe"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={toggleShowPassword}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Le client devra entrer ce mot de passe pour voir la proposition
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={!newPassword}>
            Enregistrer
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            Annuler
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
