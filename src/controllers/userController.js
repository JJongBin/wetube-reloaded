import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async(req, res) => {
    // console.log(req.body);
    const { name, username, email, password, password2, location } = req.body;
    const pageTitle = "Join"

    // password 확인
    if (password !== password2) {
        return res.status(400).render("join", {pageTitle, errorMessage: "Password confirmation does not match."})
    }

    //user name, email 중복검사
    const usernameExists = await User.exists( { $or: [{username}, {email}] } );
    // $or -> 하나에 해당되더라도 or 과 같음
    if (usernameExists) {
        return res.status(400).render("join", {pageTitle, errorMessage: "This username/email is already taken."})
    }
    
    try{
        await User.create({
            name, 
            username, 
            email, 
            password, 
            location,
        }) 
        res.redirect("/login");
      }
      catch(error){
        return res.status(400).render("join", {pageTitle:"Upload Video", errorMessage: error._message,})
      }


}


export const getLogin = (req, res) => {
    res.render("login", {pageTitle:"Login", })
}

export const postLogin = async(req, res) => {
    const { username, password } = req.body;
    const pageTitle = "Login"
    const user = await User.findOne({ username, socialOnly: false });

    if(!user){
        res.status(400).render("login", {pageTitle, errorMessage:"An account with this username does not exists."})
        
    }
    const ok = await bcrypt.compare(password, user.password);
    if(!ok){
        res.status(400).render("login", {
            pageTitle, 
            errorMessage:"Wrong password",
        })
    }
    req.session.loggedIn = true;
    req.session.user = user;
    
    return res.redirect("/")
}


export const startGithubLogin = (req, res) => {
    const baseUrl = `https://github.com/login/oauth/authorize`;
    const config = {
        // client_id: "78539b05882ca563de77",
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email"
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    console.log(finalUrl);
    return res.redirect(finalUrl)
}

export const finishGithubLogin = async(req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token"
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code
    }
    console.log(config)

    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;


    const tokenRequest = await (
        await fetch(finalUrl, {
            method:"POST",
            headers: {
                Accept: "application/json"
            }
        })
    ).json();
    // console.log(tokenRequest);
    // res.render(JSON.stringify(json));

    if("access_token" in tokenRequest){
        const { access_token } = tokenRequest;
        // console.log(access_token)
        
        const apiUrl = "https://api.github.com"
        
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`,
                }
            })
        ).json();

        console.log(userData);
        
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`,
                }
            })
        ).json();
            
        console.log(emailData);

        const emailObject = emailData.find(
            (email) => email.primary ===true && email.verified === true     // github에서 준 email 리스트에서 primary이고, verified인것을 찾는다(존재여부)
        );
        console.log(emailObject.email)

        if(!emailObject){     // 없으면 로그인 페이지로 이동
            return res.redirect("/login")
        }
        let user = await User.findOne({email: emailObject.email});    // 있으면 
        console.log(user)
        if(!user){
            // create an account  없으면 계정 생성하도록
            user = await User.create({
                avataUrl: userData.avatar_url,
                name: userData.name, 
                username: userData.login, 
                email: emailObject.email, 
                password: "", 
                socialOnly: true,
                location: userData.location,
            });
        } 
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/")

    }else{
        return res.redirect("/login");
    }
}


export const logout = (req, res) => {
    req.session.destroy();  // 세션을 없앰
    res.redirect("/");
}



export const edit = (req, res) => res.send("Edit User");
export const see = (req, res) => res.send("See User");


