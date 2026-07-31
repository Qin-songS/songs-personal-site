"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import LanguageSwitch from "./LanguageSwitch";
import OrbitMark from "./OrbitMark";

const copy = {
  en: {
    skip: "Skip to content",
    nav: [
      ["Work", "#work"],
      ["Notes", "#notes"],
      ["Résumé", "#resume"],
      ["Contact", "#contact"],
    ],
    eyebrow: "Personal archive / Est. 2026",
    heroLead: "Selected work,",
    heroItalic: "practical notes",
    heroEnd: "and a living résumé.",
    heroBody:
      "An independent space for the things I make, learn, and choose to remember.",
    explore: "Explore the archive",
    contact: "Start a conversation",
    scroll: "Scroll to browse",
    workKicker: "01 / Selected work",
    workTitle: "Things made with intent.",
    workIntro:
      "A growing index of products, experiments, and useful ideas. Real case studies will replace the reserved entries as you share them.",
    works: [
      {
        no: "001",
        title: "songs.com",
        meta: "Identity · Web · 2026",
        text: "An English-first bilingual home for work, writing, and professional experience.",
        state: "In progress",
      },
      {
        no: "002",
        title: "Your featured project",
        meta: "Reserved case study",
        text: "Add the problem, your role, the decisions you made, and the outcome.",
        state: "Awaiting content",
      },
      {
        no: "003",
        title: "A useful experiment",
        meta: "Reserved case study",
        text: "A place for smaller tools, studies, open-source work, or something delightfully unfinished.",
        state: "Awaiting content",
      },
    ],
    notesKicker: "02 / Notes",
    notesTitle: "Ideas worth keeping.",
    noteRead: "3 min read",
    noteDate: "July 2026",
    noteTitle: "Why this site exists",
    noteText:
      "A personal website should be more than a profile. It can become a durable home for your work and the thinking behind it.",
    noteLink: "Read the first note",
    noteEmpty: "Next note",
    noteEmptyTitle: "The next entry is yours.",
    noteEmptyText:
      "Add an observation, a tutorial, a project log, or a question you are still exploring.",
    resumeKicker: "03 / Living résumé",
    resumeTitle: "Experience, without the paperwork.",
    resumeIntro:
      "This section is ready for your real timeline. Until then, it describes the shape of the information we need—without inventing a career on your behalf.",
    resumeRows: [
      ["Profile", "Your role, focus, location or working style", "Now"],
      ["Experience", "Company, title, dates, and measurable contribution", "Add history"],
      ["Capabilities", "Tools are secondary; show what you can reliably deliver", "Add strengths"],
      ["Education", "Degrees, certificates, or self-directed learning worth noting", "Optional"],
    ],
    resumeDownload: "Résumé PDF will appear here",
    contactKicker: "04 / Contact",
    contactTitle: "Let’s make the next thing useful.",
    contactText:
      "Share your preferred email and social links to activate this section. Until then, nothing personal is published.",
    contactAction: "Contact details coming soon",
    footerLeft: "Designed as a living archive.",
    footerRight: "English first · 中文可用",
    status: "Building in public",
  },
  zh: {
    skip: "跳至主要内容",
    nav: [
      ["作品", "#work"],
      ["文章", "#notes"],
      ["履历", "#resume"],
      ["联系", "#contact"],
    ],
    eyebrow: "个人档案 / 始于 2026",
    heroLead: "精选作品、",
    heroItalic: "实践笔记",
    heroEnd: "与持续更新的履历。",
    heroBody: "一个独立空间，用来保存我做过的事、学到的东西，以及值得记住的想法。",
    explore: "浏览内容",
    contact: "与我联系",
    scroll: "向下浏览",
    workKicker: "01 / 精选作品",
    workTitle: "认真做成的事情。",
    workIntro: "这里将收录产品、实验和有用的想法。你提供资料后，预留内容会替换成真实案例。",
    works: [
      {
        no: "001",
        title: "songs.com",
        meta: "品牌 · 网站 · 2026",
        text: "一个以英文为主、支持中英双语的作品、文章与职业经历主页。",
        state: "制作中",
      },
      {
        no: "002",
        title: "你的代表项目",
        meta: "案例位置已预留",
        text: "补充项目问题、你的职责、关键决策和最终成果。",
        state: "等待内容",
      },
      {
        no: "003",
        title: "一次有用的实验",
        meta: "案例位置已预留",
        text: "可以放小工具、研究、开源项目，或者一个有趣的未完成作品。",
        state: "等待内容",
      },
    ],
    notesKicker: "02 / 文章",
    notesTitle: "值得留下的想法。",
    noteRead: "阅读约 3 分钟",
    noteDate: "2026 年 7 月",
    noteTitle: "为什么建立这个网站",
    noteText: "个人网站不应该只是一张名片，它可以成为作品以及作品背后思考的长期归档。",
    noteLink: "阅读第一篇文章",
    noteEmpty: "下一篇",
    noteEmptyTitle: "下一条内容由你决定。",
    noteEmptyText: "可以是一则观察、一篇教程、一段项目记录，或者一个仍在探索的问题。",
    resumeKicker: "03 / 持续更新的履历",
    resumeTitle: "经历，不必像表格。",
    resumeIntro:
      "这里已经为你的真实履历准备好结构。在你提供资料之前，页面只说明需要什么内容，不会代替你虚构经历。",
    resumeRows: [
      ["个人简介", "职业角色、关注方向、地点或工作方式", "现在"],
      ["工作经历", "公司、职位、时间，以及可以量化的贡献", "添加经历"],
      ["能力方向", "工具不是重点，说明你能够稳定交付什么", "添加优势"],
      ["教育经历", "值得记录的学历、证书或自主学习", "可选"],
    ],
    resumeDownload: "履历 PDF 将显示在这里",
    contactKicker: "04 / 联系",
    contactTitle: "一起做点真正有用的事。",
    contactText: "提供常用邮箱和社交链接后，我会启用这一部分。在此之前不会公开任何个人信息。",
    contactAction: "联系方式即将添加",
    footerLeft: "一个持续生长的个人档案。",
    footerRight: "English first · 支持中文",
    status: "持续建设中",
  },
};

