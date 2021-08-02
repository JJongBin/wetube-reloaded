import Video from "../models/video"
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
    const videos = await Video.find({}); 
    return res.render("home", {pageTitle: "Home", videos});
  }
  catch{
    return res.render("server-error")
  }
}

export const watch = async(req, res) => {
  const { id } = req.params;  //ES6
  const video = await Video.findById(id)

  return res.render("Watch", {pageTitle: video.title, video: video});   
}
export const getEdit = (req, res) => {

  const { id } = req.params;  
  
  return res.render("edit", {pageTitle: `Editing`});
}
export const postEdit = (req, res) => {
  const { id } = req.params;  
  const { title } = req.body;    // urlencoded 필요!
  console.log("postEdit ->",title);
  return res.redirect(`/videos/${id}`);
};


export const search = (req, res) => res.send("Search Videos");
export const upload = (req, res) => res.send("Upload");
export const deleteVideo = (req, res) => res.send("Delete Video");


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
  // here we will add a videl to the videos array
  const { title , description, hashtags } = req.body;
  // create 메소드를 이용하면 자바스크립트에서 자동으로 객체를 만들어줌
  try{
    await Video.create({
      title: title, 
      description: description,
      // createdAt: Date.now(),
      hashtags: hashtags.split(",").map((word) => `#${word}`),
      
    });
    // DB에 저장 - await로 기다려주고 save메소드를 이용해서 db에 저장함(mongoose)
    return res.redirect("/")
    
  }
  catch(error){
    return res.render("upload", {pageTitle:"Upload Video", errorMessage: error._message,})
  }
}









