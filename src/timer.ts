export class Timer {
  timerValue: number;
  currentTimerValue: number;
  isPaused: boolean = false;
  isOver: boolean = false;
  timeDisplayer: any;
  callBackFunction: any;
  developers: Array<any> = [];

  constructor(value: number = 1) {
    this.timerValue = this.currentTimerValue = this.minutesToSeconds(value);
  }

  initTimer(value: number) {
    this.timerValue = this.currentTimerValue = this.minutesToSeconds(value);
  }

  minutesToSeconds(value: number): number {
    return value * 60;
  }

  secondsToReadableString(value: string): string {
    const sec_num: number = parseInt(value, 10); // don't forget the second param
    const minutes: number = Math.floor(sec_num / 60);
    const seconds: number = sec_num - minutes * 60;

    let dminutes: string = minutes.toString();
    let dseconds: string = seconds.toString();

    if (minutes < 10) {
      dminutes = "0" + minutes;
    }
    if (seconds < 10) {
      dseconds = "0" + seconds;
    }
    return `${dminutes}:${dseconds}`;
  }

  formatStatusBar(name: string, time: string): string {
    return `$(organization) ${name} ${time}`;
  }

  pauseTimer(displayMessage: (message: string) => void) {
    if (this.isOver) {
      this.currentTimerValue = this.timerValue;
      this.developers.push(this.developers.shift());
      this.isOver = false;
      this.startTimer(
        this.developers,
        this.timeDisplayer,
        this.callBackFunction
      );
    } else {
      this.isPaused = !this.isPaused;
      const message = this.isPaused ? "Timer paused" : "Timer resumed";
      displayMessage(message);
    }
  }

  startTimer(
    developers: Array<string>,
    timeDisplayer?: (currentRemainingTime: string) => void,
    callBackFunction?: (name?: string) => void
  ) {
    if (timeDisplayer) {
      this.timeDisplayer = timeDisplayer;
    }
    if (callBackFunction) {
      this.callBackFunction = callBackFunction;
    }
    this.developers = developers;
    let interval = setInterval(() => {
      if (!this.isPaused) {
        if (this.timeDisplayer) {
          this.timeDisplayer(
            this.formatStatusBar(
              this.developers.length > 0 && this.developers[0]
                ? `${this.developers[0]} - `
                : "",
              this.secondsToReadableString(this.currentTimerValue.toString())
            )
          );
        }
        if (this.currentTimerValue === 0) {
          clearInterval(interval);
          this.isOver = true;
          if (callBackFunction) {
            if (this.developers.length > 1) {
              callBackFunction(this.developers[1]);
            } else {
              callBackFunction();
            }
          }
        }
        this.currentTimerValue = this.currentTimerValue - 1;
      }
    }, 1000);
  }
}
