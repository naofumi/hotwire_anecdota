---
title: Hotwireの技術的特徴
layout: article
order: 20
published: true
---

一通りHotwireを学習したものの、全体の構成がいまいちピンとこない人のために大局的に解説します。

## Hotwireは通常のHTML/CSS/JavaScriptを拡張します --- hotwire-extends-html-css-javascript

Reactや他のモダンフロントエンドと異なり、Hotwireは**ブラウザ技術を代替するものではありません**。**あくまでもブラウザ技術の拡張**を目指しています。静的HTML, PHPやERB, Bladeなどをはじめとした従来のフロントエンドに対して、**インタラクティブなUIを作りやすくするための拡張が用意されています**。

既存のERBページをHotwire化する際も、最初にERBのページを作り、それからどうやってインタラクティブにするかを考えます。Reactではウェブページの作り方をひっくり返し、ステートから出発しているのとは対照的です。**Hotwireは普通にHTMLのウェブページから出発します**。

## どのような拡張か？ --- what-hotwire-extends

Hotwireは大きく３つの側面で従来のHTMLを拡張しています。ここではウェブページを作ることに主眼を置きますので、最初のTurboとStimulusについてのみ紹介します。

* 非同期的にページを部分更新する技術 – **Turbo**
* JavaScriptを整理・整頓するための技術 - **Stimulus**
* iOSやAndroidと連携するための技術 - **Native**

## Turboの特徴 --- turbo-features

Turboは**ほとんどJavaScriptを書かなくとも非同期的にページを部分更新する技術**です。

Ruby on Railsは2004年の誕生以来、AJAXに注力しており、非同期的にページを部分更新する技術をフレームワークの中に取り込んでいました。

### Turboは15年の経験の上に作られた--- turbo-is-built-on-experience

2004年のRuby on Railsから2020年のHotwireの公開まで、さまざまなアプローチが試されてきました。

* 当初から[Prototype.js](http://prototypejs.org/)のフレームワークに組み込まれており、ブラウザからのAJAX通信がサポートされていました。
* [jQuery-UJS](https://github.com/rails/jquery-ujs)がフレームワークに組みこれており、JavaScriptを書かなくてもAJAX通信ができるようになっていました。
* [サーバ側でJavaScriptを生成する Server-generated JavaScript Responses](https://signalvnoise.com/posts/3697-server-generated-javascript-responses)が推奨され、サーバから非同期的にブラウザ画面を操作する方法が用意されていました。

Turboは上記の仕組みを15年間継続運用した経験の上に、**実際のウェブ開発で必要になるパターンを抽出し、それに絞った構成になっています**。

### ページ更新方法から見たTurboの特徴 --- turbo-features-from-page-update-method

実際に[サーバ側でJavaScriptを生成する Server-generated JavaScript Responses](https://signalvnoise.com/posts/3697-server-generated-javascript-responses)でアプリを作ると、自由度が高すぎることに気づきます。サーバからJavaScriptを送れると、やれることが多すぎてコードが分散してしまいます。一方で**ほとんどの非同期処理はごく少数のパターンを繰り返している**ことがわかります。**TurboはサーバからJavaScriptを送り込むのをやめ、非同期処理をより簡単に行う方法を提供しています**。

* **ページ全体を更新する場合 – TurboDrive:** ページ全体を切り替える際、ページ全体をロードするのではなく、非同期通信で`<body>`タグの中身だけを入れ替えると[ページ遷移が速くなります](https://github.com/defunkt/jquery-pjax)。またキャッシュなども実装しやすくなります。
* **１箇所の部分更新をする場合 – TurboFrames:** ページを部分更新する場合でも、ページの一部部分のみを更新する場合を想定しています。例えばタブを切り替える場合や引き出し的なUIを作る時です。用途が比較的絞れるために、非同期更新に限らず負荷的な機能もサポートしています。
* **複数箇所を部分更新する場合 – TurboStreams:** ページを細かく、複数箇所更新する場合を想定しています。更新する場合もreplaceだけではなく、append, prepend, removeなどの[8つの操作をサポートしています](https://turbo.hotwired.dev/reference/streams)。
   * TurboStreamsは従来の[Server-generated JavaScript Responses](https://signalvnoise.com/posts/3697-server-generated-javascript-responses)より大幅に柔軟性を落として機能を制限しています。[あえて制約を設けた方がコードの再利用が進み、理解しやすいコードになる](https://turbo.hotwired.dev/handbook/streams#but-what-about-running-javascript%3F)と考えているためです。

Turboで実現できないような複雑なことを行う場合はブラウザ側で[Turboのイベント](https://turbo.hotwired.dev/reference/events)に応答して、Stimulusなどで処理する方法が推奨されています。または[TurboStreamsを拡張する](https://turbo.hotwired.dev/handbook/streams#custom-actions)こともできます。

## Stimulusの特徴 --- stimulus

**Stimulusはイベント駆動のJavaScriptを書く際の複雑さを解消するものです**。Reactはこの複雑さを単方向データフローで解決しました。それに対してHotwireは同じ複雑さをStimulusで解決しています。

インタラクティブなJavaScriptの役割はユーザイベントに応答して、画面更新などの応答をすることです。一見シンプルに見えますが、イベントを発するパーツや更新しなければならないパーツが多くなると、コードがスパゲッティ状になります。また画面のどの要素がどのイベントを発するか、あるいは応答するかが見えにくくなることもあります。

Stimulusは以下の機能を通して、この問題を解決します。

- **DOMとJavaScriptの明示的なバインディング:** Stimulus Controllerは`data-*`属性により、明示的にDOM要素と接続されます。 HTMLの属性を見るだけで、どのイベントに応答してStimulus Controllerのどのメソッドが呼び出され、どのHTML要素が変更されるかがわかります。
- **ステート:** [Values](https://stimulus.hotwired.dev/reference/values)がステートです。Reactと同様にステート駆動のUIが実現できます。ただしValuesを使わなくても良いような簡単な処理の場合は、DOMにステートを持たせても問題ありません。
- **イベントハンドラ:** [Actions](https://stimulus.hotwired.dev/reference/actions) はHTML属性による宣言的な記述でDOMイベントとStimulus Controllerのメソッドを明示的に接続します。

## まとめ --- conclusion

インタラクティブなウェブサイトを15年構築してきた経験を土台に、HTML/CSS/JavaScriptを拡張したものがHotwireです。余計なことをせず、過去にやりすぎた部分を削ぎ落としつつ、一貫して使いやすさ・分かりやすさに注力してきたフレームワークです。

* 非同期通信のパターンを簡単に実現するためのTurbo
* JavaScriptのスパゲッティ化を防ぎ、わかりやすく記述できるようにしたStimulus

ブラウザのネイティブな機能も大幅に進歩していますので、複雑なUI/UXを作る場合でもこれだけの拡張で十分です。
