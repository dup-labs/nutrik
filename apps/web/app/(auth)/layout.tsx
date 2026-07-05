export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="auth-outer">
      <div className="auth-inner">{children}</div>
    </div>
  );
}
