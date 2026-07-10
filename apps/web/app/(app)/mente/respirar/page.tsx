import { Suspense } from "react";
import { requireFeature } from "@/lib/queries";
import { RespirarClient } from "./RespirarClient";

export const dynamic = "force-dynamic";

export default async function RespirarPage() {
  await requireFeature("meditacao");
  return (
    <Suspense>
      <RespirarClient />
    </Suspense>
  );
}
