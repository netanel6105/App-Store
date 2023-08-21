import React from 'react'
import CategoriesClientList from './home/categoriesClientList'
import NewGamesList from './home/newGamesList'
import Strip from './home/strip'
import './home/home.css'

const Home = () => {

  return (
   <React.Fragment>

    <Strip/>

    <main className='container'>
    <CategoriesClientList/>
    <NewGamesList/>
    </main>


   </React.Fragment>
  )
}

export default Home