export default function HomePage({ locale }) {
  const t = useMemo(() => copy[locale], [locale]);
  const mainRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";

    const updateProgress = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? window.scrollY / scrollable : 0);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, [locale]);

  const noteHref =
    locale === "en"
      ? "/notes/why-this-site"
      : "/zh/notes/why-this-site";

  return (
    <>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <div
        className="scroll-progress"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden="true"
      />

      <header className="site-header">
        <a className="brand-lockup" href="#top" aria-label="songs.com home">
          <span className="brand-dot" aria-hidden="true" />
          songs.com
        </a>

        <nav aria-label="Primary navigation">
          {t.nav.map(([label, href]) => (
            <a href={href} key={href}>
              {label}
            </a>
          ))}
        </nav>

        <LanguageSwitch locale={locale} />
      </header>

      <main id="main" ref={mainRef}>
        <section className="hero" id="top">
          <div className="hero-orbit">
            <OrbitMark />
          </div>

          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow">{t.eyebrow}</p>
            <h1>
              <span>{t.heroLead}</span>
              <em>{t.heroItalic}</em>
              <span>{t.heroEnd}</span>
            </h1>
            <p className="hero-body">{t.heroBody}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">
                {t.explore}
                <span aria-hidden="true">↓</span>
              </a>
              <a className="button button-quiet" href="#contact">
                {t.contact}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <div className="hero-wordmark" aria-hidden="true">
            songs.com
          </div>

          <div className="hero-meta">
            <span>{t.status}</span>
            <span>{t.scroll} ↓</span>
          </div>
        </section>

        <section className="section section-work" id="work">
          <div className="section-intro">
            <p className="eyebrow">{t.workKicker}</p>
            <h2>{t.workTitle}</h2>
            <p>{t.workIntro}</p>
          </div>

          <div className="project-list">
            {t.works.map((work) => (
              <article className="project-row" key={work.no}>
                <div className="project-no">{work.no}</div>
                <div className="project-main">
                  <h3>{work.title}</h3>
                  <p>{work.text}</p>
                </div>
                <div className="project-meta">
                  <span>{work.meta}</span>
                  <span className="project-state">{work.state}</span>
                </div>
                <span className="project-arrow" aria-hidden="true">
                  ↗
                </span>
              </article>
            ))}
          </div>
        </section>

        <section className="section section-notes" id="notes">
          <div className="section-intro">
            <p className="eyebrow">{t.notesKicker}</p>
            <h2>{t.notesTitle}</h2>
          </div>

          <div className="notes-layout">
            <Link className="featured-note" href={noteHref}>
              <div className="note-index">Nº 001</div>
              <div>
                <p className="note-meta">
                  {t.noteDate} · {t.noteRead}
                </p>
                <h3>{t.noteTitle}</h3>
                <p>{t.noteText}</p>
              </div>
              <span className="note-link">
                {t.noteLink} <span aria-hidden="true">↗</span>
              </span>
            </Link>

            <div className="empty-note">
              <p className="note-meta">{t.noteEmpty}</p>
              <h3>{t.noteEmptyTitle}</h3>
              <p>{t.noteEmptyText}</p>
              <span className="draft-stamp">Draft / 草稿</span>
            </div>
          </div>
        </section>

        <section className="section section-resume" id="resume">
          <div className="section-intro resume-intro">
            <p className="eyebrow">{t.resumeKicker}</p>
            <h2>{t.resumeTitle}</h2>
            <p>{t.resumeIntro}</p>
          </div>

          <div className="resume-list">
            {t.resumeRows.map(([title, detail, status], index) => (
              <div className="resume-row" key={title}>
                <span className="resume-index">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{detail}</p>
                <span>{status}</span>
              </div>
            ))}
          </div>

          <div className="resume-download" aria-disabled="true">
            <span>{t.resumeDownload}</span>
            <span aria-hidden="true">PDF ↗</span>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <p className="eyebrow">{t.contactKicker}</p>
          <h2>{t.contactTitle}</h2>
          <p>{t.contactText}</p>
          <button className="contact-button" type="button" disabled>
            <span>{t.contactAction}</span>
            <span aria-hidden="true">↗</span>
          </button>
          <div className="contact-orbit">
            <OrbitMark />
          </div>
        </section>
      </main>

      <footer>
        <span>{t.footerLeft}</span>
        <span>© {new Date().getFullYear()} songs.com</span>
        <span>{t.footerRight}</span>
      </footer>
    </>
  );
}

