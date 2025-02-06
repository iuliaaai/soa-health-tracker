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
    <Footer />
  </div>
);

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>, 
  document.getElementById("app")
);
