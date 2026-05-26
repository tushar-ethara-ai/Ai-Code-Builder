import { auth } from "@/lib/auth";
import { api } from "../../../../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json(
      { success: false, error: "Unauthorized access", code: 401 },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const searchTerm = searchParams.get("search") || undefined;
  const language = searchParams.get("language") || undefined;
  const tone = searchParams.get("tone") || undefined;
  const favoritesOnly = searchParams.get("favorites") === "true";

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://mock-deployment-12345.convex.cloud";
  const convex = new ConvexHttpClient(convexUrl);

  try {
    const list = await convex.query(api.generations.getGenerations, {
      userId: session.user.id,
      searchTerm,
      language,
      tone,
      favoritesOnly,
    });
    return Response.json({ success: true, data: list });
  } catch (error: any) {
    return Response.json(
      { success: false, error: error.message || "Failed to fetch history" },
      { status: 500 }
    );
  }
}
