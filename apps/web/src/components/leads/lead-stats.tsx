import { Card, CardContent } from "../ui/card";

type LeadStatsProps = {
  stats: {
    total: number;
    won: number;
    pending: number;
    revision: number;
    lost: number;
  };
};

export function LeadStats({ stats }: LeadStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-green-500">{stats.won}</div>
          <div className="text-sm text-muted-foreground">Acceptées</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-yellow-500">
            {stats.pending}
          </div>
          <div className="text-sm text-muted-foreground">En attente</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-blue-500">
            {stats.revision}
          </div>
          <div className="text-sm text-muted-foreground">En révision</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-bold text-red-500">{stats.lost}</div>
          <div className="text-sm text-muted-foreground">Refusées</div>
        </CardContent>
      </Card>
    </div>
  );
}
