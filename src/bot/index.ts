import express from "express";
import bodyParser from "body-parser";
import cors from "cors"
import logger from "morgan"
import config from './config'

const app = express()

import {router} from "./router"

app.use(cors({origin: "*", optionsSuccessStatus: 200}))
app.use(logger('dev'))
app.use(bodyParser.json({limit: config.BATCH_FILE_SIZE_LIMIT}))
app.use(router)

app.listen(config.API_PORT, () => {
    console.log("Listening on port 2137!")
})