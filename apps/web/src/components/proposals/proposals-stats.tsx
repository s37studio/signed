import { FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type ProposalsStatsProps = {
  proposals: any[];
};

export function ProposalsStats({ proposals }: ProposalsStatsProps) {
  const stats = {
    total: proposals.length,
    won: proposals.filter((p) => p.status === "WON").length,
    pending: proposals.filter((p) => p.status === "PENDING").length,
    revision: proposals.filter((p) => p.status === "REVISION").length,
  };

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="bg-[#0E0E10] rounded-[16px] border-none">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <FileText className="h-6 w-6 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#0E0E10] rounded-[16px] border-none">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.won}
              </div>
              <div className="text-sm text-muted-foreground">Acceptées</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#0E0E10] rounded-[16px] border-none">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-950 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.pending}
              </div>
              <div className="text-sm text-muted-foreground">En attente</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#0E0E10] rounded-[16px] border-none">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
              <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.revision}
              </div>
              <div className="text-sm text-muted-foreground">Révisions</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
