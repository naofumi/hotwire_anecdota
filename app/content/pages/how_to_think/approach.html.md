---
title: Hotwire, React, jQueryのアプローチ
section: Tips
layout: article
order: 40
published: true
---

Hotwireの考え方を理解しやすくするために、React, jQuery等と比較して紹介します。

## Hotwireのアプローチ --- approach-of-hotwire

下記のようなUIを作るときのHotwireのアプローチを、Reactと比べながら解説します。

![What is Hotwire](content_images/what-is-hotwire-objective.webp "max-w-[500px]")

### Hotwireの場合 --- hotwire-case

Hotwireの場合は以下のように考えます。

* "user_id:2"の行を`a`タグにします
* `a`タグの`href`属性の`/users/2/user_profile`は`#user-profile`に埋め込むべきHTMLを返してくれるサーバのエンドポイントです
* `a`タグの`data-turbo-frame`は、サーバから帰ってきたHTMLをどこに埋め込むかを指定しています

![what-is-hotwire-hotwire.webp](content_images/what-is-hotwire-hotwire.webp "max-w-[500px]")

### Reactの場合 --- react-case

Reactの場合は以下のように考えます。

* "user_id:2"の行に`onclick`イベントハンドラを繋げて、クリックしたら`selectedUser`ステートを2に更新します
* `UserProfile`コンポーネントのpropsにステート`selectedUser=2`を渡し、`UserProfile`コンポーネントは`selectedUser=2`に該当するデータをサーバに要求します
* サーバは`User.id=2`に該当するUserの情報をJSONで返します
* JSONは`userProfile`ステートにセットされます
* JSXと`userProfile`ステートを使って、virtual DOMを作成し、新しい`UserProfile`コンポーネントのHTMLを作ります
* 新しい`UserProfile`のHTMLと、現在ブラウザに表示されているものを比較して、差分を取り、差分を現在のブラウザ画面に当てはめます

![what-is-hotwire-react.png](content_images/what-is-hotwire-react.png "max-w-[600px]")

### HotwireとReactの比較 --- hotwire-react-comparison

* リクエスト送信
   * Hotwireはすぐにサーバからデータを取りにいきます
   * Reactの場合は、まず`selectedUser`のステートを設定して、**間接的に**`UserProfile`コンポーネントがサーバにデータを取りに行くようにします
* レスポンス受信から表示
   * Hotwireはサーバから帰ってきたデータを`#user-profile`にすぐに埋め込みます
   * Reactの場合は、サーバから帰ってきたデータを`userProfile`ステートに設定すると、**間接的に**新しい情報が表示されるようになります

Hotwireは目標に対して直接的に処理をしています。一方でReactはまずステートに着目して、これを変更した結果として**間接的に** UIが更新されるような仕掛けを用意しています。**直接的に画面を操作することは許されず、常にステート経由で間接的にUIを更新する仕組みです**。

少なくともシンプルなケースにおいては**直接的なものがわかりやすいでしょう**。一方で**複雑になってくれば、間接的にそして宣言的にUIを記述することの意義が出てきます**。

### (参考)jQueryの場合 --- jquery-case

参考までにjQueryのやり方を紹介します。

![what-is-hotwire-jquery.webp](content_images/what-is-hotwire-jquery.webp "max-w-[500px]")

* "user_id:2"の行にイベントハンドラをつなげて、クリックされたらサーバの`/users/2/user_profile`にリクエストが飛ぶようにします
* 帰ってきた結果は`user-profile`に埋め込まれるようにします
* 上記の流れはJavaScriptで書きます（HotwireがHTML属性で宣言的に指定するのた対照的です）

jQueryのやり方はHotwireとよく似ていて、直接的です。やはりシンプルでわかりやすいです。ただし**Hotwireの方がHTML属性を宣言的に使用しますので、UI/UXが複雑になっても混乱しにくくなっています**。

### (参考)HTMX, Alpine.jsなどとの比較 --- htmx-alpine

Hotwireと似たアプローチで、かつどのバックエンドでも使用できる技術としては[HTMX](https://htmx.org)や[Alpine.js](https://alpinejs.dev/)があります。特にHTMXは注目されていて、[Astro](https://astro.build/blog/astro-340/), Python, [Java Spring](https://spring.io/blog/2024/08/07/spring-tips-htmx), [Hono](https://zenn.dev/yusukebe/articles/e8ff26c8507799)と組み合わせた例がしばしば報告されています。

私も十分にHTMXを試していないのではっきりしたことは言えませんが、Hotwireと比較した場合、大きな違いはHTML属性をどれだけ用意しているかだと感じています。

1. jQueryはHTML属性を使わずにJavaScriptを主に使う
2. HotwireはStimulusを使って、自分で新しいHTML属性とそれに結びついたJavaScriptを書く
3. HTMXは出来合いのHTML属性をたくさん用意し、それを組み合わせてUIを作る

Hotwireは37signalsの製品で誕生し、実際の製品の複雑なUIでもわかりやすく作るために生まれた技術です。多くの箇所は出来合いのHTML属性だけで対応しますが、必要に応じてカスタムJavaScriptを書くことも重視しています。現実の複雑なプロダクトのエッジケースに対応するため、比較的すぐにJavaScriptを書きます。

それに対して、HTMXはHTML属性中心の宣言的アプローチをより深く追求した、より野心的なものだと私は感じています。

