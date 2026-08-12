const CONNECTION_TIMEOUT_MS = 8_000;

function waitForIceGathering(peer) {
  if (peer.iceGatheringState === "complete") return Promise.resolve();

  return new Promise((resolve) => {
    const timeout = window.setTimeout(done, 1_800);
    function done() {
      window.clearTimeout(timeout);
      peer.removeEventListener("icegatheringstatechange", check);
      resolve();
    }
    function check() {
      if (peer.iceGatheringState === "complete") done();
    }
    peer.addEventListener("icegatheringstatechange", check);
  });
}

function waitForConnection(peer) {
  if (peer.connectionState === "connected") return Promise.resolve();

  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => finish(false, "Connection timed out"), CONNECTION_TIMEOUT_MS);
    function finish(ok, message) {
      window.clearTimeout(timeout);
      peer.removeEventListener("connectionstatechange", check);
      peer.removeEventListener("iceconnectionstatechange", check);
      if (ok) resolve();
      else reject(new Error(message));
    }
    function check() {
      if (peer.connectionState === "connected" || peer.iceConnectionState === "connected") {
        finish(true);
      } else if (
        ["failed", "closed"].includes(peer.connectionState) ||
        ["failed", "closed"].includes(peer.iceConnectionState)
      ) {
        finish(false, "Realtime peer connection failed");
      }
    }
    peer.addEventListener("connectionstatechange", check);
    peer.addEventListener("iceconnectionstatechange", check);
  });
}

function waitForDataChannel(channel) {
  if (channel.readyState === "open") return Promise.resolve();

  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => finish(false), 3_500);
    function finish(ok) {
      window.clearTimeout(timeout);
      channel.removeEventListener("open", opened);
      channel.removeEventListener("error", failed);
      if (ok) resolve();
      else reject(new Error("Realtime data channel did not open"));
    }
    const opened = () => finish(true);
    const failed = () => finish(false);
    channel.addEventListener("open", opened);
    channel.addEventListener("error", failed);
  });
}

function createSilentAudio() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) throw new Error("AudioContext is unavailable");

  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const destination = context.createMediaStreamDestination();
  gain.gain.value = 0;
  oscillator.connect(gain);
  gain.connect(destination);
  oscillator.start();
  context.resume?.().catch(() => {});

  return {
    stream: destination.stream,
    track: destination.stream.getAudioTracks()[0],
    close() {
      try {
        oscillator.stop();
      } catch {
        // The oscillator may already be stopped during a failed attempt.
      }
      destination.stream.getTracks().forEach((track) => track.stop());
      context.close?.().catch(() => {});
    },
  };
}

