import express from "express";
import morgan from "morgan";
// const express = require("express");

const PORT = 4000

const app = express();      //express application을 생성해줌
const logger = morgan("dev");
app.use(logger);

const globalRouter = express.Router();
const handleHome = (req, res) => res.send("Home")
globalRouter.get("/", handleHome)

const userRouter = express.Router();
const handleEditUser = (req, res) => res.send("Edit User")
userRouter.get("/edit", handleEditUser)

const videoRouter = express.Router();
const handleWatchVideo = (req, res) => res.send("Watch Video")
videoRouter.get("/watch", handleWatchVideo)

app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);









// const loggerMiddleware = (req, res, next) => {    // 미들웨어 next()로 다음 함수를 실행시켜줌
//   console.log(`${req.method}  ${req.url}`);
  
//   next();
// }
// const privateMiddleware = (req, res, next) => {
//   const url = req.url;
//   if(url === "/protected") {
//     return res.send("<h1>Not Allowed</h1>");
//   }
//   next();
// }


// const handleHome = (req, res) => {
//   return res.send("Home");
// };
// const handleLogin = (req, res) => {
//   return res.send("Login!!");
// };

// app.use(loggerMiddleware);   //global 미들웨어 / get보다 앞에 위치해야함!
// app.use(privateMiddleware);   


// app.get("/", handleHome);
// app.get("/login", handleLogin);



const handleListening = () => console.log(`Server listening on port http://localhost:${PORT} 🚀`)

app.listen(PORT, handleListening);      //4000 포트, handleListening 이라는 callback
