"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { AudioRecorder } from "./components/AudioRecorder";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [tab, setTab] = useState<"gravar" | "selecao">("gravar");

  return (
    <div>
      <h1>🎙️ MeetGPT</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Transforme suas reuniões com inteligência artificial
      </p>

      <div className="tab-container">
        <button 
          className={`tab-button ${tab === "gravar" ? "active" : ""}`}
          onClick={() => setTab("gravar")}
        >
          🎤 Gravar Reunião
        </button>
        <button 
          className={`tab-button ${tab === "selecao" ? "active" : ""}`}
          onClick={() => setTab("selecao")}
        >
          📁 Transcrições Salvas
        </button>
      </div>

      {tab === "gravar" && (
        <div className="card">
          <h2>Gravação de Reunião</h2>
          <AudioRecorder title="Controles de Gravação" />
          
          <div className="form-group">
            <label className="form-label">Chat com IA</label>
            <form onSubmit={handleSubmit}>
              <textarea
                className="form-textarea"
                rows={4}
                value={input}
                onChange={handleInputChange}
                placeholder="Digite sua mensagem para o chat OpenAI..."
              />
              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                💬 Enviar Mensagem
              </button>
            </form>
          </div>

          {messages.length > 0 && (
            <div className="messages-container">
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                Histórico de Conversa
              </h3>
              {messages.map((message, index) => (
                <div key={index} className="message">
                  <div style={{ 
                    fontWeight: '600', 
                    color: message.role === 'user' ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                    marginBottom: '0.5rem'
                  }}>
                    {message.role === 'user' ? '👤 Você' : '🤖 IA'}
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "selecao" && (
        <div className="card">
          <h2>📁 Transcrições Salvas</h2>
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 1rem',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📂</div>
            <p>Nenhuma transcrição encontrada</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              As transcrições das suas reuniões aparecerão aqui
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
