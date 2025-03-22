import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { location, crop_type, hemisphere } = await req.json();

    const apiResponse = await fetch("http://farmer-chatbot-1.onrender.com/seasonal_advice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location, crop_type, hemisphere }),
    });

    const data = await apiResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch seasonal advice" }, { status: 500 });
  }
}
