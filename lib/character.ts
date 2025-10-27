import { db } from "./db";

export const getCharactersByStoryId = async (storyId: string) => {
  return db.character.findMany({
    where: { storyId },
    orderBy: { createdAt: "asc" },
  });
};

export const getCharacterById = async (id: string) => {
  return db.character.findUnique({ where: { id } });
};
