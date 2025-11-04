import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sessionRoutes from './routes/session.js';
import generateNode from './routes/generateNode.js';
import generateImage from './routes/generateImage.js';

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));

app.use('/api/session', sessionRoutes);
app.use('/api/generateNode', generateNode);
app.use('/api/generateImage', generateImage);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
