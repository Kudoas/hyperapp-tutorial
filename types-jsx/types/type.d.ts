declare namespace JSX {
  interface ElementChildrenAttribute {
    // childrenという名前を子を表すプロパティ名として宣言
    children: any;
  }
  type Element = {
    this_is_element: true;
  };

  // ElementClass
  interface ElementClass {
    // renderは必須
    render: () => any;
  }

  interface IntrinsicElements {
    foo: {
      hoge?: string;
      fuga?: number;
      children?: JSX.Element | string | number | Array<JSX.Element | string>;
    };
    bar: {
      children?: unknown;
    };
  }

  // key
  interface IntrinsicAttributes {
    key?: string;
    hoge: string;
  }

  // IntrinsicClassAttributes<T>
  // LibraryManagedAttributes<C, P>

  type LibraryManagedAttributes<C, P> = C extends { defaultProps: infer D }
    ? Partial<Pick<P, Extract<keyof P, keyof D>>> & Pick<P, Exclude<keyof P, keyof D>>
    : P;
}

interface MyFunctionComponentProps {
  foo: string;
  children?: JSX.Element | string | Array<JSX.Element | string>;
}

// ClassComponent props
interface MyProps {
  hoge: string;
}

/* @jsx h */
declare namespace h.JSX {
  interface ElementChildrenAttribute {
    children: any;
  }
  type Element = {
    this_is_element: true;
  };

  interface ElementClass {
    render: () => any;
  }

  type LibraryManagedAttributes<C, P> = C extends { defaultProps: infer D }
    ? Partial<Pick<P, Extract<keyof P, keyof D>>> & Pick<P, Exclude<keyof P, keyof D>>
    : P;
}
