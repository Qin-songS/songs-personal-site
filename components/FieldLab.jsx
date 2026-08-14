import { useEffect, useMemo, useRef, useState } from "react";
import { profile } from "../src/profile";

const directions = [
  {
    id: "quiet",
    no: "A",
    href: "/field/thoughts/",
    en: "Thoughts · Quiet",
    zh: "思考 · 安静未来",
  },
  {
    id: "organism",
    no: "B",
    href: "/field/about/",
    en: "About · Organism",
    zh: "关于我 · 数字生命",
  },
  {
    id: "editorial",
    no: "C",
    href: "/field/profile/",
    en: "Profile · Editorial",
    zh: "档案 · 动态编辑",
  },
];

const sceneCopy = {
  en: {
    quiet: {
      study: "THOUGHTS / QUIET FUTURE",
      title: "Keep the question open.",
      intro: "A calm doorway into the ideas I want to revisit, test, and understand more deeply.",
      status: "PUBLIC NOTEBOOK",
      prompt: "PAUSE · READ · RETURN",
    },
    organism: {
      study: "ABOUT / DIGITAL ORGANISM",
      title: "Still becoming.",
      intro: "Move through the three forces that shape what I pursue, refuse, and keep doing.",
      status: "NORTH STAR ACTIVE",
      prompt: "MOVE · SELECT · PULSE",
    },
    editorial: {
      study: "PROFILE / KINETIC EDITORIAL",
      title: "Qin Song / Songs.",
      intro: "The direct version: education, direction, public traces, and ways to reach me.",
      status: "PROFILE / V0.1",
      prompt: "SCAN · FOLLOW · CONNECT",
    },
    home: "Home",
  },
  zh: {
    quiet: {
      study: "思考 / 安静未来",
      title: "让问题保持开放。",
      intro: "一个安静的入口，通向那些值得反复阅读、验证和深入理解的想法。",
      status: "公开思考仓库",
      prompt: "停留 · 阅读 · 再次回来",
    },
    organism: {
      study: "关于我 / 数字生命",
      title: "我仍在成为。",
      intro: "探索三种力量：它们决定我追求什么、拒绝什么，以及为什么继续前进。",
      status: "北极星系统已启动",
      prompt: "移动 · 选择 · 唤醒",
    },
    editorial: {
      study: "个人档案 / 动态编辑",
      title: "秦松 / Songs。",
      intro: "直接的版本：教育、方向、公开记录，以及与我取得联系的方式。",
      status: "个人档案 / V0.1",
      prompt: "浏览 · 关注 · 联系",
    },
    home: "首页",
  },
};

const signals = [
  {
    id: "capability",
    en: "CAPABILITY",
    zh: "能力",
    x: 48,
    y: 28,
    response: "Science and technology determine what we can do.",
    responseZh: "科学和技术决定我们能做什么。",
    note: "Capability expands the field of possibility.",
    noteZh: "能力拓展可能性的边界。",
  },
  {
    id: "restraint",
    en: "RESTRAINT",
    zh: "取舍",
    x: 81,
    y: 58,
    response: "Art and taste determine what we choose not to do.",
    responseZh: "艺术和品味决定我们不做什么。",
    note: "Taste gives possibility a direction—and a boundary.",
    noteZh: "品味让可能性拥有方向，也拥有边界。",
  },
  {
    id: "energy",
    en: "ENERGY",
    zh: "动力",
    x: 18,
    y: 70,
    response: "Fun and creativity give us the drive to keep going.",
    responseZh: "乐趣和创意给我们做下去的动力。",
    note: "Joy turns effort into something sustainable.",
    noteZh: "乐趣让努力成为能够持续的事情。",
  },
];

const quietTopics = {
  en: [
    ["01", "Understanding", "Build an internal model that can predict, compress, and be tested."],
    ["02", "Possible worlds", "Use virtual spaces to explore paths reality has not unfolded yet."],
    ["03", "Learning systems", "Treat state and environment as part of effective learning."],
  ],
  zh: [
    ["01", "理解的本质", "建立能够预测、压缩、操控并接受检验的内部模型。"],
    ["02", "可能的世界", "用虚拟空间探索现实中尚未展开的隐藏路径。"],
    ["03", "学习系统", "把状态和环境视为有效学习的一部分。"],
  ],
};

function directionFromPath() {
  const path = window.location.pathname;
  if (path.includes("/thoughts")) return "quiet";
  if (path.includes("/profile")) return "editorial";
  return "organism";
}

