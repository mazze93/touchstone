import { AppShell } from "@/components/app-shell";
import { StoreProvider } from "@/lib/store";

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <AppShell>{children}</AppShell>
    </StoreProvider>
  );
}
