import { useEffect, useMemo, useState } from "react";

const concepts = [
  {
    id: "network",
    no: "01",
    en: "Relational map",
    zh: "内容关系图",
  },
  {
    id: "resonance",
    no: "02",
    en: "Resonance field",
    zh: "感应场",
  },
  {
    id: "assembly",
    no: "03",
    en: "Identity assembly",
    zh: "身份生成",
  },
];

const networkNodes = [
  {
    id: "core",
    label: "SONGS",
    sub: "living archive",
    x: 50,
    y: 50,
    title: "A person, not a category.",
    zh: "一个人，而不是一个栏目。",
    text: "Every trace leads back to a changing picture of who I am and what I care about.",
  },
  {
    id: "work",
    label: "WORK",
    sub: "what I make",
    x: 19,
    y: 30,
    title: "Work reveals decisions.",
    zh: "作品呈现我的判断。",
    text: "Projects connect to the thinking, skills, and moments that shaped them.",
  },
  {
    id: "notes",
    label: "NOTES",
    sub: "what I notice",
    x: 78,
    y: 24,
    title: "Thought becomes a signal.",
    zh: "想法成为持续发出的信号。",
    text: "Notes can open a live Notion source instead of becoming a second publishing system.",
  },
  {
    id: "history",
    label: "HISTORY",
    sub: "what changed me",
    x: 79,
    y: 73,
    title: "A résumé with causality.",
    zh: "不只是时间线，而是经历之间的因果。",
    text: "Experience is shown as context: what happened, what changed, and what it enabled next.",
  },
  {
    id: "contact",
    label: "CONTACT",
    sub: "what comes next",
    x: 22,
    y: 78,
    title: "Contact is the next node.",
    zh: "联系不是结尾，而是新的节点。",
    text: "The visitor leaves the archive by starting a new connection with me.",
  },
];

const networkLinks = [
  ["core", "work"],
  ["core", "notes"],
  ["core", "history"],
  ["core", "contact"],
  ["work", "notes"],
  ["work", "history"],
  ["notes", "history"],
];

const fieldSignals = [
  { id: "curiosity", label: "CURIOSITY", zh: "好奇", x: 17, y: 28 },
  { id: "craft", label: "CRAFT", zh: "创造", x: 82, y: 24 },
  { id: "systems", label: "SYSTEMS", zh: "系统", x: 84, y: 75 },
  { id: "growth", label: "GROWTH", zh: "成长", x: 14, y: 73 },
];

const fragments = [
  { id: "work", label: "MADE", zh: "作品", value: "builder", x: 18, y: 28 },
  { id: "thought", label: "THOUGHT", zh: "想法", value: "observer", x: 78, y: 22 },
  { id: "history", label: "LIVED", zh: "经历", value: "learner", x: 84, y: 69 },
  { id: "craft", label: "LEARNED", zh: "能力", value: "craftsperson", x: 22, y: 77 },
  { id: "future", label: "SEEKING", zh: "方向", value: "explorer", x: 50, y: 15 },
];

function LabHeader({ active, setActive, locale, setLocale }) {
  return (
    <header className="lab-header">
      <a className="lab-brand" href="/">
        <span className="lab-brand-mark" aria-hidden="true" />
        <span>SONGS</span>
        <small>INTERACTION LAB / 0.1</small>
      </a>

      <nav className="lab-concept-nav" aria-label="Interaction concepts">
        {concepts.map((concept) => (
          <button
            className={active === concept.id ? "is-active" : ""}
            key={concept.id}
            onClick={() => setActive(concept.id)}
            type="button"
          >
            <span>{concept.no}</span>
            {locale === "en" ? concept.en : concept.zh}
          </button>
        ))}
      </nav>

      <button
        className="lab-language"
        type="button"
        onClick={() => setLocale(locale === "en" ? "zh" : "en")}
        aria-label="Switch language"
      >
        <span className={locale === "en" ? "is-active" : ""}>EN</span>
        <i>/</i>
        <span className={locale === "zh" ? "is-active" : ""}>中</span>
      </button>
    </header>
  );
}

