---
title: Hotwireとは何か
section: Introduction
layout: section
order: 005
---

## HTMLレンダリングはサーバで行う

SSRと基本的に同じ

## SPAである

## HTMLを入れ替えるだけの非同期ページ更新

1. Reactの場合はデータを入れ替えて、その結果として新しいHTMLがブラウザで生成されて、新しいページになる
2. Hotwireの場合はサーバで新しいデータを使ったHTMLがサーバで生成されて、ブラウザで表示されているページ部分的に置換する

Reactはレンダリングされた後のHTMLを部分的に置換することをしません。サーバからデータを取得 => ステートを更新 => HTMLをブラウザで再レンダリング(Shadow DOM) => 現在表示されているHTMLとShadow DOMを比較して([差分検出処理](https://ja.legacy.reactjs.org/docs/reconciliation.html))、変更があった箇所を入れ替えます

それに対してHotwireの場合はサーバから新しいHTMLを取得します。これを`innerHTML`等で入れ替えるだけです(Morphingを使うとReactの差分検出処理と同様のことも可能)。圧倒的にシンプルな仕組みです。

## Hydrationは不要

Hotwireのイベント処理は、通常はStimulusを使用します。Stimulusは...を使用してDOMにイベントハンドラを自動的につけるもので、非同期通信によりHTMLの中身が頻繁に変わるサイトでイベントハンドラを効率的にかつコードを整理した状態でつけることができます。

React SSRでイベントハンドラをつけるためにはHydration処理を行う必要がありますが、Stimulusの場合は変更があった箇所だけイベントハンドラをつけるだけなので、軽量です。

