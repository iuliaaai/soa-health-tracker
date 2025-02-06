import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import Header from "auth_app/Header";
import Footer from "auth_app/Footer";
import Login from "auth_app/Login";
import Register from "auth_app/Register";
import { ProtectedRoute } from "auth_app/ProtectedRoute"
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Dashboard } from "./Dashboard";


const App = () => (
  <div>
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
         <Route element={<ProtectedRoute />}> 
            <Route path="/dashboard" element={<Dashboard />} /> 
        </Route>
    </Routes>
  </div>
)

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>, 
  document.getElementById("app")
);