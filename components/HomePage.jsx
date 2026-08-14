"use client";

import { useMemo } from "react";
import LanguageSwitch from "./LanguageSwitch";
import OrbitMark from "./OrbitMark";
import { profile } from "../src/profile";

const copy = {
  en: {
    skip: "Skip to content",
    nav: [
      ["Thoughts", "/field/thoughts/"],
      ["About", "/field/about/"],
      ["Profile", "/field/profile/"],
      ["Contact", "#contact"],
    ],
    identity: "Qin Song / Songs · Shanghai · 2026",
    purposeKicker: "Purpose / what guides me",
    purpose: ["Explore the unknown.", "Create value.", "Contribute."],
    purposeBody:
      "A first-year student at Shanghai University, studying Optoelectronic Information Science and Engineering—and building a happy, fulfilling life through work that matters.",
    motto: ["Every day", "is the day."],
    worldsKicker: "Three ways in",
    worldsTitle: "Choose a direction.",
    worlds: [
      { no: "A", title: "Thoughts", detail: "Notion · ideas · questions", href: "/field/thoughts/" },
      { no: "B", title: "About", detail: "Living portrait · principles", href: "/field/about/" },
      { no: "C", title: "Profile", detail: "Education · résumé · links", href: "/field/profile/" },
    ],
    contactKicker: "Direct contact",
    contactTitle: "Start a conversation.",
    contactText: "Email is the fastest way to reach me. You can also follow my public code on GitHub.",
    contactLabels: { email: "Email", github: "GitHub" },
    footerLeft: "Qin Song / Songs",
    footerRight: "English first · 中文可用",
  },
  zh: {
    skip: "跳至主要内容",
    nav: [
      ["思考", "/field/thoughts/"],
      ["关于我", "/field/about/"],
      ["个人档案", "/field/profile/"],
      ["联系", "#contact"],
    ],
    identity: "秦松 / Songs · 上海 · 2026",
    purposeKicker: "Purpose / 指引我的方向",
    purpose: ["探索未知。", "创造价值。", "作出贡献。"],
    purposeBody:
      "上海大学光电信息科学与工程专业大一学生，希望通过有意义的工作，获得幸福而充实的人生。",
    motto: ["Every day", "is the day."],
    worldsKicker: "三个入口",
    worldsTitle: "选择一个方向。",
    worlds: [
      { no: "A", title: "思考", detail: "Notion · 想法 · 问题", href: "/field/thoughts/" },
      { no: "B", title: "关于我", detail: "动态画像 · 个人原则", href: "/field/about/" },
      { no: "C", title: "个人档案", detail: "教育 · 简历 · 链接", href: "/field/profile/" },
    ],
    contactKicker: "直接联系",
    contactTitle: "开始一次对话。",
    contactText: "邮件是联系我最快的方式，也可以通过 GitHub 关注我的公开代码。",
    contactLabels: { email: "邮箱", github: "GitHub" },
    footerLeft: "秦松 / Songs",
    footerRight: "English first · 支持中文",
  },
};

export default function HomePage({ locale }) {
  const t = useMemo(() => copy[locale], [locale]);

  return (
    <>
      <a className="skip-link" href="#main">{t.skip}</a>

      <header className="site-header portal-header">
        <a className="brand-lockup" href="#top" aria-label="songs.com home">
          <span className="brand-dot" aria-hidden="true" />songs.com
        </a>
        <nav aria-label="Primary navigation">
          {t.nav.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
        </nav>
        <div className="portal-header-actions">
          <LanguageSwitch locale={locale} />
        </div>
      </header>

      <main id="main" className="portal-home">
        <section className="portal-hero" id="top">
          <div className="portal-orbit"><OrbitMark /></div>
          <div className="portal-purpose">
            <p className="eyebrow">{t.identity}</p>
            <span className="portal-purpose-label">{t.purposeKicker}</span>
            <h1>{t.purpose.map((line) => <span key={line}>{line}</span>)}</h1>
            <p className="portal-purpose-body">{t.purposeBody}</p>
            <p className="portal-purpose-motto">
              <span className="portal-purpose-motto-mark" aria-hidden="true">↳</span>
              <span className="portal-purpose-motto-text"><strong>{t.motto[0]}</strong> {t.motto[1]}</span>
            </p>
          </div>

        </section>

        <section className="portal-worlds" id="worlds">
          <div className="portal-section-heading">
            <p className="eyebrow">{t.worldsKicker}</p>
            <h2>{t.worldsTitle}</h2>
          </div>
          <nav className="portal-world-list" aria-label={t.worldsKicker}>
            {t.worlds.map((world) => (
              <a href={world.href} key={world.no}>
                <span>{world.no}</span>
                <strong>{world.title}</strong>
                <small>{world.detail}</small>
                <i aria-hidden="true">↗</i>
              </a>
            ))}
          </nav>
        </section>

        <section className="portal-contact" id="contact">
          <div>
            <p className="eyebrow">{t.contactKicker}</p>
            <h2>{t.contactTitle}</h2>
            <p>{t.contactText}</p>
          </div>
          <nav className="portal-contact-links" aria-label={t.contactKicker}>
            <a href={profile.links.mailto}><span>{t.contactLabels.email}</span><strong>{profile.links.email}</strong><i>↗</i></a>
            <a href={profile.links.github} target="_blank" rel="noreferrer"><span>{t.contactLabels.github}</span><strong>@songs061207-pixel</strong><i>↗</i></a>
          </nav>
        </section>
      </main>

      <footer><span>{t.footerLeft}</span><span>© {new Date().getFullYear()} songs.com</span><span>{t.footerRight}</span></footer>
    </>
  );
}
