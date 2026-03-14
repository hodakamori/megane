/**
 * Chat interface for AI-powered pipeline generation.
 * Renders at the bottom of the PipelineEditor panel.
 * Includes inline config panel for API key and model settings.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useAIConfigStore, PROVIDER_MODELS } from "../ai/config";
import type { AIProvider } from "../ai/config";
import { generatePipeline, extractPipelineJSON } from "../ai/client";
import { usePipelineStore } from "../pipeline/store";

interface ChatMessage {
  role: "user" | "assistant" | "error";
  content: string;
}

// ─── Styles ──────────────────────────────────────────────────────────

const containerStyle: React.CSSProperties = {
  flexShrink: 0,
  borderTop: "1px solid rgba(226,232,240,0.6)",
  display: "flex",
  flexDirection: "column",
  background: "rgba(248, 250, 252, 0.95)",
};

const messagesAreaStyle: React.CSSProperties = {
  maxHeight: 120,
  overflowY: "auto",
  padding: "6px 10px",
  display: "flex",
  flexDirection: "column",
  gap: 4,
  fontSize: 11,
  lineHeight: 1.5,
};

const inputRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-end",
  gap: 4,
  padding: "6px 10px 8px",
};

const textareaStyle: React.CSSProperties = {
  flex: 1,
  resize: "none",
  border: "1px solid #e2e8f0",
  borderRadius: 6,
  padding: "6px 8px",
  fontSize: 11,
  fontFamily: "inherit",
  lineHeight: 1.5,
  outline: "none",
  background: "white",
  minHeight: 32,
  maxHeight: 64,
};

const sendBtnStyle: React.CSSProperties = {
  background: "rgba(59, 130, 246, 0.1)",
  border: "1px solid rgba(59, 130, 246, 0.25)",
  borderRadius: 6,
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 600,
  color: "#3b82f6",
  whiteSpace: "nowrap",
};

const cancelBtnStyle: React.CSSProperties = {
  background: "rgba(239, 68, 68, 0.1)",
  border: "1px solid rgba(239, 68, 68, 0.25)",
  borderRadius: 6,
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 600,
  color: "#ef4444",
  whiteSpace: "nowrap",
};

const gearBtnStyle: React.CSSProperties = {
  background: "rgba(100, 116, 139, 0.08)",
  border: "1px solid rgba(100, 116, 139, 0.25)",
  borderRadius: 6,
  padding: "6px 8px",
  cursor: "pointer",
  fontSize: 13,
  color: "#64748b",
  lineHeight: 1,
};

const configPanelStyle: React.CSSProperties = {
  padding: "8px 10px",
  borderTop: "1px solid rgba(226,232,240,0.6)",
  background: "rgba(241, 245, 249, 0.95)",
  display: "flex",
  flexDirection: "column",
  gap: 6,
  fontSize: 11,
};

const configRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const configLabelStyle: React.CSSProperties = {
  width: 60,
  fontWeight: 600,
  color: "#475569",
  fontSize: 11,
  flexShrink: 0,
};

const configSelectStyle: React.CSSProperties = {
  flex: 1,
  border: "1px solid #e2e8f0",
  borderRadius: 4,
  padding: "3px 6px",
  fontSize: 11,
  background: "white",
  outline: "none",
};

const configInputStyle: React.CSSProperties = {
  flex: 1,
  border: "1px solid #e2e8f0",
  borderRadius: 4,
  padding: "3px 6px",
  fontSize: 11,
  background: "white",
  outline: "none",
  fontFamily: "monospace",
};

const userMsgStyle: React.CSSProperties = {
  alignSelf: "flex-end",
  background: "rgba(59, 130, 246, 0.1)",
  color: "#1e40af",
  borderRadius: "8px 8px 2px 8px",
  padding: "4px 8px",
  maxWidth: "85%",
  wordBreak: "break-word",
};

const assistantMsgStyle: React.CSSProperties = {
  alignSelf: "flex-start",
  background: "rgba(100, 116, 139, 0.08)",
  color: "#334155",
  borderRadius: "8px 8px 8px 2px",
  padding: "4px 8px",
  maxWidth: "85%",
  wordBreak: "break-word",
};

const errorMsgStyle: React.CSSProperties = {
  alignSelf: "flex-start",
  background: "rgba(239, 68, 68, 0.08)",
  color: "#dc2626",
  borderRadius: "8px 8px 8px 2px",
  padding: "4px 8px",
  maxWidth: "85%",
  wordBreak: "break-word",
};

const successMsgStyle: React.CSSProperties = {
  alignSelf: "flex-start",
  background: "rgba(16, 185, 129, 0.08)",
  color: "#059669",
  borderRadius: "8px 8px 8px 2px",
  padding: "4px 8px",
  maxWidth: "85%",
  fontWeight: 500,
};

// ─── Component ───────────────────────────────────────────────────────

export function PipelineChatBox({ onPipelineApplied }: { onPipelineApplied?: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const provider = useAIConfigStore((s) => s.provider);
  const model = useAIConfigStore((s) => s.model);
  const apiKey = useAIConfigStore((s) => s.apiKey);
  const setProvider = useAIConfigStore((s) => s.setProvider);
  const setModel = useAIConfigStore((s) => s.setModel);
  const setApiKey = useAIConfigStore((s) => s.setApiKey);

  const deserialize = usePipelineStore((s) => s.deserialize);
  const autoLayout = usePipelineStore((s) => s.autoLayout);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    if (!apiKey) {
      setShowConfig(true);
      setMessages((prev) => [
        ...prev,
        { role: "error", content: "Please set your API key in the config panel." },
      ]);
      return;
    }

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setIsStreaming(true);

    // Add a placeholder assistant message for streaming
    const assistantIdx = messages.length + 1; // index of the new assistant message
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    const abort = new AbortController();
    abortRef.current = abort;

    try {
      const fullResponse = await generatePipeline(
        { provider, model, apiKey },
        trimmed,
        (chunk) => {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last && last.role === "assistant") {
              updated[updated.length - 1] = { ...last, content: last.content + chunk };
            }
            return updated;
          });
        },
        abort.signal,
      );

      const pipeline = extractPipelineJSON(fullResponse);
      deserialize(pipeline);
      autoLayout();
      onPipelineApplied?.();

      setMessages((prev) => [
        ...prev,
        { role: "assistant" as const, content: "Pipeline generated successfully!" },
      ]);
    } catch (e: unknown) {
      if ((e as Error).name === "AbortError") {
        setMessages((prev) => [...prev, { role: "error", content: "Generation cancelled." }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "error", content: (e as Error).message || "An error occurred." },
        ]);
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [
    input,
    isStreaming,
    apiKey,
    provider,
    model,
    deserialize,
    autoLayout,
    onPipelineApplied,
    messages.length,
  ]);

  const handleCancel = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  return (
    <div style={containerStyle}>
      {/* Config panel */}
      {showConfig && (
        <div style={configPanelStyle}>
          <div style={configRowStyle}>
            <span style={configLabelStyle}>Provider</span>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as AIProvider)}
              style={configSelectStyle}
            >
              <option value="anthropic">Anthropic</option>
              <option value="openai">OpenAI</option>
            </select>
          </div>
          <div style={configRowStyle}>
            <span style={configLabelStyle}>Model</span>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              style={configSelectStyle}
            >
              {PROVIDER_MODELS[provider].map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <div style={configRowStyle}>
            <span style={configLabelStyle}>API Key</span>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={provider === "anthropic" ? "sk-ant-..." : "sk-..."}
              style={configInputStyle}
            />
          </div>
        </div>
      )}

      {/* Messages area */}
      {messages.length > 0 && (
        <div style={messagesAreaStyle}>
          {messages.map((msg, i) => {
            if (msg.role === "user") {
              return (
                <div key={i} style={userMsgStyle}>
                  {msg.content}
                </div>
              );
            }
            if (msg.role === "error") {
              return (
                <div key={i} style={errorMsgStyle}>
                  {msg.content}
                </div>
              );
            }
            // assistant
            if (msg.content === "Pipeline generated successfully!") {
              return (
                <div key={i} style={successMsgStyle}>
                  {msg.content}
                </div>
              );
            }
            // Show truncated streaming content
            const display =
              msg.content.length > 80
                ? msg.content.slice(0, 80) + "..."
                : msg.content || (isStreaming ? "Generating..." : "");
            return (
              <div key={i} style={assistantMsgStyle}>
                {display}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input row */}
      <div style={inputRowStyle}>
        <button
          onClick={() => setShowConfig(!showConfig)}
          style={{
            ...gearBtnStyle,
            background: showConfig ? "rgba(59, 130, 246, 0.1)" : gearBtnStyle.background,
            color: showConfig ? "#3b82f6" : gearBtnStyle.color,
          }}
          title="AI Settings"
        >
          &#9881;
        </button>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the pipeline you want..."
          style={textareaStyle}
          rows={1}
          disabled={isStreaming}
        />
        {isStreaming ? (
          <button onClick={handleCancel} style={cancelBtnStyle}>
            Cancel
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            style={{
              ...sendBtnStyle,
              opacity: input.trim() ? 1 : 0.5,
              cursor: input.trim() ? "pointer" : "default",
            }}
            disabled={!input.trim()}
          >
            Generate
          </button>
        )}
      </div>
    </div>
  );
}
