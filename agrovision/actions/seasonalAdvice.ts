export async function getSeasonalAdvice(location: string, crop_type: string, hemisphere: string) {
    const response = await fetch("/api/seasonalAdvice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location, crop_type, hemisphere }),
    });
  
    const data = await response.json();
    return data.advice || "No seasonal advice available.";
  }
  