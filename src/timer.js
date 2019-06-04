import { Component } from "preact";

const stringifyNumber = number => (number <= 9 ? `0${number}` : `${number}`);

const convertMillisToTime = millis => {
  let seconds = Math.floor(millis / 1000);
  let minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  minutes = minutes % 60;
  let timeStrList = [];
  if (minutes) {
    timeStrList.push(`${stringifyNumber(minutes)}`);
  }
  timeStrList.push(`${stringifyNumber(seconds)}`);
  return timeStrList.join(":");
};

export default class Timer extends Component {
  constructor(props) {
    super(props);
    const { hours = 0, minutes = 0, seconds = 0 } = props;
    const time =
      hours || minutes || seconds
        ? seconds * 1000 + minutes * 60 * 1000 + hours * 60 * 60 * 1000
        : 60000 * 25;
    this.time = time;
    this.state = {
      time,
      playState: "stopped",
      hours,
      minutes,
      seconds
    };
    this.timer = null;

    this.startTimer = this.startTimer.bind(this);
    this.pauseTimer = this.pauseTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.updateTime = this.updateTime.bind(this);

    this.updateMinutes = this.updateMinutes.bind(this);
    this.updateSeconds = this.updateSeconds.bind(this);
  }

  updateMinutes(e) {
    const newMinutes = Number(e.target.value);
    const time =
      this.state.hours || newMinutes || this.state.seconds
        ? this.state.seconds * 1000 +
          newMinutes * 60 * 1000 +
          this.state.hours * 60 * 60 * 1000
        : 60000 * 25;
    this.setState(state => ({
      minutes: newMinutes,
      time
    }));
    this.time = time;
  }

  updateSeconds(e) {
    const newSeconds = Number(e.target.value);
    const time =
      this.state.hours || this.state.minutes || newSeconds
        ? newSeconds * 1000 +
          this.state.minutes * 60 * 1000 +
          this.state.hours * 60 * 60 * 1000
        : 60000 * 25;
    this.setState(state => ({
      seconds: newSeconds,
      time
    }));
    this.time = time;
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
  }

  updateTime() {
    const { time } = this.state;
    if (time > 1000) {
      const updatedTime = time - 1000;
      updatedTime === 0 && this.timer && clearInterval(this.timer);
      this.setState(() => ({ time: updatedTime }));
    } else {
      this.stopTimer();
    }
  }

  startTimer(source) {
    // Notification.requestPermission()
    //   .then(permission => permission === "granted", error => false)
    //   .then(permissionGranted => {

    //   });
    this.timer && clearInterval(this.timer);
    const { playState } = this.state;
    playState !== "started" &&
      this.setState(
        state => ({
          playState: "started",
          time: state.playState !== "started" ? state.time : this.time
        }),
        () => {
          this.timer = setInterval(this.updateTime, 1000);
          const { onTimerStart } = this.props;
          typeof onTimerStart === "function" && onTimerStart();
        }
      );
  }

  pauseTimer() {
    const { playState } = this.state;
    playState === "started" &&
      this.setState(
        () => ({ playState: "paused" }),
        () => {
          clearInterval(this.timer);
          this.props.Alarm.pause();
        }
      );
  }

  stopTimer(source) {
    const { playState } = this.state;
    playState !== "stopped" &&
      this.setState(
        () => ({ playState: "stopped", time: this.time }),
        () => {
          clearInterval(this.timer);
          const { onTimerEnd, Alarm } = this.props;
          typeof onTimerEnd === "function" &&
            source !== "onClick" &&
            onTimerEnd();
          source === "onClick" && Alarm.pause();
          // source !== "onClick" &&
          //   new Notification(`${this.props.label} timer ending`);
        }
      );
  }

  render({ label, task }, { results = [], time, playState }) {
    const isTimerStarted = playState === "started";
    const isTimerPaused = playState === "paused";
    const isTimerStopped = playState === "stopped";
    let timeColor = "#666";
    switch (playState) {
      case "started":
        timeColor = "#38AC5F";
        break;
      case "paused":
        timeColor = "orange";
        break;
      case "stopped":
        timeColor = "red";
        break;
      default:
        timeColor = "#666";
        break;
    }
    return (
      <div
        style={{
          padding: 30,
          margin: "20px auto",
          border: `1px solid ${isTimerStarted ? "#38AC5F" : "#EEE"}`,
          borderRadius: 10,
          boxShadow: "0 0 10px 0 #ccc",
          maxWidth: 500
        }}
      >
        <h1 style={{ margin: 0, fontWeight: 300, color: "#666" }}>
          {label || "Example"}
        </h1>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <input
            value={convertMillisToTime(time)}
            onChange={e => {
              if (playState === "started") {
                return;
              }
              let text = e.target.value;
              if (text.split(":").length === 2) {
                let [minutes, seconds] = text.split(":").map(Number);
                let time = (minutes * 60 + seconds) * 1000;
                this.setState(() => ({ time }));
              }
            }}
            style={{
              padding: 10,
              marginTop: 20,
              fontSize: 16,
              textAlign: "center",
              border: 0,
              outline: "1px solid #EEE",
              cursor: "pointer"
            }}
          />
          <div style={{ marginTop: 20 }}>
            <button
              onClick={this.startTimer}
              disabled={isTimerStarted && task === null}
              style={{
                marginRight: "10px",
                padding: "10px",
                borderRadius: "4px",
                fontWeight: 600,
                cursor: `${
                  (isTimerPaused || isTimerStopped) && task === null
                    ? "pointer"
                    : "not-allowed"
                }`,
                color: "white",
                backgroundColor: `${
                  (isTimerPaused || isTimerStopped) && task === null
                    ? "#38AC5F"
                    : "#999"
                }`,
                borderColor: `${
                  (isTimerPaused || isTimerStopped) && task === null
                    ? "#38AC5F"
                    : "#999"
                }`,
                transition: "background-color 0.7s, color 0.7s ease-in-out",
                fontSize: 16
              }}
            >
              Play
            </button>
            <button
              onClick={this.pauseTimer}
              disabled={!isTimerStarted}
              style={{
                marginRight: "10px",
                padding: "10px",
                borderRadius: "4px",
                cursor: `${isTimerStarted ? "pointer" : "not-allowed"}`,
                backgroundColor: `${isTimerStarted ? "orange" : "#999"}`,
                color: "white",
                fontWeight: 600,
                borderColor: `${isTimerStarted ? "orange" : "#999"}`,
                fontSize: 16
              }}
            >
              Pause
            </button>

            <button
              onClick={() => this.stopTimer("onClick")}
              disabled={(isTimerStopped || !isTimerPaused) && !isTimerStarted}
              style={{
                marginRight: "10px",
                padding: "10px",
                borderRadius: "4px",
                fontWeight: 600,
                backgroundColor: `${!isTimerStopped ? "red" : "#999"}`,
                color: "white",
                borderColor: `${!isTimerStopped ? "red" : "#999"}`,
                cursor:
                  (isTimerStopped || !isTimerPaused) && !isTimerStarted
                    ? "not-allowed"
                    : "pointer",
                fontSize: 16
              }}
            >
              Stop
            </button>
          </div>
        </div>
      </div>
    );
  }
}
