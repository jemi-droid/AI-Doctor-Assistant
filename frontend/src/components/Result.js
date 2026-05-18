import React from "react";

function Result({ data }) {
  return (
    <div className="result">
      <h3>Prediction: {data.predicted_disease}</h3>
      <p>{data.disclaimer}</p>
    </div>
  );
}

export default Result;