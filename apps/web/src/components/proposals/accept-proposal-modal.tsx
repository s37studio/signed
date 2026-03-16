"use client";

import { useState } from "react";
import { useValidateProposal } from "@/features/proposals/hooks/use-validate-proposal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

type AcceptProposalModalProps = {
  token: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export function AcceptProposalModal({
  token,
  isOpen,
  onClose,
  onSuccess,
}: AcceptProposalModalProps) {
  const [name, setName] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const validateProposal = useValidateProposal();

  const handleAccept = () => {
    if (!name || !isConfirmed) return;

    validateProposal.mutate(
      { token },
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
            Accept the proposal
          </DialogTitle>
          <DialogDescription className="text-zinc-600">
            Fill in the form below with your company's information to accept the
            proposal.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-zinc-950">Full name or Company Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name or company name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-[8px] border-zinc-200 !bg-white text-zinc-950 placeholder:text-zinc-500 focus-visible:ring-zinc-950"
            />
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="confirm"
              checked={isConfirmed}
              onCheckedChange={(checked) => setIsConfirmed(checked as boolean)}
              className="mt-1 !bg-white !border-zinc-200 rounded-[4px] data-[state=checked]:!bg-zinc-900 data-[state=checked]:!text-white"
            />
            <Label
              htmlFor="confirm"
              className="text-sm font-normal leading-normal text-zinc-500 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I confirm that the information provided above is accurate and I am
              authorized to sign on behalf of the company
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button
            className="w-full rounded-full h-10 text-sm !bg-zinc-900 !text-white hover:!bg-zinc-800"
            onClick={handleAccept}
            disabled={validateProposal.isPending}
          >
            {validateProposal.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Accept the proposal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
