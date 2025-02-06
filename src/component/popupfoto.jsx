import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function Popupnews({ isOpen, onClose, currentNews, setCurrentNews, onSave }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Add/Edit News Modal"
      className="bg-white rounded-lg shadow-xl mt-64 mb-44 h-[80%] mx-auto p-6"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
        <button
            onClick={onClose}
            className="absolute right-[30%] -mt-12 text-4xl text-gray-600"
          >
            &times;
          </button>
      <h2 className="text-2xl font-semibold mb-2 flex justify-center -mt-9">
        {currentNews.id ? "Edit News" : "Tambah Berita"}
      </h2>
      <div className="space-y-2">
        {/* Author */}
        <input
          type="text"
          placeholder="Nama"
          value={currentNews.author}
          onChange={(e) =>
            setCurrentNews({ ...currentNews, author: e.target.value })
          }
          className="w-full px-4 py-2 border rounded"
        />

        {/* Title */}
        <input
          type="text"
          placeholder="Judul"
          value={currentNews.title}
          onChange={(e) =>
            setCurrentNews({ ...currentNews, title: e.target.value })
          }
          className="w-full px-4 py-2 border rounded"
        />

        {/* Publish Date */}
        <div className="flex items-center space-x-2">
          <label htmlFor="publishDate" className="text-sm">Tanggal</label>
          <input
            type="date"
            id="publishDate"
            value={currentNews.publishDate}
            onChange={(e) =>
              setCurrentNews({ ...currentNews, publishDate: e.target.value })
            }
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        {/* Category */}
        <input
          type="text"
          placeholder="Kategori"
          value={currentNews.category}
          onChange={(e) =>
            setCurrentNews({ ...currentNews, category: e.target.value })
          }
          className="w-full px-4 py-2 border rounded"
        />

        {/* Tags */}
        <input
          type="text"
          placeholder="Jenis"
          value={currentNews.tags}
          onChange={(e) =>
            setCurrentNews({ ...currentNews, tags: e.target.value })
          }
          className="w-full px-4 py-2 border rounded"
        />

        {/* Image Upload */}
        <div className="flex items-center space-x-2">
          <label htmlFor="image" className="text-sm">Tambahkan gambar</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setCurrentNews({ ...currentNews, image: URL.createObjectURL(file) });
              }
            }}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        {/* Content */}
        <textarea
          placeholder="Content"
          value={currentNews.content}
          onChange={(e) =>
            setCurrentNews({ ...currentNews, content: e.target.value })
          }
          className="w-full px-4 py-2 border rounded"
        ></textarea>

        {/* Save Button */}
        <button
          onClick={onSave}
          className="bg-indigo-800 text-white px-4 py-2 rounded"
        >
          {currentNews.id ? "Save Changes" : "Tambahkan Berita"}
        </button>
      </div>
    </Modal>
  );
}