import { h, app } from "https://unpkg.com/hyperapp@2.0.3";
import { onAnimationFrame } from "https://unpkg.com/@hyperapp/events@0.0.3";

// effect, subscription

// onAnimationFrame
// export var onAnimationFrame = (function (fx) {
//   return function (action) {
//     return [fx, { action: action }];
//   };
// })(function (dispatch, props) {
//   var id = requestAnimationFrame(function frame(timestamp) {
//     id = requestAnimationFrame(frame);
//     dispatch(props.action, timestamp);
//   });
//   return function () {
//     cancelAnimationFrame(id);
//   };
// });

// このactionsをdispatchし続ける方法がない...
const UpdateTime = (state, timestamp) =>
  state.mode !== "running"
    ? state
    : state.remainingTime < 0
    ? Cancel(state)
    : {
        ...state,
        remainingTime: state.duration + state.startedTime - timestamp,
      };

// actions
const DURATION = 15000;

const Start = (state, event) =>
  state.mode === "stopped"
    ? {
        mode: "running",
        startedTime: event.timeStamp,
        remainingTime: DURATION,
        duration: DURATION,
      }
    : state;
const Pause = (state) =>
  state.mode === "running"
    ? {
        ...state,
        mode: "paused",
      }
    : state;
const Continue = (state, event) =>
  state.mode === "paused"
    ? {
        ...state,
        mode: "running",
        statedTime: event.timeStamp,
        duration: state.remainingTime,
      }
    : state;
const Cancel = (state) => ({ ...state, mode: "stopped" });

// view
// ...

app({
  init: { mode: "stopped" },
  view: (state) =>
    h("div", {}, [
      h("p", {}, [
        state.mode == "stopped"
          ? h("button", { onclick: Start }, "START")
          : h("button", { onclick: Cancel }, "CANCEL"),
        state.mode === "paused"
          ? h("button", { onclick: Continue }, "CONTINUE")
          : h(
              "button",
              {
                disabled: state.mode === "stopped",
                onclick: Pause,
              },
              "PAUSE"
            ),
      ]),
      h("p", {}, ["Current state: ", state.mode]),
      h("div", { class: "gauge" }, [
        h("div", {
          class: "gauge-meter",
          style: {
            width: state.mode !== "stopped" ? (100 * state.remainingTime) / DURATION + "%" : "100%",
          },
        }),
        state.mode !== "stopped" &&
          h("p", { class: "gauge-text" }, [Math.ceil(state.remainingTime / 1000), " s"]),
      ]),
    ]),
  subscriptions: (state) => [state.mode === "running" && onAnimationFrame(UpdateTime)],
  node: document.getElementById("app"),
});
