import { getAuthHeaders } from "./auth";

// Function to fetch prompt from API
export const fetchPromptFromAPI = async (processName: string) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch("https://ravik00111110.pythonanywhere.com/api/content-gen/prompt/", {
      method: "POST",
      headers,
      body: JSON.stringify({ process_name: processName })
    });

    if (!response.ok) throw new Error("Failed to fetch prompt");

    const data = await response.json();
    console.log("🔑 Prompt:", data.prompt);
    return data.prompt;

  } catch (err) {
    console.error("Error fetching prompt:", err);
    return null;
  }
};
