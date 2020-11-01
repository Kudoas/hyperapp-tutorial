// Minimum TypeScript Version: 3.7

declare module "hyperapp" {
  // The `app` function initiates a Hyperapp application. `app` along with
  // effects are the only places where side effects are allowed.
  function app<S>(props: App<S>): Dispatch<S>;

  // The `h` function builds a virtual DOM node.
  function h<S>(
    type: string,
    props: PropList<S>,
    children?: VNode<S> | readonly VNode<S>[]
  ): VDOM<S>;

  // The `memo` function stores a view along with properties for it.
  function memo<S>(view: View<S>, props: PropList<S>): Partial<VDOM<S>>;

  // The `text` function creates a virtual DOM node representing plain text.
  function text<S>(value: number | string, node?: Node): VDOM<S>;

  // ---------------------------------------------------------------------------

  // A Hyperapp application instance has an initial state and a base view.
  // It must also be mounted over an available DOM element.
  type App<S> = Readonly<{
    // init: Transition<S> | Action<S>
    init: State<S> | EffectfulState<S> | Action<S>;
    view: View<S>;
    node: HTMLElement | null;
    subscriptions?: Subscription<S>;
    middleware?: Middleware<S>;
  }>;

  // A view builds a virtual DOM node representation of the application state.
  type View<S> = (state: State<S>) => VDOM<S>;

  // A subscription is a set of recurring effects.
  type Subscription<S> = (state: State<S>) => Subscriber<S>[];

  // A subscriber reacts to subscription updates.
  type Subscriber<S, D = any> = boolean | undefined | Effect<S, D> | Unsubscribe;

  // A subscriber ideally provides a function that cancels itself properly.
  type Unsubscribe = () => void;

  // Middleware allows for custom processing during dispatching.
  type Middleware<S> = (dispatch: Dispatch<S>) => Dispatch<S>;

  // ---------------------------------------------------------------------------

  // A dispatched action handles an event in the context of the current state.
  type Dispatch<S> = (action: Action<S>, props?: Payload<any>) => void;

  // An action transforms existing state and/or wraps another action.
  type Action<S, P = any> = ActionTransform<S, P> | ActionDescriptor<S, P>;
  type ActionTransform<S, P = any> = (
    state: State<S>,
    props?: Payload<P>
  ) => State<S> | EffectfulState<S> | Action<S>;
  type ActionDescriptor<S, P> = [Action<S, P>, Payload<P>];

  // A transform carries out the transition from one state to another.
  type Transform<S, P = any> = (
    state: State<S>,
    props?: Payload<P>
  ) => State<S> | EffectfulState<S>;

  // A payload is data external to state that is given to an action or effect.
  type Payload<P> = P;

  // Application state is accessible in every view, action, and subscription.
  type State<S> = S;

  // Transformed state can be paired with a list of effects to run.
  type EffectfulState<S, D = any> = [State<S>, ...EffectDescriptor<S, D>[]];

  // An effect descriptor describes how an effect should be invoked.
  // A function that creates this is called an effect constructor.
  type EffectDescriptor<S, D> = [Effect<S, D>, Payload<D>];

  // An effect is where side effects and any additional dispatching occur.
  // An effect used in a subscription should be able to unsubscribe.
  type Effect<S, D> = (
    dispatch: Dispatch<S>,
    props?: Payload<D>
  ) => void | Unsubscribe | Promise<void | Unsubscribe>;

  // ---------------------------------------------------------------------------

  // A virtual DOM node represents an actual DOM element.
  type VDOM<S> = {
    readonly type: string;
    readonly props: PropList<S>;
    readonly children: VNode<S>[];
    node: MaybeNode;
    readonly tag?: Tag<S>;
    readonly key: Key;
    memo?: PropList<S>;
  };

  // A key can uniquely associate a virtual DOM node with a certain DOM element.
  type Key = string | null | undefined;

  // Actual DOM nodes will be manipulated depending on how property patching goes.
  type MaybeNode = null | undefined | Node;

  // A virtual node is a convenience layer over a virtual DOM node.
  type VNode<S> = false | null | undefined | VDOM<S>;

  // A virtual DOM node's tag has metadata relevant to it. Virtual DOM nodes are
  // tagged by their type to assist rendering.
  type Tag<S> = VDOMNodeType | View<S>;

