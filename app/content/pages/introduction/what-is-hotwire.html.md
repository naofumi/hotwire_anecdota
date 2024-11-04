---
title: Hotwireとは何か
section: Introduction
layout: section
order: 005
---

## HotwireはSPA

言葉の定義によって考え方が異なりますが、Wikipediaの[「シングルページアプリケーション」](https://ja.wikipedia.org/wiki/シングルページアプリケーション)に従えば、HotwireはSPAとなります。HotwireのTurboは、Wikipedia記事から引用した下記の文書の通りに画面遷移をしたり、画面の部分的置換を行なっています。

> 必要なコード（HTML、JavaScript、CSS）は最初にまとめて読み込むか、ユーザの操作などに応じて動的にサーバと通信し、必要なものだけ読み込みを行う。
> 
> ...
> 
> サーバへリクエストすると、通常は生データ（XMLやJSON）かHTMLのどちらかが送られてくる。HTMLであれば、クライアント側はJavaScriptでDOMの一部を更新する。


## HotwireはSSR

これも言葉の定義によって考え方が変わりますが、HotwireはSSR (サーバサイドレンダリング)です。HTMLコードは専らサーバ側で生成され、ブラウザに送信されます。

HotwireはSPAであり、かつSSRであることから、Next.jsで`getServerSideProps()`を使用し、かつ`Link`タグを使用した場合と似たように動作します。

## HotwireはIKEA家具のような組み立て式

HotwireはIKEA家具のような部分組み立て工法です。工場（サーバ）で製造されたパーツを、自宅（ブラウザ）で組み立てます。一方でReact等では木材と設計図だけ（JavaScript, JSON）を搬入し、自宅でゼロから組み立てます。

Hotwireはサーバで組み上がったHTMLを取得します。HTMLはページ全体のこともありますし、一部分であることもあります。そしてブラウザに表示されているDOMに、`innerHTML`等を使って適宜挿入・置換します。

## HotwireはJSON APIが不要

HotwireではHTML断片をブラウザに送ります。JSONは送りません。

