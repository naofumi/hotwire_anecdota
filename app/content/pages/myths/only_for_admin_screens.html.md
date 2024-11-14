---
title: Hotwireは管理画面限定？
layout: article
order: 10
published: true
---

## Hotwireはエンドユーザ向けもこなします

Hotwireが管理画面に適しているのは間違いありません。JSON APIを作る手間がありませんので、多数の画面を次から次へと作るのにはとても向いています。しかし**管理画面だけ**に向いているわけではありません。

下記の企業では、Hotwire（もしくは近い技術）をエンドユーザ画面で使用し、成功しています。

* Hotwireは37signalsのメールアプリ Heyを作るために開発されたライブラリです。また37signalsはプロジェクト管理システム Basecampもこの祖先となる技術で作っています
* [CookpadはHotwireを採用](https://techlife.cookpad.com/entry/2024/11/13/130000)しています
* GitHubはHotwireの先祖となる技術(PJAX)で作られ、Turbo/Hotwire系の技術を使用して来ました。現在はTurboを使用しています。一部のページの画面の一部分でReactを使用しています
    * Hotwireのベースは少なくとも2012年のGitHubのPJAXに遡れます。10年以上、世界で有数のアクセス数のあるサイトでの実績があるコンセプトと言えます 

## 補足

* HotwireもReactも結局はJavaScriptです。JavaScriptでできることならば、HotwireでもReactでもできます。本来は驚くべきことではありません
