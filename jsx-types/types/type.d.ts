declare namespace JSX {
  interface ElementChildrenAttribute {
    // childrenという名前を子を表すプロパティ名として宣言
    children: any;
  }
  type Element = {
    this_is_element: true;
  };
  interface IntrinsicElements {
    foo: {
      hoge: string;
      fuga: number;
      children: JSX.Element | string | number;
    };
    bar: {
      children: string;
    };
  }
}
