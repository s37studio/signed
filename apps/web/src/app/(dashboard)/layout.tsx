import Sidebar from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#0E0E10]">
      <Sidebar />
      <main className="flex-1 py-4 pr-4 overflow-hidden">
        <div className="h-full w-full bg-[#0C0C0D] rounded-[20px] overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