function FieldHeader({ direction, changeDirection, locale, setLocale }) {
  const isQuiet = direction === "quiet";
  const isEditorial = direction === "editorial";

  return (
    <header className="field-header">
      <a className="field-brand" href="/">
        <strong>songs.com</strong><span>THREE WORLDS / 01—03</span>
      </a>

      <nav aria-label="Three distinct pages">
        {directions.map((item) => (
          <a
            className={item.id === direction ? "is-active" : ""}
            href={item.href}
            key={item.id}
            onClick={(event) => {
              event.preventDefault();
              changeDirection(item.id);
            }}
          >
            <span>{item.no}</span>{locale === "en" ? item.en : item.zh}
          </a>
        ))}
      </nav>

      <div className="field-actions">
        {isQuiet ? (
          <a className="field-action-link" href={profile.links.notion} target="_blank" rel="noreferrer">
            <i aria-hidden="true" /><span>NTN</span><small>OPEN NOTES</small>
          </a>
        ) : isEditorial ? (
          <a className="field-action-link" href={profile.links.mailto}>
            <i aria-hidden="true" /><span>MAIL</span><small>SAY HELLO</small>
          </a>
        ) : null}
        <button
          className="field-language"
          type="button"
          onClick={() => setLocale(locale === "en" ? "zh" : "en")}
          aria-label="Switch language"
        >
          {locale === "en" ? "中" : "EN"}
        </button>
      </div>
    </header>
  );
}

function QuietArchive({ locale }) {
  const labels = locale === "en"
    ? { eyebrow: "PUBLIC NOTEBOOK / LIVE", title: "Ideas｜思考仓库", open: "OPEN IN NOTION" }
    : { eyebrow: "公开思考仓库 / 持续更新", title: "Ideas｜思考仓库", open: "在 NOTION 中打开" };

  return (
    <div className="field-artwork quiet-archive">
      <div className="quiet-horizon" aria-hidden="true" />
      <div className="pointer-presence" aria-hidden="true" />
      <a className="quiet-notion-portal" href={profile.links.notion} target="_blank" rel="noreferrer">
        <small>{labels.eyebrow}</small><strong>{labels.title}</strong><span>{labels.open} ↗</span>
      </a>
      <div className="quiet-topic-list">
        {quietTopics[locale].map(([no, title, detail]) => (
          <a href={profile.links.notion} target="_blank" rel="noreferrer" key={no}>
            <span>{no}</span><strong>{title}</strong><p>{detail}</p><i aria-hidden="true">↗</i>
          </a>
        ))}
      </div>
    </div>
  );
}

function LivingMaterial({ mode, pulse }) {
  const canvasRef = useRef(null);
  const modeRef = useRef(0);
  const pulseStartedRef = useRef(-10000);
  const modeValues = { capability: 1, restraint: 2, energy: 3 };
  modeRef.current = modeValues[mode] || 0;

  useEffect(() => {
    pulseStartedRef.current = performance.now();
  }, [pulse]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: false });
    if (!gl) return undefined;

    const vertexSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentSource = `
      precision highp float;
      varying vec2 v_uv;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_mode;
      uniform float u_pulse;

      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
      }

      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 4; i++) {
          value += noise(p) * amplitude;
          p = p * 2.03 + 11.7;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        float t = u_time;
        float capability = 1.0 - step(0.35, abs(u_mode - 1.0));
        float restraint = 1.0 - step(0.35, abs(u_mode - 2.0));
        float energy = 1.0 - step(0.35, abs(u_mode - 3.0));
        float speed = 0.36 + capability * 0.12 - restraint * 0.28 + energy * 0.82;
        float radius = 0.37 + capability * 0.015 - restraint * 0.05 + energy * 0.025;
        float amplitude = 0.042 - capability * 0.012 - restraint * 0.018 + energy * 0.025;
        float angle = atan(p.y, p.x);
        float r = length(p);
        float materialNoise = fbm(vec2(angle * 1.65 + t * 0.035 * speed, r * 4.2 - t * 0.055 * speed));
        float contour = sin(angle * 3.0 + t * speed) * amplitude;
        contour += sin(angle * 5.0 - t * speed * 0.64) * amplitude * 0.45;
        contour += (materialNoise - 0.5) * amplitude * 0.72;
        float d = r - (radius + contour);
        float body = smoothstep(0.025, -0.025, d);
        float rim = smoothstep(0.065, 0.0, abs(d));
        float halo = exp(-max(d, 0.0) * 18.0) * (1.0 - body);
        float interference = pow(0.5 + 0.5 * sin(r * (29.0 + capability * 8.0) - angle * 3.0 - t * speed * 1.4 + materialNoise * 7.0), 15.0) * body;
        float vein = pow(0.5 + 0.5 * sin(angle * 7.0 + materialNoise * 10.0 - t * speed), 22.0) * body;
        float specular = pow(max(0.0, 1.0 - length(p - vec2(-0.19, 0.2)) * 2.0), 18.0) * body;
        float depth = smoothstep(radius, 0.06, r) * body;
        vec3 lime = vec3(0.84, 1.0, 0.34);
        vec3 cyan = vec3(0.10, 0.44, 0.42);
        vec3 violet = vec3(0.25, 0.12, 0.34);
        vec3 smoke = vec3(0.018, 0.026, 0.028);
        vec3 spectral = mix(cyan, violet, 0.5 + 0.5 * sin(angle * 2.0 + materialNoise * 3.0));
        vec3 color = mix(smoke, spectral, 0.28 + materialNoise * 0.22) * body;
        color += spectral * interference * (0.2 + energy * 0.1);
        color += lime * vein * (0.045 + capability * 0.08);
        color += vec3(0.75, 0.82, 0.72) * specular * 0.62;
        color += lime * rim * (0.24 + u_pulse * 0.36);
        color += lime * depth * 0.04;
        color += lime * halo * 0.065;
        float grain = (hash(gl_FragCoord.xy + floor(t * 24.0)) - 0.5) * 0.025;
        color = max(color + grain * body, 0.0);
        float alpha = clamp(body * 0.95 + halo * 0.12, 0.0, 1.0);
        gl_FragColor = vec4(color, alpha);
      }
    `;

    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertex || !fragment) return undefined;

    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return undefined;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.useProgram(program);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const modeLocation = gl.getUniformLocation(program, "u_mode");
    const pulseLocation = gl.getUniformLocation(program, "u_pulse");
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let frame = 0;
    const started = performance.now();
    const render = (now) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform2f(resolutionLocation, width, height);
      gl.uniform1f(timeLocation, (now - started) / 1000);
      gl.uniform1f(modeLocation, modeRef.current);
      gl.uniform1f(pulseLocation, Math.max(0, 1 - (now - pulseStartedRef.current) / 850));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, []);

  return <canvas className="organism-material" ref={canvasRef} aria-hidden="true" />;
}

