// Escopo dark ESV aplicado só à área de membros (não afeta a landing pública).
export default function MembrosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="esv-dark">{children}</div>;
}
