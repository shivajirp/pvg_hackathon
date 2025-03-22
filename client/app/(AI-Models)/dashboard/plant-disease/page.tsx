"use client";

import { useState } from "react";
import { predictPlantDisease } from "@/lib/predict";

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handlePredict = async () => {
    if (!image) return;

    setLoading(true);
    try {
      const blob = new Blob([await image.arrayBuffer()], { type: image.type });
      const result = await predictPlantDisease(blob);
      setPrediction(result);
    } catch (error) {
      console.error("Prediction failed", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Plant Disease Diagnosis</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handlePredict}
        className="px-4 py-2 bg-blue-500 text-white rounded"
        disabled={!image || loading}
      >
        {loading ? "Predicting..." : "Get Prediction"}
      </button>

      {prediction && (
        <div className="mt-4 p-4 bg-gray-100 rounded w-full max-w-lg">
          <h2 className="text-lg font-semibold">Prediction Result:</h2>

          {/* Display Processed Image */}
          {prediction[0]?.url && (
            <div className="mt-2">
              <h3 className="font-semibold">Processed Image:</h3>
              <img
                src={prediction[0].url}
                alt="Processed Result"
                className="w-full h-auto rounded"
              />
            </div>
          )}

          {/* Display Disease and Remedies */}
          {prediction[1]?.data && (
            <div className="mt-4">
              <h3 className="font-semibold">Detected Diseases & Remedies:</h3>
              <table className="table-auto w-full mt-2 border-collapse border border-gray-400">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-400 px-4 py-2">
                      Disease
                    </th>
                    <th className="border border-gray-400 px-4 py-2">Remedy</th>
                  </tr>
                </thead>
                <tbody>
                  {prediction[1].data.map(
                    (row: [string, string], index: number) => (
                      <tr key={index} className="border border-gray-400">
                        <td className="border border-gray-400 px-4 py-2">
                          {row[0]}
                        </td>
                        <td className="border border-gray-400 px-4 py-2">
                          {row[1]}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