function OrganismPortrait({ active, setActive, pulse, setPulse, locale }) {
  const [preview, setPreview] = useState(null);
  const current = preview || active;
  const selected = signals.find((signal) => signal.id === current);
  const empty = locale === "en"
    ? { label: "NORTH STAR / PERSONAL PRINCIPLES", title: "What we can do. What we choose not to do. What keeps us going.", body: "Move through the three forces that guide Songs." }
    : { label: "北极星 / 个人原则", title: "我们能做什么、不做什么，以及为什么继续。", body: "探索三种指引 Songs 的力量。" };

  const selectSignal = (signalId) => {
    setPreview(null);
    setActive((locked) => locked === signalId ? null : signalId);
  };

  return (
    <div className={`field-artwork organism-portrait organism-principle-${current || "open"}`}>
      <div className="organism-material-shell" aria-hidden="true">
        <LivingMaterial mode={current} pulse={pulse} />
        <span className="organism-material-rim" />
        <span className="organism-material-orbit organism-material-orbit-a" />
        <span className="organism-material-orbit organism-material-orbit-b" />
      </div>
      <div className="pointer-presence" aria-hidden="true" />
      <div className="field-axis field-axis-x" aria-hidden="true" />
      <div className="field-axis field-axis-y" aria-hidden="true" />
      <button
        className={`field-core field-core-pulse-${pulse % 2}`}
        type="button"
        onClick={() => setPulse((value) => value + 1)}
        aria-label={locale === "en" ? "Pulse the North Star" : "唤醒北极星"}
      >
        <span className="field-core-ring field-core-ring-a" aria-hidden="true" />
        <span className="field-core-ring field-core-ring-b" aria-hidden="true" />
        <span className="field-core-ring field-core-ring-c" aria-hidden="true" />
        <strong>SONGS</strong><small>{selected ? selected.en : "NORTH STAR"}</small>
      </button>
      {signals.map((signal, index) => (
        <button
          className={`field-choice ${active === signal.id ? "is-active" : ""} ${preview === signal.id ? "is-preview" : ""}`}
          key={signal.id}
          style={{ "--choice-x": `${signal.x}%`, "--choice-y": `${signal.y}%`, "--choice-index": `'0${index + 1}'` }}
          type="button"
          aria-pressed={active === signal.id}
          onClick={() => selectSignal(signal.id)}
          onPointerEnter={() => setPreview(signal.id)}
          onPointerLeave={() => setPreview(null)}
          onFocus={() => setPreview(signal.id)}
          onBlur={() => setPreview(null)}
        >
          <i aria-hidden="true" /><strong>{signal.en}</strong><span>{signal.zh}</span>
        </button>
      ))}
      <div className="field-echo" aria-live="polite" key={current || "open"}>
        <small>{selected ? `NORTH STAR / ${selected.en}` : empty.label}</small>
        <strong>{selected ? (locale === "en" ? selected.response : selected.responseZh) : empty.title}</strong>
        <p>{selected ? (locale === "en" ? selected.note : selected.noteZh) : empty.body}</p>
      </div>
    </div>
  );
}

