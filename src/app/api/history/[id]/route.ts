import { auth } from "@/lib/auth";
import { api } from "../../../../../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

export async function DELETE(
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
    await convex.mutation(api.generations.deleteGeneration, {
      id: id as any,
      userId: session.user.id,
    });
    return Response.json({ success: true, message: "Generation deleted successfully" });
  } catch (error: any) {
    return Response.json(
      { success: false, error: error.message || "Failed to delete generation" },
      { status: 500 }
    );
  }
}
