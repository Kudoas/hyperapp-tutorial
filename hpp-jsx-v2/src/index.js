import { h, app } from "hyperapp";

const view = () => (
  <div>
    <h1>Hello world</h1>
  </div>
);

app({
  view: view,
  node: document.getElementById(),
});
