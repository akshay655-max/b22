const express=require("express");
const res = require("express/lib/response");
const {NoteModel}=require("../models/note.model")

const noteRouter=express.Router();

noteRouter.get("/",async(req,res)=>{
    const noteAll=await NoteModel.find();
    res.send(noteAll);
})

//protected route so we need authentication for that.so we create authenticate middleware to check.
noteRouter.post("/createnote",async(req,res)=>{
     const{note,title,userID}=req.body;
    const notes=new NoteModel({title,note,userID}); //inserOne can also be used
     await notes.save()
    res.send({"msg":"note created successfully"});
})

noteRouter.patch("/editnote/:noteID",async(req,res)=>{
    const userID=req.body.userID;
    const ID=req.params.noteID;
    const payload=req.body;

    const note=await NoteModel.findOne({_id:ID}); //db.notes.findone
    if(userID===note.userID){
       await NoteModel.findByIdAndUpdate({_id:ID},payload);
       res.send({"msg":"data updated successfully"});
    }else{
        res.send("you are not authorised");
    }
  
})

noteRouter.delete("/deletenote/:noteID",async(req,res)=>{
    const userID=req.body.userID;
    const ID=req.params.noteID;
    console.log(ID)
    const note=await NoteModel.findOne({_id:ID})
    console.log("note",note);
    if(userID===note.userID){
        await NoteModel.findByIdAndDelete({_id:ID});
       res.send({"msg":"data deleted succcessfully"})
    }else{
        res.send({"msg":"you are not authorised"})
    }
   
})



module.exports={noteRouter}