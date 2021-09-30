import express from "express";
import bodyParser from "body-parser";
import cors from "cors"
import logger from "morgan"
// tslint:disable-next-line: no-var-requires
require("dotenv").config()

const app = express()

import {router} from "./router"

app.use(cors({origin: "*", optionsSuccessStatus: 200}))
app.use(logger('dev'))
app.use(bodyParser.json({limit: process.env.BATCH_FILE_SIZE_LIMIT}))
app.use(router)

app.listen(19713, () => {
    console.log("Listening on port 19713!")
})