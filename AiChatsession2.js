const AiChatsession = {
  sendMessage: async (message) => {
    try {
      const response = await fetch(
        "https://ai.google.dev/gemini-api/docs/api-key",
        {
          // Replace with the actual API endpoint
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer AIzaSyD7wxHNWRKspDuvqmJmYZM48FgzDAXS4Lk`, // Your API key
          },
          body: JSON.stringify({
            prompt: message, // Assuming the API expects a "prompt" key
            maxTokens: 100, // Example of an additional parameter; customize as needed
            model: "text-davinci-003", // Example model name; adjust based on your API
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();

      // Assuming the API response includes a "text" field for the output
      return {
        response: { text: () => data.text || "No response text available" },
      };
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },
};

export default AiChatsession;
