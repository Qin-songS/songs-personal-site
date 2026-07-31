export default function LanguageSwitch({ locale, article = false }) {
  const href =
    locale === "en"
      ? article
        ? "/zh/notes/why-this-site/"
        : "/zh/"
      : article
        ? "/notes/why-this-site/"
        : "/";

  return (
    <a
      className="language-switch"
      href={href}
      aria-label={locale === "en" ? "切换到中文" : "Switch to English"}
    >
      <span className={locale === "en" ? "active" : ""}>EN</span>
      <span aria-hidden="true">/</span>
      <span className={locale === "zh" ? "active" : ""}>中文</span>
    </a>
  );
}
