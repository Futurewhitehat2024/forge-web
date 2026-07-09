import { createSeedState } from "@/lib/seed";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ForgeData, Workspace } from "@/lib/types";

export class SupabaseNotConfiguredError extends Error {
  constructor() {
    super("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
    this.name = "SupabaseNotConfiguredError";
  }
}

function getClient() {
  const client = createAdminClient();
  if (!client) {
    throw new SupabaseNotConfiguredError();
  }
  return client;
}

export async function getOrCreateWorkspace(clerkUserId: string): Promise<Workspace> {
  const supabase = getClient();

  const { data: existing, error: fetchError } = await supabase
    .from("workspaces")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  if (existing) {
    return existing as Workspace;
  }

  const seed = createSeedState();
  const { data: created, error: insertError } = await supabase
    .from("workspaces")
    .insert({
      clerk_user_id: clerkUserId,
      state: seed,
    })
    .select("*")
    .single();

  if (insertError) {
    throw new Error(insertError.message);
  }

  return created as Workspace;
}

export async function getWorkspaceState(clerkUserId: string): Promise<ForgeData | null> {
  const supabase = getClient();

  const { data, error } = await supabase
    .from("workspaces")
    .select("state")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data?.state as ForgeData | undefined) ?? null;
}

export async function saveWorkspaceState(
  clerkUserId: string,
  state: Partial<ForgeData>
): Promise<ForgeData> {
  const supabase = getClient();
  const workspace = await getOrCreateWorkspace(clerkUserId);
  const merged = { ...workspace.state, ...state };

  const { data, error } = await supabase
    .from("workspaces")
    .update({
      state: merged,
      updated_at: new Date().toISOString(),
    })
    .eq("clerk_user_id", clerkUserId)
    .select("state")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data.state as ForgeData;
}

export async function mergeWorkspaceState(
  clerkUserId: string,
  partial: Partial<ForgeData>
): Promise<ForgeData> {
  const current = (await getWorkspaceState(clerkUserId)) ?? createSeedState();
  return saveWorkspaceState(clerkUserId, { ...current, ...partial });
}