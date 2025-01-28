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
    {/* <Header />
    <div class="text-center">
      <img
        src="https://mdbcdn.b-cdn.net/img/new/avatars/8.webp"
        class="rounded-full w-32 mb-4 mx-auto"
        alt="Avatar"
      />
      <h5 class="text-xl font-medium leading-tight mb-2">John Doe</h5>
      <p class="text-gray-500">Web designer</p>
      <Login />
    </div>
    <Footer /> */}

    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
         <Route element={<ProtectedRoute />}> 
            <Route path="/dashboard" element={<Dashboard />} /> 
            {/* <div> Dashboard </div> */}
        </Route>
    </Routes>
  </div>
)

// ReactDOM.render(<App />, document.getElementById("app"));
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>, 
  document.getElementById("app")
);