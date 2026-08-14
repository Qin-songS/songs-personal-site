import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import HomePage from "../components/HomePage";
import ArticlePage from "../components/ArticlePage";
import InteractionLab from "../components/InteractionLab";
import FieldLab from "../components/FieldLab";
import "./styles.css";
import "./lab.css";
import "./field.css";

const path = window.location.pathname.replace(/\/+$/, "") || "/";
const locale = path.startsWith("/zh") ? "zh" : "en";
const isArticle = path.includes("/notes/why-this-site");
const isLab = path === "/lab";
const isField = path === "/field" || path.startsWith("/field/");

const pageTitle = isArticle
  ? locale === "zh"
    ? "为什么建立这个网站 — songs.com"
    : "Why this site exists — songs.com"
  : locale === "zh"
    ? "秦松 / Songs — 个人网站"
    : "Qin Song / Songs — Personal website";

const pageDescription = isArticle
  ? locale === "zh"
    ? "关于为作品与想法建立一个长期归档空间的简短说明。"
    : "A short note on building a durable home for work and ideas."
  : locale === "zh"
    ? "秦松（Songs）的双语个人网站：目标、思考、个人档案与联系方式。"
    : "The bilingual personal website of Qin Song (Songs): purpose, thoughts, profile, and contact.";

document.title = pageTitle;
document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
document
  .querySelector('meta[name="description"]')
  ?.setAttribute("content", pageDescription);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {isField ? (
      <FieldLab />
    ) : isLab ? (
      <InteractionLab />
    ) : isArticle ? (
      <ArticlePage locale={locale} />
    ) : (
      <HomePage locale={locale} />
    )}
  </StrictMode>,
);
