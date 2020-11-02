# HYPERAPP TUTORIAL

Hyperappをいろいろな環境で試した時のメモ

## Findings

- v1とv2で文法やJSX対応あたりでかなり変更がある
- JSX対応はv2だと2.0.5からかなり大きめな変更があったようで、babelでトランスパイルしてもうまく動作しない
    （2.0.4以前は`transform-react-jsx`を使うと動くことは確認できた）
- JSXがなくてもviewを効率よくかけるものが用意してある
    - [@hyperapp/html](https://github.com/jorgebucaran/hyperapp/tree/main/pkg/html)：h関数をラッピングしてちょっと使いやすくした公式パッケージ
    - [hyperlit](https://github.com/zaceno/hyperlit)：JSXライクにかけるパッケージ
    - [Picostyle](https://github.com/morishitter/picostyle)：超軽量なCSS in JSのライブラリ、Hyperappにも対応している
- TS導入したい場合はhyperapp型を用意する必要がある。[公式](https://github.com/jorgebucaran/hyperapp/blob/2c5af2bee7c7c3a44c71f72dc761deb4e47b8a81/types/index.d.ts)で用意してくれている。
    他のパッケージの型はいい感じに自分で定義するか、JSを諦めるのも一つの手段かも？
- JSXの型を自分で付けるのは大変なので[preactの型](https://github.com/preactjs/preact/blob/master/src/jsx.d.ts)とかを移植するのが良さげと思った

## Keywords

- State Machines
- actions
- dispatch
- view
- subscription

## References

- [Hyperapp](https://github.com/jorgebucaran/hyperapp)
- [@hyperapp/html](https://github.com/jorgebucaran/hyperapp/tree/main/pkg/html)
- [hyperlit](https://github.com/zaceno/hyperlit)
- [Picostyle](https://github.com/morishitter/picostyle)
- [Official Tutorial](https://github.com/jorgebucaran/hyperapp/blob/main/docs/tutorial.md)
- [A Walk through Hyperapp 2](https://medium.com/hyperapp/a-walk-through-hyperapp-2-b1f642fca172)
- [TypeScriptの型におけるJSXサポートが100%分かる記事](https://qiita.com/uhyo/items/adf6cb83333a25097f25)
