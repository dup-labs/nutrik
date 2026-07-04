"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { BackHeader, MacroRow, PrimaryButton } from "@/components/ui";
import { IconSwap } from "@/components/ui/icons";
import { logMeal } from "@/lib/actions";
import { createClient } from "@/lib/supabase/client";
import type { MealLog, ProtocolMeal } from "@/lib/types";

export function MealDetailClient({
  meal,
  log,
  date,
  userId,
  linked,
}: {
  meal: ProtocolMeal;
  log: MealLog | null;
  date: string;
  userId: string;
  linked: boolean;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"feito" | "pulei" | null>(
    log ? (log.status === "done" ? "feito" : "pulei") : null,
  );
  const [follow, setFollow] = useState<"segui" | "adaptei" | null>(
    log?.follow === "seguiu" ? "segui" : log?.follow === "adaptou" ? "adaptei" : null,
  );
  const [note, setNote] = useState(log?.note ?? "");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [existingPhoto, setExistingPhoto] = useState(log?.photo_path ?? null);
  const [busy, setBusy] = useState(false);

  function pickPhoto(f: File) {
    setPhotoFile(f);
    setPhotoPreview(URL.createObjectURL(f));
  }

  async function handleSave() {
    if (!mode || busy) return;
    setBusy(true);

    let photoPath = existingPhoto;
    if (photoFile) {
      const supabase = createClient();
      const ext = photoFile.name.split(".").pop() || "jpg";
      const path = `${userId}/meals/${date}-${meal.id}.${ext}`;
      const { error } = await supabase.storage
        .from("nutrk-photos")
        .upload(path, photoFile, { upsert: true });
      if (!error) photoPath = path;
    }

    await logMeal({
      protocolMealId: meal.id,
      date,
      status: mode === "feito" ? "done" : "skipped",
      follow: mode === "feito" ? (follow === "adaptei" ? "adaptou" : "seguiu") : null,
      note,
      photoPath,
    });
    router.push("/refeicoes");
    router.refresh();
  }

  const segBtn = (active: boolean, color: string): React.CSSProperties => ({
    flex: 1,
    height: 44,
    borderRadius: "var(--radius-pill)",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
    border: active ? "none" : "1px solid var(--color-border-strong)",
    background: active ? color : "var(--color-surface-elevated)",
    color: active ? "#fff" : "var(--color-text-secondary)",
  });

  const label = (t: React.ReactNode) => (
    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 8 }}>
      {t}
    </div>
  );

  return (
    <div style={{ padding: "24px 20px 40px" }}>
      <BackHeader href="/refeicoes" title={meal.name} subtitle={meal.time ?? undefined} />

      <div style={{ fontSize: 14, lineHeight: 1.55, color: "var(--color-text-secondary)", marginBottom: 12 }}>
        {meal.description}
      </div>
      {meal.kcal != null && (
        <div style={{ marginBottom: 18 }}>
          <MacroRow kcal={meal.kcal} p={meal.protein_g} c={meal.carbs_g} g={meal.fat_g} boxed />
        </div>
      )}

      {label("uma foto, se quiser")}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(e) => e.target.files?.[0] && pickPhoto(e.target.files[0])}
      />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        style={{
          width: "100%",
          height: 176,
          borderRadius: 14,
          border: "1.5px dashed var(--color-border-strong)",
          background: photoPreview
            ? `url(${photoPreview}) center/cover`
            : "var(--color-surface)",
          color: "var(--color-text-muted)",
          fontSize: 14,
          cursor: "pointer",
          marginBottom: 22,
          overflow: "hidden",
        }}
      >
        {!photoPreview && (existingPhoto ? "foto registrada · toque pra trocar" : "toque pra adicionar uma foto")}
      </button>

      {label("como foi?")}
      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <button style={segBtn(mode === "feito", "var(--color-orange)")} onClick={() => setMode("feito")}>
          feito
        </button>
        <button style={segBtn(mode === "pulei", "#6b6f78")} onClick={() => setMode("pulei")}>
          pulei
        </button>
      </div>

      {mode === "feito" && (
        <>
          {label("seguiu o convite ou adaptou?")}
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <button style={segBtn(follow === "segui", "#2f9e6b")} onClick={() => setFollow("segui")}>
              segui
            </button>
            <button style={segBtn(follow === "adaptei", "#c67518")} onClick={() => setFollow("adaptei")}>
              adaptei
            </button>
          </div>
          {follow === "adaptei" && (
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="o que você trocou?"
              style={{
                width: "100%",
                minHeight: 78,
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border-strong)",
                background: "var(--color-surface)",
                padding: "12px 14px",
                fontSize: 14,
                color: "var(--color-text)",
                outline: "none",
                resize: "none",
                boxSizing: "border-box",
                marginBottom: 4,
              }}
            />
          )}
        </>
      )}

      {mode === "pulei" && (
        <>
          {label(
            <>
              o que rolou?{" "}
              <span style={{ fontWeight: 400, color: "var(--color-text-muted)" }}>sem julgamento</span>
            </>,
          )}
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="sem tempo, sem fome, comi outra coisa..."
            style={{
              width: "100%",
              minHeight: 78,
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border-strong)",
              background: "var(--color-surface)",
              padding: "12px 14px",
              fontSize: 14,
              color: "var(--color-text)",
              outline: "none",
              resize: "none",
              boxSizing: "border-box",
              marginBottom: 4,
            }}
          />
        </>
      )}

      <PrimaryButton disabled={!mode || busy} onClick={handleSave} style={{ marginTop: 18 }}>
        {busy ? "salvando..." : "salvar"}
      </PrimaryButton>

      {linked && (
        <Link
          href={`/refeicoes/substituir/${meal.id}`}
          style={{
            marginTop: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            color: "var(--color-orange)",
            textDecoration: "none",
          }}
        >
          <IconSwap size={15} /> pedir substituição pro nutri
        </Link>
      )}
    </div>
  );
}
