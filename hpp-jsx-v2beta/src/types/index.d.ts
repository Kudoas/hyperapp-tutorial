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
}

declare module JSX {
  interface VNode<P = {}> {
    type: string;
    props: P & { children: ComponentChildren };
    key: Key;
    /**
     * ref is not guaranteed by React.ReactElement, for compatibility reasons
     * with popular react libs we define it as optional too
     */
    ref?: Ref<any> | null;
    /**
     * The time this `vnode` started rendering. Will only be set when
     * the devtools are attached.
     * Default value: `0`
     */
    startTime?: number;
    /**
     * The time that the rendering of this `vnode` was completed. Will only be
     * set when the devtools are attached.
     * Default value: `-1`
     */
    endTime?: number;
  }

  type ComponentChild = VNode<any> | object | string | number | boolean | null | undefined;
  type ComponentChildren = ComponentChild[] | ComponentChild;

  interface PreactDOMAttributes {
    children?: ComponentChildren;
    dangerouslySetInnerHTML?: {
      __html: string;
    };
  }

  type TargetedEvent<
    Target extends EventTarget = EventTarget,
    TypedEvent extends Event = Event
  > = Omit<TypedEvent, "currentTarget"> & {
    readonly currentTarget: Target;
  };

  type TargetedAnimationEvent<Target extends EventTarget> = TargetedEvent<Target, AnimationEvent>;
  type TargetedClipboardEvent<Target extends EventTarget> = TargetedEvent<Target, ClipboardEvent>;
  type TargetedCompositionEvent<Target extends EventTarget> = TargetedEvent<
    Target,
    CompositionEvent
  >;
  type TargetedDragEvent<Target extends EventTarget> = TargetedEvent<Target, DragEvent>;
  type TargetedFocusEvent<Target extends EventTarget> = TargetedEvent<Target, FocusEvent>;
  type TargetedKeyboardEvent<Target extends EventTarget> = TargetedEvent<Target, KeyboardEvent>;
  type TargetedMouseEvent<Target extends EventTarget> = TargetedEvent<Target, MouseEvent>;
  type TargetedPointerEvent<Target extends EventTarget> = TargetedEvent<Target, PointerEvent>;
  type TargetedTouchEvent<Target extends EventTarget> = TargetedEvent<Target, TouchEvent>;
  type TargetedTransitionEvent<Target extends EventTarget> = TargetedEvent<Target, TransitionEvent>;
  type TargetedUIEvent<Target extends EventTarget> = TargetedEvent<Target, UIEvent>;
  type TargetedWheelEvent<Target extends EventTarget> = TargetedEvent<Target, WheelEvent>;

  interface EventHandler<E extends TargetedEvent> {
    /**
     * The `this` keyword always points to the DOM element the event handler
     * was invoked on. See: https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Event_handlers#Event_handlers_parameters_this_binding_and_the_return_value
     */
    (this: E["currentTarget"], event: E): void;
  }

  type AnimationEventHandler<Target extends EventTarget> = EventHandler<
    TargetedAnimationEvent<Target>
  >;
  type ClipboardEventHandler<Target extends EventTarget> = EventHandler<
    TargetedClipboardEvent<Target>
  >;
  type CompositionEventHandler<Target extends EventTarget> = EventHandler<
    TargetedCompositionEvent<Target>
  >;
  type DragEventHandler<Target extends EventTarget> = EventHandler<TargetedDragEvent<Target>>;
  type FocusEventHandler<Target extends EventTarget> = EventHandler<TargetedFocusEvent<Target>>;
  type GenericEventHandler<Target extends EventTarget> = EventHandler<TargetedEvent<Target>>;
  type KeyboardEventHandler<Target extends EventTarget> = EventHandler<
    TargetedKeyboardEvent<Target>
  >;
  type MouseEventHandler<Target extends EventTarget> = EventHandler<TargetedMouseEvent<Target>>;
  type PointerEventHandler<Target extends EventTarget> = EventHandler<TargetedPointerEvent<Target>>;
  type TouchEventHandler<Target extends EventTarget> = EventHandler<TargetedTouchEvent<Target>>;
  type TransitionEventHandler<Target extends EventTarget> = EventHandler<
    TargetedTransitionEvent<Target>
  >;
  type UIEventHandler<Target extends EventTarget> = EventHandler<TargetedUIEvent<Target>>;
  type WheelEventHandler<Target extends EventTarget> = EventHandler<TargetedWheelEvent<Target>>;

