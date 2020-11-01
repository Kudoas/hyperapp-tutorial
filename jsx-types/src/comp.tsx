const elm = (
  <foo hoge="文字列" fuga={123}>
    <bar>文字列</bar>
    <bar>文字列</bar>
    文字列
  </foo>
);

// エラー（fooの子が別の要素ではなく文字列になっているので）
const elm2 = (
  <foo hoge="文字列" fuga={123}>
    naruhodo
  </foo>
);
// エラー（barの子が文字列ではなく数値になっているので）
const elm3 = <bar>{456}</bar>;
// エラー（barの子が無いので）
const elm4 = <bar />;

// default class, func
class MyComp1 {}
const MyComp2 = () => <bar />;

const MyFunctionComponent = (props: MyFunctionComponentProps) => (
  <bar>
    {props.foo} {props.children}
  </bar>
);

const elm5 = <MyFunctionComponent foo={"hoge"}>gone</MyFunctionComponent>;

class NotClassComponent {}
class ClassComponent {
  // constructor(props: MyProps) {}
  public props!: MyProps;

  render() {
    return <bar />;
  }
}

const celm1 = <NotClassComponent />;
const celm2 = <ClassComponent hoge="str" key="diajfaj" />;
