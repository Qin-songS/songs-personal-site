import { useEffect, useMemo, useRef, useState } from "react";
import { connectDualRealtime, getRealtimeStatus } from "../src/dual-realtime";

const interfaceCopy = {
  en: {
    eyebrow: "SONGS / COGNITIVE INTERFACE",
    prototype: "CLOUD AI · STANDBY",
    routing: "AUTO ROUTING",
    close: "EXIT INTERFACE",
    minimize: "MINIMIZE",
    booting: "ESTABLISHING INTERFACE",
    linking: "ROUTING CLOUD CHANNEL",
    ready: "INTERFACE ONLINE",
    listening: "LISTENING",
    thinking: "INTERPRETING INTENT",
    speaking: "RESPONDING",
    offline: "CLOUD AI UNAVAILABLE",
    welcome: "Hi — I’m Songs AI. What would you like to know or do here? I can introduce Qin Song, open his thoughts or profile, and help you connect.",
    listeningCopy: "I’m listening. Ask who Songs is, what guides him, or where you would like to go.",
    thinkingCopy: "Mapping your question to this website…",
    unavailable: "GPT and Qwen are both unavailable. Please try again later.",
    microphoneUnavailable: "The cloud channel is online, but the microphone is unavailable in this browser.",
    voiceOnly: "The current cloud model accepts voice input only. Use the microphone to continue.",
    unknown:
      "I’m still learning that part of Songs. For now, try his purpose, thoughts, profile, contact, or visual modes.",
    heard: "I HEARD",
    response: "SONGS AI",
    input: "Ask something about Songs…",
    send: "SEND",
    mic: "VOICE",
    stop: "STOP",
    hints: "TRY A SIGNAL",
    currentModel: "CURRENT MODEL",
    connectingModel: "NEGOTIATING CHANNEL",
    switchingModel: "SWITCHING CHANNEL",
    unstableModel: "LINK UNSTABLE · RECOVERING",
    unavailableModel: "NO CLOUD CHANNEL",
    switchingCopy: "The active channel dropped. Routing your voice to the backup model…",
  },
  zh: {
    eyebrow: "SONGS / 认知界面",
    prototype: "云端 AI · 待机",
    routing: "自动选择通道",
    close: "退出界面",
    minimize: "收起助手",
    booting: "正在建立界面",
    linking: "正在选择云端通道",
    ready: "界面已上线",
    listening: "正在倾听",
    thinking: "正在理解意图",
    speaking: "正在回应",
    offline: "云端 AI 暂不可用",
    welcome: "你好，我是 Songs AI。你想了解什么，或者希望我带你去哪里？我可以介绍秦松、打开他的思考或个人档案，也可以帮你找到联系方式。",
    listeningCopy: "我正在听。你可以问秦松是谁、什么在指引他，或者希望前往哪个页面。",
    thinkingCopy: "正在把你的问题映射到这个网站……",
    unavailable: "GPT 和千问当前都不可用，请稍后再试。",
    microphoneUnavailable: "云端通道已连接，但当前浏览器无法使用麦克风。",
    voiceOnly: "当前云端模型只接受语音输入，请使用麦克风继续。",
    unknown: "我还在学习 Songs 的这一部分。你可以先问他的目标、思考、个人档案、联系方式或视觉模式。",
    heard: "我听到",
    response: "SONGS AI",
    input: "问一些关于 Songs 的事情……",
    send: "发送",
    mic: "语音",
    stop: "停止",
    hints: "尝试一个信号",
    currentModel: "当前模型",
    connectingModel: "正在协商通道",
    switchingModel: "正在切换通道",
    unstableModel: "连接不稳定 · 正在恢复",
    unavailableModel: "没有可用的云端通道",
    switchingCopy: "当前语音通道已中断，正在切换到备用模型……",
  },
};

