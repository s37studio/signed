import Image from "next/image";

type TemplateModernProps = {
  data: {
    clientName?: string;
    companyName?: string;
    projectTitle?: string;
    description?: string;
    services?: string;
    price?: number;
    deliveryTime?: string;
  };
};

export function TemplateModern({ data }: TemplateModernProps) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-screen p-8">
      <div className="w-full mx-auto bg-white dark:bg-slate-950 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-12 text-white">
          <h1 className="text-5xl font-bold mb-4">
            {data.projectTitle || "Votre Projet"}
          </h1>
          <div className="text-xl opacity-90">
            <p className="font-semibold">{data.clientName || "Client"}</p>
            {data.companyName && (
              <p className="text-lg mt-1">{data.companyName}</p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-12 space-y-8">
          {/* Description */}
          {data.description && (
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span className="w-1 h-8 bg-blue-600 rounded-full"></span>À
                propos du projet
              </h2>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {data.description}
              </p>
            </div>
          )}

          {/* Services */}
          {data.services && (
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span className="w-1 h-8 bg-purple-600 rounded-full"></span>
                Services inclus
              </h2>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {data.services}
                </p>
              </div>
            </div>
          )}

          {/* Delivery & Price */}
          <div className="grid md:grid-cols-2 gap-6 pt-6">
            {data.deliveryTime && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-xl p-6 border border-blue-200 dark:border-blue-900">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  Délai de livraison
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {data.deliveryTime}
                </p>
              </div>
            )}

            {data.price !== undefined && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-xl p-6 border border-purple-200 dark:border-purple-900">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  Investissement
                </p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {data.price.toLocaleString("fr-FR")} €
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
