const express= require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");// can remove

const { validteUser, UserModel, validteLogin, createToken } = require("../models/userModel");
const { auth, authAdmin } = require("../middlewares/auth");
const router = express.Router();


router.get("/", async(req,res) => {
  res.json({msg:"Users work"});
})


router.get("/checkToken",auth , async(req,res) => {
  res.json(req.tokenData);
})




// auth -> פונקציית MIDDLEWARE
router.get("/myInfo",auth ,async(req,res) => {
  try{
    let data = await UserModel.findOne({_id:req.tokenData._id}, {password:0})
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json(err);
  }
})






router.get("/myUser",  async(req,res) => {
  // req.query , req.params, req.body , req.header
  let token = req.header("x-api-key");
 
  if(!token){
    return res.status(401).json({msg:"You must send to here token"})
  }
  try{
    // עושה ההפך מקידוד , ומתרגם את המידע שעל הטוקן 
    // למידע שניתן להשתמש בו למשל האיי די של המשתמש
    let decodeToken = jwt.verify(token,"monkeysSecret");

    // password:0 -> יחזיר את כל המאפיינים מלבד הסיסמא
    let data = await UserModel.findOne({_id:decodeToken._id},{password:0})
    res.json(data)
  }
  catch(err){
    res.json({msg:"Token invalid or expired"})
  }
})







router.get("/allUsers", authAdmin, async (req, res) => {

  let perPage = Number(req.query.perPage) || 5;
  let page = Number(req.query.page) || 1
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;

  try {
    let data = await UserModel
      .find({},{password:0})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})







// הרשמה של משתמש חדש
router.post("/", async(req,res) => {
  let validBody = validteUser(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let user = new UserModel(req.body);
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();

    user.password = "*****";
    res.status(201).json(user)
  }


  catch(err){
    if(err.code == 11000){
      return res.status(401).json({msg:"Email already in system, try log in",code:11000})
    }

    //TODO: check if the error is becuase duplicate email
    console.log(err);
    res.status(500).json(err);
  }
})






router.post("/login", async(req,res) => {
  let validBody = validteLogin(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }

  
  try{
    // לבדוק אם מייל קייים בכלל במערכת
    let user = await UserModel.findOne({email:req.body.email})
    if(!user){
      return res.status(401).json({msg:"User or password not match , code:1"})
    }
    // שהסיסמא שהגיעה מהבאדי בצד לוקח תואמת לסיסמא המוצפנת במסד
    let passordValid = await bcrypt.compare(req.body.password,user.password)
    if(!passordValid){
     return res.status(401).json({msg:"User or password not match , code:2"})
    }
    let token = createToken(user._id, user.role);
    res.json({token:token})
  }
  catch(err){
    console.log(err);
    res.status(500).json(err);
  }
})

router.patch("/updateSearch",auth , async(req,res) => {
  const search_ar = req.body.search_ar || [];
  try{
    if(search_ar.length == 0 || search_ar.length > 20){
      return res.status(400).json({err:"You must send array of search_ar with min 1 cell and max 20 cells "})
    }
    // TODO: check if the cell string is less than 30 chars , 
    const data = await UserModel.updateOne({_id:req.tokenData._id},{last_search_ar:search_ar});
    res.json(data);
  } 
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})




//users/role?user_id=638c5b67dce9dff65c022295&role=admin
// ?user_id= &role=
// משנה תפקיד של משתמש
router.patch("/role/", authAdmin, async(req,res) => {
  try{
    // ישנה את הרול של המשתמש שבקווארי של היוזר איי די
    // לערך שנמצא בקווארי של רול
    let user_id = req.query.user_id;
    let role = req.query.role;
    // לא מאפשר למשתמש עצמו לשנות את התפקיד שלו
    // או לשנות את הסופר אדמין
    if(user_id == req.tokenData._id || user_id == "63b13b2750267011bebf32be"){
      return res.status(401).json({msg:"You try to change yourself or the superadmin , anyway you are stupid!"})
    }
    let data = await UserModel.updateOne({_id:user_id},{role})
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})





module.exports = router;