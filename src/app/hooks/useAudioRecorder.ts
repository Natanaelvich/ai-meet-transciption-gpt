import { useState, useRef, useCallback } from 'react';

interface UseAudioRecorderReturn {
  recording: boolean;
  status: string;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  isRecording: boolean;
}

interface UseAudioRecorderProps {
  uploadAudio?: (audio: Blob) => void;
}

const isRecordingSupported =
  !!navigator.mediaDevices &&
  typeof navigator.mediaDevices.getUserMedia === 'function' &&
  typeof window.MediaRecorder === 'function'

export function useAudioRecorder({ uploadAudio }: UseAudioRecorderProps = {}): UseAudioRecorderReturn {
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState('Clique em "Iniciar gravação" para começar');
  const [isRecording, setIsRecording] = useState(false)
  const recorder = useRef<MediaRecorder | null>(null)
  const intervalRef = useRef<NodeJS.Timeout>(null)
  const startTimeRef = useRef<number>(0)
  const chunkCountRef = useRef<number>(0)
  const isStoppingRef = useRef<boolean>(false)

  const saveAudioToServer = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const response = await fetch('/api/upload-audio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Áudio salvo no servidor:', result);
      return result;
    } catch (error) {
      console.error('❌ Erro ao salvar áudio no servidor:', error);
      throw error;
    }
  };

  function createRecorder(audio: MediaStream) {
    console.log('🎤 Criando novo MediaRecorder...')
    
    try {
      recorder.current = new MediaRecorder(audio, {
        mimeType: 'audio/webm',
        audioBitsPerSecond: 64_000,
      })

      console.log('✅ MediaRecorder criado com sucesso', {
        mimeType: recorder.current.mimeType,
        audioBitsPerSecond: recorder.current.audioBitsPerSecond,
        state: recorder.current.state
      })

      recorder.current.ondataavailable = async (event) => {
        chunkCountRef.current++
        const chunkSize = event.data.size
        const chunkSizeKB = (chunkSize / 1024).toFixed(2)
        
        console.log(`📦 Chunk de áudio recebido #${chunkCountRef.current}`, {
          size: `${chunkSizeKB} KB`,
          type: event.data.type,
          timestamp: new Date().toISOString()
        })

        if (chunkSize > 0) {
          try {
            console.log('📤 Salvando chunk no servidor...')
            await saveAudioToServer(event.data);
            
            // Chama o callback personalizado se fornecido
            if (uploadAudio) {
              uploadAudio(event.data);
            }
          } catch (error) {
            console.error('❌ Erro ao salvar chunk:', error);
            setStatus('❌ Erro ao salvar áudio');
          }
        } else {
          console.warn('⚠️ Chunk vazio recebido, ignorando...')
        }
      }

      recorder.current.onstart = () => {
        startTimeRef.current = Date.now()
        console.log('🎬 Gravação iniciada!', {
          timestamp: new Date().toISOString(),
          recorderState: recorder.current?.state
        })
        setStatus('🎤 Gravando... Clique em "Parar" para finalizar')
        setRecording(true)
      }

      recorder.current.onstop = () => {
        const duration = Date.now() - startTimeRef.current
        console.log('⏹️ Gravação encerrada', {
          duration: `${duration}ms`,
          chunks: chunkCountRef.current,
          timestamp: new Date().toISOString(),
          isStopping: isStoppingRef.current
        })
        
        // Só muda o estado se realmente estiver parando a gravação
        if (isStoppingRef.current) {
          console.log('✅ Status final já foi atualizado no stopRecording')
          // Status já foi atualizado no stopRecording, não precisa fazer nada aqui
        } else {
          console.log('🔄 Chunk finalizado, continuando gravação...')
        }
      }

      recorder.current.onerror = (event) => {
        console.error('❌ Erro na gravação:', {
          error: event.error,
          name: event.error?.name,
          message: event.error?.message,
          timestamp: new Date().toISOString()
        })
        setStatus('❌ Erro na gravação')
        setRecording(false)
        setIsRecording(false)
      }

      recorder.current.onpause = () => {
        console.log('⏸️ Gravação pausada')
        setStatus('⏸️ Gravação pausada')
      }

      recorder.current.onresume = () => {
        console.log('▶️ Gravação retomada')
        setStatus('🎤 Gravando...')
      }

      console.log('🚀 Iniciando gravação...')
      recorder.current.start()
      
    } catch (error) {
      console.error('❌ Erro ao criar MediaRecorder:', {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      })
      setStatus('❌ Erro ao inicializar gravação')
      throw error
    }
  }

  async function startRecording() {
    console.log('🎯 Iniciando processo de gravação...')
    
    if (!isRecordingSupported) {
      const errorMsg = 'O seu navegador não suporta gravação'
      console.error('❌ Navegador não suporta gravação:', {
        mediaDevices: !!navigator.mediaDevices,
        getUserMedia: typeof navigator.mediaDevices?.getUserMedia,
        MediaRecorder: typeof window.MediaRecorder,
        userAgent: navigator.userAgent
      })
      alert(errorMsg)
      setStatus('❌ Navegador não suporta gravação')
      return
    }

    try {
      isStoppingRef.current = false
      setIsRecording(true)
      setStatus('🎤 Solicitando permissão de microfone...')
      
      console.log('🎤 Solicitando permissão de microfone...')
      const audio = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44_100,
        },
      })

      console.log('✅ Permissão de microfone concedida', {
        trackCount: audio.getTracks().length,
        trackSettings: audio.getTracks().map(track => ({
          kind: track.kind,
          enabled: track.enabled,
          muted: track.muted,
          readyState: track.readyState
        }))
      })

      setStatus('🎤 Configurando gravação...')
      createRecorder(audio)

      console.log('⏰ Configurando intervalo de chunks (5s)...')
      intervalRef.current = setInterval(() => {
        console.log('🔄 Reiniciando gravação (intervalo de 5s)')
        recorder.current?.stop()
        createRecorder(audio)
      }, 5000)

      console.log('✅ Gravação iniciada com sucesso')
      
    } catch (error) {
      console.error('❌ Erro ao iniciar gravação:', {
        error: error instanceof Error ? error.message : error,
        name: error instanceof Error ? error.name : 'Unknown',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      })
      
      setIsRecording(false)
      setStatus('❌ Erro ao iniciar gravação')
      
      if (error instanceof Error && error.name === 'NotAllowedError') {
        alert('Permissão de microfone negada. Por favor, permita o acesso ao microfone.')
      } else if (error instanceof Error && error.name === 'NotFoundError') {
        alert('Nenhum dispositivo de áudio encontrado.')
      } else {
        alert('Erro ao iniciar gravação. Tente novamente.')
      }
    }
  }

  function stopRecording() {
    console.log('🛑 Parando gravação...')
    
    try {
      // Marca que estamos realmente parando a gravação
      isStoppingRef.current = true
      
      // Atualiza o estado imediatamente para feedback visual
      setIsRecording(false)
      setRecording(false)
      setStatus('⏹️ Parando gravação...')
      
      if (recorder.current) {
        console.log('⏹️ Parando MediaRecorder...')
        recorder.current.stop()
      }
      
      if (intervalRef.current) {
        console.log('⏹️ Limpando intervalo...')
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      
      console.log('✅ Gravação parada com sucesso', {
        totalChunks: chunkCountRef.current,
        timestamp: new Date().toISOString()
      })
      
      // Reset counters
      chunkCountRef.current = 0
      startTimeRef.current = 0
      isStoppingRef.current = false
      
      // Atualiza o status final imediatamente
      setStatus('✅ Gravação finalizada')
      
    } catch (error) {
      console.error('❌ Erro ao parar gravação:', {
        error: error instanceof Error ? error.message : error,
        timestamp: new Date().toISOString()
      })
      setStatus('❌ Erro ao parar gravação')
      isStoppingRef.current = false
    }
  }

  return {
    recording,
    status,
    startRecording,
    stopRecording,
    isRecording
  };
} 