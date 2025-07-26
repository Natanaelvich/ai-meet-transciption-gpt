"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  const [tab, setTab] = useState<"gravar" | "selecao">("gravar");

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Bem-vindo ao MeetGPT 🎙️</h1>
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setTab("gravar")} disabled={tab === "gravar"}>
          Gravar Reunião
        </button>
        <button
          onClick={() => setTab("selecao")}
          disabled={tab === "selecao"}
          style={{ marginLeft: 10 }}
        >
          Ver transcrições salvas
        </button>
      </div>

      {tab === "gravar" && (
        <div>
          <h2>Tab Gravar</h2>
          {/* Aqui você pode adicionar upload de áudio e chamar a transcrição */}
          <form onSubmit={handleSubmit}>
            <textarea
              rows={4}
              value={input}
              onChange={handleInputChange}
              placeholder="Digite sua mensagem para o chat OpenAI"
              style={{ width: "100%" }}
            />
            <button type="submit" style={{ marginTop: 10 }}>
              Enviar
            </button>
          </form>
          <pre style={{ background: "#eee", padding: 10, marginTop: 10 }}>
            {messages[messages.length - 1]?.content}
          </pre>
        </div>
      )}

      {tab === "selecao" && (
        <div>
          <h2>Tab Seleção</h2>
          <p>
            Exibe transcrições salvas aqui (implemente conforme seu backend).
          </p>
        </div>
      )}
    </div>
  );
}
