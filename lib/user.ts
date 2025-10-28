import { db } from "./db";

export const getAllUsersWithStories = async () => {
  return db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      stories: {
        select: {
          id: true,
          name: true,
          description: true,
          theme: true,
          status: true,
          createdAt: true,
          _count: {
            select: {
              characters: true,
              episodes: true,
            },
          },
        },
      },
      _count: {
        select: {
          stories: true,
        },
      },
    },
    where: {
      stories: {
        some: {},
      },
    },
  });
};

export const getUserWithStories = async (userId: string) => {
  return db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      stories: {
        where: {
          status: "PUBLISHED",
        },
        select: {
          id: true,
          name: true,
          description: true,
          theme: true,
          status: true,
          createdAt: true,
          _count: {
            select: {
              characters: true,
              episodes: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: {
          stories: true,
        },
      },
    },
  });
};
