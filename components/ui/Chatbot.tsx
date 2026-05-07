"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Volume2, VolumeX, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const MAX_MESSAGES = 10;

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(false);
  const [count, setCount] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // Focus input on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      sourceRef.current?.stop();
      audioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  function stopSpeech() {
    try {
      sourceRef.current?.stop();
    } catch {}
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  function speakWithBrowserVoice(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  }

  async function speak(text: string) {
    if (muted || !text.trim()) return;
    const speechText = text.trim().slice(0, 500);

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      speakWithBrowserVoice(speechText);
      return;
    }

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: speechText }),
      });
      if (!res.ok) {
        speakWithBrowserVoice(speechText);
        return;
      }

      const buf = await res.arrayBuffer();
      const ctx = audioCtxRef.current ?? new AudioContext();
      audioCtxRef.current = ctx;
      if (ctx.state === "suspended") await ctx.resume();

      const decoded = await ctx.decodeAudioData(buf);
      stopSpeech();
      const source = ctx.createBufferSource();
      source.buffer = decoded;
      source.connect(ctx.destination);
      source.start();
      sourceRef.current = source;
    } catch (err) {
      console.error("[TTS]", err);
      speakWithBrowserVoice(speechText);
    }
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading || count >= MAX_MESSAGES) return;

    const userMsg: Message = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    setCount((c) => c + 1);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          toast.error("Rate limit reached. Try again later.");
        } else {
          toast.error("Failed to send message.");
        }
        setMessages(next);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");
      const decoder = new TextDecoder();
      let full = "";

      // Add empty assistant message
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: full },
        ]);
      }

      // Speak the full response
      void speak(full);
    } catch (err) {
      console.error("[chat]", err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const remaining = MAX_MESSAGES - count;

  return (
    <>
      {/* Floating trigger */}
      <motion.button
        type="button"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 200, damping: 18 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat with AI assistant"}
        aria-expanded={open}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-fuchsia-500 text-white shadow-2xl shadow-primary/40 transition-shadow hover:shadow-primary/60"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={open ? "x" : "bot"}
            initial={{ rotate: -45, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 45, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {open ? <X className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      {/* Sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="AI chat assistant"
            className={cn(
              "fixed bottom-24 right-6 z-50 flex h-[560px] w-[calc(100vw-3rem)] max-w-[380px] flex-col overflow-hidden rounded-3xl border border-border shadow-2xl",
              "bg-background/85 backdrop-blur-2xl backdrop-saturate-150"
            )}
          >
            {/* Header */}
            <header className="flex items-center gap-3 border-b border-border px-5 py-4">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-fuchsia-500 text-white">
                <Bot className="h-5 w-5" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Shruti&apos;s AI</p>
                <p className="text-[11px] text-emerald-500">Online</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!muted) stopSpeech();
                  setMuted((m) => !m);
                }}
                aria-label={muted ? "Unmute voice" : "Mute voice"}
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {muted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>

              <span className="text-[11px] text-muted-foreground">
                {remaining} left
              </span>
            </header>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.length === 0 && (
                <div className="mt-12 text-center text-sm text-muted-foreground">
                  <div className="mb-3 text-3xl">👋</div>
                  Hi! I&apos;m Shruti&apos;s AI assistant.
                  <br />
                  Ask me about her skills, projects, or experience.
                </div>
              )}

              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "flex",
                    m.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      m.role === "user"
                        ? "rounded-br-md bg-gradient-to-br from-primary to-fuchsia-500 text-white"
                        : "rounded-bl-md border border-border bg-muted/60 text-foreground"
                    )}
                  >
                    {m.content || (
                      <span className="inline-flex gap-1">
                        <span className="dot" />
                        <span className="dot" />
                        <span className="dot" />
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}

              {loading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md border border-border bg-muted/60 px-4 py-2.5">
                    <span className="inline-flex gap-1">
                      <span className="dot" />
                      <span className="dot" />
                      <span className="dot" />
                    </span>
                  </div>
                </div>
              )}

              {count >= MAX_MESSAGES && (
                <p className="pt-2 text-center text-xs text-muted-foreground">
                  Limit reached. Refresh to restart.
                </p>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-center gap-2 border-t border-border bg-background/60 p-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  count >= MAX_MESSAGES ? "Limit reached" : "Ask anything…"
                }
                disabled={loading || count >= MAX_MESSAGES}
                aria-label="Type your message"
                className="flex-1 rounded-xl border border-border bg-muted/40 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:bg-background disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading || count >= MAX_MESSAGES}
                aria-label="Send message"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-fuchsia-500 text-white transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>

            <style jsx>{`
              .dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: hsl(var(--muted-foreground));
                display: inline-block;
                animation: dotBounce 1.4s ease-in-out infinite;
              }
              .dot:nth-child(2) { animation-delay: 0.15s; }
              .dot:nth-child(3) { animation-delay: 0.3s; }
              @keyframes dotBounce {
                0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
                30% { opacity: 1; transform: translateY(-3px); }
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
