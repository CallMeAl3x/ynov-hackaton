import { db } from "./db";
import { StoryStatus } from "@prisma/client";

export const getStoryById = async (id: string) => {
  return db.story.findUnique({
    where: { id },
  });
};

export const getStoryByUserId = async (userId: string) => {
  return db.story.findMany({
    where: { authorId: userId },
  });
};

export const createStory = async (data: {
  name: string;
  theme: string;
  subject: string;
  description?: string | null;
  authorId: string;
  coverImage?: string | null;
  status?: StoryStatus;
}) => {
  return db.story.create({ data });
};

export const updateStory = async (
  id: string,
  data: Partial<{
    name: string;
    theme: string;
    subject: string;
    description?: string | null;
    coverImage?: string | null;
    status?: StoryStatus;
  }>
) => {
  return db.story.update({ where: { id }, data });
};

export const deleteStory = async (id: string) => {
  return db.story.delete({ where: { id } });
};
