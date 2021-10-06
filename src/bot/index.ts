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
app.use(bodyParser.json())
app.use(router)

app.listen(19713, () => {
    console.log("Bot and API on port 19713!")
})