import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());



const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log('Server'));