import mongoose from "mongoose";

// hashtags의 format을 처리해줌     ->      static을 활용하는 방법으로 바꿔줌(주석처리한다!)
// export const formatHashtags = (hashtags) =>
// hashtags.split(",").map((word) => (word.startsWith('#') ? word : `#${word}`))

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxLength: 80 },
    fileUrl: { type: String, required: true },
    description: { type: String, required: true, trim: true, minLength: 20 },
    createdAt: {type: Date, required: true, default: Date.now},
    hashtags: [{ type: String, trim: true }],
    meta: {
        views: { type: Number, default: 0, required: true },
        rating: { type: Number, default: 0, required: true },
    }
});




videoSchema.static('formatHashtags', function(hashtags) {
    return hashtags.split(",").map((word) => (word.startsWith('#') ? word : `#${word}`))
})



// video 생성시 hash tag 처리(videoSchema.pre 사용)
// videoSchema.pre("save", async function() {
//     this.hashtags = this.hashtags[0].split(",").map((word) => word.startsWith('#') ? word : `#${word}`)
// })

const Video =mongoose.model("Video", videoSchema);

export default Video;


