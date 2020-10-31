import { h, app, VDOM } from "hyperapp";

const state = {
  greeting: "こんにちは世界",
};

const view = (state: any): VDOM<any> => <h1>{state.greeting}</h1>;

app({
  init: state,
  view: view,
  node: document.getElementById("app"),
});
