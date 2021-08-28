import Video from "../models/video"
import User from "../models/User"
import Comment from "../models/Comment"

/*
// cllback 방식 
export const home = (req, res) => {
  // mongoose 의 callback 함수 
  // 모든형태의 비디오를 찾는다(첫 번째 arg 비어있으면 모든형식 뜻함) 
  // 두번째 arg - error와 document를 전송해주는 콜백함수
  Video.find({}, (error, videos) => {
    return res.render("home", {pageTitle: "Home", videos});
    // db search가 끝나야 rendering이 시작됨 db에서 보내주는 video를 인자로 받음
  });    
}
*/

// promise 방식
export const home = async(req, res) => {
  try{
    // await로 기다려줌 (아래코드에서 db에 데이터를 결과값으로 받을때까지)
    // await는 function 내에서만 사용이 가능한대 해당 function이 asynchronous일때만 가능함! (astnc를 적어줌)
    const videos = await Video.find({}).sort({createdAt: "desc"}).populate("owner"); 
    // console.log(videos);
    return res.render("home", {pageTitle: "Home", videos});
  }
  catch{
    return res.render("server-error")
  }
}

export const watch = async(req, res) => {
  const { id } = req.params;  //ES6
  // populate는 실제 데이터로 채워줌(model에서 ref로 정의해줬음)
  const video = await Video.findById(id).populate("owner").populate("comments");
  // 에러체크를 먼저하는 방법 이용 -> 에러 체크후 이상이 없으면 정상적인 화면 랜더링
  if (!video){
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  // console.log(video)
  return res.render("Watch", {pageTitle: video.title, video, });   
}


export const getEdit = async(req, res) => {

  const { id } = req.params;  
  const video = await Video.findById(id).populate("owner")
  const { user:{_id} } = req.session;

  if (!video){
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  
  // 동영상 게시자만 수정페이지에 접근가능
  if(String(video.owner._id) !== String(_id)){
    // console.log("video.owner", video.owner)
    // console.log("_id", _id)
    req.flash("error", "Not authorized")
    return res.status(403).redirect("/");
  }
  return res.render("edit", {pageTitle: `Edit ${video.title}`, video: video});
}


export const postEdit = async(req, res) => {
  const { id } = req.params;  
  const { title, description, hashtags } = req.body;  
  // const video = await Video.findById(id)
  const video = await Video.exists({_id:id})  //exists 필터를 입력해줌
  const { user:{_id} } = req.session;

  if (!video){
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }

  if(String(video.owner) !== String(_id)){
    req.flash("error", "You are not the owner of the video")
    return res.status(403).redirect("/");
  }
  
  await Video.findByIdAndUpdate(id, {
    title, 
    description, 
    // hashtags: hashtags.split(",").map((word) => word.startsWith('#') ? word : `#${word}`),
    hashtags: Video.formatHashtags(hashtags),   // video.js에서 내가 static으로 만들어줬기때문에 가능! - import도 필요없지!
  
  })

  // video.title = title;
  // video.description = description
  // video.hashtags= hashtags.split(",").map((word) => word.startWith('#') ? word : `#${word}`)
  // await video.save()

  // const { title } = req.body;    // urlencoded 필요!
  req.flash("success", "Changes saved")
  return res.redirect(`/videos/${id}`);
};


// export const upload = (req, res) => res.send("Upload");





export const getUpload = (req, res) => {
  return res.render("upload", {pageTitle:"Upload Video"})
}

/*
export const postUpload = async(req, res) => {
  // here we will add a videl to the videos array
  const { title , description, hashtags } = req.body;
  const video = new Video({
    title: title, 
    description: description,
    createdAt: Date.now(),
    hashtags: hashtags.split(",").map((word) => `#${word}`),
    meta: {
      views: 0,
      rating: 0,
    },
  });
  // DB에 저장 - await로 기다려주고 save메소드를 이용해서 db에 저장함(mongoose)
  await video.save();
  return res.redirect("/")
}
*/

export const postUpload = async(req, res) => {
  const { user:{ _id } } = req.session;
  
  const { video, thumb } = req.files;

  // here we will add a videl to the videos array
  const { title , description, hashtags } = req.body;
  // create 메소드를 이용하면 자바스크립트에서 자동으로 객체를 만들어줌
  try{
    const newVideo = await Video.create({
      title: title, 
      description: description,
      fileUrl: video[0].loaction,
      thumbUrl: thumb[0].loaction,
      owner: _id,
      // createdAt: Date.now(),
      // hashtags: hashtags.split(",").map((word) => word.startsWith('#') ? word : `#${word}`),
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();

    // DB에 저장 - await로 기다려주고 save메소드를 이용해서 db에 저장함(mongoose)
    return res.redirect("/")
    
  }
  catch(error){
    return res.status(400).render("upload", {pageTitle:"Upload Video", errorMessage: error._message,})
  }
}



export const deleteVideo = async(req, res) => {
  const { id } = req.params;
  const { user:{_id} } = req.session;
  const video = await Video.findById(id);
  
  if(!video){
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }

  if(String(video.owner) !== String(_id)){
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id)
  
  return res.redirect("/");
};



export const search = async(req, res) => {
  const { keyword } = req.query;
  
  let videos = [];
  if (keyword){
    videos = await Video.find({
      title: {
        $regex: new RegExp(`${keyword}$`, "i")  // 포함하면 검색이 되도록
      },
    }).populate("owner");
  }
  
  return res.render("search", {pageTitle:"Search", videos})
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  if(!video) {
    return res.sendStatus(400);
  } else {
    video.meta.views += 1;
    await video.save();
    return res.sendStatus(200);
  }
}



export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    owner_name: user.name,
    video: id,
  });
  // console.log(comment);
  // console.log(user)
  video.comments.push(comment._id);
  video.save();
  return res.status(201).json({ newCommentId: comment._id });
};

export const deleteComment = async (req, res) => {
  const { user:{_id} } = req.session;
  const {
    body: { videoId },
    params: { id },
  } = req;
  // console.log(_id)
  // console.log(videoId)
  // console.log(id)

  const commentOwner = await User.findById(_id);
  const video = await Video.findById(videoId);
  const comment = await Comment.findById(id)
  if (String(_id) !== String(comment.owner)) {
    return res.sendStatus(404);
  };

  commentOwner.comments.splice(commentOwner.comments.indexOf(id),1);
  commentOwner.save();
  video.comments.splice(video.comments.indexOf(id),1);
  video.save();

  await Comment.findByIdAndDelete(id)

  return res.status(201).json({ deleteCommentId: comment._id });
}