  // These are based on actual DOM node types:
  // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
  const enum VDOMNodeType {
    SSR = 1,
    Text = 3,
  }

  // Virtual DOM properties will often correspond to HTML attributes.
  type PropList<S> = Readonly<
    ElementCreationOptions &
      EventActions<S> & {
        [_: string]: unknown;
        class?: ClassProp;
        key?: Key;
        style?: StyleProp;
      }
  >;

  // The `class` property represents an HTML class attribute string.
  type ClassProp = false | string | Record<string, boolean> | ClassProp[];

  // The `style` property represents inline CSS.
  type StyleProp = {
    [K in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[K] | null;
  } & { [index: number]: never }; // For some reason we need this to prevent `style` from being a string.

  // Event handlers are implemented using actions.
  type EventActions<S> = { [K in keyof EventsMap]?: Action<S, EventsMap[K]> };
  type EventsMap = OnHTMLElementEventMap & OnWindowEventMap & { onsearch: Event };

  // ---------------------------------------------------------------------------

  // Due to current limitations with TypeScript (which will get resolved in the
  // future: https://devblogs.microsoft.com/typescript/announcing-typescript-4-1-beta/#key-remapping-mapped-types),
  // here is a collection of modified copies of relevant event maps from
  // TypeScript's "lib.dom.d.ts" definition file to assist with defining
  // `EventActions`:

  type OnElementEventMap = {
    onfullscreenchange: Event;
    onfullscreenerror: Event;
  };

  type OnGlobalEventHandlersEventMap = {
    onabort: UIEvent;
    onanimationcancel: AnimationEvent;
    onanimationend: AnimationEvent;
    onanimationiteration: AnimationEvent;
    onanimationstart: AnimationEvent;
    onauxclick: MouseEvent;
    onblur: FocusEvent;
    oncancel: Event;
    oncanplay: Event;
    oncanplaythrough: Event;
    onchange: Event;
    onclick: MouseEvent;
    onclose: Event;
    oncontextmenu: MouseEvent;
    oncuechange: Event;
    ondblclick: MouseEvent;
    ondrag: DragEvent;
    ondragend: DragEvent;
    ondragenter: DragEvent;
    ondragexit: Event;
    ondragleave: DragEvent;
    ondragover: DragEvent;
    ondragstart: DragEvent;
    ondrop: DragEvent;
    ondurationchange: Event;
    onemptied: Event;
    onended: Event;
    onerror: ErrorEvent;
    onfocus: FocusEvent;
    onfocusin: FocusEvent;
    onfocusout: FocusEvent;
    ongotpointercapture: PointerEvent;
    oninput: Event;
    oninvalid: Event;
    onkeydown: KeyboardEvent;
    onkeypress: KeyboardEvent;
    onkeyup: KeyboardEvent;
    onload: Event;
    onloadeddata: Event;
    onloadedmetadata: Event;
    onloadstart: Event;
    onlostpointercapture: PointerEvent;
    onmousedown: MouseEvent;
    onmouseenter: MouseEvent;
    onmouseleave: MouseEvent;
    onmousemove: MouseEvent;
    onmouseout: MouseEvent;
    onmouseover: MouseEvent;
    onmouseup: MouseEvent;
    onpause: Event;
    onplay: Event;
    onplaying: Event;
    onpointercancel: PointerEvent;
    onpointerdown: PointerEvent;
    onpointerenter: PointerEvent;
    onpointerleave: PointerEvent;
    onpointermove: PointerEvent;
    onpointerout: PointerEvent;
    onpointerover: PointerEvent;
    onpointerup: PointerEvent;
    onprogress: ProgressEvent;
    onratechange: Event;
    onreset: Event;
    onresize: UIEvent;
    onscroll: Event;
    onsecuritypolicyviolation: SecurityPolicyViolationEvent;
    onseeked: Event;
    onseeking: Event;
    onselect: Event;
    onselectionchange: Event;
    onselectstart: Event;
    onstalled: Event;
    onsubmit: Event;
    onsuspend: Event;
    ontimeupdate: Event;
    ontoggle: Event;
    ontouchcancel: TouchEvent;
    ontouchend: TouchEvent;
    ontouchmove: TouchEvent;
    ontouchstart: TouchEvent;
    ontransitioncancel: TransitionEvent;
    ontransitionend: TransitionEvent;
    ontransitionrun: TransitionEvent;
    ontransitionstart: TransitionEvent;
    onvolumechange: Event;
    onwaiting: Event;
    onwheel: WheelEvent;
  };

  type OnDocumentAndElementEventHandlersEventMap = {
    oncopy: ClipboardEvent;
    oncut: ClipboardEvent;
    onpaste: ClipboardEvent;
  };

  type OnHTMLElementEventMap = OnElementEventMap &
    OnGlobalEventHandlersEventMap &
    OnDocumentAndElementEventHandlersEventMap;

  type OnWindowEventHandlersEventMap = {
    onafterprint: Event;
    onbeforeprint: Event;
    onbeforeunload: BeforeUnloadEvent;
    onhashchange: HashChangeEvent;
    onlanguagechange: Event;
    onmessage: MessageEvent;
    onmessageerror: MessageEvent;
    onoffline: Event;
    ononline: Event;
    onpagehide: PageTransitionEvent;
    onpageshow: PageTransitionEvent;
    onpopstate: PopStateEvent;
    onrejectionhandled: PromiseRejectionEvent;
    onstorage: StorageEvent;
    onunhandledrejection: PromiseRejectionEvent;
    onunload: Event;
  };

  type OnWindowEventMap = OnGlobalEventHandlersEventMap &
    OnWindowEventHandlersEventMap & {
      onabort: UIEvent;
      onafterprint: Event;
      onbeforeprint: Event;
      onbeforeunload: BeforeUnloadEvent;
      onblur: FocusEvent;
      oncanplay: Event;
      oncanplaythrough: Event;
      onchange: Event;
      onclick: MouseEvent;
      oncompassneedscalibration: Event;
      oncontextmenu: MouseEvent;
      ondblclick: MouseEvent;
      ondevicelight: DeviceLightEvent;
      ondevicemotion: DeviceMotionEvent;
      ondeviceorientation: DeviceOrientationEvent;
      ondeviceorientationabsolute: DeviceOrientationEvent;
      ondrag: DragEvent;
      ondragend: DragEvent;
      ondragenter: DragEvent;
      ondragleave: DragEvent;
      ondragover: DragEvent;
      ondragstart: DragEvent;
      ondrop: DragEvent;
      ondurationchange: Event;
      onemptied: Event;
      onended: Event;
      onerror: ErrorEvent;
      onfocus: FocusEvent;
      onhashchange: HashChangeEvent;
      oninput: Event;
      oninvalid: Event;
      onkeydown: KeyboardEvent;
      onkeypress: KeyboardEvent;
      onkeyup: KeyboardEvent;
      onload: Event;
      onloadeddata: Event;
      onloadedmetadata: Event;
      onloadstart: Event;
      onmessage: MessageEvent;
      onmousedown: MouseEvent;
      onmouseenter: MouseEvent;
      onmouseleave: MouseEvent;
      onmousemove: MouseEvent;
      onmouseout: MouseEvent;
      onmouseover: MouseEvent;
      onmouseup: MouseEvent;
      onmousewheel: Event;
      onMSGestureChange: Event;
      onMSGestureDoubleTap: Event;
      onMSGestureEnd: Event;
      onMSGestureHold: Event;
      onMSGestureStart: Event;
      onMSGestureTap: Event;
      onMSInertiaStart: Event;
      onMSPointerCancel: Event;
      onMSPointerDown: Event;
      onMSPointerEnter: Event;
      onMSPointerLeave: Event;
      onMSPointerMove: Event;
      onMSPointerOut: Event;
      onMSPointerOver: Event;
      onMSPointerUp: Event;
      onoffline: Event;
      ononline: Event;
      onorientationchange: Event;
      onpagehide: PageTransitionEvent;
      onpageshow: PageTransitionEvent;
      onpause: Event;
      onplay: Event;
      onplaying: Event;
      onpopstate: PopStateEvent;
      onprogress: ProgressEvent<Window>;
      onratechange: Event;
      onreadystatechange: ProgressEvent<Window>;
      onreset: Event;
      onresize: UIEvent;
      onscroll: Event;
      onseeked: Event;
      onseeking: Event;
      onselect: Event;
      onstalled: Event;
      onstorage: StorageEvent;
      onsubmit: Event;
      onsuspend: Event;
      ontimeupdate: Event;
      onunload: Event;
      onvolumechange: Event;
      onvrdisplayactivate: Event;
      onvrdisplayblur: Event;
      onvrdisplayconnect: Event;
      onvrdisplaydeactivate: Event;
      onvrdisplaydisconnect: Event;
      onvrdisplayfocus: Event;
      onvrdisplaypointerrestricted: Event;
      onvrdisplaypointerunrestricted: Event;
      onvrdisplaypresentchange: Event;
      onwaiting: Event;
    };

  namespace JSX {
    // tslint:disable-next-line:no-empty-interface
    interface Element extends React.ReactElement<any, any> {}
    interface ElementClass extends React.Component<any> {
      render(): React.ReactNode;
    }
    interface ElementAttributesProperty {
      props: {};
    }
    interface ElementChildrenAttribute {
      children: {};
    }

    // tslint:disable-next-line:no-empty-interface
    interface IntrinsicAttributes extends React.Attributes {}
    // tslint:disable-next-line:no-empty-interface
    interface IntrinsicClassAttributes<T> extends React.ClassAttributes<T> {}

    interface IntrinsicElements {
      // HTML
      a: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
      abbr: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      address: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      area: React.DetailedHTMLProps<React.AreaHTMLAttributes<HTMLAreaElement>, HTMLAreaElement>;
      article: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      aside: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      audio: React.DetailedHTMLProps<React.AudioHTMLAttributes<HTMLAudioElement>, HTMLAudioElement>;
      b: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      base: React.DetailedHTMLProps<React.BaseHTMLAttributes<HTMLBaseElement>, HTMLBaseElement>;
      bdi: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      bdo: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      big: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      blockquote: React.DetailedHTMLProps<React.BlockquoteHTMLAttributes<HTMLElement>, HTMLElement>;
      body: React.DetailedHTMLProps<React.HTMLAttributes<HTMLBodyElement>, HTMLBodyElement>;
      br: React.DetailedHTMLProps<React.HTMLAttributes<HTMLBRElement>, HTMLBRElement>;
      button: React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
      >;
      canvas: React.DetailedHTMLProps<
        React.CanvasHTMLAttributes<HTMLCanvasElement>,
        HTMLCanvasElement
      >;
      caption: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      cite: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      code: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      col: React.DetailedHTMLProps<
        React.ColHTMLAttributes<HTMLTableColElement>,
        HTMLTableColElement
      >;
      colgroup: React.DetailedHTMLProps<
        React.ColgroupHTMLAttributes<HTMLTableColElement>,
        HTMLTableColElement
      >;
      data: React.DetailedHTMLProps<React.DataHTMLAttributes<HTMLDataElement>, HTMLDataElement>;
      datalist: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDataListElement>,
        HTMLDataListElement
      >;
      dd: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      del: React.DetailedHTMLProps<React.DelHTMLAttributes<HTMLElement>, HTMLElement>;
      details: React.DetailedHTMLProps<React.DetailsHTMLAttributes<HTMLElement>, HTMLElement>;
      dfn: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      dialog: React.DetailedHTMLProps<
        React.DialogHTMLAttributes<HTMLDialogElement>,
        HTMLDialogElement
      >;
      div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
      dl: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDListElement>, HTMLDListElement>;
      dt: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      em: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      embed: React.DetailedHTMLProps<React.EmbedHTMLAttributes<HTMLEmbedElement>, HTMLEmbedElement>;
      fieldset: React.DetailedHTMLProps<
        React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
        HTMLFieldSetElement
      >;
      figcaption: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      figure: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      footer: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      form: React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
      h1: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h2: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h3: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h4: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h5: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h6: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      head: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadElement>, HTMLHeadElement>;
      header: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      hgroup: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      hr: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHRElement>, HTMLHRElement>;
      html: React.DetailedHTMLProps<React.HtmlHTMLAttributes<HTMLHtmlElement>, HTMLHtmlElement>;
      i: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      iframe: React.DetailedHTMLProps<
        React.IframeHTMLAttributes<HTMLIFrameElement>,
        HTMLIFrameElement
      >;
      img: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
      input: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
      ins: React.DetailedHTMLProps<React.InsHTMLAttributes<HTMLModElement>, HTMLModElement>;
      kbd: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      keygen: React.DetailedHTMLProps<React.KeygenHTMLAttributes<HTMLElement>, HTMLElement>;
      label: React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
      legend: React.DetailedHTMLProps<React.HTMLAttributes<HTMLLegendElement>, HTMLLegendElement>;
      li: React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;
      link: React.DetailedHTMLProps<React.LinkHTMLAttributes<HTMLLinkElement>, HTMLLinkElement>;
      main: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      map: React.DetailedHTMLProps<React.MapHTMLAttributes<HTMLMapElement>, HTMLMapElement>;
      mark: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      menu: React.DetailedHTMLProps<React.MenuHTMLAttributes<HTMLElement>, HTMLElement>;
      menuitem: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      meta: React.DetailedHTMLProps<React.MetaHTMLAttributes<HTMLMetaElement>, HTMLMetaElement>;
      meter: React.DetailedHTMLProps<React.MeterHTMLAttributes<HTMLElement>, HTMLElement>;
      nav: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      noindex: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      noscript: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      object: React.DetailedHTMLProps<
        React.ObjectHTMLAttributes<HTMLObjectElement>,
        HTMLObjectElement
      >;
      ol: React.DetailedHTMLProps<React.OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>;
      optgroup: React.DetailedHTMLProps<
        React.OptgroupHTMLAttributes<HTMLOptGroupElement>,
        HTMLOptGroupElement
      >;
      option: React.DetailedHTMLProps<
        React.OptionHTMLAttributes<HTMLOptionElement>,
        HTMLOptionElement
      >;
      output: React.DetailedHTMLProps<React.OutputHTMLAttributes<HTMLElement>, HTMLElement>;
      p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
      param: React.DetailedHTMLProps<React.ParamHTMLAttributes<HTMLParamElement>, HTMLParamElement>;
      picture: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      pre: React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>;
      progress: React.DetailedHTMLProps<
        React.ProgressHTMLAttributes<HTMLProgressElement>,
        HTMLProgressElement
      >;
      q: React.DetailedHTMLProps<React.QuoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;
      rp: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      rt: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      ruby: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      s: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      samp: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      slot: React.DetailedHTMLProps<React.SlotHTMLAttributes<HTMLSlotElement>, HTMLSlotElement>;
      script: React.DetailedHTMLProps<
        React.ScriptHTMLAttributes<HTMLScriptElement>,
        HTMLScriptElement
      >;
      section: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      select: React.DetailedHTMLProps<
        React.SelectHTMLAttributes<HTMLSelectElement>,
        HTMLSelectElement
      >;
      small: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      source: React.DetailedHTMLProps<
        React.SourceHTMLAttributes<HTMLSourceElement>,
        HTMLSourceElement
      >;
      span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
      strong: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      style: React.DetailedHTMLProps<React.StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>;
      sub: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      summary: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      sup: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      table: React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>;
      template: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLTemplateElement>,
        HTMLTemplateElement
      >;
      tbody: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLTableSectionElement>,
        HTMLTableSectionElement
      >;
      td: React.DetailedHTMLProps<
        React.TdHTMLAttributes<HTMLTableDataCellElement>,
        HTMLTableDataCellElement
      >;
      textarea: React.DetailedHTMLProps<
        React.TextareaHTMLAttributes<HTMLTextAreaElement>,
        HTMLTextAreaElement
      >;
      tfoot: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLTableSectionElement>,
        HTMLTableSectionElement
      >;
      th: React.DetailedHTMLProps<
        React.ThHTMLAttributes<HTMLTableHeaderCellElement>,
        HTMLTableHeaderCellElement
      >;
      thead: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLTableSectionElement>,
        HTMLTableSectionElement
      >;
      time: React.DetailedHTMLProps<React.TimeHTMLAttributes<HTMLElement>, HTMLElement>;
      title: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTitleElement>, HTMLTitleElement>;
      tr: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;
      track: React.DetailedHTMLProps<React.TrackHTMLAttributes<HTMLTrackElement>, HTMLTrackElement>;
      u: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      ul: React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
      var: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      video: React.DetailedHTMLProps<React.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>;
      wbr: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      webview: React.DetailedHTMLProps<
        React.WebViewHTMLAttributes<HTMLWebViewElement>,
        HTMLWebViewElement
      >;

      // SVG
      svg: React.SVGProps<SVGSVGElement>;

      animate: React.SVGProps<SVGElement>; // TODO: It is SVGAnimateElement but is not in TypeScript's lib.dom.d.ts for now.
      animateMotion: React.SVGProps<SVGElement>;
      animateTransform: React.SVGProps<SVGElement>; // TODO: It is SVGAnimateTransformElement but is not in TypeScript's lib.dom.d.ts for now.
      circle: React.SVGProps<SVGCircleElement>;
      clipPath: React.SVGProps<SVGClipPathElement>;
      defs: React.SVGProps<SVGDefsElement>;
      desc: React.SVGProps<SVGDescElement>;
      ellipse: React.SVGProps<SVGEllipseElement>;
      feBlend: React.SVGProps<SVGFEBlendElement>;
      feColorMatrix: React.SVGProps<SVGFEColorMatrixElement>;
      feComponentTransfer: React.SVGProps<SVGFEComponentTransferElement>;
      feComposite: React.SVGProps<SVGFECompositeElement>;
      feConvolveMatrix: React.SVGProps<SVGFEConvolveMatrixElement>;
      feDiffuseLighting: React.SVGProps<SVGFEDiffuseLightingElement>;
      feDisplacementMap: React.SVGProps<SVGFEDisplacementMapElement>;
      feDistantLight: React.SVGProps<SVGFEDistantLightElement>;
      feDropShadow: React.SVGProps<SVGFEDropShadowElement>;
      feFlood: React.SVGProps<SVGFEFloodElement>;
      feFuncA: React.SVGProps<SVGFEFuncAElement>;
      feFuncB: React.SVGProps<SVGFEFuncBElement>;
      feFuncG: React.SVGProps<SVGFEFuncGElement>;
      feFuncR: React.SVGProps<SVGFEFuncRElement>;
      feGaussianBlur: React.SVGProps<SVGFEGaussianBlurElement>;
      feImage: React.SVGProps<SVGFEImageElement>;
      feMerge: React.SVGProps<SVGFEMergeElement>;
      feMergeNode: React.SVGProps<SVGFEMergeNodeElement>;
      feMorphology: React.SVGProps<SVGFEMorphologyElement>;
      feOffset: React.SVGProps<SVGFEOffsetElement>;
      fePointLight: React.SVGProps<SVGFEPointLightElement>;
      feSpecularLighting: React.SVGProps<SVGFESpecularLightingElement>;
      feSpotLight: React.SVGProps<SVGFESpotLightElement>;
      feTile: React.SVGProps<SVGFETileElement>;
      feTurbulence: React.SVGProps<SVGFETurbulenceElement>;
      filter: React.SVGProps<SVGFilterElement>;
      foreignObject: React.SVGProps<SVGForeignObjectElement>;
      g: React.SVGProps<SVGGElement>;
      image: React.SVGProps<SVGImageElement>;
      line: React.SVGProps<SVGLineElement>;
      linearGradient: React.SVGProps<SVGLinearGradientElement>;
      marker: React.SVGProps<SVGMarkerElement>;
      mask: React.SVGProps<SVGMaskElement>;
      metadata: React.SVGProps<SVGMetadataElement>;
      mpath: React.SVGProps<SVGElement>;
      path: React.SVGProps<SVGPathElement>;
      pattern: React.SVGProps<SVGPatternElement>;
      polygon: React.SVGProps<SVGPolygonElement>;
      polyline: React.SVGProps<SVGPolylineElement>;
      radialGradient: React.SVGProps<SVGRadialGradientElement>;
      rect: React.SVGProps<SVGRectElement>;
      stop: React.SVGProps<SVGStopElement>;
      switch: React.SVGProps<SVGSwitchElement>;
      symbol: React.SVGProps<SVGSymbolElement>;
      text: React.SVGProps<SVGTextElement>;
      textPath: React.SVGProps<SVGTextPathElement>;
      tspan: React.SVGProps<SVGTSpanElement>;
      use: React.SVGProps<SVGUseElement>;
      view: React.SVGProps<SVGViewElement>;
    }
  }
}
