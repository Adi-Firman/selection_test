import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css";

export default function App() {
  const [originalData, setOriginalData] = useState([]);
  const [dominoes, setDominoes] = useState([]);

  // Ambil data dari file mock
  useEffect(() => {
    axios
      .get("/mock/data.json")
      .then((res) => {
        // Pastikan data yang diterima adalah array
        if (Array.isArray(res.data)) {
          setOriginalData(res.data);
          setDominoes(res.data);
        } else {
          console.error("Data yang diterima bukan array");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const countDoubles = () => {
    return Array.isArray(dominoes)
      ? dominoes.filter(([a, b]) => a === b).length
      : 0;
  };

  const sortDominoes = (order = "asc") => {
    if (Array.isArray(dominoes)) {
      const sorted = [...dominoes].sort((a, b) => {
        const sumA = a[0] + a[1];
        const sumB = b[0] + b[1];
        if (sumA === sumB) return order === "asc" ? a[0] - b[0] : b[0] - a[0];
        return order === "asc" ? sumA - sumB : sumB - sumA;
      });
      setDominoes(sorted);
    }
  };

  const removeDuplicates = () => {
    if (Array.isArray(dominoes)) {
      const seen = new Set();
      const unique = dominoes.filter(([a, b]) => {
        const key = [a, b].sort().join(",");
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      setDominoes(unique);
    }
  };

  const flipCards = () => {
    if (Array.isArray(dominoes)) {
      setDominoes(dominoes.map(([a, b]) => [b, a]));
    }
  };

  const removeTotal = (total) => {
    if (Array.isArray(dominoes)) {
      setDominoes(dominoes.filter(([a, b]) => a + b !== total));
    }
  };

  const resetData = () => {
    setDominoes(originalData);
  };

  return (
    <div className="App">
      <h1>Dominoes</h1>

      <div>
        {Array.isArray(dominoes) && dominoes.length > 0 ? (
          dominoes.map(([a, b], index) => (
            <span
              key={index}
              style={{ margin: "5px", display: "inline-block" }}
            >
              [{a}, {b}]
            </span>
          ))
        ) : (
          <p>No dominoes available</p> // Pesan jika tidak ada data
        )}
      </div>

      <h3>Double Cards Count: {countDoubles()}</h3>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => sortDominoes("asc")}>Sort Asc</button>
        <button onClick={() => sortDominoes("desc")}>Sort Desc</button>
        <button onClick={removeDuplicates}>Remove Duplicates</button>
        <button onClick={flipCards}>Flip Cards</button>
        <button onClick={() => removeTotal(4)}>Remove Total = 4</button>
        <button onClick={resetData}>Reset</button>
      </div>
    </div>
  );
}
