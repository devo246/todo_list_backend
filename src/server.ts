import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db'
import authRouter from './routes/auth.route'
import taskRouter from './routes/task.route'
// src/server.ts
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cors());

dotenv.config()
connectDB()

app.use('/api', authRouter)
app.use('/api/tasks', taskRouter)

app.listen(process.env.PORT!, () => {
    console.log(`server is work in: http://localhost:${process.env.PORT!}`);
})