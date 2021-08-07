
import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";

import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import { localsMiddleware } from "./middlewares";
// const express = require("express");



const app = express();      //express application을 생성해줌
const logger = morgan("dev");


app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");     // 작업 디렉토리를 변경
app.use(logger);
app.use(express.urlencoded({ extended: true }));    //express application이 form의 value들을 이해할 수 있도록

// 우리의 router 앞에서 해줘야함 (session middleware)
app.use(
    session({
        secret: "hello",
        resave: true,
        saveUninitialized: true,
        store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/wetube" }),     // 세션이 서버가 아닌 mongoDB에 저장되도록
}))

app.use(localsMiddleware)

app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;

