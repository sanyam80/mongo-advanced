const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const connectDB = ()=>{
    mongoose.connect("mongodb://localhost:27017/abc");
}
const userSchema = new mongoose.Schema({
    firstName :{type:String, required:true},
    lastName :{type:String, required:false},
    email :{type:String, required:true, unique:false},
    password:{type:String, required:true}
   });
const user = mongoose.model("students", userSchema)
const postSchema = new mongoose.Schema(
    {
        title:{type:String, required:true},
        body:{type:String, required:true},
        userid:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"students",
            required:"true"
        }
    },
    {
    timestamps:true
}
);
const Post = mongoose.model("post",postSchema);

const commentSchema = new mongoose.Schema(
    {
    body:{type:String, required:true},
    postId:{type:mongoose.Schema.Types.ObjectId,ref:"post",required:true},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"students",required:true}
},
    {timestamps:true}

 
);
const Comment = mongoose.model("comment",commentSchema);

app.post("/students",async(req,res)=>{
 try{
     const user1 = await user.create(req.body);
     return res.send({"user":user1})
 }
 catch{
     
     return res.send("something went wrong");
 }
})



app.get("/students",async(req,res) =>{

    const User = await user.find().lean().exec()
    return res.send({"users":User})


})


app.post("/Posts",async(req,res)=>{
    try{
        const posts = await Post.create(req.body);
        return res.send({"user":posts})
    }
    catch{
        console.log("something went wrong")
        return res.send("something went wrong");
    }
   })
   
   
   
  app.get("/Posts",async(req,res) =>{
   
       const post = await Post.find().populate({path:"userid",select:{firstName:1, _id:0}}).lean().exec()
       return res.send({"users":post})
   
   
    });
    app.patch("/Posts/:id",async(req,res) =>{
   
        const post = await Post.findByIdAndUpdate(req.params.id,req.body,{new:true}).lean().exec()
        return res.send({"users":post})
    
    
     });
     app.delete("/students/:id",async(req,res) =>{
   
        const post = await user.findByIdAndDelete(req.params.id).lean().exec()
        return res.send({"users":post})
    
    
     });

     
app.post("/Comment",async(req,res)=>{
    try{
        const posts = await Comment.create(req.body);
        return res.send({"user":posts})
    }
    catch{
        
        return res.send("something went wrong");
    }
   })
   
   
   
  app.get("/Comment",async(req,res) =>{
   
       const post = await Comment.find().lean().exec()
       return res.send({"users":post})
   
   
    });

   







app.listen(5500,async()=>{
    try{
        await connectDB();
    }
    catch{
        console.log("something went wrong")
    }
    console.log("Listening on port 5500")
})