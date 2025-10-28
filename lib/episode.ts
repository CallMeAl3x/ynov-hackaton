import { db } from "./db";

export const getEpisodesByStoryId = async (storyId: string) => {
  return db.episode.findMany({
    where: { storyId },
    orderBy: { order: "asc" },
  });
};

export const getEpisodeById = async (id: string) => {
  return db.episode.findUnique({ where: { id } });
};

export const getEpisodeWithStory = async (id: string) => {
  return db.episode.findUnique({
    where: { id },
    include: { story: true },
  });
};
