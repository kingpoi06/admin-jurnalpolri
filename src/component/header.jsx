import React, { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import useAxios from "../useAxios";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditDataOpen, setIsEditDataOpen] = useState(false);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false); 
  const [namalengkap, setNamalengkap] = useState("");
  const navigate = useNavigate();
  const axiosInstance = useAxios();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          navigate("/");
          return;
        }

        if (accessToken) {
          const decoded = jwtDecode(accessToken);
          setNamalengkap(decoded.namalengkap);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching token:", error);
        navigate("/");
      }
    };

    fetchData();
  }, [axiosInstance, navigate]);

  // Menampilkan SweetAlert ketika data diedit
  const handleEditData = () => {
    Swal.fire({
      title: 'Data berhasil diubah!',
      icon: 'success',
      confirmButtonText: 'Tutup'
    });
    setIsEditDataOpen(false);
  };

  // Menampilkan pop-up profil
  const handleProfileClick = () => {
    setIsProfilePopupOpen(true);
  };

  // Menutup pop-up profil
  const closeProfilePopup = () => {
    setIsProfilePopupOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-[100%] z-40 flex items-center justify-between bg-indigo-600 text-white p-4 shadow-xl">
      {/* Search Bar */}
      <div className="flex justify-center items-center bg-white rounded-md w-1/3 mx-auto">
        {/* <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 bg-transparent text-black focus:outline-none"
        />
        <button className="px-4 text-black hover:text-black">
          <IoSearch />
        </button> */}
      </div>

      {/* Profil */}
      <div className="flex items-center space-x-4">
        <span className="text-sm">Hello, {namalengkap}</span>
        <div className="relative">
          <button
            className="flex items-center focus:outline-none"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <img
              src="/profil.jpg" // Menampilkan foto profil
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
          </button>

          {/* Dropdown Menu */}
          
        </div>
      </div>

      {/* Modal Edit Data */}
      {isEditDataOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-gray-300 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl text-black font-medium mb-4">Edit Data</h2>
            <div className="mb-4">
              <label className="block text-sm text-black font-secondary font-bold mb-1">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-2 border text-black border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold font-secondary text-black mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border text-black border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-error-700 rounded-md"
                onClick={() => setIsEditDataOpen(false)} // Close modal
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                onClick={handleEditData} // Handle edit data
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up Profil */}
      {isProfilePopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-medium mb-4">Profil Pengguna</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Nama</label>
              <p className="text-sm">Admin</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <p className="text-sm">admin@example.com</p>
            </div>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                onClick={closeProfilePopup} // Menutup pop-up
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
