import "./style";
import { Component, render } from "preact";
import Timer from "./timer";
import Modal from "./modal";

const delayedPromise = (timeInMillis = 2000) => {
  return new Promise((resolve, reject) => {
    timeInMillis > 0 && setTimeout(resolve, timeInMillis);
    if (timeInMillis === 0) return resolve();
  });
};

const Alarm = new Audio("http://soundbible.com/grab.php?id=1787&type=mp3");

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      taskDetails: {
        name: null,
        startTime: null,
        endTime: null
      }
    };

    this.onSessionTimerStart = this.onSessionTimerStart.bind(this);
    this.onSessionTimerEnd = this.onSessionTimerEnd.bind(this);
    this.onBreakTimerStart = this.onBreakTimerStart.bind(this);
    this.onBreakTimerEnd = this.onBreakTimerEnd.bind(this);

    this.sessionTimer = null;
    this.breakTimer = null;
    this.inputRef = null;
  }

  onSessionTimerStart() {
    if (this.breakTimer !== null) {
      this.breakTimer.stopTimer("onSessionTimerStart");
    } else {
      alert(`onSessionTimerStart(): this.breakTimer is ${this.breakTimer}`);
    }
  }

  onSessionTimerEnd() {
    if (this.breakTimer !== null) {
      this.breakTimer.startTimer("onSessionTimerEnd");
    } else {
      alert(`onSessionTimerEnd(): this.breakTimer is ${this.breakTimer}`);
    }
  }

  onBreakTimerStart() {
    if (this.sessionTimer !== null) {
      this.sessionTimer.stopTimer("onBreakTimerStart");
    } else {
      alert(`onBreakTimerStart(): this.sessionTimer is ${this.sessionTimer}`);
    }
  }

  onBreakTimerEnd() {
    if (this.sessionTimer !== null) {
      this.sessionTimer.startTimer("onBreakTimerEnd");
    } else {
      alert(`onBreakTimerEnd(): this.sessionTimer is ${this.sessionTimer}`);
    }
  }

  render() {
    return (
      <div>
        <h1>Simple Pomodoro timer</h1>
        <Timer
          label="Session"
          seconds={0}
          minutes={25}
          hours={0}
          ref={sessionTimer => (this.sessionTimer = sessionTimer)}
          onTimerStart={() => {
            delayedPromise(3000).then(() => {
              Alarm.pause();
            });
            this.onSessionTimerStart();
          }}
          onTimerEnd={() => {
            this.onSessionTimerEnd();
            Alarm.play();
          }}
          Alarm={Alarm}
          task={this.state.taskDetails.name}
        />
        <section>
          <form>
            <input
              placeholder="Task name"
              value={this.state.taskDetails.name}
              style={{
                padding: 20,
                border: `1px solid ${
                  this.state.taskDetails.name === null ? "#EEE" : "#38AC5F"
                }`,
                borderRadius: 10,
                boxShadow: "0 0 10px 0 #ccc",
                width: "50%",
                fontSize: 16
              }}
              ref={ref => (this.inputRef = ref)}
            />
            <input
              type="submit"
              disabled={true}
              style={{
                padding: 20,
                marginLeft: 20,
                color: "#FFF",
                backgroundColor:
                  this.state.taskDetails.name === null ? "#EEE" : "#38AC5F",
                border: `1px solid ${
                  this.state.taskDetails.name === null ? "#EEE" : "#38AC5F"
                }`,
                cursor:
                  this.state.taskDetails.name === null
                    ? "not-allowed"
                    : "pointer",
                borderRadius: 10,
                boxShadow: "0 0 10px 0 #ccc",
                width: "20%",
                fontSize: 16
              }}
              value="Add task"
            />
          </form>
        </section>
        <Timer
          label="Break"
          seconds={0}
          minutes={5}
          hours={0}
          ref={breakTimer => (this.breakTimer = breakTimer)}
          onTimerStart={() => {
            delayedPromise(3000).then(() => {
              Alarm.pause();
            });
            this.onBreakTimerStart();
          }}
          onTimerEnd={() => {
            this.onBreakTimerEnd();
            Alarm.play();
          }}
          Alarm={Alarm}
          task={this.state.taskDetails.name}
        />
      </div>
    );
  }
}

if (typeof window !== "undefined") {
  render(<App />, document.getElementById("root"));
}
