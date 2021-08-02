
import express from "express";
import morgan from "morgan";

import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
// const express = require("express");



const app = express();      //express application을 생성해줌
const logger = morgan("dev");


app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");     // 작업 디렉토리를 변경
app.use(logger);
app.use(express.urlencoded({ extended: true }));    //express application이 form의 value들을 이해할 수 있도록
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;

