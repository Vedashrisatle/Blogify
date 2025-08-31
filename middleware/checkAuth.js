const { createTokenforUser,validateToken}=require("../service/authentication");

function checkAuth(cookiename){
   return (req,res,next)=>{
    const tokenCookievalue = req.cookies[cookiename];
    if(!tokenCookievalue){
        next();
    }
    else{
        try{
            const userpayload=validateToken(tokenCookievalue);
            req.user=userpayload;
        }catch(error){
            res.clearCookie(cookiename);
            req.user = null;
        }
        next();
    }

    };
}

module.exports={checkAuth}

