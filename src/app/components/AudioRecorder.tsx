'use client';

import { useAudioRecorder } from '../hooks/useAudioRecorder';

interface AudioRecorderProps {
  title?: string;
  className?: string;
}

export function AudioRecorder({ title = "Gravar Reunião", className = "" }: AudioRecorderProps) {
  const { isRecording, status, startRecording, stopRecording } = useAudioRecorder();

  return (
    <div className={`audio-recorder ${className}`}>
      <h2>{title}</h2>
      <p className="status">{status}</p>
      <div className="controls">
        {!isRecording && (
          <button 
            onClick={startRecording}
            className="start-button"
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            🎤 Iniciar gravação
          </button>
        )}
        {isRecording && (
          <button 
            onClick={stopRecording}
            className="stop-button"
            style={{
              backgroundColor: '#f44336',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ⏹️ Parar gravação
          </button>
        )}
      </div>
      {isRecording && (
        <div className="recording-indicator" style={{ marginTop: '10px' }}>
          <span style={{ color: '#f44336', fontWeight: 'bold' }}>
            🔴 Gravando...
          </span>
        </div>
      )}
    </div>
  );
} 