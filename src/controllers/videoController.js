export const fakeUser = {
  username: "jongbin",
  loggedIn: true
}


export const trending = (req, res) => {
    const videos = [
      {
        title: "First Video",
        rating: 5, 
        comments: 2,
        created: "2 minutes ago",
        view: 59,
        id: 1
      },
      {
        title: "Second Video",
        rating: 5, 
        comments: 2,
        created: "2 minutes ago",
        view: 59,
        id: 1
      },
      {
        title: "Third Video",
        rating: 5, 
        comments: 2,
        created: "2 minutes ago",
        view: 59,
        id: 1
      }
    ]
      
    res.render("home", {pageTitle: "Home", fakeUser: fakeUser, videos});
}


export const see = (req, res) => {
    res.render("Watch", {pageTitle: "Watch"});   
}
export const edit = (req, res) => {
    res.render("edit", {pageTitle: "Edit"});
}


export const search = (req, res) => res.send("Search Videos");

export const upload = (req, res) => res.send("Upload");
export const deleteVideo = (req, res) => res.send("Delete Video");










