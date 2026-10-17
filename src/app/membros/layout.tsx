import "./editorial.css";

// Escopo dark ESV aplicado só à área de membros (não afeta a landing pública).
// .esv-ed liga o padrão editorial de luxo (filetes, serifa nos títulos, raio zero).
export default function MembrosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="esv-dark esv-ed">{children}</div>;
}
