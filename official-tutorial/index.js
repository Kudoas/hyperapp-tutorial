import { h, app } from "https://unpkg.com/hyperapp@2.0.3";

// -- EFFECTS & SUBSCRIPTIONS --
const fetchJSONData = (dispatch, options) =>
  fetch(options.url)
    .then((response) => response.json())
    .then((data) => dispatch(options.onresponse, data))
    .catch(() => dispatch(options.onresponse, {}))
    .finally(() => dispatch(options.onfinish));

const SetFetching = (state, fetching) => ({ ...state, fetching });

const storyLoader = (searchWord) => [
  fetchJSONData,
  {
    url: `https://hyperapp.dev/tutorial-assets/stories/${searchWord.toLowerCase()}.json`,
    onresponse: GotStories,
    onstart: [SetFetching, true],
    onfinish: [SetFetching, false],
  },
];

const intervalSub = (dispatch, props) => {
  const interval = setInterval(() => dispatch(props.action), props.time);
  return () => clearInterval(interval);
};

// -- ACTIONS --
const StartEditingFilter = (state) => ({ ...state, editingFilter: true });
const StopEditingFilter = (state) => (
  { ...state, editingFilter: false },
  // effect declarations go here: //
  [
    fetchJSONData,
    {
      url: `https://hyperapp.dev/tutorial-assets/stories/${state.filter.toLowerCase()}.json`,
      onresponse: GotStories,
    },
  ]
);
const SetFilter = (state, word) => ({ ...state, filter: word });
const SelectStory = (state, id) => ({
  ...state, // keep all state the same, except for the following:
  reading: id,
  stories: {
    ...state.stories, //keep stories the same, except for:
    [id]: {
      ...state.stories[id], //keep this story the same, except for:
      seen: true,
    },
  },
});
const GotStories = (state, stories) => ({
  ...state,

  // replace old stories with new,
  // but keep the 'seen' value if it exists
  stories: Object.keys(stories)
    .map((id) => [
      id,
      {
        ...stories[id],
        seen: state.stories[id] && state.stories[id].seen,
      },
    ])
    .reduce((o, [id, story]) => ((o[id] = story), o), {}),

  // in case the current story is in the new list as well,
  // keep it selected, Otherwise select nothing
  reading: stories[state.reading] ? state.reading : null,
});
const ToggleAutoUpdate = (state) => ({
  ...state,
  autoUpdate: !state.autoUpdate,
});

// -- VIEWS ---
const emphasize = (word, string) =>
  string
    .split(" ")
    .map((x) => (x.toLowerCase() === word.toLowerCase() ? h("em", {}, x + " ") : x + " "));

const storyThumbnail = (props) =>
  h(
    "li",
    {
      onclick: [SelectStory, props.id],
      class: {
        unread: props.unread,
        reading: props.reading,
      },
    },
    [
      h("p", { class: "title" }, emphasize(props.filter, props.title)),
      h("p", { class: "author" }, props.author),
    ]
  );

const storyList = (props) =>
  h("div", { class: "stories" }, [
    h(
      "ul",
      {},
      Object.keys(props.stories).map((id) =>
        storyThumbnail({
          id,
          title: props.stories[id].title,
          author: props.stories[id].author,
          unread: !props.stories[id].seen,
          reading: props.reading === id,
          filter: props.filter,
        })
      )
    ),
  ]);

const filterView = (props) =>
  h("div", { class: "filter" }, [
    "Filter:",
    props.editingFilter
      ? h("input", {
          type: "text",
          value: props.filter,
          oninput: [SetFilter, (event) => event.target.value],
        })
      : h("span", { class: "filter-word" }, props.filter),
    props.editingFilter
      ? h("button", { onclick: StopEditingFilter }, "\u2713")
      : h("button", { onclick: StartEditingFilter }, "\u270E"),
  ]);

const storyDetail = (props) =>
  h("div", { class: "story" }, [
    props && h("h1", {}, props.title),
    props &&
      h(
        "p",
        {},
        `
    Lorem ipsum dolor sit amet, consectetur adipiscing
    elit, sed do eiusmod tempor incididunt ut labore et
    dolore magna aliqua. Ut enim ad minim veniam, qui
    nostrud exercitation ullamco laboris nisi ut aliquip
    ex ea commodo consequat.
  `
      ),
    props && h("p", { class: "signature" }, props.author),
  ]);

const autoUpdateView = (props) =>
  h("div", { class: "autoupdate" }, [
    "Auto update: ",
    h("input", {
      type: "checkbox",
      checked: props.autoUpdate,
      oninput: ToggleAutoUpdate,
    }),
  ]);

const container = (content) => h("div", { class: "container" }, content);

// -- RUN --
app({
  init: [
    {
      editingFilter: false,
      autoUpdate: false,
      filter: "ocean",
      reading: null,
      stories: {},
    },
    storyLoader("ocean"),
  ],
  node: document.getElementById("app"),
  view: (state) =>
    container([
      filterView(state),
      storyList(state),
      storyDetail(state.reading && state.stories[state.reading]),
      autoUpdateView(state),
    ]),
  subscriptions: (state) => [
    state.autoUpdate &&
      !state.editingFilter && [
        intervalSub,
        {
          time: 5000, //milliseconds,
          action: StopEditingFilter,
        },
      ],
  ],
});