export async function getRealtimeStatus() {
  try {
    const response = await fetch("/api/ai/status", {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Status endpoint failed");
    const data = await response.json();
    return {
      providers: Array.isArray(data.providers) ? data.providers : [],
      mode: data.mode === "cloud" ? "cloud" : "unavailable",
    };
  } catch {
    return { providers: [], mode: "unavailable" };
  }
}

async function createProviderConnection({ provider, locale, onEvent, onState }) {
  const peer = new RTCPeerConnection({ iceServers: [] });
  const silentAudio = createSilentAudio();
  const audioElement = document.createElement("audio");
  audioElement.autoplay = true;
  audioElement.playsInline = true;
  let microphoneStream = null;
  let microphoneTrack = null;
  let closed = false;
  let connected = false;
  let failureReported = false;
  let disconnectTimer = null;

  const sender = peer.addTrack(silentAudio.track, silentAudio.stream);
  const outboundChannel = peer.createDataChannel("oai-events");
  const attachedChannels = new WeakSet();

  const attachChannel = (channel) => {
    if (attachedChannels.has(channel)) return;
    attachedChannels.add(channel);
    channel.addEventListener("message", (message) => {
      try {
        onEvent?.(JSON.parse(message.data), provider);
      } catch {
        // Ignore non-JSON transport messages.
      }
    });
    channel.addEventListener("close", () => reportFailure());
    channel.addEventListener("error", () => reportFailure());
  };

  attachChannel(outboundChannel);
  peer.addEventListener("datachannel", (event) => attachChannel(event.channel));
  peer.addEventListener("track", (event) => {
    audioElement.srcObject = event.streams[0] || new MediaStream([event.track]);
    audioElement.play().catch(() => {});
  });
  const reportState = (state) => {
    if (closed) return;
    onState?.(state, provider);
  };

  const reportFailure = () => {
    if (!connected || failureReported || closed) return;
    failureReported = true;
    reportState("failed");
  };

  const clearDisconnectTimer = () => {
    window.clearTimeout(disconnectTimer);
    disconnectTimer = null;
  };

  const handleTransportState = () => {
    const state = peer.connectionState;
    const iceState = peer.iceConnectionState;
    if (state === "failed" || iceState === "failed") {
      clearDisconnectTimer();
      reportFailure();
      return;
    }
    if (state === "disconnected" || iceState === "disconnected") {
      reportState("disconnected");
      if (!disconnectTimer) {
        disconnectTimer = window.setTimeout(() => {
          disconnectTimer = null;
          if (
            peer.connectionState === "disconnected" ||
            peer.iceConnectionState === "disconnected"
          ) {
            reportFailure();
          }
        }, 4_000);
      }
      return;
    }
    clearDisconnectTimer();
    reportState(state);
  };

  peer.addEventListener("connectionstatechange", handleTransportState);
  peer.addEventListener("iceconnectionstatechange", handleTransportState);
  const cleanup = () => {
    if (closed) return;
    closed = true;
    clearDisconnectTimer();
    microphoneStream?.getTracks().forEach((track) => track.stop());
    silentAudio.close();
    audioElement.pause();
    audioElement.srcObject = null;
    peer.close();
  };

  try {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    await waitForIceGathering(peer);

    const response = await fetch("/api/ai/session", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        provider,
        locale,
        sdp: peer.localDescription?.sdp || offer.sdp,
      }),
    });
    const session = await response.json();
    if (!response.ok || !session.sdp) {
      throw new Error(session.error || `Unable to start ${provider}`);
    }

    await peer.setRemoteDescription({ type: "answer", sdp: session.sdp });
    await Promise.all([waitForConnection(peer), waitForDataChannel(outboundChannel)]);
    connected = true;

    if (session.clientSession) {
      outboundChannel.send(
        JSON.stringify({ type: "session.update", session: session.clientSession }),
      );
    }

    return {
      provider,
      model: session.model,
      supportsText: provider === "openai",
      send(event) {
        if (outboundChannel.readyState !== "open") {
          throw new Error("Realtime channel is not open");
        }
        outboundChannel.send(JSON.stringify(event));
      },
      sendText(text) {
        if (provider !== "openai") {
          throw new Error(`${provider} realtime accepts microphone audio, not typed user messages`);
        }
        this.send({
          type: "conversation.item.create",
          item: {
            type: "message",
            role: "user",
            content: [{ type: "input_text", text }],
          },
        });
        this.send({ type: "response.create" });
      },
      sendFunctionOutput(callId, output) {
        this.send({
          type: "conversation.item.create",
          item: {
            type: "function_call_output",
            call_id: callId,
            output: JSON.stringify(output),
          },
        });
        this.send({ type: "response.create" });
      },
      async setMicrophone(enabled) {
        if (enabled) {
          if (!microphoneTrack) {
            microphoneStream = await navigator.mediaDevices.getUserMedia({
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
              },
            });
            microphoneTrack = microphoneStream.getAudioTracks()[0];
            await sender.replaceTrack(microphoneTrack);
            silentAudio.close();
          }
          microphoneTrack.enabled = true;
        } else if (microphoneTrack) {
          microphoneTrack.enabled = false;
        }
      },
      close: cleanup,
    };
  } catch (error) {
    cleanup();
    throw error;
  }
}

export async function connectDualRealtime({
  locale,
  onEvent,
  onAttempt,
  onState,
  excludeProviders = [],
}) {
  const status = await getRealtimeStatus();
  const excluded = new Set(excludeProviders);
  const providers = status.providers.filter((provider) => !excluded.has(provider));
  if (!providers.length) throw new Error("No cloud voice provider is available");

  const errors = [];
  for (const provider of providers) {
    onAttempt?.(provider);
    try {
      return await createProviderConnection({ provider, locale, onEvent, onState });
    } catch (error) {
      errors.push(`${provider}: ${error instanceof Error ? error.message : "failed"}`);
    }
  }

  throw new Error(errors.join("; ") || "All realtime providers failed");
}
