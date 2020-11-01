import { h, text, app } from "hyperapp";
import { main, h1, button } from "@hyperapp/html";

type State = {
  count: number;
};

const Subtract = (state: State) => ({ ...state, count: state.count - 1 });
const Add = (state: State) => ({ ...state, count: state.count + 1 });

app({
  init: { count: 0 },
  view: (state: State) =>
    main({}, [
      h1({}, text(state.count)),
      button({ onclick: Subtract }, text("-")),
      button({ onclick: Add }, text("+")),
    ]),
  node: document.getElementById("app"),
});
