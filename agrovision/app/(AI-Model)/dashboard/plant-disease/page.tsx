"use client";

import { useState } from "react";
import { predictPlantDisease } from "@/actions/predict";
import { FileUpload } from "@/components/ui/file-upload";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (files: File[]) => {
    const file = files[0] || null;
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handlePredict = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const blob = new Blob([await file.arrayBuffer()], { type: file.type });
      const result = await predictPlantDisease(blob);
      setPrediction(result);
    } catch (error) {
      console.error("Prediction failed", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 flex flex-col items-center w-full max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Plant Disease Diagnosis
      </h1>

      {/* Upload Section */}
      <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-300 dark:border-neutral-700 rounded-lg p-6 flex flex-col items-center shadow-lg">
        <FileUpload onChange={handleFileUpload} />

        {preview && (
          <div className="mt-6 flex flex-col items-center w-full">
            <h3 className="text-lg font-semibold mb-2">Selected Image:</h3>
            <div className="relative w-72 h-72 rounded-lg overflow-hidden shadow-md border border-gray-300 dark:border-gray-600">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {/* Predict Button */}
      <button
        onClick={handlePredict}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg mt-6 font-semibold text-lg transition hover:bg-blue-700 disabled:bg-gray-400"
        disabled={!file || loading}
      >
        {loading ? "Predicting..." : "Get Prediction"}
      </button>

      {/* Prediction Result */}
      {prediction && (
        <div className="mt-8 p-6 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-5xl">
          <h2 className="text-xl font-semibold mb-4">Prediction Result:</h2>

          {/* Processed Image */}
          {prediction[0]?.url && (
            <div className="mb-6 flex flex-col items-center">
              <h3 className="font-semibold mb-2">Processed Image:</h3>
              <div className="relative w-80 h-80 rounded-lg overflow-hidden shadow-md border border-gray-300 dark:border-gray-600">
                <img
                  src={prediction[0].url}
                  alt="Processed Result"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Disease & Remedies Table */}
          {prediction[1]?.data && prediction[1].data.length > 0 && (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
                <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-800">
                  <tr>
                    {prediction[1].headers.map(
                      (header: string, index: number) => (
                        <th key={index} className="px-6 py-3">
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {prediction[1].data.map((row: string[], rowIndex: number) => (
                    <tr
                      key={rowIndex}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      {row.map((cell: string, cellIndex: number) => (
                        <td key={cellIndex} className="px-6 py-4">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
