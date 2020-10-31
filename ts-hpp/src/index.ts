import { app } from "hyperapp";
import html from "hyperlit";

const state = {
  greeting: "こんにちは世界",
};

const view = (state: any) => html`<h1>${state.greeting}</h1>`;

app({
  init: state,
  view: view,
  node: document.getElementById("app"),
});
