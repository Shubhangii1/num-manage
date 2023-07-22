import React, { useState } from "react";
import axios from "axios";

const NumberManagement = () => {
  const [urls, setUrls] = useState("");
  const [numbers, setNumbers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFetchNumbers = async () => {
    try {
      setErrorMessage(""); // Clear any previous error messages
      const urlsArray = urls.split("\n").filter((url) => url);

      // Ensure at least one URL is provided
      if (urlsArray.length === 0) {
        setErrorMessage("Please provide at least one URL");
        setNumbers([]);
        return;
      }

      const requests = urlsArray.map((url) =>
        axios
          .get(url)
          .then((response) => response.data)
          .catch((error) => {
            // Handle Axios errors (e.g., timeout, 404)
            console.error(`Error fetching data from ${url}: ${error}`);
            return [];
          })
      );

      const responses = await Promise.all(requests);

      const validResponses = responses.filter(
        (data) => Array.isArray(data) && data.length > 0
      );

      const mergedNumbers = Array.from(
        new Set(validResponses.flatMap((data) => data))
      ).sort((a, b) => a - b);

      setNumbers(mergedNumbers);
    } catch (error) {
      console.error("Error fetching numbers:", error);
      setErrorMessage("An error occurred while fetching numbers.");
      setNumbers([]);
    }
  };

  return (
    <div>
      <h1>Number Management Service</h1>
      <textarea
        rows={5}
        placeholder="Enter URLs separated by new lines..."
        value={urls}
        onChange={(e) => setUrls(e.target.value)}
      />
      <button onClick={handleFetchNumbers}>Fetch Numbers</button>
      {errorMessage && <p>{errorMessage}</p>}
      <div>
        <h2>Numbers:</h2>
        <ul>
          {numbers.map((number, index) => (
            <li key={index}>{number}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NumberManagement;
