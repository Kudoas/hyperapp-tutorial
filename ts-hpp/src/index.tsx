import { h, app } from "hyperapp";

const state = {
  greeting: "こんにちは世界",
};

const hoge = (state: any) => (
  <div>
    <h1>{state.greeting}</h1>
  </div>
);

app({
  init: state,
  view: hoge,
  node: document.getElementById("app"),
});
