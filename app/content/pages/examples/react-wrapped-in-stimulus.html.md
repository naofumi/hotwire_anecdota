---
title: ReactをStimulusでラップする
description: "CRUDページ全体はHotwireで作りながら、既存の高度なReactウィジェットだけを部分的に利用する構成を紹介します。既存MPAへReactを埋め込む一般的な方法に加え、StimulusでReactをラップして外部からpropsを更新し、二つの技術をページ内で協調させる考え方を解説します。"
section: Tips
layout: article
order: 500
---

## ReactとHotwireの共存

CRUDなどの画面はHotwireで作りたい一方で、部分的にReactを使いたいというケースもあります。例えば非常にインタラクティブなUIコンポーネントをすでに持っていて、これを使いたいケース。あるいは出来合いのReactウィジェットを使いたいといったケースがあるかもしれません。

Hotwireはこのようなケースにも十分に対応できます。

### 既存のMPAページの一部にReactを使用する

[Reactの公式サイト](https://ja.react.dev/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page)にもあるように、既存ページの一部にReactを使うのは極めて一般的です。

Hotwireはこれに十分に対応します。加えてStimulusを使えば、Reactコンポーネントのpropsを外部から簡単に変更できます。ここではStimulusでReactをラップする方法を紹介します。

