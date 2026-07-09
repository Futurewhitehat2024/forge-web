import { ForgeProvider } from "@/components/forge-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ForgeProvider>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="pl-[240px]">
          <Topbar />
          <main className="p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </ForgeProvider>
  );
}