function NetworkConcept({ locale }) {
  const [focus, setFocus] = useState("core");
  const activeNode = networkNodes.find((node) => node.id === focus);

  const pointFor = (id) => {
    const node = networkNodes.find((item) => item.id === id);
    return { x: node.x * 10, y: node.y * 6 };
  };

  return (
    <section className="lab-stage network-stage" aria-label="Relational map concept">
      <div className="lab-stage-copy">
        <p>CONCEPT 01 / CONTENT AS RELATIONSHIPS</p>
        <h1>{locale === "en" ? "Nothing exists alone." : "没有内容是孤立的。"}</h1>
        <span>
          {locale === "en"
            ? "Select a signal to see how work, thought, and experience form one identity."
            : "选择一个信号，观察作品、想法和经历如何共同构成一个人。"}
        </span>
      </div>

      <div className="network-canvas">
        <svg viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
          {networkLinks.map(([from, to]) => {
            const a = pointFor(from);
            const b = pointFor(to);
            const active = from === focus || to === focus;
            return (
              <line
                className={active ? "is-active" : ""}
                key={`${from}-${to}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
              />
            );
          })}
        </svg>

        {networkNodes.map((node) => (
          <button
            className={`network-node ${node.id === focus ? "is-active" : ""} ${node.id === "core" ? "is-core" : ""}`}
            key={node.id}
            style={{ "--x": `${node.x}%`, "--y": `${node.y}%` }}
            type="button"
            onPointerEnter={() => setFocus(node.id)}
            onFocus={() => setFocus(node.id)}
            onClick={() => setFocus(node.id)}
          >
            <span>{node.label}</span>
            <small>{node.sub}</small>
          </button>
        ))}

        <div className="network-readout" key={activeNode.id}>
          <small>ACTIVE SIGNAL / {activeNode.id.toUpperCase()}</small>
          <strong>{locale === "en" ? activeNode.title : activeNode.zh}</strong>
          <p>{activeNode.text}</p>
        </div>
      </div>
    </section>
  );
}

function ResonanceConcept({ locale }) {
  const [pointer, setPointer] = useState({ x: 50, y: 50, ox: 0, oy: 0 });
  const [signal, setSignal] = useState("listening");
  const [pulse, setPulse] = useState(0);

  const moveField = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setPointer({ x, y, ox: (x - 50) * 0.16, oy: (y - 50) * 0.16 });
  };

  return (
    <section
      className="lab-stage resonance-stage"
      aria-label="Resonance field concept"
      onPointerMove={moveField}
      onPointerLeave={() => setPointer({ x: 50, y: 50, ox: 0, oy: 0 })}
      style={{
        "--pointer-x": `${pointer.x}%`,
        "--pointer-y": `${pointer.y}%`,
        "--core-x": `${pointer.ox}px`,
        "--core-y": `${pointer.oy}px`,
      }}
    >
      <div className="lab-stage-copy">
        <p>CONCEPT 02 / INTERFACE AS PRESENCE</p>
        <h1>{locale === "en" ? "The system notices you." : "这个系统能感知你的存在。"}</h1>
        <span>
          {locale === "en"
            ? "Move through the field. The archive changes its energy around your attention."
            : "在感应场中移动，档案会根据你的注意力改变能量状态。"}
        </span>
      </div>

      <div className="field-plane">
        <div className="field-reticle" aria-hidden="true" />
        <button
          className={`energy-core pulse-${pulse % 2}`}
          type="button"
          onClick={() => setPulse((value) => value + 1)}
          aria-label="Pulse identity core"
        >
          <span className="energy-orbit energy-orbit-a" />
          <span className="energy-orbit energy-orbit-b" />
          <span className="energy-orbit energy-orbit-c" />
          <span className="energy-center">
            SONGS
            <small>{signal.toUpperCase()}</small>
          </span>
        </button>

        {fieldSignals.map((item) => (
          <button
            className={`field-signal ${signal === item.id ? "is-active" : ""}`}
            key={item.id}
            style={{ "--x": `${item.x}%`, "--y": `${item.y}%` }}
            type="button"
            onPointerEnter={() => setSignal(item.id)}
            onFocus={() => setSignal(item.id)}
            onClick={() => setSignal(item.id)}
          >
            <i aria-hidden="true" />
            <span>{item.label}</span>
            <small>{item.zh}</small>
          </button>
        ))}

        <div className="field-status">
          <span>FIELD RESPONSE</span>
          <strong>{signal === "listening" ? "MOVE TO TUNE" : `LOCKED / ${signal.toUpperCase()}`}</strong>
        </div>
      </div>
    </section>
  );
}

function AssemblyConcept({ locale }) {
  const [selected, setSelected] = useState([]);
  const progress = selected.length / fragments.length;
  const traits = fragments
    .filter((fragment) => selected.includes(fragment.id))
    .map((fragment) => fragment.value);

  const toggle = (id) => {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  return (
    <section className="lab-stage assembly-stage" aria-label="Identity assembly concept">
      <div className="lab-stage-copy">
        <p>CONCEPT 03 / DISCOVERY AS PORTRAIT</p>
        <h1>{locale === "en" ? "You assemble the portrait." : "由访客亲手拼出我的画像。"}</h1>
        <span>
          {locale === "en"
            ? "Open traces in any order. The site forms a different impression from every path."
            : "以任意顺序解锁线索；不同的浏览路径，会形成不同的认识。"}
        </span>
      </div>

      <div className="assembly-plane">
        <div
          className="assembly-progress"
          style={{ "--progress": `${progress * 360}deg` }}
          aria-label={`${Math.round(progress * 100)} percent assembled`}
        >
          <div className="assembly-portrait">
            <span className="portrait-scan" aria-hidden="true" />
            <small>IDENTITY RESOLUTION</small>
            <strong>{String(Math.round(progress * 100)).padStart(2, "0")}%</strong>
            <p>
              {selected.length === 0
                ? locale === "en"
                  ? "No assumptions. Explore first."
                  : "不预设结论，先开始探索。"
                : traits.join(" / ")}
            </p>
          </div>
        </div>

        {fragments.map((fragment, index) => {
          const isSelected = selected.includes(fragment.id);
          return (
            <button
              className={`identity-fragment ${isSelected ? "is-selected" : ""}`}
              key={fragment.id}
              style={{ "--x": `${fragment.x}%`, "--y": `${fragment.y}%`, "--delay": `${index * 80}ms` }}
              type="button"
              onClick={() => toggle(fragment.id)}
            >
              <span>0{index + 1}</span>
              <strong>{fragment.label}</strong>
              <small>{fragment.zh}</small>
            </button>
          );
        })}

        <div className={`assembly-summary ${progress === 1 ? "is-complete" : ""}`}>
          <small>VISITOR IMPRESSION</small>
          <strong>
            {progress === 1
              ? locale === "en"
                ? "A curious builder turning thought into useful systems."
                : "一个把思考变成有用系统的好奇创造者。"
              : locale === "en"
                ? `${fragments.length - selected.length} ${fragments.length - selected.length === 1 ? "trace" : "traces"} remain.`
                : `还剩 ${fragments.length - selected.length} 条线索。`}
          </strong>
          {selected.length > 0 && (
            <button type="button" onClick={() => setSelected([])}>
              RESET PORTRAIT
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default function InteractionLab() {
  const [active, setActive] = useState("network");
  const [locale, setLocale] = useState("en");
  const activeIndex = useMemo(
    () => concepts.findIndex((concept) => concept.id === active),
    [active],
  );

  useEffect(() => {
    document.body.classList.add("lab-body");
    document.documentElement.lang = locale === "en" ? "en" : "zh-CN";
    document.title = "Interaction Lab — songs.com";
    return () => document.body.classList.remove("lab-body");
  }, [locale]);

  return (
    <div className={`lab-shell mode-${active}`}>
      <div className="lab-grid" aria-hidden="true" />
      <div className="lab-scanline" aria-hidden="true" />
      <LabHeader
        active={active}
        setActive={setActive}
        locale={locale}
        setLocale={setLocale}
      />

      <main className="lab-main" key={active}>
        {active === "network" && <NetworkConcept locale={locale} />}
        {active === "resonance" && <ResonanceConcept locale={locale} />}
        {active === "assembly" && <AssemblyConcept locale={locale} />}
      </main>

      <footer className="lab-footer">
        <span>
          <i aria-hidden="true" /> SYSTEM ONLINE
        </span>
        <span>EXPERIMENT {String(activeIndex + 1).padStart(2, "0")} / 03</span>
        <span>{locale === "en" ? "CLICK · MOVE · DISCOVER" : "点击 · 移动 · 探索"}</span>
      </footer>
    </div>
  );
}
