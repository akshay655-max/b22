const express=require("express");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const cors=require("cors")
const {connection}=require("./config/db")
const {UserModel}=require("./models/User.model")
const {noteRouter}=require("./routes/notes.router")
const {authenticate}=require("./middleware/authenticate.middleware")

const PORT=8500;

const app=express();

app.use(express.json());
app.use(cors({
    origin:"*"
}))

app.get("/",(req,res)=>{
    res.send("welcome to home page");
})


app.post("/signup",async(req,res)=>{ 
       const {email,password,name,age}=req.body;
       const userPresent=await UserModel.findOne({email}); //findOne function gives empty object if matched document is not there.if it is not found it would gives empty object and it is truthy value;
       if(userPresent?.email){
           res.send("Try loggin in ,already exist");
       }else{
      
        try{
            bcrypt.hash(password, 4,async function(err, hash) {
                // Store hash in your password DB.
                const newUser=new UserModel({email,password:hash,name,age}); //or insertOne we can use
                await newUser.save();
                res.send({"msg":"signup successfully"});
            });
           
        }catch(err){
             res.send("something went wrong,pls try again later")
        }

       }
   
})

app.post("/login",async(req,res)=>{
    const{email,password}=req.body;
    try{
        const user=await UserModel.find({email});
        if(user.length>0){
            const hashed_password=user[0].password;
            bcrypt.compare(password, hashed_password, function(err, result) {
                // result == true
                if(result){
                    var token = jwt.sign({ user_ID: user[0]._id }, 'shhhhh');
                    res.send({"msg":"login successfully","token":token});
                }else{
                    res.send("login faild")
                }
            });
            
        }else{
            res.send("login failed")
        }
    }catch(err){
      console.log(err);
      res.send("something went wrong,pls try again later")
    }
})

app.use(authenticate);
app.use("/notes",noteRouter);




app.listen(PORT,async()=>{
    try{
        await connection;
        console.log("connecting db successfully")

    }catch(err){
        console.log("error in connecting db")
        console.log(err)
    }
    console.log(`connected to port on ${PORT}`)
})