  interface DOMAttributes<Target extends EventTarget> extends PreactDOMAttributes {
    // Image Events
    onLoad?: GenericEventHandler<Target>;
    onLoadCapture?: GenericEventHandler<Target>;
    onError?: GenericEventHandler<Target>;
    onErrorCapture?: GenericEventHandler<Target>;

    // Clipboard Events
    onCopy?: ClipboardEventHandler<Target>;
    onCopyCapture?: ClipboardEventHandler<Target>;
    onCut?: ClipboardEventHandler<Target>;
    onCutCapture?: ClipboardEventHandler<Target>;
    onPaste?: ClipboardEventHandler<Target>;
    onPasteCapture?: ClipboardEventHandler<Target>;

    // Composition Events
    onCompositionEnd?: CompositionEventHandler<Target>;
    onCompositionEndCapture?: CompositionEventHandler<Target>;
    onCompositionStart?: CompositionEventHandler<Target>;
    onCompositionStartCapture?: CompositionEventHandler<Target>;
    onCompositionUpdate?: CompositionEventHandler<Target>;
    onCompositionUpdateCapture?: CompositionEventHandler<Target>;

    // Details Events
    onToggle?: GenericEventHandler<Target>;

    // Focus Events
    onFocus?: FocusEventHandler<Target>;
    onFocusCapture?: FocusEventHandler<Target>;
    onBlur?: FocusEventHandler<Target>;
    onBlurCapture?: FocusEventHandler<Target>;

    // Form Events
    onChange?: GenericEventHandler<Target>;
    onChangeCapture?: GenericEventHandler<Target>;
    onInput?: GenericEventHandler<Target>;
    onInputCapture?: GenericEventHandler<Target>;
    onSearch?: GenericEventHandler<Target>;
    onSearchCapture?: GenericEventHandler<Target>;
    onSubmit?: GenericEventHandler<Target>;
    onSubmitCapture?: GenericEventHandler<Target>;
    onInvalid?: GenericEventHandler<Target>;
    onInvalidCapture?: GenericEventHandler<Target>;
    onReset?: GenericEventHandler<Target>;
    onResetCapture?: GenericEventHandler<Target>;
    onFormData?: GenericEventHandler<Target>;
    onFormDataCapture?: GenericEventHandler<Target>;

    // Keyboard Events
    onKeyDown?: KeyboardEventHandler<Target>;
    onKeyDownCapture?: KeyboardEventHandler<Target>;
    onKeyPress?: KeyboardEventHandler<Target>;
    onKeyPressCapture?: KeyboardEventHandler<Target>;
    onKeyUp?: KeyboardEventHandler<Target>;
    onKeyUpCapture?: KeyboardEventHandler<Target>;

    // Media Events
    onAbort?: GenericEventHandler<Target>;
    onAbortCapture?: GenericEventHandler<Target>;
    onCanPlay?: GenericEventHandler<Target>;
    onCanPlayCapture?: GenericEventHandler<Target>;
    onCanPlayThrough?: GenericEventHandler<Target>;
    onCanPlayThroughCapture?: GenericEventHandler<Target>;
    onDurationChange?: GenericEventHandler<Target>;
    onDurationChangeCapture?: GenericEventHandler<Target>;
    onEmptied?: GenericEventHandler<Target>;
    onEmptiedCapture?: GenericEventHandler<Target>;
    onEncrypted?: GenericEventHandler<Target>;
    onEncryptedCapture?: GenericEventHandler<Target>;
    onEnded?: GenericEventHandler<Target>;
    onEndedCapture?: GenericEventHandler<Target>;
    onLoadedData?: GenericEventHandler<Target>;
    onLoadedDataCapture?: GenericEventHandler<Target>;
    onLoadedMetadata?: GenericEventHandler<Target>;
    onLoadedMetadataCapture?: GenericEventHandler<Target>;
    onLoadStart?: GenericEventHandler<Target>;
    onLoadStartCapture?: GenericEventHandler<Target>;
    onPause?: GenericEventHandler<Target>;
    onPauseCapture?: GenericEventHandler<Target>;
    onPlay?: GenericEventHandler<Target>;
    onPlayCapture?: GenericEventHandler<Target>;
    onPlaying?: GenericEventHandler<Target>;
    onPlayingCapture?: GenericEventHandler<Target>;
    onProgress?: GenericEventHandler<Target>;
    onProgressCapture?: GenericEventHandler<Target>;
    onRateChange?: GenericEventHandler<Target>;
    onRateChangeCapture?: GenericEventHandler<Target>;
    onSeeked?: GenericEventHandler<Target>;
    onSeekedCapture?: GenericEventHandler<Target>;
    onSeeking?: GenericEventHandler<Target>;
    onSeekingCapture?: GenericEventHandler<Target>;
    onStalled?: GenericEventHandler<Target>;
    onStalledCapture?: GenericEventHandler<Target>;
    onSuspend?: GenericEventHandler<Target>;
    onSuspendCapture?: GenericEventHandler<Target>;
    onTimeUpdate?: GenericEventHandler<Target>;
    onTimeUpdateCapture?: GenericEventHandler<Target>;
    onVolumeChange?: GenericEventHandler<Target>;
    onVolumeChangeCapture?: GenericEventHandler<Target>;
    onWaiting?: GenericEventHandler<Target>;
    onWaitingCapture?: GenericEventHandler<Target>;

