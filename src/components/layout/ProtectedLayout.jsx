import { ProtectedRoute } from "./ProtectedRoute";
import { AppLayout } from "./AppLayout";

export function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <AppLayout />
    </ProtectedRoute>
  );
}
