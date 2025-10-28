type Character = {
  id: string;
  name: string;
  description: string;
  role: "PROTAGONIST" | "ANTAGONIST" | "SECONDARY" | "MINOR";
  storyId: string;
  relationships: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type Story = {
  id: string;
  name: string;
  description: string | null;
  subject: string;
  theme: string;
  status: string;
  coverImage: string | null;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
};

type Episode = {
  id: string;
  name: string;
  content: string;
  order: number;
  published: boolean;
  storyId: string;
  createdAt: Date;
  updatedAt: Date;
};

export function buildEpisodePrompt(
  story: Story,
  characters: Character[],
  episodes: Episode[]
): string {
  const charactersList = characters
    .map(
      (c) =>
        `- ${c.name} (${c.role}): ${c.description}${c.relationships ? ` - Relationships: ${c.relationships}` : ""}`
    )
    .join("\n");

  return `Tu es un écrivain expert en création de fiction. Tu dois créer un épisode pour une web novel.

INFORMATIONS DE L'HISTOIRE:
Titre: ${story.name}
Thème: ${story.theme}
Sujet/Intrigue: ${story.subject}
${story.description ? `Description: ${story.description}` : ""}

PERSONNAGES:
${charactersList}

CONTEXTE ACTUEL:
Épisode: ${episodes.length + 1}
${episodes.length > 0 ? `Dernier épisode résumé: "${episodes[episodes.length - 1].name}\n${episodes[episodes.length - 1].content.substring(0, 300)}..."` : "Ceci est le premier épisode"}

INSTRUCTIONS:
1. Écris un épisode de 1500 à 2500 mots MAXIMUM au format MARKDOWN
2. Respecte ABSOLUMENT la limite de 2500 mots
3. Reprends les personnages mentionnés et développe l'histoire
4. Respecte le thème "${story.theme}" et l'intrigue
5. Utilise un langage engageant et captivant avec une bonne mise en forme markdown
6. Crée une continuité avec l'épisode précédent (le cas échéant)
7. Termine par un suspense ou un hook pour le prochain épisode
8. Utilise des titres (##), des paragraphes bien séparés, et du **gras** ou *italique* pour mettre en avant les éléments importants

LIMITE STRICTE: Ne dépasse PAS 2500 mots!

Format attendu:
- Utilise ## pour les sous-titres de scènes
- Sépare les paragraphes avec des lignes vides
- Mets en gras les noms des personnages lors de leur première apparition
- Utilise l'italique pour les pensées intérieures ou dialogues importants

Commence directement avec le contenu de l'épisode en markdown, sans introduction.`;
}
