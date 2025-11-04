import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();
const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Option A: OpenAI Images
router.post('/openai', async (req, res) => {
  try {
    const { node, emotion } = req.body;
    const prompt = `Abstract scene representing ${node}, evoking ${emotion}. Soft digital textures, organic circuits, cinematic depth-of-field.`;
    const result = await openai.images.generate({ model: 'gpt-image-1', prompt, size: '1024x1024', n: 1 });
    const url = result.data[0].url;
    res.json({ image: url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Image generation failed', message: err.message });
  }
});

// Option B: Stable Diffusion (sd endpoint)
router.post('/sd', async (req, res) => {
  try {
    const { node, emotion } = req.body;
    const prompt = `concept art of ${node}, feeling of ${emotion}, surreal digital light and soft texture`;
    const sdResp = await fetch('http://127.0.0.1:7860/sdapi/v1/txt2img', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, steps: 25, cfg_scale: 7, width: 1024, height: 1024 })
    });
    const data = await sdResp.json();
    const image = `data:image/png;base64,${data.images[0]}`;
    res.json({ image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Stable Diffusion error', message: err.message });
  }
});

export default router;
