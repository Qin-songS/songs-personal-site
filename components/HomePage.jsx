"use client";

import { useEffect, useMemo, useState } from "react";
import LanguageSwitch from "./LanguageSwitch";
import OrbitMark from "./OrbitMark";
import VoicePrototype from "./VoicePrototype";
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
    aiEyebrow: "SONGS AI / VOICE + TEXT",
    aiTitle: "Ask me what you need.",
    aiText: "Meet Songs through conversation, or ask the assistant to take you somewhere on this site.",
    aiAction: "Open assistant",
    aiNote: "Voice begins after one permission tap",
    worldsKicker: "Three ways in",
    worldsTitle: "Choose a direction.",
    worlds: [
      { no: "A", title: "Thoughts", detail: "Notion · ideas · questions", href: "/field/thoughts/" },
      { no: "B", title: "About", detail: "Living portrait · AI", href: "/field/about/" },
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
    aiEyebrow: "SONGS AI / 语音 + 文字",
    aiTitle: "告诉我你需要什么。",
    aiText: "通过对话认识秦松，也可以让助手直接带你前往网站中的任何部分。",
    aiAction: "打开 AI 助手",
    aiNote: "语音会在一次权限确认后开始",
    worldsKicker: "三个入口",
    worldsTitle: "选择一个方向。",
    worlds: [
      { no: "A", title: "思考", detail: "Notion · 想法 · 问题", href: "/field/thoughts/" },
      { no: "B", title: "关于我", detail: "动态画像 · AI", href: "/field/about/" },
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

const directionRoutes = {
  quiet: "/field/thoughts/",
  organism: "/field/about/",
  editorial: "/field/profile/",
};

export default function HomePage({ locale }) {
  const t = useMemo(() => copy[locale], [locale]);
  const [voiceOpen, setVoiceOpen] = useState(() => {
    try {
      return window.sessionStorage.getItem("songs-ai-dock-state") === "open";
    } catch {
      return false;
    }
  });

  const rememberVoiceState = (open) => {
    try {
      window.sessionStorage.setItem("songs-ai-dock-state", open ? "open" : "closed");
    } catch {
      // The dock still works when session storage is restricted.
    }
  };

  const openVoice = () => {
    rememberVoiceState(true);
    setVoiceOpen(true);
  };

  const closeVoice = () => {
    rememberVoiceState(false);
    setVoiceOpen(false);
  };

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";

    const storageKey = "songs-ai-welcome-v2";
    let alreadyWelcomed = false;
    try {
      alreadyWelcomed = window.sessionStorage.getItem(storageKey) === "shown";
    } catch {
      // The prominent AI launcher remains available when storage is restricted.
    }

    if (alreadyWelcomed) return undefined;

    const timer = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem(storageKey, "shown");
      } catch {
        // Opening the interface does not depend on storage access.
      }
      rememberVoiceState(true);
      setVoiceOpen(true);
    }, 1600);

    return () => window.clearTimeout(timer);
  }, [locale]);

  const executeVoiceAction = (action) => {
    if (action.locale) {
      window.location.assign(action.locale === "zh" ? "/zh/" : "/");
      return;
    }

    if (action.signal === "connect") {
      closeVoice();
      window.setTimeout(() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }), 80);
      return;
    }

    const destination = directionRoutes[action.direction];
    if (destination) window.location.assign(destination);
  };

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
          <button className="portal-header-ai" type="button" onClick={openVoice} aria-haspopup="dialog">
            <i aria-hidden="true" /> AI
          </button>
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

          <button className="portal-ai-launch" type="button" onClick={openVoice} aria-haspopup="dialog">
            <span className="portal-ai-beacon" aria-hidden="true"><i /></span>
            <span className="portal-ai-copy">
              <small>{t.aiEyebrow}</small>
              <strong>{t.aiTitle}</strong>
              <span>{t.aiText}</span>
            </span>
            <span className="portal-ai-action"><strong>{t.aiAction} ↗</strong><small>{t.aiNote}</small></span>
          </button>
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
      <VoicePrototype open={voiceOpen} onClose={closeVoice} locale={locale} onAction={executeVoiceAction} variant="dock" />
    </>
  );
}
