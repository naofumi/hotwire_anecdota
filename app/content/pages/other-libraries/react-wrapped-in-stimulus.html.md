---
title: ReactをStimulusでラップする
section: Tips
layout: article
order: 005
---

## ReactとHotwireの共存

CRUDなどの画面はHotwireで作りたい一方で、部分的にReactを使いたいというケースもあります。例えば非常にインタラクティブなUIコンポーネントをすでに持っていて、これを使いたいケース。あるいは出来合いのReactウィジェットを使いたいといったケースがあるかもしれません。

Hotwireはこのようなケースにも十分に対応できます。

### 既存のMPAページの一部にReactを使用する

[Reactの公式サイト](https://ja.react.dev/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page)にもあるように、既存ページの一部にReactを使うのは極めて一般的です。

Hotwireはこれに十分に対応します。加えてStimulusを使えば、Reactコンポーネントのpropsを外部から簡単に変更できます。ここではStimulusでReactをラップする方法を紹介します。

