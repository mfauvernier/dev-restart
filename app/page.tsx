"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { TechnologyItem } from "@/components/TechnologyItem";

type Technologie = {
  nom: string;
  maitrisee: boolean;
};

// Technologies affichées par défaut
const technologiesInitiales: Technologie[] = [
  { nom: "Next.js", maitrisee: false },
  { nom: "React", maitrisee: true },
  { nom: "TypeScript", maitrisee: false },
  { nom: "IA", maitrisee: false },
];

// Récupérer les technologies enregistrées
function lireTechnologies(): Technologie[] {
  if (typeof window === "undefined") {
    return technologiesInitiales;
  }

  try {
    const donnees = localStorage.getItem("technologies");

    if (donnees === null) {
      return technologiesInitiales;
    }

    const resultat: unknown = JSON.parse(donnees);

    if (
      Array.isArray(resultat) &&
      resultat.every(
        (tech) =>
          tech !== null &&
          typeof tech === "object" &&
          typeof tech.nom === "string" &&
          typeof tech.maitrisee === "boolean",
      )
    ) {
      return resultat as Technologie[];
    }
  } catch (erreur) {
    console.error("Erreur de chargement :", erreur);
  }

  return technologiesInitiales;
}

// Permet de distinguer le rendu serveur du rendu navigateur
const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function Home() {
  const estClient = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  // Notre liste de technologies
  const [technologies, setTechnologies] =
    useState<Technologie[]>(lireTechnologies);

  // Texte du champ de saisie
  const [nouvelleTech, setNouvelleTech] = useState("");

  // Sauvegarde automatique après le chargement côté navigateur
  useEffect(() => {
    if (!estClient) return;

    localStorage.setItem("technologies", JSON.stringify(technologies));
  }, [technologies, estClient]);

  // Calcul des statistiques
  const total = technologies.length;

  const maitrisees = technologies.filter((tech) => tech.maitrisee).length;

  const progression = total === 0 ? 0 : Math.round((maitrisees / total) * 100);

  // Ajouter une technologie
  function ajouterTechnologie() {
    const valeur = nouvelleTech.trim();

    const existeDeja = technologies.some(
      (tech) => tech.nom.toLowerCase() === valeur.toLowerCase(),
    );

    if (valeur === "" || existeDeja) return;

    setTechnologies((prev) => [...prev, { nom: valeur, maitrisee: false }]);

    setNouvelleTech("");
  }

  // Supprimer une technologie
  function supprimerTechnologie(nom: string) {
    setTechnologies((prev) => prev.filter((tech) => tech.nom !== nom));
  }

  // Modifier le statut d'une technologie
  function basculerTechnologie(nom: string) {
    setTechnologies((prev) =>
      prev.map((tech) =>
        tech.nom === nom ? { ...tech, maitrisee: !tech.maitrisee } : tech,
      ),
    );
  }

  // Attendre le rendu côté navigateur
  if (!estClient) {
    return (
      <main className="min-h-screen bg-[#090F1E] p-10 text-white">
        Chargement de Dev Restart...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#090F1E] text-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Navigation */}
        <header className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-600 p-3 font-mono font-bold">
              {"</>"}
            </div>

            <span className="text-xl font-bold tracking-tight">
              dev<span className="text-violet-400">.restart</span>
            </span>
          </div>

          <span className="hidden text-xs font-medium tracking-widest text-slate-400 sm:block">
            LEARNING DASHBOARD
          </span>
        </header>

        {/* Introduction */}
        <section className="py-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-violet-400">
            Mon espace de progression
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Reprenons le code.
            <span className="text-violet-400"> En mieux.</span>
          </h1>

          <p className="mt-4 max-w-xl text-slate-400">
            Un espace pour suivre mes compétences, explorer de nouvelles
            technologies et progresser chaque jour.
          </p>
        </section>

        {/* Statistiques */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { titre: "Compétences", valeur: total },
            { titre: "Maîtrisées", valeur: maitrisees },
            { titre: "Progression", valeur: `${progression}%` },
          ].map((stat) => (
            <div
              key={stat.titre}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <p className="text-sm text-slate-400">{stat.titre}</p>

              <p className="mt-3 text-3xl font-bold">{stat.valeur}</p>
            </div>
          ))}
        </section>

        {/* Barre de progression */}
        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Ma progression</h2>

            <span className="font-semibold text-violet-400">
              {progression}%
            </span>
          </div>

          <div
            className="h-3 overflow-hidden rounded-full bg-slate-800"
            role="progressbar"
            aria-valuenow={progression}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progression des compétences"
          >
            <div
              className="h-full rounded-full bg-violet-500 transition-all duration-300"
              style={{ width: `${progression}%` }}
            />
          </div>
        </section>

        {/* Technologies */}
        <section className="mt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Mes technologies</h2>

            <p className="mt-1 text-sm text-slate-400">
              Clique sur un statut pour le modifier.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {technologies.map((tech) => (
              <TechnologyItem
                key={tech.nom}
                nom={tech.nom}
                maitrisee={tech.maitrisee}
                onBasculer={() => basculerTechnologie(tech.nom)}
                onSupprimer={() => supprimerTechnologie(tech.nom)}
              />
            ))}
          </div>

          {technologies.length === 0 && (
            <p className="rounded-xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
              Aucune technologie pour le moment.
            </p>
          )}
        </section>

        {/* Formulaire */}
        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-4 text-lg font-semibold">Ajouter une compétence</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ajouterTechnologie();
            }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              placeholder="Ex. : Python, Node.js, Docker..."
              value={nouvelleTech}
              onChange={(e) => setNouvelleTech(e.target.value)}
              aria-label="Nom de la technologie"
              className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500"
            />

            <button
              type="submit"
              className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-500"
            >
              + Ajouter
            </button>
          </form>
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          Dev Restart — Built with Next.js, React & TypeScript
        </footer>
      </div>
    </main>
  );
}
