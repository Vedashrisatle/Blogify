const JWT=require("jsonwebtoken");
const secret="$uperMan@123";

function createTokenforUser(user){
    const payload={
        _id:user._id,
        fullname:user.fullname,
        email:user.email,
        profileImageURL:user.profileImageURL,
        role:user.role,
    };
    const token=JWT.sign(payload,secret);
    return token;
}
async function validateToken(token){
    const payload=await JWT.verify(token,secret);
    return payload;

}

module.exports={
    createTokenforUser,validateToken
}