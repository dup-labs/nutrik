import { Suspense } from "react";
import { RespirarClient } from "./RespirarClient";

export default function RespirarPage() {
  return (
    <Suspense>
      <RespirarClient />
    </Suspense>
  );
}
