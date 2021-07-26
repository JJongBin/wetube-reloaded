import express from "express";
import morgan from "morgan";

import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
// const express = require("express");

const PORT = 4000

const app = express();      //express application을 생성해줌
const logger = morgan("dev");
app.use(logger);

app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);




const handleListening = () => console.log(`Server listening on port http://localhost:${PORT} 🚀`)

app.listen(PORT, handleListening);      //4000 포트, handleListening 이라는 callback
