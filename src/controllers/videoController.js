export const fakeUser = {
  username: "jongbin",
  loggedIn: true
}


let videos = [
  {
    title: "First Video",
    rating: 5, 
    comments: 2,
    created: "2 minutes ago",
    view: 1,
    id: 1
  },
  {
    title: "Second Video",
    rating: 5, 
    comments: 2,
    created: "2 minutes ago",
    view: 59,
    id: 2
  },
  {
    title: "Third Video",
    rating: 5, 
    comments: 2,
    created: "2 minutes ago",
    view: 59,
    id: 3
  }
]
export const trending = (req, res) => {
      
    return res.render("home", {pageTitle: "Home", fakeUser: fakeUser, videos});
}


export const watch = (req, res) => {
  const { id } = req.params;  //ES6
  // const id = req.params.id

  const video = videos[id-1];

  return res.render("Watch", {pageTitle: `Watching ${video.title}`, fakeUser, video});   
}
export const getEdit = (req, res) => {

  const { id } = req.params;  
  const video = videos[id-1];
  
  return res.render("edit", {pageTitle: `Editing ${video.title}`, video});
}
export const postEdit = (req, res) => {
  const { id } = req.params;  
  const { title } = req.body;    // urlencoded 필요!
  console.log("postEdit ->",title);
  videos[id-1].title = title;
  return res.redirect(`/videos/${id}`);
};


export const search = (req, res) => res.send("Search Videos");
export const upload = (req, res) => res.send("Upload");
export const deleteVideo = (req, res) => res.send("Delete Video");


export const getUpload = (req, res) => {
  return res.render("upload", {pageTitle:"Upload Video", videos})
}
export const postUpload = (req, res) => {
  // here we will add a videl to the videos array
  console.log(req.body);
  const { title } = req.body;
  const newVideo = {
    title: title,
    rating: 0, 
    comments: 0,
    created: "just now",
    view: 0,
    id: videos.length + 1
  };
  videos.push(newVideo);
  return res.redirect("/")
}









