// app/(auth)/layout.tsx

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Optional: Add logo or branding here */}
      <div className="container mx-auto px-4">
        {children}
      </div>
    </div>
  );
}