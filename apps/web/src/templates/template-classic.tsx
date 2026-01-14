type TemplateClassicProps = {
  data: {
    clientName?: string;
    companyName?: string;
    proposalTitle?: string;
    introduction?: string;
    scope?: string;
    pricing?: number;
    timeline?: string;
  };
};

export function TemplateClassic({ data }: TemplateClassicProps) {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b-4 border-slate-900 dark:border-slate-100 pb-8 mb-8">
          <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-4">
            Proposition Commerciale
          </h1>
          <div className="text-lg text-slate-700 dark:text-slate-300">
            <p className="font-semibold text-xl mb-2">
              {data.clientName || "Client"}
            </p>
            {data.companyName && (
              <p className="text-slate-600 dark:text-slate-400">
                {data.companyName}
              </p>
            )}
          </div>
        </div>

        {/* Title */}
        {data.proposalTitle && (
          <div className="mb-8">
            <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100 border-l-4 border-slate-900 dark:border-slate-100 pl-4">
              {data.proposalTitle}
            </h2>
          </div>
        )}

        {/* Introduction */}
        {data.introduction && (
          <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-900 border-l-4 border-slate-300 dark:border-slate-700">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Introduction
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {data.introduction}
            </p>
          </div>
        )}

        {/* Scope */}
        {data.scope && (
          <div className="mb-8">
            <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-4 border-b-2 border-slate-200 dark:border-slate-800 pb-2">
              Périmètre du projet
            </h3>
            <div className="p-6 border border-slate-200 dark:border-slate-800">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {data.scope}
              </p>
            </div>
          </div>
        )}

        {/* Timeline & Pricing */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {data.timeline && (
            <div className="border-2 border-slate-200 dark:border-slate-800 p-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3">
                Calendrier
              </h4>
              <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {data.timeline}
              </p>
            </div>
          )}

          {data.pricing !== undefined && (
            <div className="border-2 border-slate-900 dark:border-slate-100 p-6 bg-slate-50 dark:bg-slate-900">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3">
                Montant total
              </h4>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {data.pricing.toLocaleString("fr-FR")} €
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                HT
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-500 text-center">
            Cette proposition est valable 30 jours à compter de sa date d'émission
          </p>
        </div>
      </div>
    </div>
  );
}
