import React, { useState } from "react";
import axios from "axios";
import Result from "./Result";

function SymptomForm() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", {
        symptoms: symptoms,
      });

      setResult(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter symptoms (e.g. fever cough)"
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
      />

      <button onClick={handleSubmit}>Check</button>

      {result && <Result data={result} />}
    </div>
  );
}

export default SymptomForm;