"use client";

import { useState } from "react";
import { getSeasonalAdvice } from "@/actions/seasonalAdvice";

export default function SeasonalAdviceForm() {
  const [location, setLocation] = useState("");
  const [cropType, setCropType] = useState("");
  const [hemisphere, setHemisphere] = useState("Northern");
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const response = await getSeasonalAdvice(location, cropType, hemisphere);
    setAdvice(response);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white text-gray-900 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-3xl font-semibold text-green-600 mb-4 flex items-center gap-2">
        🌿 Seasonal Farming Advice
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-lg font-medium">Your location (country/region):</label>
          <input
            type="text"
            className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter location (e.g., United States Midwest)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-lg font-medium">Crop type (optional):</label>
          <input
            type="text"
            className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter crop type (e.g., Wheat)"
            value={cropType}
            onChange={(e) => setCropType(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-lg font-medium">Hemisphere:</span>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="hemisphere"
              value="Northern"
              checked={hemisphere === "Northern"}
              onChange={() => setHemisphere("Northern")}
              className="accent-green-600"
            />
            Northern
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="hemisphere"
              value="Southern"
              checked={hemisphere === "Southern"}
              onChange={() => setHemisphere("Southern")}
              className="accent-green-600"
            />
            Southern
          </label>
        </div>

        <button
          type="submit"
          className="w-full p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-lg transition duration-200"
          disabled={loading}
        >
          {loading ? "Fetching Advice..." : "Get Seasonal Advice"}
        </button>
      </form>

      {advice && (
        <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded">
          <h3 className="text-xl font-semibold text-green-600">Advice:</h3>
          <p className="text-gray-800 mt-2">{advice}</p>
        </div>
      )}
    </div>
  );
}
