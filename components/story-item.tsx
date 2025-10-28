"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteStory } from "@/actions/delete-story";
import Link from "next/link";

export default function StoryItem({ story }: { story: any }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const ok = confirm("Are you sure you want to delete this story?");
    if (!ok) return;
    try {
      setIsDeleting(true);
      const res = await deleteStory(story.id);
      if (res?.success) {
        // Refresh the server component list
        router.refresh();
      } else {
        alert(res?.error || "Failed to delete story");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete story");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <li className="p-3 border rounded flex items-start justify-between">
      <div>
        <Link href={`/story/${story.id}`} className="font-medium text-sky-600">
          {story.name}
        </Link>
        <p className="text-sm text-slate-600">{story.description ?? ""}</p>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={`/story/${story.id}/edit`}
          className="text-sm rounded px-3 py-1 border hover:bg-slate-50"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-sm rounded bg-red-600 text-white px-3 py-1 disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Remove"}
        </button>
      </div>
    </li>
  );
}
