// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = join(process.cwd(), 'public/uploads');
  const filePath = join(uploadDir, file.name);

  try {
    // 确保上传目录存在
    await mkdir(uploadDir, { recursive: true });

    // 写入文件
    await writeFile(filePath, buffer);
    console.log(`File uploaded to ${filePath}`);
    
    // 保存文件信息到数据库
    const savedFile = await prisma.file.create({
      data: {
        filename: file.name,
        filepath: `/uploads/${encodeURIComponent(file.name)}`,
      },
    });

    const fileUrl = `/uploads/${encodeURIComponent(file.name)}`;
    return NextResponse.json({ success: true, file: savedFile });
  } catch (error) {
    console.error('Error uploading file:', error instanceof Error ? error.message : String(error));
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
}
