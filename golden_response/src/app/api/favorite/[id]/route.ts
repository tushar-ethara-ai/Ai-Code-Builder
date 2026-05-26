import { auth } from "@/lib/auth";
import { api } from "../../../../../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json(
      { success: false, error: "Unauthorized access", code: 401 },
      { status: 401 }
    );
  }

  const { id } = await params;
  if (!id) {
    return Response.json(
      { success: false, error: "Missing document ID", code: 400 },
      { status: 400 }
    );
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://mock-deployment-12345.convex.cloud";
  const convex = new ConvexHttpClient(convexUrl);

  try {
    const isFavorited = await convex.mutation(api.generations.toggleFavorite, {
      id: id as any,
      userId: session.user.id,
    });
    return Response.json({ success: true, isFavorited });
  } catch (error: any) {
    return Response.json(
      { success: false, error: error.message || "Failed to toggle favorite status" },
      { status: 500 }
    );
  }
}
