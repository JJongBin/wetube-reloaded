import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const multerUploader = multerS3({
  s3: s3,
  bucket: "jongbintube",
  acl: "public-read",
});




export const localsMiddleware = (req, res, next) => {
    
    // 현재 로그인된 유저를 알려준다
    res.locals.loggedIn = Boolean(req.session.loggedIn);    
    res.locals.siteName = "Wetube";
    res.locals.loggedInUser = req.session.user || {};
    // res.locals.loggedInUsername = req.session.username || {};
    // console.log(res.locals.loggedInUser)
    // console.log(res.locals)
    next();
}


// 로그인 하지 않은 유저가 edit-profile에 접근하는것을 막기 위해
export const protectorMiddleware = (req, res, next) => {
    if(req.session.loggedIn){
        next();
    }else{
        req.flash("error", "Not authorized")
        return res.redirect("/login");
    }
}

// 로그인한 유저가 로그인페이지로 이동하는것을 막기위해
export const publicOnlyMiddleware = (req, res, next) => {
    if(!req.session.loggedIn){
        next()
    } else {
        req.flash("error", "Not authorized")
        return res.redirect("/")
    }
};



export const avatarUpload = multer({ dest: "uploads/avatars/", linits:{
    fileSize: 3000000,
    }, 
    storage: multerUploader,
});      // 사용자가 보낼 파일을 uploads 폴더에 저장


export const videoUpload = multer({ dest: "uploads/videos/", linits:{
    fileSize: 10000000,
    }, 
    storage: multerUploader,
});