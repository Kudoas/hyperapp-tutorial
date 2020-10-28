import { h, text, app } from "hyperapp";

const AddTodo = (state: any) => ({
  ...state,
  todos: state.todos.concat(state.value),
});

const NewValue = (state: any, event: any) => ({
  ...state,
  value: event.target.value,
});

app({
  init: { todos: [], value: "" },
  view: ({ todos, value }) =>
    h("main", {}, [
      h("input", { type: "text", oninput: NewValue, value }),
      h("button", { onclick: AddTodo }, text("Add")),
      h(
        "ul",
        {},
        todos.map((todo) => h("li", {}, text(todo)))
      ),
    ]),
  node: document.getElementById("app"),
});
