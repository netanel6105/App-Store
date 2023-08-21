
const usersR = require("./users")
const categoriesR =require("./categories")
const gamesAppsR = require('./gamesApps')
const uploadR = require('./upload')

exports.routesInit = (app) =>{  
    
    app.use("/users",usersR);
    app.use("/categories", categoriesR);
    app.use("/gamesApps", gamesAppsR);
    app.use("/upload", uploadR);
  
    
    
    
    app.use("*",(req,res) => {
        res.status(404).json({msg:"endpoint not found , 404",error:404})
      })
}

