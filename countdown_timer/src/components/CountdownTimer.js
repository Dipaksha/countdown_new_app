import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import { Box } from "@mui/system";

const handleTimerValue = (min, sec) => {
  let minutes = min,
    seconds;
  seconds = sec % 60;
  minutes += Math.floor(sec / 60);
  return { minutes, seconds };
};

const CountdownTimer = () => {
  const [inputTime, setInputTime] = useState({
    minutes: 0,
    seconds: 0,
    isStart: false,
  });
  const [timer, setTimer] = useState({ minutes: 0, seconds: 0 });

  const interval = useRef(0);

  const handleInputTimeChange = (name, value) => {
    setInputTime({
      ...inputTime,
      [name]: value,
    });
  };

  const handleStart = () => {
    if (inputTime.minutes || inputTime.seconds) {
      if (interval.current) clearInterval(interval.current);
      setTimer(
        handleTimerValue(Number(inputTime.minutes), Number(inputTime.seconds))
      );
      setInputTime({ ...inputTime, isStart: true });
    }
  };
  useEffect(() => {
    if (inputTime.isStart) {
      interval.current = setInterval(() => {
        if (timer.seconds > 0 || timer.minutes > 0) {
          setTimer((prevState) => ({
            minutes:
              timer.minutes > 0 && prevState.seconds === 0
                ? timer.minutes - 1
                : prevState.minutes,
            seconds:
              timer.minutes === 0 && prevState.seconds === 0
                ? 0
                : prevState.seconds === 0
                ? (timer.seconds = 59)
                : prevState.seconds - 1,
          }));
        } else if (timer.seconds === 0) {
          setTimer((prevState) => ({
            minutes: timer.minutes === 0 ? 0 : prevState.minutes - 1,
            seconds: (timer.seconds = 59),
          }));
        }
      }, 1000);
      setInputTime({ ...inputTime, isStart: false });
    }
  }, [inputTime.isStart]);
  if (timer.minutes === 0 && timer.seconds === 0) {
    if (interval.current) {
      clearInterval(interval.current);
      interval.current = null;
    }
  }
  const display = (state) => {
    const showCountDown = (
      <span>
        {" "}
        {state.minutes <= 0
          ? "00"
          : state.minutes >= 10
          ? state.minutes
          : `0${state.minutes}`}
        :
        {state.seconds <= 0
          ? "00"
          : state.seconds >= 10
          ? state.seconds
          : `0${state.seconds}`}
      </span>
    );
    return showCountDown;
  };

  const handleClickStop = () => {
    if (interval.current) {
      clearInterval(interval.current);
      interval.current = null;
      setInputTime({ ...inputTime, isStart: false });
    } else {
      setInputTime({ ...inputTime, isStart: true });
    }
  };

  const handleClickReset = () => {
    clearInterval(interval.current);
    setInputTime({
      ...inputTime,
      isStart: false,
    });
    setTimer({ minutes: 0, seconds: 0 });
  };

  return (
    <React.Fragment>
      <Container component="main" maxWidth="xs" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                required
                id="minutes"
                name="minutes"
                label="Minutes"
                fullWidth
                autoComplete="given-name"
                variant="outlined"
                value={inputTime.minutes}
                onChange={(e) =>
                  handleInputTimeChange(e.target.name, e.target.value)
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                id="seconds"
                name="seconds"
                label="Seconds"
                fullWidth
                autoComplete="given-name"
                variant="outlined"
                value={inputTime.seconds}
                onChange={(e) =>
                  handleInputTimeChange(e.target.name, e.target.value)
                }
              />
            </Grid>
          </Grid>
          <Typography variant="h2" align="center">
            {display(timer)}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              style={{ width: "32%" }}
              onClick={handleStart}
            >
              Start
            </Button>
            <Button
              variant="contained"
              style={{ width: "31%" }}
              onClick={handleClickStop}
              sx={{ ml: 1 }}
            >
              {interval.current ? "Pause" : "Resume"}
            </Button>
            <Button
              variant="contained"
              sx={{ ml: 1 }}
              style={{ width: "32%" }}
              onClick={handleClickReset}
            >
              Reset
            </Button>
          </Box>
        </Paper>
      </Container>
    </React.Fragment>
  );
};
export default CountdownTimer;
