"use client";

import { useState } from "react";
import { FileUpload as FileUploader } from "@/components/ui/file-upload";
import Image from "next/image";
export const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (files: File[]) => {
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setPreview(URL.createObjectURL(files[0]));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch("/api/analyze-cattle", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center w-full max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Cattle Disease Diagnosis
      </h1>
      <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-300 dark:border-neutral-700 rounded-lg p-6 flex flex-col items-center shadow-lg">
        <FileUploader onChange={handleFileChange} />
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
      <button
        className="px-6 py-3 bg-blue-600 text-white rounded-lg mt-6 font-semibold text-lg transition hover:bg-blue-700 disabled:bg-gray-400"
        onClick={handleUpload}
        disabled={!selectedFile || loading}
      >
        {loading ? "Analyzing..." : "Upload & Analyze"}
      </button>

      {result && (
        <div className="mt-8 p-6 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-5xl">
          <h2 className="text-xl font-semibold mb-4">Analysis Result:</h2>
          <div className="flex flex-col items-center">
            <h3 className="font-semibold mb-2">Uploaded Image:</h3>
            <div className="relative w-80 h-80 rounded-lg overflow-hidden shadow-md border border-gray-300 dark:border-gray-600 mb-4">
              <Image
                src={preview || ""}
                alt="Uploaded Preview"
                className="w-full h-full object-cover"
                width={320}
                height={320}
              />
            </div>
          </div>
          {result.cattle_diseases && result.cattle_diseases.length > 0 && (
            <div>
              {result.cattle_diseases.map((disease: any, index: number) => (
                <div
                  key={index}
                  className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
                >
                  <h3 className="text-lg font-bold text-red-600 dark:text-red-400">
                    {disease.name}
                  </h3>
                  <p className="mt-2">
                    <strong>Symptoms:</strong>
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                    {disease.symptoms.map((symptom: string, i: number) => (
                      <li key={i}>{symptom}</li>
                    ))}
                  </ul>
                  <p className="mt-2">
                    <strong>Possible Causes:</strong>
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                    {disease.possible_causes.map((cause: string, i: number) => (
                      <li key={i}>{cause}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {result.remedies && result.remedies.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-bold">Remedies:</h3>
              {result.remedies.map((remedy: any, index: number) => (
                <div
                  key={index}
                  className="mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
                >
                  <p>
                    <strong>Disease:</strong> {remedy.disease}
                  </p>
                  <p>
                    <strong>Treatment:</strong> {remedy.treatment}
                  </p>
                  <p>
                    <strong>Prevention:</strong> {remedy.prevention}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
