import { getPatientContext } from "@/lib/queries";
import { getMyGroups, getPendingInvites } from "@/lib/social/queries";
import { AmigosClient } from "./AmigosClient";

export const dynamic = "force-dynamic";

export default async function AmigosPage() {
  const { supabase, user, profile } = await getPatientContext();
  const [groups, invites] = await Promise.all([
    getMyGroups(supabase, user.id),
    getPendingInvites(supabase),
  ]);

  return (
    <div style={{ padding: "24px 20px 28px", maxWidth: 680, margin: "0 auto" }}>
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: 28,
            letterSpacing: "-0.03em",
          }}
        >
          amigos
        </div>
        <div style={{ fontSize: 14, color: "var(--color-text-muted)", marginTop: 2 }}>
          quem tá junto, pontua junto.
        </div>
      </div>

      <AmigosClient
        groups={groups.map((g) => ({
          id: g.group.id,
          name: g.group.name,
          memberCount: g.memberCount,
          myWeekPoints: g.myWeekPoints,
          myPosition: g.myPosition,
        }))}
        invites={invites}
        hasUsername={!!profile?.username}
      />
    </div>
  );
}
