---
title: Hotwire, Reactにまつわる誤った認識
subtitle: フロントエンド技術を批判的に、正確に分析する。
description: "HotwireはRails専用、JavaScript不要、Reactと二者択一、エコシステムで不利といった誤解を具体例とともに検証します。Reactラッパーの土台となるVanilla JS、Web Components、Lookbook、ERBへのReact埋め込みなどを示し、技術の実際の役割と生産性を見直します。"
layout: article
order: 70
published: true
---

## Hotwireについての誤った認識 --- misconceptions-about-hotwire

### HotwireはRails専用 --- hotwire-is-rails-only

* Hotwireは**バックエンドフレームワークに関係なく使用できます**。HTML/CSS/JSだけで作った静的HTMLページでも使用できます。私も[Next.js上でHotwireを使用しています](https://hotwire-n-next.castle104.com/)。

### Hotwireを使うとJavaScriptを書かないで済む --- javascript-is-not-required-for-hotwire

* Hotwireで作られた37signalsの[Fizzy](https://www.fizzy.do)は70個のStimulus controllerファイルを読み込みます。**Hotwireを使いこなすにはJavaScriptを書く必要があります**。
* ただし書かなければならないJavaScriptの量は圧倒的に少なく済みます。ReactはUI/UXとは直接関係ないコードを大量に書くため、[HotwireはReactよりも圧倒的にJavaScriptが少なく済みます](/introduction/unnecessary_stuff_in_react)。
* 詳しくは[別記事でHotwireにおけるJavaScriptの必要性を紹介しています](/introduction/you-should-use-javascript)。

### ReactはERB/Hotwireのいずれかを選ばなければならない --- we-need-to-decide

* **Reactを採用するか、それともERB/Hotwireを採用するかは二者択一ではありません**。[HotwireのページにReactを埋め込むことは簡単にできます](/other_libraries/using_with_react)。ERBの開発スピードの速さ、メンテナンス性の高さを生かしながら、Reactをどうしても使いたいところでは使うやり方が合理的です。
* ERB/Hotwireの中にReactを埋め込むことは時代遅れであり、UI/UX的に最適ではないという考え方があります。しかしこれは間違いです。**状況次第ですが、むしろERB/HotwireにReactを埋め込んだ方が優れたUI/UXになる可能性があります**。UI/UXに大変なこだわりを持つApple社も、Apple Storeの製品選択ページではサーバレンダリングされたHTMLにReactを埋め込んでいます。特に最近の[Speculation Rules API](https://developer.mozilla.org/en-US/docs/Web/API/Speculation_Rules_API)や`<script>`タグの[`blocking`属性](https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement/blocking)を使うと、MPAであってもSPAのsoft navigationを超えるUI/UXが実現できます。

### HotwireだとStorybookが使えない --- storybook-is-not-supported

* Storybookの代わりに[Lookbook](https://lookbook.build/)があります。LookbookはRails用のStorybookのようなものです。
* Storybookはモダンフロントエンドだけでなく、vanilla HTMLでも使えます。もちろんHotwireも使えます。例えばデジタル庁のデザインシステムは[HTML用のStorybook](https://design.digital.go.jp/dads/html)と[React用のStorybook](https://design.digital.go.jp/dads/react)の双方を用意しています。

## Reactについての誤った認識 --- misconceptions-about-react

### デザインシステムにはReact(などのモダンフロントエンド)が必要 --- react-is-required-for-design-systems

* デザインシステムを活用するにはReactやVue等のモダンフロントエンドで作る必要があるという考えがあります。これは間違いです。**デザインシステムは特定フロントエンド技術に閉じ込められるべきものではありません**。
* 実際にデジタル庁のデザインシステムはReactとnative HTMLの双方の技術で例を用意しています（[アコーディオンの例](https://design.digital.go.jp/dads/components/accordion/)）。
* 近年ではWeb componentを使った**フロントエンドフレームワーク非依存のデザインシステムが増えています**。Web componentはReact, Vue等が不要で、HTMLとvanilla JSだけで作りますので、Hotwireはもちろんのこと、Wordpressなどの従来技術で構築されたウェブサイトでも使用できます。特に[Lit](https://lit.dev/)、[Stencil](https://stenciljs.com)等のライブラリを使って、コーポレートサイト、マーケティングページ、SaaSプロダクト横断的に使えるコンポーネントライブラリが注目されています。

### エコシステムはReactの方が充実している --- the-react-ecosystem-is-broader

* **Reactの方がエコシステムが充実していると言われていますが、Hotwireが不利になることはありません**。
* **Reactのライブラリの多くは、vanilla JSをラップしているに過ぎません**。Reactでなければ実現できないライブラリはほぼ存在せず、Hotwireから使えるvanilla JSのものがベースになっていることが一般的です。
   * 例えば[Chart.js](https://www.chartjs.org), [Interact.js](https://interactjs.io), [Tiptap](https://tiptap.dev)はvanilla JSのライブラリで、Reactラッパーが用意されています。
* HotwireのStimulusはvanilla JSのライブラリをラップするのにとても適しています。
* ReactはUIライブラリが充実していますが、AIを使用することで効率的にHotwire化できます。

この点についてはRailsTokyo#4で発表させていただきました。[11:30の時点からAIとUIライブラリについて解説しています](https://www.youtube.com/watch?v=jhP4vGv3gz4&t=689s)。

![RailsTokyo#4 AI様があれば、Hotwireの弱点は消えるか](https://www.youtube.com/watch?v=jhP4vGv3gz4&t=689s)

### Reactを使えば開発生産性が向上する --- react-can-improve-development-productivity

* jQueryなどのレガシーフロントエンド技術をやめて、React等のモダンフロントエンドを採用すれば開発生産性が向上するという意見があります。**しかし実際の現場で見る限り、モダンフロントエンドへのリプレイスをした後に生産性が向上すること(例えば機能開発速度が向上するなど)は客観的には確認できません**。
* しばしば見落とされるのは、Reactのコンポーネントにデータを渡す前のバックエンド処理、OpenAPI契約、データfetchとエラーハンドリング、認証・認可、ステート管理の負担の大きさです。開発者工数の多くはJSON基礎工事とも言える工程です。**ReactはUI/UXに届く前段の負担が大きく、生産性を落としてしまいます**。これについては[Reactアプリで不要だと感じるもの](/introduction/unnecessary_stuff_in_react)で紹介しています。

### Reactでなければ作れないUI/UXがある --- we-can-build-complex-ui-ux-with-react

* Reactでなければ作れない高度なUI/UXはほぼありません。ReactはあくまでもHTML/CSS/JSを抽象化した薄いレイヤーでしかなく、JavaScriptに独自の機能を追加するものではありません。**Reactで作れて、vanilla JSで作れないものは原理的に存在し得ません**。
* React/Vueを使わないと実現できないと考えられていたUIが、Hotwire数行で実現できることもあります。**React神話、モダンフロントエンド神話を捨てて、Reactが実現するものは何か、JavaScriptで何ができるかをしっかり見つめる必要があります**。

### ReactはTypeScriptを使うから型安全である --- typescript-is-typesafe

これについては[TypeScript vs. ERBの型安全性](/introduction/type_safety)で解説しています。

> TypeScriptだけをいくら使用しても型安全にはなりません。逆にRuby ERBを使用すればほとんど何もしなくても高い型安全性が得られます。

### Reactを使えばフロントエンドとバックエンドのチームが独立に開発できる --- react-enables-independent-frontend-and-backend-development

* 理想的なスキーマ駆動開発ができれば、JSON APIが開発初期から固定され、フロントエンドとバックエンドが独立して開発することが可能になりそうです。しかし[現実には理想的なスキーマ駆動開発はなかなか実現できません](https://speakerdeck.com/hal_spidernight/tsnoapixing-an-quan-nodui-jia-hashui-kafu-u-bu-gong-ping-nasukimaqu-dong-nizhong-zhi-fu-woda-tuhaihuritutozhan-lue?slide=28)。
* フロントエンドとバックエンドの双方がスキーマを則っていることを担保するために、しばしばスキーマ定義からFE/BEのインタフェースを自動生成したり、[自動テストでAPIレスポンスを確認したり](https://zenn.dev/overflow_offers/articles/20220802-committee-rails)します。しかし実際にこのようなレポジトリで開発すると分かりますが、FE/BEの独立性が失われます。遅くともCIの時点でFE/BEがお互いにスキーマに則っていないといけないためです。スキーマに影響がある変更をする場合は、独立した開発は結局できなくなります。