    // MouseEvents
    onClick?: MouseEventHandler<Target>;
    onClickCapture?: MouseEventHandler<Target>;
    onContextMenu?: MouseEventHandler<Target>;
    onContextMenuCapture?: MouseEventHandler<Target>;
    onDblClick?: MouseEventHandler<Target>;
    onDblClickCapture?: MouseEventHandler<Target>;
    onDrag?: DragEventHandler<Target>;
    onDragCapture?: DragEventHandler<Target>;
    onDragEnd?: DragEventHandler<Target>;
    onDragEndCapture?: DragEventHandler<Target>;
    onDragEnter?: DragEventHandler<Target>;
    onDragEnterCapture?: DragEventHandler<Target>;
    onDragExit?: DragEventHandler<Target>;
    onDragExitCapture?: DragEventHandler<Target>;
    onDragLeave?: DragEventHandler<Target>;
    onDragLeaveCapture?: DragEventHandler<Target>;
    onDragOver?: DragEventHandler<Target>;
    onDragOverCapture?: DragEventHandler<Target>;
    onDragStart?: DragEventHandler<Target>;
    onDragStartCapture?: DragEventHandler<Target>;
    onDrop?: DragEventHandler<Target>;
    onDropCapture?: DragEventHandler<Target>;
    onMouseDown?: MouseEventHandler<Target>;
    onMouseDownCapture?: MouseEventHandler<Target>;
    onMouseEnter?: MouseEventHandler<Target>;
    onMouseEnterCapture?: MouseEventHandler<Target>;
    onMouseLeave?: MouseEventHandler<Target>;
    onMouseLeaveCapture?: MouseEventHandler<Target>;
    onMouseMove?: MouseEventHandler<Target>;
    onMouseMoveCapture?: MouseEventHandler<Target>;
    onMouseOut?: MouseEventHandler<Target>;
    onMouseOutCapture?: MouseEventHandler<Target>;
    onMouseOver?: MouseEventHandler<Target>;
    onMouseOverCapture?: MouseEventHandler<Target>;
    onMouseUp?: MouseEventHandler<Target>;
    onMouseUpCapture?: MouseEventHandler<Target>;

    // Selection Events
    onSelect?: GenericEventHandler<Target>;
    onSelectCapture?: GenericEventHandler<Target>;

    // Touch Events
    onTouchCancel?: TouchEventHandler<Target>;
    onTouchCancelCapture?: TouchEventHandler<Target>;
    onTouchEnd?: TouchEventHandler<Target>;
    onTouchEndCapture?: TouchEventHandler<Target>;
    onTouchMove?: TouchEventHandler<Target>;
    onTouchMoveCapture?: TouchEventHandler<Target>;
    onTouchStart?: TouchEventHandler<Target>;
    onTouchStartCapture?: TouchEventHandler<Target>;

