import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import Header from "./Header"
import Footer from "./Footer";
import Login from "./Login";
import { Register } from "./Register";
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

const App = () => (
  <div className="text-3xl mx-auto max-w-6xl">
    {/* <Header /> */}
    {/* <div className="my-10">
      Home page Content
    </div> */}
    {/* <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Footer />} /> */}
            {/* <div> Dashboard </div> */}
        {/* </Route>
    </Routes> */}
    
    <Footer />
  </div>
);

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>, 
  document.getElementById("app")
);
