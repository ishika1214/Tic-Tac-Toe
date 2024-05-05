import React, { useState, useEffect } from "react";
import "./home.css";

const Square = ({ value, onSquareClick }) => {
  return (
    <div className="square" onClick={onSquareClick}>
      {value}
    </div>
  );
};

const Home = () => {
  const [squares, setSquares] = useState([]);
  const [move, setMove] = useState(0);
  const [message, setMessage] = useState("");
  const [size, setSize] = useState("3");
  const [hasError, setHasError] = useState(false);

  const onSquareClick = (value) => {
    const newSquares = [...squares];
    if (!newSquares[value]) {
      newSquares[value] = move % 2 === 0 ? "X" : "O";
      setMove(move + 1);
      setSquares(newSquares);
    }
  };

  const handleResult = () => {
    if (move >= size * 2 - 1) {
      let winner = null;
      const totalSize = parseInt(size);
      const winConditions = [];

      for (let i = 0; i < totalSize; i++) {
        const row = [];
        const column = [];
        for (let j = 0; j < totalSize; j++) {
          row.push(i * totalSize + j);
          column.push(j * totalSize + i);
        }
        winConditions.push(row, column);
      }

      const leftDiagonal = [];
      const rightDiagonal = [];
      for (let i = 0; i < totalSize; i++) {
        leftDiagonal.push(i * totalSize + i);
        rightDiagonal.push((i + 1) * (totalSize - 1));
      }
      winConditions.push(leftDiagonal, rightDiagonal);

      for (const condition of winConditions) {
        const lineValues = condition.map((index) => squares[index]);
        if (
          lineValues.every((val) => val === lineValues[0] && val !== undefined)
        ) {
          winner = lineValues[0];
          break;
        }
      }
      if (winner) {
        setMessage(`Player "${winner}" has won!`);
      } else if (move === totalSize * totalSize) {
        setMessage("Match is draw");
      }
    }
  };

  useEffect(() => {
    handleResult();
  }, [squares, move]);

  useEffect(() => {
    if (message !== "") {
      const timeout = setTimeout(() => {
        setSquares([]);
        setMessage("");
        setMove(0);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  return (
    <div className="container">
      <div className="welcome">Tic-Tac-Toe</div>
      <div className="winner-message">{message !== "" && message}</div>
      <div className="box">
        <div className="input-parent">
          <label className="size-label">Enter game size</label>
          <input
            type="text"
            value={size}
            onChange={(e) => {
              if (e.target.value < 7) {
                setSize(e.target.value);
                setHasError(false);
              } else {
                setHasError(true);
              }
            }}
            className="size-input"
          />
        </div>
        {hasError && <p className="error">Size should be less than 7</p>}
        <div className="row-Container">
          <div
            className="row"
            style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
          >
            {Array.from({ length: size * size }).map((_, index) => (
              <Square
                key={index}
                value={squares[index]}
                onSquareClick={() => onSquareClick(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
