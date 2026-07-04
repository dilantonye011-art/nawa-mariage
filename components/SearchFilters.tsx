"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal, RotateCcw, MapPin, Shield } from "lucide-react";
import { SearchFilters as SearchFiltersType, defaultFilters } from "@/hooks/useSearchFilters";

interface SearchFiltersProps {
  filters: SearchFiltersType;
  updateFilter: <K extends keyof SearchFiltersType>(key: K, value: SearchFiltersType[K]) => void;
  resetFilters: () => void;
  isOpen: boolean;
  togglePanel: () => void;
}

const countries = [
  "Cameroun", "Sénégal", "Côte d'Ivoire", "Mali", "Burkina Faso",
  "Niger", "Tchad", "Guinée", "Bénin", "Togo", "Gabon", "RDC",
  "Rwanda", "Burundi", "Centrafrique", "Congo", "Ghana", "Nigeria",
  "Algérie", "Maroc", "Tunisie", "Égypte", "Soudan", "Éthiopie",
  "Kenya", "Tanzanie", "Ouganda", "Zambie", "Zimbabwe", "Afrique du Sud"
];

const religions = [
  { value: "", label: "Toutes" },
  { value: "islam", label: "Islam" },
  { value: "christianisme", label: "Christianisme" },
  { value: "autre", label: "Autre" },
];

const maritalStatuses = [
  { value: "", label: "Tous" },
  { value: "celibataire", label: "Célibataire" },
  { value: "divorce", label: "Divorcé(e)" },
  { value: "veuf", label: "Veuf/Veuve" },
];

export function SearchFilters({ filters, updateFilter, resetFilters, isOpen, togglePanel }: SearchFiltersProps) {
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "ageMin" && value === 18) return false;
    if (key === "ageMax" && value === 50) return false;
    if (value === "" || value === false) return false;
    return true;
  }).length;

  return (
    <>
      <button
        onClick={togglePanel}
        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium hover:border-primary-400 transition shadow-sm"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filtres
        {activeFiltersCount > 0 && (
          <span className="ml-1 px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full">
            {activeFiltersCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={togglePanel}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 z-50 shadow-2xl overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filtres de recherche</h2>
                  <button onClick={togglePanel} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Âge</label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <input
                        type="range"
                        min={18}
                        max={60}
                        value={filters.ageMin}
                        onChange={(e) => updateFilter("ageMin", Math.min(Number(e.target.value), filters.ageMax))}
                        className="w-full accent-primary-600"
                      />
                      <div className="text-center text-sm text-gray-500 mt-1">{filters.ageMin} ans</div>
                    </div>
                    <span className="text-gray-400">-</span>
                    <div className="flex-1">
                      <input
                        type="range"
                        min={18}
                        max={60}
                        value={filters.ageMax}
                        onChange={(e) => updateFilter("ageMax", Math.max(Number(e.target.value), filters.ageMin))}
                        className="w-full accent-primary-600"
                      />
                      <div className="text-center text-sm text-gray-500 mt-1">{filters.ageMax} ans</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Pays</label>
                  <select
                    value={filters.country}
                    onChange={(e) => updateFilter("country", e.target.value)}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option value="">Tous les pays</option>
                    {countries.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ville</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher une ville..."
                      value={filters.city}
                      onChange={(e) => updateFilter("city", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Religion</label>
                  <div className="flex flex-wrap gap-2">
                    {religions.map((r) => (
                      <button
                        key={r.value}
                        onClick={() => updateFilter("religion", r.value)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                          filters.religion === r.value
                            ? "bg-primary-600 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Statut marital</label>
                  <div className="flex flex-wrap gap-2">
                    {maritalStatuses.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => updateFilter("maritalStatus", s.value)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                          filters.maritalStatus === s.value
                            ? "bg-primary-600 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Options</label>
                  <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-emerald-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Profils vérifiés uniquement</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={filters.verifiedOnly}
                      onChange={(e) => updateFilter("verifiedOnly", e.target.checked)}
                      className="w-5 h-5 accent-primary-600"
                    />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl cursor-pointer">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-blue-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Près de chez moi</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={filters.nearby}
                      onChange={(e) => updateFilter("nearby", e.target.checked)}
                      className="w-5 h-5 accent-primary-600"
                    />
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-2 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Réinitialiser
                  </button>
                  <button
                    onClick={togglePanel}
                    className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition"
                  >
                    Appliquer ({activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''})
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
