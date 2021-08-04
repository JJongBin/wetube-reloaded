import User from "../models/User";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async(req, res) => {
    // console.log(req.body);
    const { name, username, email, password, password2, location } = req.body;
    const pageTitle = "Join"

    // password 확인
    if (password !== password2) {
        return res.render("join", {pageTitle, errorMessage: "Password confirmation does not match."})
    }

    //user name, email 중복검사
    const usernameExists = await User.exists( { $or: [{username}, {email}] } );
    // $or -> 하나에 해당되더라도 or 과 같음
    if (usernameExists) {
        return res.render("join", {pageTitle, errorMessage: "This username/email is already taken."})
    }

    await User.create({
        name, 
        username, 
        email, 
        password, 
        location,
    }) 
    res.redirect("/login");
}

export const login = (req, res) => res.send("Login");

export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Delete User");
export const logout = (req, res) => res.send("Logout");
export const see = (req, res) => res.send("See User");


