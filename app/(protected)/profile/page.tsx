import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProfileClient } from "./profile-client";
import { getStoryByUserId } from "@/lib/story";

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user || !user.id) {
    redirect("/auth/login");
  }

  const stories = await getStoryByUserId(user.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <ProfileClient
        user={{
          id: user.id,
          name: user.name || null,
          email: user.email || null,
          image: user.image || null,
        }}
        stories={stories}
      />
    </div>
  );
}
