import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import { ToastContainer } from "react-toastify";

import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { AdminHeader } from "./components/adminHeader";
import HeaderClient from "./client_comps/misc/headerClient";
import { adminRoutes, ClientRoutes } from "./routesPath/routesPath";
import Page404 from "./comps_general/page404";
import Footer from "./client_comps/misc/footer";

import { MyContext } from "./context/myContext";
import { useEffect, useState } from "react";
import { API_URL, doApiGet, TOKEN_KEY } from "./services/apiServices";
import TestScroll from "./test_comps/testScroll";


function App() {

  const [userInfo , setUserInfo] = useState({});

  useEffect(() => {
    doUserApi()
  },[])

  const doUserApi = async() => {
    if(localStorage[TOKEN_KEY]){
      try{
        const url = API_URL+"/users/myInfo";
        const resp = await doApiGet(url); 
        setUserInfo(resp);
        console.log(resp);
      }
      catch(err){
        console.log(err);
        localStorage.removeItem(TOKEN_KEY);
      }
    }
  }
  return (

    <MyContext.Provider value={{userInfo, doUserApi ,setUserInfo}}>
    <BrowserRouter>

      <Routes>
        <Route path="/admin/*" element={<AdminHeader />} />
        <Route path="/*" element={<HeaderClient />} />
      </Routes>
      <main>
      <Routes>
        {/* http://localhost:3000/category/action */}
        {/* client */}
          {ClientRoutes()}
          <Route path="/scroll" element={<TestScroll />} />
        {/* <Route path="/" element={<Home />} />
        <Route path="/category/:catName" element={<PageGamesList />} />
        <Route path="/info/:id" element={<GameInfo />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/userGameList" element={<UserGamesAddedList />} />
        <Route path="/userGameList/add" element={<AddGame />} />
        <Route path="/userGameList/edit/:id" element={<EditGames />} /> */}



        {/* admin */}
        {adminRoutes()}
        {/* <Route path="/admin" element={<LoginAdmin />} />
        <Route path="/admin/categories" element={<CategoriesList />} />
        <Route path="/admin/categories/edit/:id" element={<EditCategory />} />
        <Route path="/admin/categories/new" element={<AddCategory />} />
        <Route path="/admin/apps" element={<AppsListAdmin />} />
        <Route path="/admin/users" element={<UsersList />} /> */}


        <Route path="/*" element={<Page404/>}/>
      </Routes>
      </main>

      <ToastContainer theme="colored" position="top-left" />

        <Footer/>
    </BrowserRouter>
    </MyContext.Provider>

  );
}

export default App;
