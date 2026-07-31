import "./globals.css";

export const metadata = {
  title: {
    default: "songs.com — Work, notes & résumé",
    template: "%s — songs.com",
  },
  description:
    "An English-first bilingual personal archive for selected work, writing, experience, and contact.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "songs.com",
    description: "Selected work, practical notes, and a living résumé.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
