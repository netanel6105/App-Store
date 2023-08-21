import React from "react"
import { Route } from "react-router-dom"
import GameInfo from "../client_comps/gameInfo/gameInfo"
import Home from "../client_comps/home"
import FavsGameList from "../client_comps/pagesGamesList/favsGameList"
import PageGamesList from "../client_comps/pagesGamesList/pageGamesList"
import SearchGamesList from "../client_comps/pagesGamesList/searchGameList"
import AddGame from "../client_comps/userPages/addGame"
import EditGames from "../client_comps/userPages/editGames"
import LogIn from "../client_comps/userPages/logIn"
import SignUp from "../client_comps/userPages/signUp"
import UserGamesAddedList from "../client_comps/userPages/userGamesAddedList"
import { AddCategory } from "../components/addCategory"
import { AppsListAdmin } from "../components/appsListAdmin"
import { CategoriesList } from "../components/categoriesList"
import { EditCategory } from "../components/editCategory"
import { LoginAdmin } from "../components/loginAdmin"
import TestUpload from "../components/testUpload"
import { UsersList } from "../components/usersList"

export const ClientRoutes = () => {
  return(
    <React.Fragment>
         <Route path="/" element={<Home />} />
        <Route path="/category/:catName" element={<PageGamesList />} />
        <Route path="/info/:id" element={<GameInfo />} />
        <Route path="/favs" element={<FavsGameList />} />
        <Route path="/search" element={<SearchGamesList />} />


        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/userGameList" element={<UserGamesAddedList />} />
        <Route path="/userGameList/add" element={<AddGame />} />
        <Route path="/userGameList/edit/:id" element={<EditGames />} />

    </React.Fragment>
  )
}


export const adminRoutes = () => {
    return(
      <React.Fragment>
       <Route path="/admin" element={<LoginAdmin />} />
        <Route path="/admin/categories" element={<CategoriesList />} />
        <Route path="/admin/categories/edit/:id" element={<EditCategory />} />
        <Route path="/admin/categories/new" element={<AddCategory />} />
        <Route path="/admin/apps" element={<AppsListAdmin />} />
        <Route path="/admin/users" element={<UsersList />} />
        <Route path="/admin/test" element={<TestUpload />} />

      </React.Fragment>
    )
  }