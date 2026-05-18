---
title: Apple Store模写（複雑なステート）
layout: article
order: 120
published: true
descriptors:
  technologies:
    - Turbo Streams
    - Stimulus
    - React
  related_pages:
    - /introduction/complex_ui
    - /concepts/stimulus-typical-structure
  demo_urls:
    - ["サーバでステートを持つデモ", "/iphone"]
    - ["Stimulusを使用してクライアントでステートを持つデモ", "/components/iphone"]
    - ["Reactを使用してクライアントでステートを持つデモ", "/react/iphone"]
---
![iphone.mov](content_images/iphone.mov)
## Apple Storeの模写 --- complex-state

ここではApple Storeを模写しながら、Turbo (Morphing), Stimulusのステートの使い方を考えてみます。Apple Storeの場合は以下のようになっています

* オプションを選択すると、それに応じてリアルタイムで表示価格が変更されます
    * 合計金額
    * 各オプションの隣に表示される合計価格 (例えば現在のモデルのRAMを1TBに変更した時に合計はいくらになるか)
* カラーオプションを選択すると、それに応じて画像が切り替わります
* 前のオプションを選択するまで、次のオプションは選択不可能状態です。オプションを選択すると、次のオプションは選択可能に切り替わります

また、**StimulusとReactで実装したものはネットワーク通信が発生しません**。価格更新を含めてすべてブラウザだけで処理します。

**このようなページはしばしばコードが複雑になります**。その理由は下記のように多数のものがお互いに関連し合うためです。

* 複数のアクションがステートを変更しています
* ステートからページの複数の要素が同時に更新されています
   * 価格や画像
   * オプションの選択状態
   * オプションの選択可能状態（[ステートマシン的な管理](https://ja.wikipedia.org/wiki/状態遷移図)）
* 選択されたオプションから価格を計算します 

## 複数の技術で実装して、コードを比較する --- compare

このようなページではステート管理が重要になります。さまざまな方法がありますが、今回は以下の複数の手法を比較検討します。

* **サーバでステート管理する場合:** オプションを選択するたびにサーバと通信を行い、レスポンスとして更新された画面を受け取ります。サーバ通信が発生するにも関わらず、Turboで良好なUI/UXを保つ方法を確認します
* **ブラウザでStimulusを使ってステート管理する場合:** 実際のApple Storeと同様にすべてブラウザで更新をします（価格等を含めて）。複雑なステートをどのようにStimulusで管理し、画面の複数箇所を効率的に（コードをスパゲッティ化にせずに）更新するかを確認します
* **Reactを使ってステート管理する場合:** 実際のApple StoreはReactを使用しています（[MPAにReactを埋め込む](/examples/using_with_react#merits-embed-react-in-an-mpa)）。ブラウザだけでステートを管理し、ネットワーク通信せずに画面を更新するのはReactの得意分野です。Hotwireを使った方法と比較し、何が利点なのかを確認します

## 実装してみた結果 --- results

実装した結果の詳細は[関連ページ](#related-pages)でご確認いただけます。ここでは全体を通した印象をお伝えします。

* 比較的複雑なステートであっても、Hotwireで問題なく対応できます
    * ステートをサーバに持たせた場合が一番簡単になります。Reactよりも簡単になります
    * サーバ通信をせずにStimulusだけでステート管理した場合でも、Stimulusの[Values](https://stimulus.hotwired.dev/reference/values)でスッキリ対応できます
* 書きやすさの違いはReact vs Hotwireではなく、HTMLテンプレートシステムの利用による
    * ERBやJSXのようなHTMLテンプレートシステムを使い、HTMLとロジックを混ぜた場合はコードは書きやすいです（改めてPHPの偉大さを思い起こさせてくれます）
    * すでに用意されたHTMLに対して、後からStimulus `target`を繋げて更新する場合は、ファイルを行き来しなければならないので多少書きにくくなります。ステートをすべてStimulusに持たせた場合がこのケースです
    * ただ、HTMLとロジックを分割するか否かだけの違いであり、大きな違いとは感じませんでした
* いずれのケースでも、ビジネスロジックをなるべくマークアップから分離し、`IPhone.js`や`Iphone.rb`などのview modelに持たせることが効果的です。**View Modelにしっかりロジックを収められれば、上記の３手法の違いは些細**に感じられました

## Stimulusで複雑なブラウザステートは管理できるか？ --- can-stimulus-handle-complex-state

上記のことから、**Stimulusでもある程度複雑なブラウザステートが管理できる**ことがわかりました。**そもそもステート管理はviewがやることではなく、modelなどで行うものですので、StimulusとReactで同様に管理できることは当然と言えば当然です**。

StimulusとReactのコードの主な違いは、modelのデータをviewに反映させるところです。ReactはJSXテンプレートをすべて再レンダリングしますので、データをviewに反映させる処理がわかりやすくなっています。さらにこれを自動的にやってくれます。Stimulusの場合はここが多少煩雑になります。

一方で、**ステートをサーバ側で管理する場合が一番簡単です**。ブラウザでステートを管理する場合は`Catalog`クラス(`app/models/catalog.rb`)で製品情報を一旦すべて集約して、これを一気にブラウザに送る必要があります。それに対してサーバ側で管理する場合は`Iphone`クラス(`app/models/iphone.rb`)でその都度計算するだけです。

## 複雑さはモデルで管理すること --- manage-complexity-in-the-model

上述のようにそもそも複雑なステートはmodelの問題です。StimulusやReactのようなview/controllerライブラリの問題ではありません。

**一番の教訓はmodelの中でしっかり複雑さを管理することでしょう**。

