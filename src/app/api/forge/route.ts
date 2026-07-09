import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  getOrCreateWorkspace,
  mergeWorkspaceState,
  SupabaseNotConfiguredError,
} from "@/lib/db";
import type { ForgeData } from "@/lib/types";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const workspace = await getOrCreateWorkspace(userId);
    return NextResponse.json(workspace.state);
  } catch (error) {
    if (error instanceof SupabaseNotConfiguredError) {
      return NextResponse.json(
        { error: "Database unavailable", message: error.message },
        { status: 503 }
      );
    }

    console.error("[GET /api/forge]", error);
    return NextResponse.json({ error: "Failed to load workspace" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let partial: Partial<ForgeData>;

  try {
    partial = (await request.json()) as Partial<ForgeData>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const state = await mergeWorkspaceState(userId, partial);
    return NextResponse.json(state);
  } catch (error) {
    if (error instanceof SupabaseNotConfiguredError) {
      return NextResponse.json(
        { error: "Database unavailable", message: error.message },
        { status: 503 }
      );
    }

    console.error("[PUT /api/forge]", error);
    return NextResponse.json({ error: "Failed to save workspace" }, { status: 500 });
  }
}