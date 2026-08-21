import { Suspense } from "react";
import AdminLoginPage from "./AdminLoginPage";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F5F0E8] text-sm text-coffee-muted">
          Loading...
        </div>
      }
    >
      <AdminLoginPage />
    </Suspense>
  );
}
