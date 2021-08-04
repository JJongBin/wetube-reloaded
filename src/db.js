import mongoose from "mongoose"

mongoose.connect("mongodb://127.0.0.1:27017/wetube", { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});   // 주소 맨뒤에 db 이름을 명시


const db = mongoose.connection

const handleOpen = () => console.log("connected to DB ✅");
const handleError = (error) => console.log("❌ DB Error ❌ ", error);

db.on("error", handleError);
db.once("open", handleOpen);

