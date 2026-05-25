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

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://mock-deployment-12345.convex.cloud";
  const convex = new ConvexHttpClient(convexUrl);

  try {
    const stats = await convex.query(api.usageStats.getUsageStats, {
      userId: session.user.id,
    });
    return Response.json({ success: true, data: stats });
  } catch (error: any) {
    return Response.json(
      { success: false, error: error.message || "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
