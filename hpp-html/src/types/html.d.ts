// temporary definition

declare module "@hyperapp/html" {
  import { PropList, VNode } from "hyperapp";

  function main<S>(props: PropList<S>, children?: VNode<S> | readonly VNode<S>[]): any;
  function h1<S>(props: PropList<S>, children?: VNode<S> | readonly VNode<S>[]): any;
  function h2<S>(props: PropList<S>, children?: VNode<S> | readonly VNode<S>[]): any;
  function h3<S>(props: PropList<S>, children?: VNode<S> | readonly VNode<S>[]): any;
  function h4<S>(props: PropList<S>, children?: VNode<S> | readonly VNode<S>[]): any;
  function h5<S>(props: PropList<S>, children?: VNode<S> | readonly VNode<S>[]): any;
  function h6<S>(props: PropList<S>, children?: VNode<S> | readonly VNode<S>[]): any;
  function div<S>(props: PropList<S>, children?: VNode<S> | readonly VNode<S>[]): any;
  function button<S>(props: PropList<S>, children?: VNode<S> | readonly VNode<S>[]): any;
}
