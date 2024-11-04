---
title: CSR vs SSR
section: History
layout: section
order: 010
---

## 進化の分岐点はCSR vs SSR 

![Hotwire History](content_images/hotwire-history.webp)

上記のように、フロントエンドライブラリー・フレームワークは大きくCSRとSSRに分けられると私は考えています。

こうすることで、ReactやVueのようなライブラリーとHotwire, HTMXの違いをクローズアップできると思います。

* ReactやVueはブラウザでHTMLを生成するCSRとして発展しました。そのため、ブラウザでHTMLを書き換えるのが一般的です。[Reactの条件付きレンダー](https://ja.react.dev/learn/conditional-rendering)がその典型です。サーバからHTMLを受け取り、これでDOMを部分置換する使い方はしません
* 一方でHotwireやHTMXはサーバでHTMLを生成するSSRとして発展しました。したがって大きなHTMLを書き換える場合は原則としてサーバを使います。ブラウザだけで行う変更は主にCSSクラスやHTML属性の変更に限られます。サーバからJSONを受け取り、HTMLを生成することも可能ではありますが、一般的ではありません
* ルーツであるjQueryではこの区別が明確ではなく、サーバからJSONを受け取り、ブラウザでHTMLを書き換えることは一般的でした。またサーバから帰ってきたHTMLを`innerHTML`で部分的に置換することも行われていました
