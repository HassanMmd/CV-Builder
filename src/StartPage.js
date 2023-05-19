import "./StartPage.css"
import React from "react";
import Header from "./Header"
import NavBar from "./NavBar";
import Footer from "./Footer";
import { BrowserRouter } from "react-router-dom";

function StartPage() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <NavBar />
        <Footer/>
      </BrowserRouter>
    </div>
  )

}

export default StartPage;