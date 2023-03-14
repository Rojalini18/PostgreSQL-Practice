import React from "react";
import { Route, Routes } from "react-router-dom";
import { Navbar } from "../Components/Navbar";
import { Students } from "../Components/Students";
import Home from "../Components/Home";

const AllRoutes = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/students" element={<Students />} />
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
    </div>
  );
};

export default AllRoutes;
