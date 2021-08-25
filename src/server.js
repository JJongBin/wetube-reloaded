
import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";

import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import apiRouter from "./routers/apiRouter";
import { localsMiddleware } from "./middlewares";
// const express = require("express");



const app = express();      //express application을 생성해줌
const logger = morgan("dev");


app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");     // 작업 디렉토리를 변경
app.use(logger);
app.use(express.urlencoded({ extended: true }));    //express application이 form의 value들을 이해할 수 있도록
app.use(express.json());    //express application이 object를 이해하도록

// 우리의 router 앞에서 해줘야함 (session middleware)
app.use(
    session({
        secret: "process.env.COOKIE_SECRET",    // 쿠키에 sign(backend에 쿠키를 줬음을 보여줌) 할때 사용하는 string
        resave: false,
        saveUninitialized: false,   // 세션을 수정할(로그인) 때만 DB에 저장하고 쿠키를 넘겨줌(false)  
        // cookie: {
        //     maxAge: 20000,  // 쿠키를 얼마동안 유지할지
        // },
        store: MongoStore.create({ mongoUrl: process.env.DB_URL }),     // 세션이 서버 메모리가 아닌 mongoDB에 저장되도록 -> 서버를 재시작해도 로그인이 유지
        // 민감한 정보들은 process.env (환경변수)로 만들어주기! (dotenv 설치)
}))

app.use(flash())        // flash 미들웨어는 messages라고 하는 locals를 사용할 수 있게함
app.use(localsMiddleware)
app.use("/uploads", express.static("uploads"))       //폴더 노출
app.use("/static", express.static("assets"))       //폴더 노출

app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

export default app;

