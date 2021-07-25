import React, { useState } from "react";
import Maze from "./Maze";
import generateMaze from "./generateMaze";
import MazeSizeSlider from "./MazeSlider";
import "./App.css";



function App() {
  // App state 
  const [isOpen, setIsopen] = React.useState(false);
  const [maze, setMaze] = useState(generateMaze());
  // submit maze dimenesions change
  const onSubmit = ({ height, width }) => {
    const newMaze = generateMaze({ height, width });
    setMaze(newMaze);
  }
  return (
    <div className="App">
      <button onClick={() => setIsopen(true)}>Modify maze size</button>
      <Maze maze={maze} />
      <MazeSizeSlider
        isOpen={isOpen}
        onRequestClose={() => setIsopen(false)}
        onSubmit={onSubmit}
      />
    </div>
  )
}


export default App
