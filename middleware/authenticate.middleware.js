const jwt=require("jsonwebtoken");
const authenticate=(req,res,next)=>{
    console.log(req.headers);
 const token=req.headers?.authorization?.split(" ")[1];
 try{
     if(token){   //token is present and correct
        jwt.verify(token, 'shhhhh', function(err, decoded) {
            if(decoded){
               const userID=decoded.user_ID;
                req.body.userID=userID;
                next();
            }else{
                res.send("please login")
            } 
    
          });
     }else{
         res.send("please login")
     }
   

 }catch(err){
     res.send("something went wrong")
 }


}
module.exports={authenticate}