function EditorialProfile({ locale }) {
  const t = locale === "en" ? {
    name: "QIN SONG", alias: "SONGS / 秦松", education: "Shanghai University · Year 01",
    field: "Optoelectronic Information Science and Engineering",
    direction: "Explore unknowns. Create value. Contribute.",
    labels: ["EDUCATION", "FIELD", "DIRECTION"], github: "PUBLIC CODE", notion: "PUBLIC NOTES", email: "DIRECT CONTACT",
  } : {
    name: "秦松", alias: "SONGS / QIN SONG", education: "上海大学 · 大一",
    field: "光电信息科学与工程",
    direction: "探索未知，创造价值，对世界作出贡献。",
    labels: ["教育", "专业", "方向"], github: "公开代码", notion: "公开思考", email: "直接联系",
  };

  return (
    <div className="field-artwork editorial-profile">
      <div className="editorial-words" aria-hidden="true"><span>LEARN</span><span>MAKE</span><span>LIVE</span></div>
      <div className="editorial-profile-sheet">
        <div className="editorial-name"><small>{t.alias}</small><strong>{t.name}</strong><span>PROFILE / 2026</span></div>
        <div className="editorial-facts">
          <div><small>01 / {t.labels[0]}</small><strong>{t.education}</strong></div>
          <div><small>02 / {t.labels[1]}</small><strong>{t.field}</strong></div>
          <div><small>03 / {t.labels[2]}</small><strong>{t.direction}</strong></div>
        </div>
        <nav className="editorial-links" aria-label="External profile links">
          <a href={profile.links.github} target="_blank" rel="noreferrer"><span>GITHUB</span><strong>{t.github}</strong><i>↗</i></a>
          <a href={profile.links.notion} target="_blank" rel="noreferrer"><span>NOTION</span><strong>{t.notion}</strong><i>↗</i></a>
          <a href={profile.links.mailto}><span>EMAIL</span><strong>{t.email}</strong><i>↗</i></a>
        </nav>
      </div>
    </div>
  );
}

export default function FieldLab() {
  const [direction, setDirection] = useState(directionFromPath);
  const [locale, setLocale] = useState("en");
  const [active, setActive] = useState(null);
  const [pulse, setPulse] = useState(0);
  const [pointer, setPointer] = useState({ x: 50, y: 50, ox: 0, oy: 0 });
  const directionIndex = useMemo(() => directions.findIndex((item) => item.id === direction), [direction]);
  const t = sceneCopy[locale][direction];

  useEffect(() => {
    document.body.classList.add("field-body");
    document.documentElement.lang = locale === "en" ? "en" : "zh-CN";
    document.title = `${direction === "quiet" ? "Thoughts" : direction === "organism" ? "About" : "Profile"} — songs.com`;
    const followHistory = () => setDirection(directionFromPath());
    window.addEventListener("popstate", followHistory);
    return () => {
      document.body.classList.remove("field-body");
      window.removeEventListener("popstate", followHistory);
    };
  }, [locale, direction]);

  const trackPointer = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setPointer({ x, y, ox: (x - 50) * 0.24, oy: (y - 50) * 0.24 });
  };

  const changeDirection = (next) => {
    const target = directions.find((item) => item.id === next);
    if (!target) return;
    window.history.pushState({}, "", target.href);
    setDirection(next);
    setActive(null);
    setPulse(0);
  };

  return (
    <div
      className={`field-shell field-${direction}`}
      onPointerMove={trackPointer}
      onPointerLeave={() => setPointer({ x: 50, y: 50, ox: 0, oy: 0 })}
      style={{ "--field-x": `${pointer.x}%`, "--field-y": `${pointer.y}%`, "--field-ox": `${pointer.ox}px`, "--field-oy": `${pointer.oy}px` }}
    >
      <FieldHeader direction={direction} changeDirection={changeDirection} locale={locale} setLocale={setLocale} />
      <main className={`field-main field-main-${direction}`} key={direction}>
        <div className="field-intro"><p>{t.study}</p><h1>{t.title}</h1><span>{t.intro}</span></div>
        {direction === "quiet" ? <QuietArchive locale={locale} /> : direction === "editorial" ? <EditorialProfile locale={locale} /> : (
          <OrganismPortrait active={active} setActive={setActive} pulse={pulse} setPulse={setPulse} locale={locale} />
        )}
      </main>
      <footer className="field-footer">
        <a href="/">← {sceneCopy[locale].home}</a>
        <span>{String(directionIndex + 1).padStart(2, "0")} / 03 · {t.status}</span>
        <span>{t.prompt}</span>
      </footer>
    </div>
  );
}
