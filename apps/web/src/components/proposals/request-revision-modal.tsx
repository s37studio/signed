"use client";

import { useState } from "react";
import { useRequestRevision } from "@/features/proposals/hooks/use-request-revision";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type RequestRevisionModalProps = {
  token: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const REVISION_TYPES = [
  { value: "scope", label: "Scope Change" },
  { value: "pricing", label: "Pricing Adjustment" },
  { value: "timeline", label: "Timeline Change" },
  { value: "terms", label: "Terms & Conditions" },
  { value: "other", label: "Other" },
];

export function RequestRevisionModal({
  token,
  isOpen,
  onClose,
  onSuccess,
}: RequestRevisionModalProps) {
  const [revisionType, setRevisionType] = useState("");
  const [explanation, setExplanation] = useState("");
  const requestRevision = useRequestRevision();

  const handleSubmit = () => {
    if (!revisionType || !explanation) return;

    requestRevision.mutate(
      {
        token,
        message: `[Type: ${revisionType}] ${explanation}`,
      },
      {
        onSuccess: () => {
          onSuccess?.();
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] !top-auto !bottom-22 !translate-y-0 data-closed:!zoom-out-100 data-open:!zoom-in-100 data-closed:slide-out-to-bottom-4 data-open:slide-in-from-bottom-4 !duration-300 !ease-out bg-white border border-zinc-200 shadow-[0_2px_12px_rgba(0,0,0,0.06)] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-zinc-950">
            Request Revision
          </DialogTitle>
          <DialogDescription className="text-zinc-500">
            Please provide specific details about the changes you would like to
            see.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="revision-type" className="text-zinc-950">Revision Type</Label>
            <div className="relative">
              <select
                id="revision-type"
                className={cn(
                  "w-full h-10 rounded-[8px] border border-zinc-200 !bg-white pl-3 pr-10 py-2 text-sm outline-none focus:ring-1 focus:ring-zinc-300 appearance-none disabled:cursor-not-allowed disabled:opacity-50 text-zinc-950"
                )}
                value={revisionType}
                onChange={(e) => setRevisionType(e.target.value)}
              >
                <option value="" disabled className="text-zinc-500">
                  Select a revision type
                </option>
                {REVISION_TYPES.map((type) => (
                  <option key={type.value} value={type.value} className="text-zinc-950">
                    {type.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="explanation" className="text-zinc-950">Explanation</Label>
            <Textarea
              id="explanation"
              placeholder="Please describe why you would like to deny the proposal."
              className="min-h-[120px] rounded-[8px] border-zinc-200 !bg-white text-zinc-950 placeholder:text-zinc-500 focus-visible:ring-zinc-950"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="rounded-full h-10 px-6 text-sm !border-zinc-200 !bg-white !text-zinc-950 hover:!bg-zinc-100 hover:!text-zinc-900"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={requestRevision.isPending}
            className="rounded-full h-10 px-6 text-sm !bg-zinc-900 !text-white hover:!bg-zinc-800"
          >
            {requestRevision.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Send Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
