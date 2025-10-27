import { getStoryByUserId } from "@/lib/story";
import { currentUser } from "@/lib/auth";
import Link from "next/link";
import StoryItem from "@/components/story-item";

const Storys = async () => {
  const user = await currentUser();
  if (!user || !user.id) return <div>Not logged in</div>;

  const storys = await getStoryByUserId(user.id);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Your stories</h2>
        <Link
          href="/onboarding/new"
          className="text-sm rounded bg-sky-600 text-white px-3 py-1"
        >
          Create story
        </Link>
      </div>

      <ul className="mt-4 space-y-3">
        {storys.length === 0 ? (
          <li>
            No stories yet —{" "}
            <Link href="/onboarding/new" className="text-sky-600">
              create one
            </Link>
          </li>
        ) : (
          storys.map((s: any) => <StoryItem key={s.id} story={s} />)
        )}
      </ul>
    </div>
  );
};

export default Storys;
