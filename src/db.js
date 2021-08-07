import mongoose from "mongoose"

mongoose.connect(process.env.DB_URL, { 
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

