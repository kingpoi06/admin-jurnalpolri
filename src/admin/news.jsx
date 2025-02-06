import React, { useState, useEffect } from "react";
import Sidebar from "../component/sidebar";
import Header from "../component/header";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
// import { v4 as uuidv4 } from "uuid"; // Import UUID
// import NewsModal from "./NewsModal"; // Import NewsModal component
// import Popupnews from "../component/popupnews";
import useAxios from "../useAxios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import closeModal from "../component/DeleteNews"

export default function News() {
  const axiosInstance = useAxios();
  const [token, setToken] = useState("");
  const [namalengkap, setNamalengkap] = useState("");
  const navigate = useNavigate();
  const [newsData, setNewsData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

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

  useEffect(() => {
    const getNews = async () => {
      try {
        const response = await axiosInstance.get("/news", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        setNewsData(data);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };
      getNews();
  }, [axiosInstance,  token]);

  

  // const handleSaveEdit = () => {
  //   if (!currentNews.author || !currentNews.title || !currentNews.content) {
  //     Swal.fire("Kesalahan", "Harap isi semua kolom", "kesalahan");
  //     return;
  //   }
  //   setNewsData((prevData) =>
  //     prevData.map((news) => (news.id === currentNews.id ? currentNews : news))
  //   );
  //   setIsModalOpen(false);
  // };

  const handleEdit = (news) => {
    localStorage.setItem("newsToEdit", JSON.stringify(news));
    navigate("/editnews");
  };

  const handleAddNews = () => {
    navigate("/addnews")
  };

  const handleDelete = async (id) => {
    try {
      // Konfirmasi sebelum menghapus
      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Berita yang dihapus tidak dapat dikembalikan!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, hapus!",
      });
      if (result.isConfirmed) {
        // Hapus data dari server
        await axiosInstance.delete(`/news/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // Perbarui state setelah berhasil dihapus
        setNewsData((prevNews) => prevNews.filter((news) => news.id !== id));
  
        Swal.fire("Dihapus!", "Berita berhasil dihapus.", "success");
      }
    } catch (error) {
      console.error("Error deleting news:", error);
      Swal.fire("Kesalahan!", "Gagal menghapus berita.", "error");
    }
  };



  return (
    <>
      <div className="bg-gray-100 min-h-screen w-full overflow-x-hidden">
        <div className="fixed z-50 w-64 h-full">
          <Sidebar />
        </div>

        <div className="ml-56">
          <Header />
          <div className="pt-24 px-4">
            <div className="flex justify-between items-center">
              <h2 className="font-medium font-primary text-gray-500 pt-2 text-2xl">
                Berita
              </h2>
              <button
                onClick={handleAddNews}
                className="bg-success-500 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center"
              >
                <FaPlus className="mr-2" /> Tambah Berita
              </button>
            </div>

            <div className="mt-4 mb-4">
              <div className="bg-white p-4 w-full shadow-xl">
                <table className="w-full table-auto rounded-lg">
                  <thead>
                    <tr className="bg-indigo-600 text-white text-left">
                      <th className="px-4 py-2">No</th>
                      <th className="px-4 py-2">Nama</th>
                      <th className="px-4 py-2">Tanggal Rilis</th>
                      <th className="px-4 py-2">Kategori</th>
                      <th className="px-4 py-2">Tag</th>
                      <th className="px-4 py-2">Judul</th>
                      <th className="px-4 py-2">Gambar Berita</th>
                      <th className="px-4 py-2 flex justify-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newsData.map((news, index) => (
                      <tr key={news.id} className="border-b">
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">{news.author}</td>
                        <td className="px-4 py-2">{formatDate(news.createdAt)}</td>
                        <td className="px-4 py-2">{news.kategori}</td>
                        <td className="px-4 py-2">{news.tags}</td>
                        <td className="px-4 py-2">{news.title}</td>
                        <td className="px-4 py-2">
                          <img src={news.image} alt="thumbnail" className="h-16" />
                        </td>
                        <td className="px-4 py-2 flex justify-center">
                          <button
                            onClick={() => handleEdit(news)}
                            className="text-blue-600 mx-1"
                          >
                            <FaEdit className="mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(news.id)}
                            className="text-red-600 mx-1"
                          >
                            <FaTrash className="mr-1" /> Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Component */}
      {/* <Popupnews
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentNews={currentNews}
        setCurrentNews={setCurrentNews}
        onSave={currentNews.id ? handleSaveEdit : handleSaveAdd}
      /> */}
    </>
  );
}