const express=require("express");
const router=express.Router();
const postController=require("../controllers/postController");

router.post('/newPost',postController.createPost);

module.exports=router;