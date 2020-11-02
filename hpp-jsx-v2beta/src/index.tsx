import { h, app, VDOM } from "hyperapp";

type State = {
  greeting: string;
};

const state = {
  greeting: "こんにちは世界",
};

const view = (state: State): VDOM<State> => <h1>{state.greeting}</h1>;

app({
  init: state,
  view: view,
  node: document.getElementById("app"),
});
