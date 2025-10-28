import { Metadata } from "next";
import { getAllUsersWithStories } from "@/lib/user";
import { CommunityClient } from "./community-client";

export const metadata: Metadata = {
  title: "Community - Pensaga",
  description: "Discover and connect with Pensaga creators.",
};

export default async function CommunityPage() {
  const users = await getAllUsersWithStories();

  return <CommunityClient users={users} />;
}
