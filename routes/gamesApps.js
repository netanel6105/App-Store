const express= require("express");
const { auth } = require("../middlewares/auth");
const {GamesAppsModel,validateJoi} = require("../models/gamesAppModel")
const {random} = require("lodash");
const router = express.Router();


//localhost:3001/gamesApps?cat=arcade
router.get("/", async (req, res) => {
   // Math.min -> מביא את המספר הקטן יותר מבין 2 המספרים של ה 20 ומספר העמוד
   let perPage = Math.min(req.query.perPage,20) || 5;
   let page = Number(req.query.page) || 1
   let sort = req.query.sort || "_id";
   let reverse = req.query.reverse == "yes" ? 1 : -1;
   let cat = req.query.cat;
   let userId = req.query.userId;
   //?search=
   let search = req.query.search;
    //localhost:3002/gamesApps/?search=go
    try {
      let findQuery = {};
      if(cat){
        findQuery = {category_url:cat}
      }
      else if(userId){
        // מחזיר רשימת אפליקציות/משחקים של אותו משתמש לפי האיי די שנשלח בקוארי סטרינג
        findQuery = {user_id:userId}
      }
      else if(search){
        let searchExp = new RegExp(search,"i");
        findQuery = {$or:[{name:searchExp},{info:searchExp}]}
        // findQuery = {name:searchExp};
      }
      let data = await GamesAppsModel
        .find(findQuery)
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




 //localhost:3001/gamesApps/single/63b14e328974ec3b2dcf69b3
  router.get("/single/:id", async(req,res) =>{
    try{
      let id = req.params.id;
      let data = await GamesAppsModel.findOne({_id:id});
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })



router.post("/groupApp", async(req,res)=>{
  try{
    let data = await GamesAppsModel.find({"_id":{$in:req.body.ids}}).limit(20)
    // let data = await GamesAppsModel.find({"_id":{$in:["63b14d7d8974ec3b2dcf69b1",
    // "63b14e328974ec3b2dcf69b3",
    // "63b14eb78974ec3b2dcf69b5"]}})
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})



router.post("/", auth , async(req,res) => {
    let validBody = validateJoi(req.body);
    if(validBody.error){
      return res.status(401).json(validBody.error.details)
    }
    try{
      let gameApp = new GamesAppsModel(req.body);
      gameApp.user_id = req.tokenData._id;
      gameApp.short_id= await createShortId();
      await gameApp.save();
      res.status(201).json(gameApp);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })





  
//localhost:3001/gamesApps/count?perPage=5&userId=63b13b6050267011bebf32c2
  //localhost:3001/gamesApps/count?perPage=2&cat=aciton
  //localhost:3001/gamesApps/count?perPage=2
// יחזיר את מספר הרשומות במערכת
// מה שיחסוף מפיינד רגיל המון משאבים מהמסד נתונים
router.get("/count", async(req,res) => {
  let perPage = Number(req.query.perPage) || 5;
  let cat = req.query.cat;
  let userId = req.query.userId;
  try{
    let findQuery = {};
    // בשביל צד לקוח שנעשה עמוד קטגוריה שנוכל לדעת לאותה קטגוריה כמה עמודים יש
    if(cat){
      findQuery = {category_url:cat}
    }
    else if(userId){
      // מחזיר רשימת אפליקציות/משחקים של אותו משתמש לפי האיי די שנשלח בקוארי סטרינג
      findQuery = {user_id:userId}
    }
    let count = await GamesAppsModel.countDocuments(findQuery);
    // מחזיר את מספר העמודים לפי פר פייג'
    let pages = Math.ceil(count/perPage);
    res.json({count, pages})

  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})
  

  router.put("/:id", auth, async (req, res) => {
    let validBody = validateJoi(req.body);
    // אם יש טעות יזהה מאפיין אירור בולידבאדי
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      let id = req.params.id;
      let data;
      if(req.tokenData.role == "admin"){
        data = await GamesAppsModel.updateOne({ _id: id}, req.body)
      }
      else{
        data = await GamesAppsModel.updateOne({ _id: id, user_id: req.tokenData._id }, req.body)
      }
      
      // modfiedCount : 1 - אם הצליח לערוך נקבל בצד לקוח בחזרה
      res.json(data);
    }
    catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  })
  
  
  router.delete("/:id", auth, async (req, res) => {
    try {
      let id = req.params.id;
      let data;
      if(req.tokenData.role == "admin"){
        data = await GamesAppsModel.deleteOne({ _id: id})
      }
      else{
        data = await GamesAppsModel.deleteOne({ _id: id, user_id: req.tokenData._id });
      }
      
      // deletedCount : 1 - אם הצליח לערוך נקבל בצד לקוח בחזרה
      res.json(data);
    }
    catch (err) {
      console.log(err)
      res.status(500).json(err)
    }
  })

// async -> פונקציה שעושה רטרן והיא אסינכרונית אוטומטית
// מחזירה פרומיס
const createShortId = async() => {
  try{
    while(true){
      // מייצר מספר רנדומלי
      let rnd = random(0,9999);
      // בודק אם הוא כבר קיים באחד מהרשומות
      let game = await GamesAppsModel.findOne({short_id:rnd});
      // אם גיים הוא שקר זה אומר שהמספר ייחודי ואותו נחזיר
      if(!game) { return rnd}
    }
  }
  catch(err){
    return err
  }
}


module.exports = router;