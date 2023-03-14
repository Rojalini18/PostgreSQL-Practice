import React from "react";
import { Route, Routes } from "react-router-dom";
import { Navbar } from "../Components/Navbar";
import { Class } from "../Components/Class";
import { Students } from "../Components/Students";
import { Teachers } from "../Components/Teachers";
import { Attendance } from "../Components/Attendance";
import Home from "../Components/Home";

const AllRoutes = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/class" element={<Class />} />
        <Route path="/students" element={<Students />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
    </div>
  );
};

export default AllRoutes;
