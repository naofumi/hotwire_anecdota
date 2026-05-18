---
title: Hotwireにまつわる誤った認識
layout: article
order: 70
published: true
---

Hotwire, Reactおよびフロントエンド一般に対する誤った認識について言及したいと思います。

## HotwireはRails専用 --- hotwire-is-rails-only

* Hotwireは**バックエンドフレームワークに関係なく使用できます**。HTML/CSS/JSだけで作った静的HTMLページでも使用できます。私も[Next.js上でHotwireを使用しています](https://hotwire-n-next.castle104.com/)。

## Hotwireを使うとJavaScriptを書かないで済む --- javascript-is-not-required-for-hotwire

* Hotwireで作られた37signalsの[Fizzy](https://www.fizzy.do)は70個のStimulus controllerファイルを読み込みます。**Hotwireを使いこなすにはJavaScriptを書く必要があります**。
* ただし、同じJavaScriptを書くのであればReactを使えば良いという話ではありません。Reactを採用するとむしろUI/UX以外のところで多くの複雑なJavaScriptを書くからです。
* 詳しくは[別記事でHotwireにおけるJavaScriptの必要性を紹介しています](/introduction/you-should-use-javascript)。

## ReactはERB/Hotwireのいずれかを選ばなければならない --- we-need-to-decide

* ERB/Hotwireの中にReactを埋め込むことは時代遅れであり、UI/UX的に最適ではないという考え方があります。しかしこれは間違いです。**状況次第ですが、むしろERB/HotwireにReactを埋め込んだ方が優れたUI/UXになる可能性は高いです**。UI/UXに大変なこだわりを持つApple社も、Apple Storeの製品選択ページではサーバレンダリングされたHTMLにReactを埋め込んでいます。特に最近の[Speculation Rules API](https://developer.mozilla.org/en-US/docs/Web/API/Speculation_Rules_API)や`<script>`タグの[`blocking`属性](https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement/blocking)を使うと、MPAであってもSPAのsoft navigationを超えるUI/UXが実現できます。
* **Reactを採用するか、それともERB/Hotwireを採用するかは二者択一ではありません**。[HotwireのページにReactを埋め込むことは簡単にできます](/other_libraries/using_with_react)。ERBの開発スピードの速さ、メンテナンス性の高さを生かしながら、Reactをどうしても使いたいところでは使うやり方が合理的です。

## デザインシステムにはReactが必要 --- react-is-required-for-design-systems

* デザインシステムを活用するにはReactやVue等のモダンフロントエンドで作る必要があるという考えがあります。これは間違いです。**デザインシステムは特定フロントエンド技術に閉じ込められるべきものではありません**。
* 実際にデジタル庁のデザインシステムはReactとnative HTMLの双方の技術で例を用意しています（[アコーディオンの例](https://design.digital.go.jp/dads/components/accordion/)）。
* 近年ではWeb componentを使った**フロントエンドフレームワーク非依存のデザインシステムが増えています**。Web componentはReact, Vue等が不要で、HTMLとvanilla JSだけで作りますので、Wordpressなどの従来技術で構築されたウェブサイトでも使用できます。特に[Lit](https://lit.dev/)、[Stencil](https://stenciljs.com)等のライブラリを使って、コーポレートサイト、マーケティングページ、SaaSプロダクト横断的に使えるコンポーネントライブラリが注目されています。

## エコシステムはReactの方が充実している --- the-react-ecosystem-is-broader

* **Reactの方がエコシステムが充実していると言われていますが、Hotwireが不利になることはありません**。
* **Reactのライブラリの多くは、vanilla JSをラップしているに過ぎません**。Reactでなければ実現できないライブラリはほぼ存在せず、Hotwireから使えるvanilla JSのものがベースになっていることが一般的です。
   * 例えば[Chart.js](https://www.chartjs.org), [Interact.js](https://interactjs.io), [Tiptap](https://tiptap.dev)はvanilla JSのライブラリで、Reactラッパーが用意されています。
* HotwireのStimulusはvanilla JSのライブラリをラップするのにとても適しています。

## HotwireだとStorybookが使えない --- storybook-is-not-supported

* Storybookの代わりに[Lookbook](https://lookbook.build/)があります。LookbookはRails用のStorybookのようなものです。
* Storybookはモダンフロントエンドだけでなく、vanilla HTMLでも使えます。例えばデジタル庁のデザインシステムは[HTML用のStorybook](https://design.digital.go.jp/dads/html)と[React用のStorybook](https://design.digital.go.jp/dads/react)の双方を用意しています。

## Reactを使えば開発生産性が向上する --- react-can-improve-development-productivity

* jQueryなどのレガシーフロントエンド技術をやめて、React等のモダンフロントエンドを採用すれば開発生産性が向上するという意見があります。**モダンフロントエンドへのリプレイスをしている現場を見る限り、むしろReactの方が大幅に生産性が落ちます**（React導入後の開発速度の比較など）。
* しばしば見落とされるのは、Reactのコンポーネントにデータを渡す前のバックエンド処理、OpenAPI契約、データfetchとエラーハンドリング、認証・認可、ステート管理の負担の大きさです。開発者工数の多くはJSON基礎工事とも言える工程です。**ReactはUI/UXに届く前段の負担が大きく、生産性を落としてしまいます**。

## Reactでなければ作れないUI/UXがある --- we-can-build-complex-ui-ux-with-react

* Reactでなければ作れない高度なUI/UXはほぼありません。ReactはHTML/CSS/JSを抽象化したレイヤーです。**Reactで作れて、vanilla JSで作れないものは原理的に存在し得ません**。
* React/Vueを使わないと実現できないと考えられていたUIが、Hotwire数行で実現できることもあります。**React神話、モダンフロントエンド神話を捨てて、Reactが実現するものは何か、JavaScriptで何ができるかをしっかり見つめる必要があります**。

## ReactはTypeScriptを使うから型安全である --- typescript-is-typesafe

これについては[TypeScript vs. ERBの型安全性](/introduction/type_safety)で解説しています。

> TypeScriptだけをいくら使用しても型安全にはなりません。逆にRuby ERBを使用すればほとんど何もしなくても高い型安全性が得られます。
