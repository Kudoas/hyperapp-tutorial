import { h, text, app } from "hyperapp";

const AddTodo = (state: any) => ({
  ...state,
  todos: state.todos.concat(state.value),
});

const NewValue = (state: any, event: any) => ({
  ...state,
  value: event.target.value,
});

const Component = () => <h1>hoge</h1>;

app({
  init: { todos: [], value: "" },
  view: () => (
    <div>
      <h1>hoge</h1>
    </div>
  ),
  node: document.getElementById("app"),
});