const routes = [
  {
    id: "about",
    number: "01",
    label: { en: "WHO IS SONGS?", zh: "秦松是谁？" },
    phrases: ["who", "songs", "about", "purpose", "study", "goal", "秦松", "是谁", "关于", "目标", "专业"],
    reply: {
      en: "Opening the living portrait: what Songs studies, values, and is still becoming.",
      zh: "正在打开动态个人画像：秦松在学习什么、重视什么，以及正在成为什么。",
    },
    command: "FIELD.OPEN / ABOUT",
    action: { signal: "capability", direction: "organism" },
  },
  {
    id: "notes",
    number: "02",
    label: { en: "OPEN YOUR NOTES", zh: "打开你的想法" },
    phrases: ["note", "writing", "idea", "think", "notion", "文章", "想法", "思考", "笔记"],
    reply: {
      en: "Opening the thinking space and Qin Song’s public Notion archive.",
      zh: "正在打开思考空间与秦松公开的 Notion 思考仓库。",
    },
    command: "FIELD.SELECT / THINK",
    action: { signal: "think", direction: "quiet" },
  },
  {
    id: "resume",
    number: "03",
    label: { en: "READ YOUR RÉSUMÉ", zh: "了解你的经历" },
    phrases: ["resume", "résumé", "experience", "about", "learn", "简历", "经历", "关于你", "了解你"],
    reply: {
      en: "Opening the direct profile: education, field, direction, and public links.",
      zh: "正在打开个人档案：教育经历、专业、方向与公开链接。",
    },
    command: "FIELD.SELECT / LEARN",
    action: { signal: "learn", direction: "editorial" },
  },
  {
    id: "contact",
    number: "04",
    label: { en: "HOW CAN WE CONNECT?", zh: "如何联系你？" },
    phrases: ["contact", "email", "connect", "reach", "联系", "邮箱", "邮件", "合作"],
    reply: {
      en: "Opening the connection signal. Contact details will stay one confirmation away — never hidden behind the AI.",
      zh: "正在打开连接信号。联系方式永远只需要一次确认，不会被藏在 AI 后面。",
    },
    command: "FIELD.SELECT / CONNECT",
    action: { signal: "connect", direction: "organism" },
  },
];

const providerNames = { openai: "OPENAI", qwen: "QWEN" };
const providerDisplayNames = { openai: "GPT / OPENAI", qwen: "QWEN / 千问" };
const responseDeltaEvents = new Set([
  "response.output_audio_transcript.delta",
  "response.audio_transcript.delta",
  "response.output_text.delta",
  "response.text.delta",
]);

function toolAction(args) {
  switch (args.action) {
    case "show_about":
    case "show_work":
      return { action: routes[0].action, command: routes[0].command };
    case "open_notes":
      return { action: routes[1].action, command: routes[1].command };
    case "show_resume":
      return { action: routes[2].action, command: routes[2].command };
    case "show_contact":
      return { action: routes[3].action, command: routes[3].command };
    case "set_mode":
      if (["quiet", "organism", "editorial"].includes(args.value)) {
        return { action: { direction: args.value }, command: `FIELD.MODE / ${args.value.toUpperCase()}` };
      }
      break;
    case "set_language":
      if (["en", "zh"].includes(args.value)) {
        return { action: { locale: args.value }, command: `LANGUAGE / ${args.value.toUpperCase()}` };
      }
      break;
    default:
      break;
  }
  return null;
}

