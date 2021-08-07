// require("dotenv").config();     //  이 방식은 다른 파일은 import로 되어있기때문에 파일 하나하나에 다 해줘야함
import "dotenv/config"      // 이 방식은 전체에 적용
import "./db";
import "./models/video"
import "./models/User"
import app from "./server";

const PORT = 4000

const handleListening = () => 
    console.log(`Server listening on port http://localhost:${PORT} 🚀`)

app.listen(PORT, handleListening);      //4000 포트, handleListening 이라는 callback
