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
    setAdvice(formatResponse(response));
    setLoading(false);
  };

  // Format response: Converts markdown-like text into styled HTML
  const formatResponse = (text: string) => {
    return text
      .replace(
        /^## (.*?)$/gm,
        "<h2 class='text-xl font-semibold text-green-700 mt-4'>$1</h2>"
      ) // Headings
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold text
      .replace(/\* (.*?)$/gm, "<li class='ml-6 list-disc'>$1</li>") // Bullet points
      .replace(/\n/g, "<br />"); // Preserve line breaks
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white text-gray-900 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-3xl font-semibold text-green-600 mb-4 flex items-center gap-2">
        🌿 Seasonal Farming Advice
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-lg font-medium">
            Your Location (Country/Region):
          </label>
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
          <label className="block text-lg font-medium">
            Crop Type (Optional):
          </label>
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
        <div className="mt-6 p-6 bg-gray-100 border border-gray-300 rounded-lg shadow-sm">
          <h3 className="text-2xl font-semibold text-green-700 mb-3">
            🌱 Farming Advice
          </h3>
          <div
            className="text-gray-800 text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: advice }}
          />
        </div>
      )}
    </div>
  );
}
