import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(cors());
app.use(express.json());

// 音频转录接口
app.post('/api/transcribe', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '没有上传文件' });
    }

    const filePath = path.resolve(req.file.path);

    // 调用 OpenAI 音频转写接口
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-1',
    });

    // 删除临时上传文件
    fs.unlinkSync(filePath);

    res.json({ text: transcription.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '转录失败' });
  }
});

// 文本生成建议接口
app.post('/api/advice', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: '缺少文本' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: '你是一个帮助父母理解自闭症儿童表达的专家。' },
        { role: 'user', content: `请根据以下孩子的表达，给出沟通建议：${text}` },
      ],
      max_tokens: 500,
    });

    const advice = completion.choices[0].message.content;
    res.json({ advice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '生成建议失败' });
  }
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`后端服务器运行在 http://localhost:${PORT}`);
});
