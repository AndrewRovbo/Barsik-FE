import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserList from './components/UserList';

import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import Profile from "./pages/Profile";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/log-in" element={<LogIn />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<h2>Page not found</h2>} />
                </Routes>

                {/* <UserList /> */}
            </div>
        </BrowserRouter>
    );
}

export default App;
