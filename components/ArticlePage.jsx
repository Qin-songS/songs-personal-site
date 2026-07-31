"use client";

import { useEffect } from "react";
import LanguageSwitch from "./LanguageSwitch";

const article = {
  en: {
    back: "Back to the archive",
    eyebrow: "Note 001 / July 2026",
    title: "Why this site exists",
    dek: "A personal website should be more than a profile. It can become a durable home for your work and the thinking behind it.",
    read: "3 minute read",
    sections: [
      [
        "A place you control",
        "Profiles on other platforms are useful, but they are borrowed space. A personal site gives your work a stable address and lets different parts of your life sit next to one another: finished projects, rough notes, professional experience, and the occasional unfinished idea.",
      ],
      [
        "Show the thinking, not only the outcome",
        "A polished screenshot rarely explains why a project mattered. The most useful case studies show the problem, your role, the choices you made, the constraints you faced, and what changed afterward. That is the story this archive is designed to hold.",
      ],
      [
        "Small entries compound",
        "The blog does not need to begin with an essay. A short observation, a useful command, a decision log, or a lesson from a project is enough. Over time, these entries become a record of how you think and what you care about.",
      ],
    ],
    closing:
      "This first version is intentionally incomplete. Its job is to create a clear structure, then make it easy to replace placeholders with real work—one honest entry at a time.",
    next: "Next: add the first real project",
  },
  zh: {
    back: "返回主页",
    eyebrow: "文章 001 / 2026 年 7 月",
    title: "为什么建立这个网站",
    dek: "个人网站不应该只是一张名片，它可以成为作品以及作品背后思考的长期归档。",
    read: "阅读约 3 分钟",
    sections: [
      [
        "一个由自己掌控的空间",
        "其他平台上的个人主页当然有用，但它们始终是借来的空间。个人网站为你的作品提供稳定地址，也让生活中的不同部分可以自然地放在一起：完成的项目、尚未打磨的笔记、职业经历，以及偶尔出现的半成品想法。",
      ],
      [
        "展示思考，而不只是结果",
        "一张精美截图很少能说明项目为什么重要。真正有用的案例会解释问题、你的职责、关键选择、当时的限制，以及最后发生了什么变化。这正是这个档案希望承载的故事。",
      ],
      [
        "小记录会逐渐累积",
        "博客不必从一篇长文开始。一次观察、一条有用的命令、一段决策记录，或者项目里学到的一件事就足够。时间久了，它们会成为你如何思考、在意什么的真实记录。",
      ],
    ],
    closing:
      "这个首版有意保持不完整。它首先建立清楚的结构，再让我们能够用真实作品逐步替换占位内容——一次只添加一条诚实的记录。",
    next: "下一步：添加第一个真实项目",
  },
};

export default function ArticlePage({ locale }) {
  const t = article[locale];

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [locale]);

  return (
    <>
      <header className="site-header article-header">
        <a className="brand-lockup" href={locale === "en" ? "/" : "/zh/"}>
          <span className="brand-dot" aria-hidden="true" />
          songs.com
        </a>
        <LanguageSwitch locale={locale} article />
      </header>

      <main className="article-page">
        <a className="article-back" href={locale === "en" ? "/" : "/zh/"}>
          <span aria-hidden="true">←</span> {t.back}
        </a>

        <article>
          <header className="article-hero">
            <p className="eyebrow">{t.eyebrow}</p>
            <h1>{t.title}</h1>
            <p className="article-dek">{t.dek}</p>
            <div className="article-meta">
              <span>{t.read}</span>
              <span>songs.com</span>
            </div>
          </header>

          <div className="article-body">
            {t.sections.map(([heading, body], index) => (
              <section key={heading}>
                <div className="article-section-number">0{index + 1}</div>
                <div>
                  <h2>{heading}</h2>
                  <p>{body}</p>
                </div>
              </section>
            ))}
            <p className="article-closing">{t.closing}</p>
          </div>
        </article>

        <a
          className="article-next"
          href={`${locale === "en" ? "" : "/zh"}/#work`}
        >
          <span>{t.next}</span>
          <span aria-hidden="true">↗</span>
        </a>
      </main>
    </>
  );
}
