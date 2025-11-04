import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { getSession } from '../models/sessionModel.js';
dotenv.config();
const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const basePrompt = (node, emotion, stress, hope) => `
Eres un narrador inmersivo para una experiencia llamada "Mapa de Ansiedades".
Describe en 60-110 palabras la atmósfera sensorial del nodo "${node}", usando lenguaje poético y directo. El usuario reportó la emoción "${emotion}". Nivel de estrés: ${stress}. Nivel de esperanza: ${hope}.
Guía suavemente hacia la regulación y la respiración, sin sermones. Mantén la voz en primera persona plural.
`;

router.post('/', async (req, res) => {
  try {
    const { node, emotion, sessionId } = req.body;
    const session = sessionId ? getSession(sessionId) : null;
    const stress = session ? session.stress : 30;
    const hope = session ? session.hope : 0;

    const prompt = basePrompt(node, emotion || '', stress, hope);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Eres un narrador emocional, conciso, sensorial.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 220
    });

    const text = completion.choices[0].message.content.trim();

    const actions = {
      insomnio: ['cerrar_ojos','seguir_mirando'],
      sobrepensamiento: ['apagar_voces','dejar_que_sigan'],
      vacio: ['escuchar_silencio','buscar_algo'],
      miedo: ['huir','enfrentarlo'],
      estres: ['respirar','seguir_tensando']
    };

    res.json({ text, actions: actions[node] || ['regresar'] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error generating text', message: err.message });
  }
});

export default router;
