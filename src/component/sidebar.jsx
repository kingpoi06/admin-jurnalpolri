import React, { useState, useEffect } from "react";
import { FaTachometerAlt, FaFolder, FaNewspaper, FaSignOutAlt, FaCamera, FaPhotoVideo, FaUserShield } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import useAxios from "../useAxios"
import useClearTokensOnUnload from "../useClearTokensOnUnload";
import Swal from "sweetalert2";


export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isGalleryDropdownOpen, setIsGalleryDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
    const axiosInstance = useAxios();
    useClearTokensOnUnload();


  useEffect(() => {
    const savedIsOpen = localStorage.getItem("sidebar-isOpen");
    if (savedIsOpen !== null) {
      setIsOpen(JSON.parse(savedIsOpen));
    }

    // Untuk dropdown Galeri
    if (location.pathname === "/foto" || location.pathname === "/video") {
      setIsGalleryDropdownOpen(true);
    } else {
      setIsGalleryDropdownOpen(false);
    }
  }, [location]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    localStorage.setItem("sidebar-isOpen", JSON.stringify(!isOpen));
  };

  const toggleGalleryDropdown = () => setIsGalleryDropdownOpen(prev => !prev);

  const navigateTo = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    
    // SweetAlert confirmation
    const result = await Swal.fire({
      title: "Apakah anda yakin?",
      text: "Anda akan keluar dari Admin Geoheritage!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Keluar!",
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosInstance.delete("/logout");

        if (response.status === 200) {
          localStorage.removeItem("accessToken");
          navigate("/");
        }
      } catch (error) {
        console.error("Failed to logout", error);
      }
    }
  };

  return (
    <div className={`flex flex-col ${isOpen ? "w-52" : "w-20"} h-screen bg-indigo-600 text-white shadow-xl transition-none`}>
      {/* Title / Admin Icon */}
      <div className="flex items-center justify-center mt-4 mb-8 cursor-pointer" onClick={toggleSidebar}>
      <FaUserShield className="text-2xl" />
        {isOpen && <h2 className="text-2xl font-bold font-primary ml-2">ADMIN</h2>}
      </div>

      {/* Sidebar Menu */}
      <div className="space-y-4 flex-1">
        <div className="hover:bg-gray-700 p-2 mx-3 rounded-md flex items-center space-x-2 cursor-pointer" onClick={() => navigateTo("/")}>
          <FaTachometerAlt className="text-xl" />
          {isOpen && <span className="font-medium font-primary">Dashboard</span>}
        </div>

        <div className="hover:bg-gray-700 p-2 mx-3 rounded-md flex items-center space-x-2 cursor-pointer" onClick={() => navigateTo("/news")}>
          <FaNewspaper className="text-xl" />
          {isOpen && <span className="font-medium font-primary">Berita</span>}
        </div>

        {/* Logout */}
        <div className="hover:bg-gray-700 p-2 mx-3 rounded-md flex items-center space-x-2 cursor-pointer" onClick={handleLogout}>
          <FaSignOutAlt className="text-xl" />
          {isOpen && <span className="font-medium font-primary">Logout</span>}
        </div>
      </div>
    </div>
  );
}
