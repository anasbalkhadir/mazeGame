import React, { useState, useEffect, useCallback } from "react"
import Modal from 'react-modal';
import * as images from "./images"
import "./Maze.css"
import Confetti from 'react-confetti'
import CloseIcon from '@material-ui/icons/Close';
import MailForm from './MailForm';
import { bfs } from "./helpers/bfs";


function Maze({ maze }) {
  //initial values 
  const startCoordinates = getStartCoordinates(maze);
  const endCoordinates = getEndCoordinates(maze);
  //convert maze to  binary maze
  const binaryMaze = maze.tiles.map((row, rowIndex) => (row.map((cell, cellIndex) => {
    if (rowIndex === endCoordinates[0] && cellIndex === endCoordinates[1])
      return 1;
    return Number(cell.passable)
  })));
  //maze intern State
  const [playerCoordinates, setPlayerCoordinates] = useState([0, 0]);
  const [visitedCells, setVisitedCells] = useState([startCoordinates]);
  const [isGameEnded, setIsGameEnded] = React.useState(false);

  function initMaze() {
    setPlayerCoordinates(startCoordinates)
  }
  function closeEndGameBox() {
    initMaze();
    setIsGameEnded(false);
  }
  function restart() {
    initMaze();
    setIsGameEnded(false);
  }
  const handleUserKeyPress = useCallback(event => {
    const { key } = event;
    setPlayerCoordinates(previewsPlayerCoordinates => {
      const newPlayerCoordinates = getPlayerCoordinates(previewsPlayerCoordinates, maze, key) || previewsPlayerCoordinates;
      setVisitedCells(previewsVisitedCells => {
        if (!isCellVisited(newPlayerCoordinates, previewsVisitedCells))
          return [...visitedCells, newPlayerCoordinates];
        else
          return previewsVisitedCells;
      });

      if (newPlayerCoordinates?.[0] === endCoordinates[0] && newPlayerCoordinates?.[1] === endCoordinates[1]) setIsGameEnded(true)
      return newPlayerCoordinates;
    });
  });
  // attach listener and attach event handler with  callback pattern
  useEffect(() => {
    window.addEventListener('keydown', handleUserKeyPress);

    return () => {
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  }, [handleUserKeyPress]);
  console.log({ visitedCells })
  return (
    <div className="Maze" >
      {maze.tiles.map((row, rowIndex) => (
        <div key={`${rowIndex}`} className="Maze-row">
          {row.map((cell, cellIndex) => {
            if (rowIndex === playerCoordinates[0] && cellIndex === playerCoordinates[1])
              return <img key={`${cellIndex}`} src={images.player} alt="" />
            if (rowIndex === startCoordinates[0] && cellIndex === startCoordinates[1])
              return <img key={`${cellIndex}`} src={images.stairsDown} alt="" />
            if (rowIndex === endCoordinates[0] && cellIndex === endCoordinates[1])
              return <img key={`${cellIndex}`} src={images.stairsUp} alt="" />
            return <img key={`${cellIndex}`} src={cell.passable ? images.floor : images.wall} alt="" />

          })}
        </div>
      ))}

      <EndGameBox
        isOpen={isGameEnded}
        onRequestClose={closeEndGameBox}
        style={customStyles}
        ariaHideApp={false}
        restart={restart}
        score={computeScore(binaryMaze, startCoordinates, endCoordinates, visitedCells)}

      />
    </div>
  )
}
// The Modal Box is dislyed when the plyayer passes the end point
function EndGameBox({ submit, restart, score, ...modalProps }) {
  return <Modal
    {...modalProps}
  >
    <CloseIcon style={{ alignItems: "right" }} onClick={modalProps.onRequestClose}>/</CloseIcon>
    <Confetti
      width={400}
      height={250}
    />
    <ScoreMessageBox score={score} />
    <h3>Receive your results</h3>
    <MailForm message={scoreMessageText(score)} submit={modalProps.onRequestClose} />
    <button onClick={restart} >restart</button>

  </Modal>
}
// The score  Message componenet 
function ScoreMessageBox({ score }) {
  if (score === 1)
    return <h1>Congratulation, Perfect score!</h1>;
  else if (score >= 0.9 && score < 1)
    return <h1>Congratulation, Good score!</h1>;
  else if (score >= 0.5 && score < 0.9)
    return <h1>Average Score,  you can do better </h1>;
  else
    return <h1>Poor Score, try again </h1>;
}
// The score Text Message
function scoreMessageText(score) {
  if (score === 1)
    return 'Congratulation, you get  a Perfect Score!';
  else if (score >= 0.9 && score < 1)
    return 'Congratulation, Good score!';
  else if (score >= 0.5 && score < 0.9)
    return 'Average Score,  you can do better ';
  else
    return 'Poor Score, try maze game again,  you  can surely improve ';
}


// check the start cell  is passable  and one of the next cell is passable 
function getStartCoordinates(maze) {
  return [0, 0]
}
// check the end cell  is passable  and one of the next cell is passable 
function getEndCoordinates(maze) {
  return [maze.width - 1, maze.height - 2]
}
// control  player mouvemnent in the maze
function getPlayerCoordinates(playerCoordinates, maze, key) {
  console.log(playerCoordinates)
  const endCoordinates = [maze.width - 1, maze.height - 2];
  switch (key) {
    case 'ArrowLeft':
      if (playerCoordinates[1] - 1 >= 0 && (maze.tiles[playerCoordinates[0]][playerCoordinates[1] - 1].passable || (playerCoordinates[0] === endCoordinates[0] && endCoordinates[1] === playerCoordinates[1] - 1)))
        return [playerCoordinates[0], playerCoordinates[1] - 1]
      break;

    case 'ArrowRight':
      if (playerCoordinates[1] + 1 <= maze.height - 1 && (maze.tiles[playerCoordinates[0]][playerCoordinates[1] + 1].passable || (endCoordinates[0] === playerCoordinates[0] && endCoordinates[1] === playerCoordinates[1] + 1)))
        return [playerCoordinates[0], playerCoordinates[1] + 1]
      break;

    case 'ArrowUp':
      if (playerCoordinates[0] - 1 >= 0 && (maze.tiles[playerCoordinates[0] - 1][playerCoordinates[1]].passable || (endCoordinates[0] === playerCoordinates[0] - 1 && endCoordinates[1] === playerCoordinates[1])))
        return [playerCoordinates[0] - 1, playerCoordinates[1]]
      break;
    case 'ArrowDown':
      if (playerCoordinates[0] + 1 <= maze.width - 1 && (maze.tiles[playerCoordinates[0] + 1][playerCoordinates[1]].passable || (endCoordinates[0] === playerCoordinates[0] + 1 && endCoordinates[1] === playerCoordinates[1])))
        return [playerCoordinates[0] + 1, playerCoordinates[1]]
      break;

    default:
      break;
  }
}

// count the cell visited by  the player 
function isCellVisited(cell, visitedCells) {
  for (const visitedCell of visitedCells) {
    if (cell[0] === visitedCell[0] && cell[1] === visitedCell[1])
      return true;
  }
  return false;
}

// compute the score with the following formula: tile_count / ((path_length × tile_count) / shortest_path_length)

function computeScore(binaryMaze, startCoordinates, endCoordinates, visitedCells) {
  // add all the binaryMaze values using reduce
  const tileCount = binaryMaze.reduce(
    (count, currentRow) => count + currentRow.reduce((rowCount, currentCell) =>
      rowCount + currentCell), 0)
  const shortPath = bfs(binaryMaze, startCoordinates, endCoordinates);
  const pathLength = visitedCells.length - 1;
  console.log({ tileCount, shortPath, pathLength })
  return tileCount / ((pathLength * tileCount) / shortPath)

}

// Modal Style 
const customStyles = {
  content: {
    height: 300,
    width: 400,
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: 20,
    justifyContent: "space-arround"
  },
};


export default Maze
