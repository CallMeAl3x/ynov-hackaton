import { NextRequest, NextResponse } from "next/server";
import { getStoryById } from "@/lib/story";
import { getEpisodesByStoryId } from "@/lib/episode";
import { currentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const storyId = searchParams.get("storyId");

    if (!storyId) {
      return NextResponse.json({ error: "Missing storyId" }, { status: 400 });
    }

    const story = await getStoryById(storyId);
    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    const episodes = await getEpisodesByStoryId(storyId);

    if (episodes.length === 0) {
      return NextResponse.json(
        { error: "No episodes to download" },
        { status: 400 }
      );
    }

    // Dynamic import for jszip
    const JSZip = (await import("jszip")).default;
    const { marked } = await import("marked");

    const zip = new JSZip();

    // Add each episode as a PDF text file
    for (const episode of episodes) {
      const htmlContent = await marked(episode.content);

      const htmlString = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${episode.name}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      padding: 40px;
      line-height: 1.8;
      color: #333;
    }
    h1, h2, h3, h4, h5, h6 {
      margin: 24px 0 12px 0;
      font-weight: 600;
      color: #1a1a1a;
    }
    h1 { font-size: 24px; }
    h2 { font-size: 20px; }
    h3 { font-size: 18px; }
    p {
      margin: 12px 0;
      line-height: 1.8;
    }
    ul, ol {
      margin: 12px 0;
      padding-left: 24px;
    }
    li {
      margin: 6px 0;
    }
    blockquote {
      margin: 12px 0;
      padding: 12px 16px;
      border-left: 4px solid #ddd;
      background-color: #f9f9f9;
      color: #666;
    }
    code {
      background-color: #f5f5f5;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
    }
    pre {
      background-color: #f5f5f5;
      padding: 12px;
      border-radius: 3px;
      overflow-x: auto;
      margin: 12px 0;
    }
    pre code {
      background-color: transparent;
      padding: 0;
    }
  </style>
</head>
<body>
  <h1>${episode.name}</h1>
  <p><strong>${story.name}</strong> - Épisode ${episode.order}</p>
  <p><em>Créé le ${
        typeof episode.createdAt === "string"
          ? new Date(episode.createdAt).toLocaleDateString("fr-FR")
          : episode.createdAt.toLocaleDateString("fr-FR")
      }</em></p>
  <hr />
  ${htmlContent}
</body>
</html>`;

      // Save as HTML file in the ZIP
      zip.file(
        `${episode.order}-${episode.name.replace(/\//g, "-")}.html`,
        htmlString
      );
    }

    const zipBuffer = await zip.generateAsync({ type: "arraybuffer" });

    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${story.name.replace(/\//g, "-")}-episodes.zip"`,
      },
    });
  } catch (error) {
    console.error("Error downloading PDFs:", error);
    return NextResponse.json(
      { error: "Failed to generate download" },
      { status: 500 }
    );
  }
}
