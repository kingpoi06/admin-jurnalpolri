import React, { useState, useEffect } from "react";
import Sidebar from "../component/sidebar";
import Header from "../component/header";
import { FaNewspaper } from "react-icons/fa";
import { Bar } from "react-chartjs-2";  // Ganti Pie dengan Bar
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import useAxios from "../useAxios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [namalengkap, setNamalengkap] = useState("");
  const navigate = useNavigate();
  const axiosInstance = useAxios();
  const [totalNews, setTotalNews] = useState(0);
  const [totalPhotos, setTotalPhotos] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        setLoading(true);
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Fetch all totals in parallel
        const [newsResponse, photoResponse, videoResponse] = await Promise.all([
          axiosInstance.get("/news", { headers }),
        ]);

        // Set total counts
        setTotalNews(newsResponse.data.length || 0);
        setTotalPhotos(photoResponse.data.length || 0);
        setTotalVideos(videoResponse.data.length || 0);
      } catch (error) {
        console.error("Error fetching totals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotals();
  }, [token]);

  // Data untuk grafik
  const data = {
    labels: ["Total Berita", "Total Foto", "Total Video"], // Label untuk grafik
    datasets: [
      {
        label: "Jumlah Konten",
        data: [totalNews], // Data yang ditampilkan di grafik
        backgroundColor: ["rgba(75, 192, 192, 0.6)"], // Warna untuk setiap bar
        borderColor: ["rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
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

  // Opsi grafik
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Perbandingan Jumlah Konten",
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Memulai skala y dari 0
      },
    },
  };

  return (
    <div className="bg-gray-100 min-h-screen w-full overflow-x-hidden">
      <div className="fixed z-50 w-64 h-full">
        <Sidebar />
      </div>

      <div className="ml-56">
        <Header />
        <div className="pt-28">
          <div className="flex">
            <h2 className="font-medium font-primary text-gray-500 pt-2 text-2xl">
              Dashboard
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {[ 
              { title: "Total Berita", icon: <FaNewspaper size={32} />, count: totalNews },
            ].map((item, idx) => (
              <div key={idx} className="mt-6 bg-emerald-500 h-28 w-64 rounded-md flex items-center justify-center">
                <div className="bg-white h-28 w-64 ml-2 rounded-md shadow-xl flex flex-col justify-start items-center pt-2">
                  <h1 className="text-black font-medium font-secondary text-xl">{item.title}</h1>
                  <div className="mt-2">{item.icon}</div>
                  <p className="text-black font-semibold text-lg">{item.count}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 mb-4">
            <div className="bg-white rounded-lg shadow-xl p-4">
              <Bar data={data} options={options} /> {/* Ganti Pie dengan Bar */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
