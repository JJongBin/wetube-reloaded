import "./db";
import express from "express";
import morgan from "morgan";

import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
// const express = require("express");

const PORT = 4000

const app = express();      //express application을 생성해줌
const logger = morgan("dev");


app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");     // 작업 디렉토리를 변경
app.use(logger);
app.use(express.urlencoded({ extended: true }));    //express application이 form의 value들을 이해할 수 있도록
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);




const handleListening = () => console.log(`Server listening on port http://localhost:${PORT} 🚀`)

app.listen(PORT, handleListening);      //4000 포트, handleListening 이라는 callback
