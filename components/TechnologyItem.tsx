type TechnologyItemProps = {
  nom: string;
  maitrisee: boolean;
  onBasculer: () => void;
  onSupprimer: () => void;
};

export function TechnologyItem({
  nom,
  maitrisee,
  onBasculer,
  onSupprimer,
}: TechnologyItemProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-violet-500/60">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 text-xl text-violet-400">
          {"</>"}
        </div>

        <button
          onClick={onSupprimer}
          aria-label={`Supprimer ${nom}`}
          className="text-sm text-slate-500 transition hover:text-red-400"
        >
          ✕
        </button>
      </div>

      <h3 className="mt-5 text-lg font-semibold text-white">{nom}</h3>

      <button
        onClick={onBasculer}
        aria-pressed={maitrisee}
        className={`mt-3 rounded-full px-3 py-1 text-xs font-medium transition ${
          maitrisee
            ? "bg-emerald-500/15 text-emerald-400"
            : "bg-slate-800 text-slate-400 hover:bg-violet-500/20"
        }`}
      >
        {maitrisee ? "✓ Maîtrisée" : "○ À apprendre"}
      </button>
    </div>
  );
}
