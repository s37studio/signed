"use client";

import { Eye, Clock, MapPin, Calendar } from "lucide-react";

import { useProposalViews } from "@/features/proposals/hooks/use-proposal-views";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type ProposalViewsModalProps = {
  proposalId: string;
  viewCount: number;
};

function formatDuration(seconds: number | null) {
  if (!seconds) return "En cours...";

  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes < 60) {
    return remainingSeconds > 0
      ? `${minutes}min ${remainingSeconds}s`
      : `${minutes}min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}min`;
}

function formatRelativeTime(date: string) {
  const now = new Date();
  const viewDate = new Date(date);
  const diffMs = now.getTime() - viewDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins}min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;

  return viewDate.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: viewDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

function ViewItem({ view }: { view: any }) {
  const location =
    view.city && view.country
      ? `${view.city}, ${view.country}`
      : view.country || "Localisation inconnue";

  return (
    <div className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formatRelativeTime(view.viewedAt)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium">
          <Clock className="h-4 w-4" />
          <span>{formatDuration(view.duration)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span>{location}</span>
      </div>

      <div className="mt-2 text-xs text-muted-foreground">
        {new Date(view.viewedAt).toLocaleString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
}

export function ProposalViewsModal({
  proposalId,
  viewCount,
}: ProposalViewsModalProps) {
  const { data: views, isLoading } = useProposalViews(proposalId);

  return (
    <Dialog>
      <DialogTrigger
        render={
          <button className="inline-flex items-center justify-center gap-1 rounded-md px-2 py-1 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
        }
      >
        <Eye className="h-3 w-3" />
        <span>{viewCount}</span>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Historique des visites</DialogTitle>
          <DialogDescription>
            {viewCount} visite{viewCount > 1 ? "s" : ""} enregistrée
            {viewCount > 1 ? "s" : ""}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[100px]" />
            <Skeleton className="h-[100px]" />
            <Skeleton className="h-[100px]" />
          </div>
        ) : views && views.length > 0 ? (
          <div className="space-y-3 mt-4">
            {views.map((view) => (
              <ViewItem key={view.id} view={view} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Eye className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>Aucune visite enregistrée</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
