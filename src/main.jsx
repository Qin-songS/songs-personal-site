import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import HomePage from "../components/HomePage";
import ArticlePage from "../components/ArticlePage";
import "./styles.css";

const path = window.location.pathname.replace(/\/+$/, "") || "/";
const locale = path.startsWith("/zh") ? "zh" : "en";
const isArticle = path.includes("/notes/why-this-site");

const pageTitle = isArticle
  ? locale === "zh"
    ? "为什么建立这个网站 — songs.com"
    : "Why this site exists — songs.com"
  : locale === "zh"
    ? "作品、文章与履历 — songs.com"
    : "songs.com — Work, notes & résumé";

const pageDescription = isArticle
  ? locale === "zh"
    ? "关于为作品与想法建立一个长期归档空间的简短说明。"
    : "A short note on building a durable home for work and ideas."
  : locale === "zh"
    ? "songs.com 的中文个人主页：作品、文章、履历与联系方式。"
    : "An English-first bilingual personal archive for selected work, writing, experience, and contact.";

document.title = pageTitle;
document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
document
  .querySelector('meta[name="description"]')
  ?.setAttribute("content", pageDescription);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {isArticle ? (
      <ArticlePage locale={locale} />
    ) : (
      <HomePage locale={locale} />
    )}
  </StrictMode>,
);
