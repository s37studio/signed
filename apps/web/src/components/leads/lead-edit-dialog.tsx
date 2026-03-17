"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface LeadEditDialogProps {
  lead: {
    id: string;
    name: string;
    email: string | null;
    company: string | null;
    phone: string | null;
  };
  onUpdate: (
    id: string,
    data: { name?: string; email?: string; company?: string; phone?: string }
  ) => void;
  isUpdating: boolean;
  trigger?: React.ReactElement;
}

export function LeadEditDialog({
  lead,
  onUpdate,
  isUpdating,
  trigger,
}: LeadEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: lead.name,
    email: lead.email || "",
    company: lead.company || "",
    phone: lead.phone || "",
  });

  useEffect(() => {
    if (open) {
      setFormData({
        name: lead.name,
        email: lead.email || "",
        company: lead.company || "",
        phone: lead.phone || "",
      });
    }
  }, [open, lead]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(lead.id, formData);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={trigger || <Button variant="outline" size="sm">Modifier</Button>} />
      <SheetContent side="right" className="sm:max-w-[600px] rounded-l-[20px] bg-[#060606] border-none pt-8 pb-8 pr-8">
        <SheetHeader>
          <SheetTitle>Modifier le lead</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-name" className="mb-2 block">Nom *</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="rounded-[12px] bg-zinc-900/50 border-none h-10"
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-email" className="mb-2 block">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="rounded-[12px] bg-zinc-900/50 border-none h-10"
            />
          </div>

          <div>
            <Label htmlFor="edit-company" className="mb-2 block">Entreprise</Label>
            <Input
              id="edit-company"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              className="rounded-[12px] bg-zinc-900/50 border-none h-10"
            />
          </div>

          <div>
            <Label htmlFor="edit-phone" className="mb-2 block">Téléphone</Label>
            <Input
              id="edit-phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="rounded-[12px] bg-zinc-900/50 border-none h-10"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-[12px]"
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isUpdating} className="rounded-[12px]">
              {isUpdating ? "Modification..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
