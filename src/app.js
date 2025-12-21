import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { JSON_LIMIT } from "./constants"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN
}))

app.use(express.json({limit: JSON_LIMIT}))
app.use(express.urlencoded({extended: true, limit: JSON_LIMIT}))
app.use(express.static("public"))
app.use(cookieParser())

export default app