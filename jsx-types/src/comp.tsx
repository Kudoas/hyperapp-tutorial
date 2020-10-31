const elm = (
  <foo hoge="文字列" fuga={123}>
    <bar>文字列</bar>
  </foo>
);

// エラー（fooの子が別の要素ではなく文字列になっているので）
const elm2 = (
  <foo hoge="文字列" fuga={123}>
    naruhodo!
  </foo>
);
// エラー（barの子が文字列ではなく数値になっているので）
const elm3 = <bar>{456}</bar>;
// エラー（barの子が無いので）
const elm4 = <bar />;