export default function VoicePrototype({ open, onClose, locale, onAction, variant = "fullscreen" }) {
  const [phase, setPhase] = useState("booting");
  const [reply, setReply] = useState(interfaceCopy[locale].welcome);
  const [transcript, setTranscript] = useState("");
  const [siteCommand, setSiteCommand] = useState("SYSTEM / STANDBY");
  const [input, setInput] = useState("");
  const [availableProviders, setAvailableProviders] = useState([]);
  const [provider, setProvider] = useState(null);
  const [activeModel, setActiveModel] = useState("");
  const [attemptedProvider, setAttemptedProvider] = useState(null);
  const [routingState, setRoutingState] = useState("standby");
  const [micActive, setMicActive] = useState(false);
  const realtimeRef = useRef(null);
  const connectingRef = useRef(null);
  const cloudFailedRef = useRef(false);
  const failoverRef = useRef(false);
  const interfaceOpenRef = useRef(false);
  const liveReplyRef = useRef("");
  const handledCallsRef = useRef(new Set());
  const micActiveRef = useRef(false);
  const sessionTimeoutRef = useRef(null);
  const timersRef = useRef([]);
  const inputRef = useRef(null);
  const t = interfaceCopy[locale];

  const status = useMemo(() => t[phase] || t.ready, [phase, t]);
  const displayedProvider = provider || attemptedProvider;
  const channelLabel = useMemo(() => {
    if (routingState === "switching" && attemptedProvider) {
      return `${t.switchingModel} · ${providerDisplayNames[attemptedProvider]}`;
    }
    if (provider) {
      return `${providerDisplayNames[provider]} · ${activeModel || "REALTIME"} · LIVE`;
    }
    if (attemptedProvider) {
      return `${t.connectingModel} · ${providerDisplayNames[attemptedProvider]}`;
    }
    if (availableProviders.length) {
      return `${t.routing} · ${availableProviders.map((item) => providerNames[item]).join(" > ")}`;
    }
    return t.prototype;
  }, [activeModel, attemptedProvider, availableProviders, provider, routingState, t]);
  const modelMonitor = useMemo(() => {
    if (routingState === "switching") {
      return {
        name: attemptedProvider ? providerDisplayNames[attemptedProvider] : "BACKUP",
        detail: t.switchingModel,
      };
    }
    if (routingState === "connecting") {
      return {
        name: attemptedProvider ? providerDisplayNames[attemptedProvider] : "AUTO",
        detail: t.connectingModel,
      };
    }
    if (routingState === "unstable") {
      return {
        name: displayedProvider ? providerDisplayNames[displayedProvider] : "CLOUD",
        detail: t.unstableModel,
      };
    }
    if (routingState === "offline") return { name: "OFFLINE", detail: t.unavailableModel };
    if (provider) return { name: providerDisplayNames[provider], detail: activeModel || "REALTIME" };
    return { name: "AUTO", detail: availableProviders.length ? t.routing : t.prototype };
  }, [activeModel, attemptedProvider, availableProviders.length, displayedProvider, provider, routingState, t]);

  const setMicrophoneState = (value) => {
    micActiveRef.current = value;
    setMicActive(value);
  };

  const clearTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  };

  const queue = (callback, delay) => {
    const timer = window.setTimeout(callback, delay);
    timersRef.current.push(timer);
    return timer;
  };

  useEffect(() => {
    if (!open) return undefined;

    interfaceOpenRef.current = true;
    clearTimers();
    cloudFailedRef.current = false;
    failoverRef.current = false;
    handledCallsRef.current.clear();
    setProvider(null);
    setActiveModel("");
    setAttemptedProvider(null);
    setRoutingState("standby");
    setAvailableProviders([]);
    setMicrophoneState(false);
    setPhase("booting");
    setReply(interfaceCopy[locale].welcome);
    setTranscript("");
    setSiteCommand("SYSTEM / STANDBY");
    getRealtimeStatus().then((result) => {
      setAvailableProviders(result.providers);
      if (!result.providers.length) {
        setCloudUnavailable("CHANNEL / NOT CONFIGURED");
      }
    });
    queue(() => {
      if (!cloudFailedRef.current) setPhase("ready");
    }, 1150);

    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      interfaceOpenRef.current = false;
      window.removeEventListener("keydown", closeOnEscape);
      clearTimers();
      realtimeRef.current?.close();
      realtimeRef.current = null;
      connectingRef.current = null;
      window.clearTimeout(sessionTimeoutRef.current);
      sessionTimeoutRef.current = null;
      setMicrophoneState(false);
    };
  }, [open]);

  const executeToolCall = (name, callId, rawArguments) => {
    if (!callId || handledCallsRef.current.has(callId)) return;
    handledCallsRef.current.add(callId);

    let result = null;
    try {
      const args = typeof rawArguments === "string" ? JSON.parse(rawArguments) : rawArguments;
      if (name === "control_website") result = toolAction(args || {});
    } catch {
      result = null;
    }

    if (result) {
      onAction(result.action);
      setSiteCommand(result.command);
    }
    realtimeRef.current?.sendFunctionOutput(callId, {
      ok: Boolean(result),
      message: result ? "Website action completed" : "Website action rejected",
    });
  };

  const handleRealtimeEvent = (event) => {
    if (event.type === "input_audio_buffer.speech_started") {
      setPhase("listening");
      setSiteCommand("VOICE / CAPTURING");
    }

    if (event.type === "input_audio_buffer.speech_stopped" || event.type === "response.created") {
      liveReplyRef.current = "";
      setReply(interfaceCopy[locale].thinkingCopy);
      setPhase("thinking");
    }

    if (event.type === "conversation.item.input_audio_transcription.completed" && event.transcript) {
      setTranscript(event.transcript);
    }

    if (responseDeltaEvents.has(event.type) && typeof event.delta === "string") {
      liveReplyRef.current += event.delta;
      setReply(liveReplyRef.current);
      setPhase("speaking");
    }

    if (["response.output_audio_transcript.done", "response.audio_transcript.done"].includes(event.type)) {
      const complete = event.transcript || event.text;
      if (complete) {
        liveReplyRef.current = complete;
        setReply(complete);
      }
    }

    if (event.type === "response.function_call_arguments.done") {
      executeToolCall(event.name, event.call_id, event.arguments);
    }

    if (event.type === "response.output_item.done" && event.item?.type === "function_call") {
      executeToolCall(event.item.name, event.item.call_id, event.item.arguments);
    }

    if (event.type === "response.done") {
      event.response?.output?.forEach((item) => {
        if (item.type === "function_call") {
          executeToolCall(item.name, item.call_id, item.arguments);
        }
      });
      setPhase(micActiveRef.current ? "listening" : "ready");
    }

    if (event.type === "error") {
      setSiteCommand("CHANNEL / RECOVERABLE ERROR");
      setPhase(micActiveRef.current ? "listening" : "ready");
    }
  };

  const setCloudUnavailable = (command = "CHANNEL / ALL PROVIDERS FAILED") => {
    realtimeRef.current?.close();
    realtimeRef.current = null;
    window.clearTimeout(sessionTimeoutRef.current);
    sessionTimeoutRef.current = null;
    cloudFailedRef.current = true;
    setProvider(null);
    setActiveModel("");
    setAttemptedProvider(null);
    setRoutingState("offline");
    setMicrophoneState(false);
    setReply(t.unavailable);
    setSiteCommand(command);
    setPhase("offline");
  };

  const armSessionLimit = (client) => {
    window.clearTimeout(sessionTimeoutRef.current);
    sessionTimeoutRef.current = window.setTimeout(() => {
      if (realtimeRef.current !== client) return;
      client.close();
      realtimeRef.current = null;
      setCloudUnavailable("CHANNEL / 5 MINUTE LIMIT");
    }, 5 * 60 * 1000);
  };

  const connectRealtime = async ({
    excludeProviders = [],
    switchingFrom = null,
    resumeMicrophone = false,
  } = {}) => {
    if (connectingRef.current) return connectingRef.current;

    const task = (async () => {
      setPhase("linking");
      setRoutingState(switchingFrom ? "switching" : "connecting");
      setReply(switchingFrom ? t.switchingCopy : t.thinkingCopy);

      try {
        const client = await connectDualRealtime({
          locale,
          excludeProviders,
          onEvent: handleRealtimeEvent,
          onAttempt: (nextProvider) => {
            setAttemptedProvider(nextProvider);
            setRoutingState(switchingFrom ? "switching" : "connecting");
            setSiteCommand(
              switchingFrom
                ? `FAILOVER / ${providerNames[switchingFrom]} > ${providerNames[nextProvider]}`
                : `ROUTE / ${providerNames[nextProvider]}`,
            );
          },
          onState: (state, activeProvider) => {
            const current = realtimeRef.current;
            if (!current || current.provider !== activeProvider) return;
            if (state === "disconnected") {
              setRoutingState("unstable");
              setSiteCommand(`CHANNEL / ${providerNames[activeProvider]} UNSTABLE`);
            } else if (state === "connected") {
              setRoutingState("live");
              setSiteCommand(`CHANNEL / ${providerNames[activeProvider]} READY`);
            } else if (state === "failed") {
              setSiteCommand(`CHANNEL / ${providerNames[activeProvider]} FAILED`);
              void recoverRealtime(activeProvider);
            }
          },
        });

        if (!interfaceOpenRef.current) {
          client.close();
          return null;
        }

        realtimeRef.current = client;
        cloudFailedRef.current = false;
        setProvider(client.provider);
        setActiveModel(client.model || "REALTIME");
        setAttemptedProvider(null);
        setRoutingState("live");
        setSiteCommand(`CHANNEL / ${providerNames[client.provider]} READY`);
        armSessionLimit(client);

        if (resumeMicrophone) {
          try {
            await client.setMicrophone(true);
            setMicrophoneState(true);
            setSiteCommand(`VOICE / ${providerNames[client.provider]} CAPTURING`);
            setPhase("listening");
          } catch {
            setMicrophoneState(false);
            setReply(t.microphoneUnavailable);
            setSiteCommand("MICROPHONE / UNAVAILABLE");
            setPhase("ready");
          }
        } else {
          setPhase("ready");
        }
        return client;
      } catch {
        if (interfaceOpenRef.current) {
          setCloudUnavailable();
        }
        return null;
      }
    })();

    connectingRef.current = task;
    try {
      return await task;
    } finally {
      if (connectingRef.current === task) connectingRef.current = null;
    }
  };

  const recoverRealtime = async (failedProvider) => {
    if (!interfaceOpenRef.current) return null;
    if (failoverRef.current) return connectingRef.current || null;

    const failedClient = realtimeRef.current;
    if (!failedClient || failedClient.provider !== failedProvider) {
      return connectingRef.current || null;
    }

    failoverRef.current = true;
    const resumeMicrophone = micActiveRef.current;
    failedClient.close();
    realtimeRef.current = null;
    window.clearTimeout(sessionTimeoutRef.current);
    sessionTimeoutRef.current = null;
    setMicrophoneState(false);
    setProvider(null);
    setActiveModel("");
    setAttemptedProvider(null);
    setRoutingState("switching");
    setPhase("linking");
    setReply(t.switchingCopy);
    setSiteCommand(`FAILOVER / ${providerNames[failedProvider]} > BACKUP`);

    try {
      return await connectRealtime({
        excludeProviders: [failedProvider],
        switchingFrom: failedProvider,
        resumeMicrophone,
      });
    } finally {
      failoverRef.current = false;
    }
  };

  const ensureRealtime = async () => {
    if (realtimeRef.current) return realtimeRef.current;
    if (cloudFailedRef.current) return null;
    if (connectingRef.current) return connectingRef.current;
    return connectRealtime();
  };

  const runCommand = async (value) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    clearTimers();
    setInput("");
    setTranscript(trimmed);
    const client = await ensureRealtime();
    if (!client) return;

    liveReplyRef.current = "";
    setReply(t.thinkingCopy);
    setSiteCommand(`QUERY / ${providerNames[client.provider]}`);
    setPhase("thinking");
    if (!client.supportsText) {
      setReply(t.voiceOnly);
      setSiteCommand(`QUERY / ${providerNames[client.provider]} VOICE ONLY`);
      setPhase("ready");
      return;
    }
    try {
      client.sendText(trimmed);
    } catch {
      const replacement = await recoverRealtime(client.provider);
      if (replacement?.supportsText) {
        try {
          replacement.sendText(trimmed);
          return;
        } catch {
          // The replacement dropped too; the cloud-unavailable state is set below.
        }
      }
      if (replacement && !replacement.supportsText) {
        setReply(t.voiceOnly);
        setSiteCommand(`QUERY / ${providerNames[replacement.provider]} VOICE ONLY`);
        setPhase("ready");
      } else if (!replacement) {
        setCloudUnavailable();
      }
    }
  };

  const startListening = async () => {
    if (micActive) {
      await realtimeRef.current?.setMicrophone(false);
      setMicrophoneState(false);
      setPhase("ready");
      setSiteCommand(provider ? `CHANNEL / ${providerNames[provider]} READY` : "VOICE / STANDBY");
      return;
    }

    const client = await ensureRealtime();
    if (!client) return;

    try {
      await client.setMicrophone(true);
      setMicrophoneState(true);
      setTranscript("");
      setReply(t.listeningCopy);
      setSiteCommand(`VOICE / ${providerNames[client.provider]} CAPTURING`);
      setPhase("listening");
    } catch {
      setMicrophoneState(false);
      setReply(t.microphoneUnavailable);
      setSiteCommand("MICROPHONE / UNAVAILABLE");
      setPhase("ready");
    }
  };

  const submit = (event) => {
    event.preventDefault();
    runCommand(input);
  };

  if (!open) return null;

  return (
    <section
      className={`voice-interface voice-interface-${variant} voice-phase-${phase} voice-provider-${displayedProvider || "auto"} voice-routing-${routingState}`}
      role={variant === "dock" ? "complementary" : "dialog"}
      aria-modal={variant === "dock" ? undefined : "true"}
      aria-label="Songs AI voice interface"
    >
      <div className="voice-grid" aria-hidden="true" />
      <div className="voice-scan" aria-hidden="true" />

      <header className="voice-header">
        <div className="voice-header-copy">
          <strong>{t.eyebrow}</strong>
          <span>{channelLabel}</span>
        </div>
        <div
          className={`voice-model-monitor voice-model-${displayedProvider || "auto"} voice-model-state-${routingState}`}
          role="status"
          aria-live="polite"
        >
          <i className="voice-model-beacon" aria-hidden="true" />
          <span>
            <small>{t.currentModel}</small>
            <strong key={`${displayedProvider}-${routingState}`}>{modelMonitor.name}</strong>
          </span>
          <em>{modelMonitor.detail}</em>
        </div>
        <button type="button" onClick={onClose}>
          <span>×</span>
          {variant === "dock" ? t.minimize : t.close}
        </button>
      </header>

      <div className="voice-stage">
        <div className="voice-orbital" aria-hidden="true">
          <span className="voice-orbit voice-orbit-a" />
          <span className="voice-orbit voice-orbit-b" />
          <span className="voice-orbit voice-orbit-c" />
          <div className="voice-wave">
            {Array.from({ length: 28 }, (_, index) => (
              <i key={index} style={{ "--wave-index": index }} />
            ))}
          </div>
          <div className="voice-orb-core">
            <strong>
              {phase === "booting"
                ? "00"
                : routingState === "switching"
                  ? "↻"
                  : displayedProvider === "qwen"
                    ? "Q"
                    : displayedProvider === "openai"
                      ? "G"
                      : "AI"}
            </strong>
            <small>{status}</small>
          </div>
        </div>

        <div className="voice-dialogue" aria-live="polite">
          <div className="voice-status-line">
            <span className="voice-status-dot" />
            <strong>{status}</strong>
            <small>{siteCommand}</small>
          </div>

          {transcript && (
            <div className="voice-heard">
              <small>{t.heard}</small>
              <p>“{transcript}”</p>
            </div>
          )}

          <div className="voice-response">
            <small>{t.response}</small>
            <p>{reply}</p>
          </div>

          <form className="voice-input" onSubmit={submit}>
            <label htmlFor="voice-prototype-input">{t.input}</label>
            <input
              id="voice-prototype-input"
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t.input}
              autoComplete="off"
              disabled={routingState === "offline"}
            />
            <button type="button" onClick={startListening} className="voice-mic" disabled={routingState === "offline"}>
              <span aria-hidden="true">{micActive ? "■" : "●"}</span>
              {micActive ? t.stop : t.mic}
            </button>
            <button type="submit" disabled={!input.trim() || routingState === "offline"}>
              {t.send} ↗
            </button>
          </form>
        </div>
      </div>

      <div className="voice-signals">
        <small>{t.hints}</small>
        <div>
          {routes.map((route) => (
            <button
              key={route.id}
              type="button"
              onClick={() => runCommand(route.label[locale])}
              disabled={routingState === "offline"}
            >
              <span>{route.number}</span>
              <strong>{route.label[locale]}</strong>
              <i>↗</i>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
