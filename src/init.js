import "./db";
import "./models/video"
import "./models/User"
import app from "./server";

const PORT = 4000

const handleListening = () => 
    console.log(`Server listening on port http://localhost:${PORT} 🚀`)

app.listen(PORT, handleListening);      //4000 포트, handleListening 이라는 callback
