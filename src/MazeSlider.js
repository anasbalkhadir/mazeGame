import React, { useState } from "react"
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Modal from 'react-modal';
import CloseIcon from '@material-ui/icons/Close';

import "./Maze.css"

//styles
const useStyles = makeStyles({
  root: {
    width: 200,
  },
});

const customStyles = {
  content: {
    height: 200,
    width: 250,
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

export default function MazeSizeSlider({ onSubmit, ...modalProps }) {
  return <Modal
    style={customStyles}
    {...modalProps}
  >
    <CloseIcon style={{ alignItems: "right" }} onClick={modalProps.onRequestClose}>/</CloseIcon>
    {/** change maze size */}
    <MazeSlider onSubmit={onSubmit} />
  </Modal>
}


function MazeSlider(props) {
  const classes = useStyles();
  //states
  const [height, setHeight] = useState(20);
  const [width, setWidth] = useState(20);
  //handlers
  const handleHeightChange = (event, newHeight) => {
    props?.onSubmit?.({ height: newHeight, width })
    setHeight(newHeight);
  };
  const handleWidthChange = (event, newWidth) => {
    props?.onSubmit?.({ height, width: newWidth })
    setWidth(newWidth);
  };

  return (
    <div disabled={true} className={classes.root}>
      <Typography id="continuous-slider" gutterBottom>
        Width:{width}
      </Typography>
      <Grid container spacing={2}>
        <Grid item>
        </Grid>
        <Grid item xs>
          <Slider classNamePrefix="select" track={false} value={height} min={5} max={75} onChange={handleHeightChange} aria-labelledby="continuous-slider" />
        </Grid>
        <Grid item>
        </Grid>
      </Grid>
      <Typography id="continuous-slider" gutterBottom>
        Height:{height}
      </Typography>
      <Slider classNamePrefix="select" value={width} min={5} max={75} onChange={handleWidthChange} aria-labelledby="continuous-slider" />
    </div>
  );
}