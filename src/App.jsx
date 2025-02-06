import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Login from "./views/loginpage/index";
import News from "./admin/news";

import Dashboard from"./admin/dashboard";
import AddNews from "./admin/post/addNews";

import EditNews from "./admin/update/editNews";


function App() {
  return (
    <Router>
      <Routes>
        {/* Login */}
        
        <Route path="/" element={<Login />} />
        {/* Fitur */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/news" element={<News />} />
        <Route path="/addnews" element={<AddNews />} />
        <Route path="/editnews" element={<EditNews />} />

      </Routes>
    </Router>
  );
}

export default App;
