'use client';

import { useAudioRecorder } from '../hooks/useAudioRecorder';

interface AudioRecorderProps {
  title?: string;
  className?: string;
}

export function AudioRecorder({ title = "Controles de Gravação", className = "" }: AudioRecorderProps) {
  const { isRecording, status, startRecording, stopRecording } = useAudioRecorder();

  return (
    <div className={`audio-recorder ${className}`}>
      <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>{title}</h3>
      
      <div className="status">
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            backgroundColor: isRecording ? 'var(--error)' : 'var(--success)',
            display: 'inline-block'
          }}></span>
          {status}
        </span>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        {!isRecording && (
          <button 
            onClick={startRecording}
            className="btn btn-success"
          >
            🎤 Iniciar Gravação
          </button>
        )}
        {isRecording && (
          <button 
            onClick={stopRecording}
            className="btn btn-error"
          >
            ⏹️ Parar Gravação
          </button>
        )}
      </div>
      
      {isRecording && (
        <div className="recording-indicator">
          <span>🔴 Gravando...</span>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            marginTop: '0.5rem'
          }}>
            <div style={{
              width: '100%',
              height: '4px',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '30%',
                height: '100%',
                backgroundColor: 'var(--error)',
                borderRadius: '2px',
                animation: 'pulse 2s infinite'
              }}></div>
            </div>
            <span style={{ fontSize: '0.8rem' }}>AO VIVO</span>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
} 