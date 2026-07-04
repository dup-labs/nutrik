"use client";

/*
  Blob color reference (brand tokens → rgb):
  --color-blue-glow:  #6DA4B7 → rgb(109, 164, 183)   bright teal, the signature glow
  --color-blue-core:  #0F2F3C → rgb( 15,  47,  60)   mid dark teal
  --color-blue-deep:  #122229 → rgb( 18,  34,  41)   ultra-dark teal, depth anchor
*/

export default function BackgroundBlobs() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        background: "#05070B", /* --color-base */
      }}
    >
      {/* Blob 1 — large, top-left, blue-glow core → blue-core fade, slow drift */}
      <div style={{
        position: "absolute",
        width: "70vw",
        height: "70vw",
        borderRadius: "50%",
        background: "radial-gradient(circle at center, rgba(109,164,183,0.72) 0%, rgba(15,47,60,0.38) 50%, transparent 70%)",
        filter: "blur(90px)",
        top: "-25%",
        left: "-15%",
        animation: "blob1 10s ease-in-out infinite",
        willChange: "transform",
      }} />

      {/* Blob 2 — medium, bottom-right, blue-deep heavy anchor */}
      <div style={{
        position: "absolute",
        width: "55vw",
        height: "55vw",
        borderRadius: "50%",
        background: "radial-gradient(circle at center, rgba(18,34,41,0.98) 0%, rgba(15,47,60,0.55) 50%, transparent 70%)",
        filter: "blur(70px)",
        bottom: "-20%",
        right: "-10%",
        animation: "blob2 16s ease-in-out infinite",
        willChange: "transform",
      }} />

      {/* Blob 3 — medium, center-diagonal, blue-core body */}
      <div style={{
        position: "absolute",
        width: "45vw",
        height: "45vw",
        borderRadius: "50%",
        background: "radial-gradient(circle at center, rgba(15,47,60,0.85) 0%, rgba(18,34,41,0.42) 50%, transparent 70%)",
        filter: "blur(80px)",
        top: "25%",
        left: "35%",
        animation: "blob3 30s ease-in-out infinite",
        willChange: "transform",
      }} />

      {/* Blob 4 — smaller, bottom-left, blue-glow soft accent */}
      <div style={{
        position: "absolute",
        width: "35vw",
        height: "35vw",
        borderRadius: "50%",
        background: "radial-gradient(circle at center, rgba(109,164,183,0.38) 0%, rgba(15,47,60,0.18) 55%, transparent 70%)",
        filter: "blur(60px)",
        bottom: "5%",
        left: "10%",
        animation: "blob4 24s ease-in-out infinite",
        willChange: "transform",
      }} />

      {/* Blob 5 — small spark, center-right, blue-glow highlight */}
      <div style={{
        position: "absolute",
        width: "25vw",
        height: "25vw",
        borderRadius: "50%",
        background: "radial-gradient(circle at center, rgba(109,164,183,0.52) 0%, rgba(15,47,60,0.22) 55%, transparent 70%)",
        filter: "blur(50px)",
        top: "55%",
        right: "15%",
        animation: "blob5 18s ease-in-out infinite",
        willChange: "transform",
      }} />
    </div>
  );
}
