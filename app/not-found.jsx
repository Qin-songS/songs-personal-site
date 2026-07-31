import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <p className="eyebrow">404 / Off the record</p>
      <h1>This page has not been written yet.</h1>
      <Link className="text-link" href="/">
        Return to songs.com <span aria-hidden="true">↗</span>
      </Link>
    </main>
  );
}

