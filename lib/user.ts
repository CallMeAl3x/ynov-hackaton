import { db } from "./db";

export const getAllUsersWithStories = async () => {
  return db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      stories: {
        where: {
          status: "PUBLISHED",
          // Only include stories that have at least one published episode
          episodes: {
            some: {
              published: true,
            },
          },
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
      },
      _count: {
        select: {
          stories: true,
        },
      },
    },
    where: {
      stories: {
        some: {
          status: "PUBLISHED",
          // Only include users that have at least one story with a published episode
          episodes: {
            some: {
              published: true,
            },
          },
        },
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
          // Only include stories that have at least one published episode
          episodes: {
            some: {
              published: true,
            },
          },
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
