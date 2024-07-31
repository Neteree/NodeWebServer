const express = require("express");
const cors = require("cors");
const app = express();
const cardRouter = require("./cards/card.router");
const errorHandlerMiddleware = require("./middleware/errorHandlerMiddleware");

app.use(cors());
app.use(express.json());

app.use(cardRouter);

app.use(errorHandlerMiddleware);

module.exports = app;
