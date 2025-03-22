"use server";

import { Client } from "@gradio/client";

export async function predictPlantDisease(image: Blob) {
  try {
    const client = await Client.connect("sankalp2606/Plant-Disease_diagnosis");
    const result = await client.predict("/predict", { img: image });

    return result.data; // Return the prediction result
  } catch (error) {
    console.error("Prediction Error:", error);
    return { error: "Failed to get prediction" };
  }
}
