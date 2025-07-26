import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioBlob = formData.get('audio') as Blob;
    
    if (!audioBlob) {
      return NextResponse.json(
        { error: 'Nenhum arquivo de áudio fornecido' },
        { status: 400 }
      );
    }

    // Converte o Blob para Buffer
    const bytes = await audioBlob.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Cria a pasta temp se não existir
    const tempDir = join(process.cwd(), 'temp');
    if (!existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true });
    }

    // Gera um nome único para o arquivo
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `audio-${timestamp}.webm`;
    const filePath = join(tempDir, fileName);

    // Salva o arquivo
    await writeFile(filePath, buffer);

    console.log('✅ Arquivo de áudio salvo:', {
      fileName,
      filePath,
      size: buffer.length,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      fileName,
      filePath,
      size: buffer.length
    });

  } catch (error) {
    console.error('❌ Erro ao salvar arquivo de áudio:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 