    // Pointer Events
    onPointerOver?: PointerEventHandler<Target>;
    onPointerOverCapture?: PointerEventHandler<Target>;
    onPointerEnter?: PointerEventHandler<Target>;
    onPointerEnterCapture?: PointerEventHandler<Target>;
    onPointerDown?: PointerEventHandler<Target>;
    onPointerDownCapture?: PointerEventHandler<Target>;
    onPointerMove?: PointerEventHandler<Target>;
    onPointerMoveCapture?: PointerEventHandler<Target>;
    onPointerUp?: PointerEventHandler<Target>;
    onPointerUpCapture?: PointerEventHandler<Target>;
    onPointerCancel?: PointerEventHandler<Target>;
    onPointerCancelCapture?: PointerEventHandler<Target>;
    onPointerOut?: PointerEventHandler<Target>;
    onPointerOutCapture?: PointerEventHandler<Target>;
    onPointerLeave?: PointerEventHandler<Target>;
    onPointerLeaveCapture?: PointerEventHandler<Target>;
    onGotPointerCapture?: PointerEventHandler<Target>;
    onGotPointerCaptureCapture?: PointerEventHandler<Target>;
    onLostPointerCapture?: PointerEventHandler<Target>;
    onLostPointerCaptureCapture?: PointerEventHandler<Target>;

    // UI Events
    onScroll?: UIEventHandler<Target>;
    onScrollCapture?: UIEventHandler<Target>;

    // Wheel Events
    onWheel?: WheelEventHandler<Target>;
    onWheelCapture?: WheelEventHandler<Target>;

    // Animation Events
    onAnimationStart?: AnimationEventHandler<Target>;
    onAnimationStartCapture?: AnimationEventHandler<Target>;
    onAnimationEnd?: AnimationEventHandler<Target>;
    onAnimationEndCapture?: AnimationEventHandler<Target>;
    onAnimationIteration?: AnimationEventHandler<Target>;
    onAnimationIterationCapture?: AnimationEventHandler<Target>;

    // Transition Events
    onTransitionEnd?: TransitionEventHandler<Target>;
    onTransitionEndCapture?: TransitionEventHandler<Target>;
  }

  type Key = string | number | any;

  interface Attributes {
    key?: Key;
    jsx?: boolean;
  }

  type RefObject<T> = { current: T | null };
  type RefCallback<T> = (instance: T | null) => void;
  type Ref<T> = RefObject<T> | RefCallback<T>;

  interface ClassAttributes<T> extends Attributes {
    ref?: Ref<T>;
  }

  interface HTMLAttributes<RefType extends EventTarget = EventTarget>
    extends ClassAttributes<RefType>,
      DOMAttributes<RefType> {
    // Standard HTML Attributes
    accept?: string;
    acceptCharset?: string;
    accessKey?: string;
    action?: string;
    allowFullScreen?: boolean;
    allowTransparency?: boolean;
    alt?: string;
    as?: string;
    async?: boolean;
    autocomplete?: string;
    autoComplete?: string;
    autocorrect?: string;
    autoCorrect?: string;
    autofocus?: boolean;
    autoFocus?: boolean;
    autoPlay?: boolean;
    capture?: boolean | string;
    cellPadding?: number | string;
    cellSpacing?: number | string;
    charSet?: string;
    challenge?: string;
    checked?: boolean;
    class?: string;
    className?: string;
    cols?: number;
    colSpan?: number;
    content?: string;
    contentEditable?: boolean;
    contextMenu?: string;
    controls?: boolean;
    controlsList?: string;
    coords?: string;
    crossOrigin?: string;
    data?: string;
    dateTime?: string;
    default?: boolean;
    defer?: boolean;
    dir?: "auto" | "rtl" | "ltr";
    disabled?: boolean;
    disableRemotePlayback?: boolean;
    download?: any;
    draggable?: boolean;
    encType?: string;
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    frameBorder?: number | string;
    headers?: string;
    height?: number | string;
    hidden?: boolean;
    high?: number;
    href?: string;
    hrefLang?: string;
    for?: string;
    htmlFor?: string;
    httpEquiv?: string;
    icon?: string;
    id?: string;
    inputMode?: string;
    integrity?: string;
    is?: string;
    keyParams?: string;
    keyType?: string;
    kind?: string;
    label?: string;
    lang?: string;
    list?: string;
    loading?: "eager" | "lazy";
    loop?: boolean;
    low?: number;
    manifest?: string;
    marginHeight?: number;
    marginWidth?: number;
    max?: number | string;
    maxLength?: number;
    media?: string;
    mediaGroup?: string;
    method?: string;
    min?: number | string;
    minLength?: number;
    multiple?: boolean;
    muted?: boolean;
    name?: string;
    nonce?: string;
    noValidate?: boolean;
    open?: boolean;
    optimum?: number;
    pattern?: string;
    placeholder?: string;
    playsInline?: boolean;
    poster?: string;
    preload?: string;
    radioGroup?: string;
    readOnly?: boolean;
    rel?: string;
    required?: boolean;
    role?: string;
    rows?: number;
    rowSpan?: number;
    sandbox?: string;
    scope?: string;
    scoped?: boolean;
    scrolling?: string;
    seamless?: boolean;
    selected?: boolean;
    shape?: string;
    size?: number;
    sizes?: string;
    slot?: string;
    span?: number;
    spellcheck?: boolean;
    src?: string;
    srcset?: string;
    srcDoc?: string;
    srcLang?: string;
    srcSet?: string;
    start?: number;
    step?: number | string;
    style?: string | { [key: string]: string | number };
    summary?: string;
    tabIndex?: number;
    target?: string;
    title?: string;
    type?: string;
    useMap?: string;
    value?: string | string[] | number;
    volume?: string | number;
    width?: number | string;
    wmode?: string;
    wrap?: string;

    // RDFa Attributes
    about?: string;
    datatype?: string;
    inlist?: any;
    prefix?: string;
    property?: string;
    resource?: string;
    typeof?: string;
    vocab?: string;

    // Microdata Attributes
    itemProp?: string;
    itemScope?: boolean;
    itemType?: string;
    itemID?: string;
    itemRef?: string;
  }

