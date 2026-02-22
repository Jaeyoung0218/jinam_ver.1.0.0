import { readFile } from "node:fs/promises";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getMimeType(ext: string): string {
  switch (ext.toLowerCase()) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}

function resolveThumbnailPathById(id: string): string | null {
  const dir = join(process.cwd(), "crawler", "concert_thumbnails");
  if (!existsSync(dir)) return null;

  const target = id.toLowerCase();
  const files = readdirSync(dir);
  const exact = files.find((file) => {
    const dot = file.lastIndexOf(".");
    if (dot <= 0) return false;
    const base = file.slice(0, dot).toLowerCase();
    return base === target;
  });
  if (exact) return join(dir, exact);

  const fuzzy = files.find((file) => {
    const dot = file.lastIndexOf(".");
    if (dot <= 0) return false;
    const base = file.slice(0, dot).toLowerCase();
    // Tolerate minor id drift (e.g. truncated suffix/prefix)
    return base.startsWith(target) || target.startsWith(base) || base.includes(target) || target.includes(base);
  });

  if (!fuzzy) return null;
  return join(dir, fuzzy);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const filePath = resolveThumbnailPathById(id);
  if (!filePath) {
    return NextResponse.json({ ok: false, message: "Thumbnail not found." }, { status: 404 });
  }

  const file = await readFile(filePath);
  const dot = filePath.lastIndexOf(".");
  const ext = dot >= 0 ? filePath.slice(dot) : "";

  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Content-Type": getMimeType(ext),
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
