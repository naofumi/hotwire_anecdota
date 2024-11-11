---
title: Reactと一緒に使う
section: With Other Frameworks
layout: section
order: 010
published: true
---

## MPAの中にReactを埋め込む

HotwireやMPAのページの中にReactを埋め込むのは簡単です。[Reactの公式サイトによると](https://ja.react.dev/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page)、**Facebookも長らくこの使い方がメインでした**。

Apple StoreもMPAページの中にReactを埋め込んで使っています。ブラウザ側だけで製品のオプションを選択して、価格を表示しています。このような複雑なステートをフロンド側だけで管理するために使っているようです。なおAppleウェブサイトの他のページは、ほとんどがMPAになっています。必要なところだけReactを使っています。

一般的なページ、特にマーケティング的なページは、ReactよりもMPAの方が向いていると思います。ほとんどのページをMPAで作り、複雑なステート管理が必要なところだけをReactで書くのは賢明な選択です。

## MPAをHotwireで拡張する

HotwireはMPAを拡張する技術です。TurboをインストールしただけでTurbo Driveがデフォルトで動くようになり、ページ遷移が高速化されます。マーケティング的なページでも十分に役に立ちます。

マーケティング的なページはjQueryやバニラJavaScriptでページをインタラクティブにしていることが多いです。この場合もStimulusを使うと、コードの整理に役立ちます。

## 実例の紹介

本サイトでも何箇所かでReactをHotwireの中に埋め込み、Hotwireとの違いを例示しています。ここではそのやり方を解説します。
