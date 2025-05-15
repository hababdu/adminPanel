import React, { useState } from "react";
import axios from "axios";

const KitchenForm = () => {
  const [formData, setFormData] = useState({ name: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await axios.post("https://hosilbek.pythonanywhere.com/api/user/kitchens/", {
        name: formData.name,
      });
      setMessage({ type: "success", text: "Ma'lumot muvaffaqiyatli yuborildi!" });
      setFormData({ name: "" });
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Xatolik yuz berdi. Qayta urinib ko‘ring." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-center">O‘zbek taomlari qo‘shish</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">
            Nomi (name)
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-600 text-white py-2 px-4 rounded-lg transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loading ? "Yuborilmoqda..." : "Yuborish"}
        </button>
      </form>

      {message.text && (
        <div
          className={`mt-4 p-2 rounded ${
            message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

export default KitchenForm;