  interface IntrinsicElements {
    // HTML
    a: HTMLAttributes<HTMLAnchorElement>;
    abbr: HTMLAttributes<HTMLElement>;
    address: HTMLAttributes<HTMLElement>;
    area: HTMLAttributes<HTMLAreaElement>;
    article: HTMLAttributes<HTMLElement>;
    aside: HTMLAttributes<HTMLElement>;
    audio: HTMLAttributes<HTMLAudioElement>;
    b: HTMLAttributes<HTMLElement>;
    base: HTMLAttributes<HTMLBaseElement>;
    bdi: HTMLAttributes<HTMLElement>;
    bdo: HTMLAttributes<HTMLElement>;
    big: HTMLAttributes<HTMLElement>;
    blockquote: HTMLAttributes<HTMLQuoteElement>;
    body: HTMLAttributes<HTMLBodyElement>;
    br: HTMLAttributes<HTMLBRElement>;
    button: HTMLAttributes<HTMLButtonElement>;
    canvas: HTMLAttributes<HTMLCanvasElement>;
    caption: HTMLAttributes<HTMLTableCaptionElement>;
    cite: HTMLAttributes<HTMLElement>;
    code: HTMLAttributes<HTMLElement>;
    col: HTMLAttributes<HTMLTableColElement>;
    colgroup: HTMLAttributes<HTMLTableColElement>;
    data: HTMLAttributes<HTMLDataElement>;
    datalist: HTMLAttributes<HTMLDataListElement>;
    dd: HTMLAttributes<HTMLElement>;
    del: HTMLAttributes<HTMLModElement>;
    details: HTMLAttributes<HTMLDetailsElement>;
    dfn: HTMLAttributes<HTMLElement>;
    dialog: HTMLAttributes<HTMLDialogElement>;
    div: HTMLAttributes<HTMLDivElement>;
    dl: HTMLAttributes<HTMLDListElement>;
    dt: HTMLAttributes<HTMLElement>;
    em: HTMLAttributes<HTMLElement>;
    embed: HTMLAttributes<HTMLEmbedElement>;
    fieldset: HTMLAttributes<HTMLFieldSetElement>;
    figcaption: HTMLAttributes<HTMLElement>;
    figure: HTMLAttributes<HTMLElement>;
    footer: HTMLAttributes<HTMLElement>;
    form: HTMLAttributes<HTMLFormElement>;
    h1: HTMLAttributes<HTMLHeadingElement>;
    h2: HTMLAttributes<HTMLHeadingElement>;
    h3: HTMLAttributes<HTMLHeadingElement>;
    h4: HTMLAttributes<HTMLHeadingElement>;
    h5: HTMLAttributes<HTMLHeadingElement>;
    h6: HTMLAttributes<HTMLHeadingElement>;
    head: HTMLAttributes<HTMLHeadElement>;
    header: HTMLAttributes<HTMLElement>;
    hgroup: HTMLAttributes<HTMLElement>;
    hr: HTMLAttributes<HTMLHRElement>;
    html: HTMLAttributes<HTMLHtmlElement>;
    i: HTMLAttributes<HTMLElement>;
    iframe: HTMLAttributes<HTMLIFrameElement>;
    img: HTMLAttributes<HTMLImageElement>;
    input: HTMLAttributes<HTMLInputElement>;
    ins: HTMLAttributes<HTMLModElement>;
    kbd: HTMLAttributes<HTMLElement>;
    keygen: HTMLAttributes<HTMLUnknownElement>;
    label: HTMLAttributes<HTMLLabelElement>;
    legend: HTMLAttributes<HTMLLegendElement>;
    li: HTMLAttributes<HTMLLIElement>;
    link: HTMLAttributes<HTMLLinkElement>;
    main: HTMLAttributes<HTMLElement>;
    map: HTMLAttributes<HTMLMapElement>;
    mark: HTMLAttributes<HTMLElement>;
    marquee: HTMLAttributes<HTMLMarqueeElement>;
    menu: HTMLAttributes<HTMLMenuElement>;
    menuitem: HTMLAttributes<HTMLUnknownElement>;
    meta: HTMLAttributes<HTMLMetaElement>;
    meter: HTMLAttributes<HTMLMeterElement>;
    nav: HTMLAttributes<HTMLElement>;
    noscript: HTMLAttributes<HTMLElement>;
    object: HTMLAttributes<HTMLObjectElement>;
    ol: HTMLAttributes<HTMLOListElement>;
    optgroup: HTMLAttributes<HTMLOptGroupElement>;
    option: HTMLAttributes<HTMLOptionElement>;
    output: HTMLAttributes<HTMLOutputElement>;
    p: HTMLAttributes<HTMLParagraphElement>;
    param: HTMLAttributes<HTMLParamElement>;
    picture: HTMLAttributes<HTMLPictureElement>;
    pre: HTMLAttributes<HTMLPreElement>;
    progress: HTMLAttributes<HTMLProgressElement>;
    q: HTMLAttributes<HTMLQuoteElement>;
    rp: HTMLAttributes<HTMLElement>;
    rt: HTMLAttributes<HTMLElement>;
    ruby: HTMLAttributes<HTMLElement>;
    s: HTMLAttributes<HTMLElement>;
    samp: HTMLAttributes<HTMLElement>;
    script: HTMLAttributes<HTMLScriptElement>;
    section: HTMLAttributes<HTMLElement>;
    select: HTMLAttributes<HTMLSelectElement>;
    slot: HTMLAttributes<HTMLSlotElement>;
    small: HTMLAttributes<HTMLElement>;
    source: HTMLAttributes<HTMLSourceElement>;
    span: HTMLAttributes<HTMLSpanElement>;
    strong: HTMLAttributes<HTMLElement>;
    style: HTMLAttributes<HTMLStyleElement>;
    sub: HTMLAttributes<HTMLElement>;
    summary: HTMLAttributes<HTMLElement>;
    sup: HTMLAttributes<HTMLElement>;
    table: HTMLAttributes<HTMLTableElement>;
    tbody: HTMLAttributes<HTMLTableSectionElement>;
    td: HTMLAttributes<HTMLTableCellElement>;
    textarea: HTMLAttributes<HTMLTextAreaElement>;
    tfoot: HTMLAttributes<HTMLTableSectionElement>;
    th: HTMLAttributes<HTMLTableCellElement>;
    thead: HTMLAttributes<HTMLTableSectionElement>;
    time: HTMLAttributes<HTMLTimeElement>;
    title: HTMLAttributes<HTMLTitleElement>;
    tr: HTMLAttributes<HTMLTableRowElement>;
    track: HTMLAttributes<HTMLTrackElement>;
    u: HTMLAttributes<HTMLElement>;
    ul: HTMLAttributes<HTMLUListElement>;
    var: HTMLAttributes<HTMLElement>;
    video: HTMLAttributes<HTMLVideoElement>;
    wbr: HTMLAttributes<HTMLElement>;
  }
}
