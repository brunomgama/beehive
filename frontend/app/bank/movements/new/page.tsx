
import { Suspense } from "react";
import NewMovementPageClient from "@/components/client/movements/new_movements";

export default function NewMovementPage() {
  return (
    <Suspense fallback={null}>
      <NewMovementPageClient />
    </Suspense>
  );
}