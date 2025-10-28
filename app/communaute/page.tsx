import { getAllUsersWithStories } from "@/lib/user";
import { CommunityClient } from "./community-client";

export default async function CommunityPage() {
  const users = await getAllUsersWithStories();

  return <CommunityClient users={users} />;
}
