/**
 * Utilitaire pour traduire et formater les rôles de personnages
 */

export const ROLE_TRANSLATIONS = {
  PROTAGONIST: {
    fr: "Protagoniste",
    en: "Protagonist",
  },
  ANTAGONIST: {
    fr: "Antagoniste",
    en: "Antagonist",
  },
  SECONDARY: {
    fr: "Personnage secondaire",
    en: "Secondary",
  },
  MINOR: {
    fr: "Personnage mineur",
    en: "Minor",
  },
} as const;

export const ROLE_VALUES = Object.keys(ROLE_TRANSLATIONS) as (keyof typeof ROLE_TRANSLATIONS)[];

/**
 * Traduit un rôle de personnage
 * @param role - La clé du rôle (PROTAGONIST, ANTAGONIST, SECONDARY, MINOR)
 * @param lang - La langue (fr ou en), défaut: fr
 * @returns Le rôle traduit
 */
export const getRoleLabel = (role: string, lang: "fr" | "en" = "fr"): string => {
  const roleKey = role.toUpperCase() as keyof typeof ROLE_TRANSLATIONS;
  if (roleKey in ROLE_TRANSLATIONS) {
    return ROLE_TRANSLATIONS[roleKey][lang];
  }
  return role;
};

/**
 * Obtient la couleur du badge pour un rôle
 * @param role - La clé du rôle
 * @returns Classes Tailwind pour le badge
 */
export const getRoleBadgeColor = (role: string): string => {
  const colorMap: Record<string, string> = {
    PROTAGONIST: "bg-amber-100 text-amber-900 border border-amber-300",
    ANTAGONIST: "bg-rose-100 text-rose-900 border border-rose-300",
    SECONDARY: "bg-violet-100 text-violet-900 border border-violet-300",
    MINOR: "bg-slate-100 text-slate-700 border border-slate-300",
  };
  return colorMap[role] || "bg-slate-100 text-slate-700 border border-slate-300";
};

/**
 * Liste des rôles avec labels en français pour les sélecteurs
 */
export const ROLE_OPTIONS = [
  { label: "Protagoniste (Héros Principal)", value: "PROTAGONIST" },
  { label: "Antagoniste (Méchant Principal)", value: "ANTAGONIST" },
  { label: "Personnage Secondaire", value: "SECONDARY" },
  { label: "Personnage Mineur", value: "MINOR" },
];
