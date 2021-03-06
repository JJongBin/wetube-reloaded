import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    avatarUrl : String,
    socialOnly: {type: Boolean, default: false}, 
    username: { type: String, required: true, unique: true },
    password: { type: String, },
    name: { type: String, required: true },
    location : String,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }]
});



userSchema.pre("save", async function() {
    // 여기서 this = user   
    if (this.isModified("password")){      // password가 수정되면 true 반환
        this.password = await bcrypt.hash(this.password, 5);
    }
})


const User =mongoose.model("User", userSchema);

export default User;
// init에 import해야함

