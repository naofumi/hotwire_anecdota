---
title: 楽観的UI
description: "サーバ応答を待たずに操作結果を表示する楽観的UIを、Hotwireでどう考えるかを整理します。checkboxやradioが持つブラウザ標準の即時反応とCSSの状態セレクタを活用する方法、HTML変更が必要な場合にStimulusを補助的に使う方法を分け、JavaScriptを増やしすぎない実装方針を示します。"
section: Performance
layout: article
order: 500
---

## 楽観的(Optimistic) UI 

楽観的UIは簡単にいうと、POSTなどのmutationに対して、サーバからの応答を待たずにUIを更新させることを言います。

Hotwireで考えるときは、大きく２つに分けると良いと思います。

### HTMLを変更しなくても良い楽観的 UI

例えば`<input type="checkbox">`(チェックボックス)や`<input type="radio">`(ラジオボタン)はネイティブなままでも楽観的 UIを提供してくれます。チェックボックスはクリックすればチェックが入り、またラジオボタンもクリックすれば選択されます。一切のJavaScriptを書かなくても、またサーバとの通信をしなくても、HTML要素のステートは変更されます。

またチェックボックスやラジオボタンのステートはCSS擬似セレクタの`:checked`で検知できますので、CSSさえ書けばオン・オフ時の表示を自在に変更できます。さらに`:has`擬似セレクターを使えば親HTML要素の表示も変えられます。

このように一切JavaScriptを書かなくても、かなりの楽観的 UIが作れます

### HTMLの変更が必要な楽観的 UI

例えばチャックアプリを作っていて、
