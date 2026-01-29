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
          <div>
            <div className="text-2xl font-bold text-zinc-50">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#0E0E10] rounded-[16px] border-none">
        <CardContent className="pt-6">
          <div>
            <div className="text-2xl font-bold text-zinc-50">{stats.won}</div>
            <div className="text-sm text-muted-foreground">Acceptées</div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#0E0E10] rounded-[16px] border-none">
        <CardContent className="pt-6">
          <div>
            <div className="text-2xl font-bold text-zinc-50">
              {stats.pending}
            </div>
            <div className="text-sm text-muted-foreground">En attente</div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#0E0E10] rounded-[16px] border-none">
        <CardContent className="pt-6">
          <div>
            <div className="text-2xl font-bold text-zinc-50">
              {stats.revision}
            </div>
            <div className="text-sm text-muted-foreground">Révisions</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
