import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import gameRouter from './routers/gameRouter.js';
import clientRouter from './routers/clientRouter.js';
import categoryRouter from './routers/categoryRouter.js';
import rentRouter from './routers/rentRouter.js';
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(gameRouter);
app.use(clientRouter);
app.use(categoryRouter);
app.use(rentRouter);


const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log('Server'));