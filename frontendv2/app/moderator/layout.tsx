
export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <main className="min-h-screen">{children}</main>
    </>
  );
}
