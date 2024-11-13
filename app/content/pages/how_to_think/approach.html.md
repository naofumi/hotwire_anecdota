---
title: Hotwire, React, jQueryのアプローチ
section: Tips
layout: article
order: 050
published: true
---

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

* Hotwireはすぐにサーバからデータを取りにいきます。Reactの場合は、まず`selectedUser`のステートを設定して、**流れの中で**`UserProfile`コンポーネントがサーバにデータを取りに行くようにします
* Hotwireはサーバから帰ってきたデータを`#user-profile`にすぐに埋め込みます。Reactの場合は、サーバから帰ってきたデータを`userProfile`ステートに設定すると、**流れの中で**新しい情報が表示されるようになります

Hotwireは目標に対して直接的に処理をしています。一方でReactはまずステートに着目して、これを変更した結果として**流れの中で** UIが適切に更新されるような仕掛けを用意しています。ステートを更新して間接的にUIを更新する仕組みです。

直接的ですので、通常はHotwireの方がシンプルでわかりやすいです。

### (参考)jQueryの場合 --- jquery-case

参考までにjQueryのやり方を紹介します。

![what-is-hotwire-jquery.webp](content_images/what-is-hotwire-jquery.webp "max-w-[500px]")

* "user_id:2"の行にイベントハンドラをつなげて、クリックされたらサーバの`/users/2/user_profile`にリクエストが飛ぶようにします
* 帰ってきた結果は`user-profile`に埋め込まれるようにします
* 上記の流れはJavaScriptで書きます（HotwireはHTML属性だけで宣言的に指定した）

jQueryのやり方はHotwireとよく似ていて、直接的です。やはりシンプルでわかりやすいです。

## Hotwireのアプローチのまとめ --- approach-of-hotwire-summary

* ブラウザからのリクエストに対して、サーバでHTMLのパーツを作ります
* ブラウザではパーツをはめ込みます
* ステートは通常はあまり意識しません（複雑なUIになったら考えることがあります）
