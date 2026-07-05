import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui";
import {
  IconChat,
  IconChevronLeft,
  IconCopy,
  IconMail,
  IconMapPin,
  IconPhone,
} from "@/components/ui/icons";
import { getPatientContext } from "@/lib/queries";
import { PRO_ACCENT, type Professional } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProDetailPage({
  params,
}: {
  params: Promise<{ proId: string }>;
}) {
  const { proId } = await params;
  const { supabase } = await getPatientContext();

  const { data } = await supabase
    .from("professionals")
    .select("*")
    .eq("id", proId)
    .maybeSingle();
  if (!data) notFound();
  const pro = data as Professional;
  const acc = PRO_ACCENT[pro.type];
  const initial = pro.name.replace(/^Dra?\. /, "")[0];

  const contactRow = (icon: React.ReactNode, text: string, mono?: boolean) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: "var(--radius-md)",
          background: acc.soft,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: acc.accent,
        }}
      >
        {icon}
      </div>
      <span
        style={{
          fontSize: 13,
          color: "var(--color-text-secondary)",
          fontFamily: mono ? "var(--font-data)" : undefined,
        }}
      >
        {text}
      </span>
    </div>
  );

  return (
    <div style={{ paddingBottom: 28 }}>
      <div style={{ position: "relative", height: 150, background: acc.mesh, overflow: "hidden" }}>
        <Link
          href="/perfil"
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 2,
            width: 38,
            height: 38,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.35)",
            background: "var(--glass-bg-tint)",
            backdropFilter: "var(--glass-blur)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
          }}
        >
          <IconChevronLeft size={18} />
        </Link>
        <div
          style={{
            position: "absolute",
            left: 20,
            bottom: -30,
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: acc.bg,
            border: "3px solid var(--color-surface-elevated)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: 24,
            color: acc.accent,
            boxShadow: "var(--shadow-card)",
          }}
        >
          {initial}
        </div>
      </div>

      <div style={{ padding: "44px 20px 0", maxWidth: 640, margin: "0 auto" }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 22, letterSpacing: "-0.03em" }}>
          {pro.name}
        </div>
        <div style={{ fontSize: 13, color: acc.accent, marginTop: 2, textTransform: "capitalize" }}>
          {acc.role}
        </div>
        {pro.reg_code && (
          <div style={{ fontFamily: "var(--font-data)", fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>
            {pro.reg_code}
          </div>
        )}

        {pro.bio && (
          <Card style={{ marginTop: 18 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
                marginBottom: 8,
              }}
            >
              sobre
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.55, color: "var(--color-text-secondary)" }}>
              {pro.bio}
            </div>
            {pro.tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
                {pro.tags.map((t) => (
                  <div
                    key={t}
                    style={{
                      height: 26,
                      padding: "0 12px",
                      borderRadius: "var(--radius-pill)",
                      background: acc.soft,
                      display: "flex",
                      alignItems: "center",
                      fontSize: 11,
                      color: acc.accent,
                    }}
                  >
                    {t}
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        <Card style={{ marginTop: 12 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "var(--color-text-muted)",
              marginBottom: 12,
            }}
          >
            contato
          </div>
          {pro.clinic && contactRow(<IconMapPin size={16} />, pro.clinic)}
          {pro.phone && contactRow(<IconPhone size={16} />, pro.phone, true)}
          {pro.email && contactRow(<IconMail size={16} />, pro.email)}
        </Card>

        <Card
          style={{
            marginTop: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
              }}
            >
              código de convite
            </div>
            <div
              style={{
                fontFamily: "var(--font-data)",
                fontSize: 16,
                letterSpacing: "0.06em",
                marginTop: 3,
              }}
            >
              {pro.invite_code}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              height: 30,
              padding: "0 12px",
              borderRadius: "var(--radius-pill)",
              background: acc.soft,
              color: acc.accent,
              fontSize: 12,
            }}
          >
            <IconCopy size={13} /> copiar
          </div>
        </Card>

        <Link href={`/chat/${pro.id}`} style={{ textDecoration: "none" }}>
          <div
            style={{
              width: "100%",
              height: 54,
              borderRadius: "var(--radius-pill)",
              background: "var(--color-orange)",
              color: "#fff",
              fontWeight: 600,
              fontSize: 16,
              boxShadow: "0 4px 16px rgba(254,95,51,0.24)",
              marginTop: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <IconChat size={18} /> conversar
          </div>
        </Link>
      </div>
    </div>
  );
}
