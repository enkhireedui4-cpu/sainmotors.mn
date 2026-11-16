import { localePath } from "@/lib/i18n";

// The host's .htaccess redirects "/" to "/en/" before this file is served.
// This page covers any other static host: a meta refresh plus visible links.
export default function RootPage() {
  const mn = localePath("mn");
  const en = localePath("en");
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${en}`} />
      <p style={{ fontFamily: "Arial, sans-serif", padding: "2rem" }}>
        <a href={mn}>Sain Motors — Монгол</a> · <a href={en}>English</a>
      </p>
    </>
  );
}
