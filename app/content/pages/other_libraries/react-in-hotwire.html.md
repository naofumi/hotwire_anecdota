---
title: ReactとHotwireの共存
layout: article
order: 005
published: true
---

## Reactのページを一部残しながらHotwireに移行する

CRUDなどの画面はHotwireで作りたい一方で、部分的にReactを使いたいというケースもあります。例えば非常にインタラクティブなUIコンポーネントをすでに持っていて、これを使いたいケース。あるいは出来合いのReactウィジェットを使いたいといったケースがあるかもしれません。

Hotwireはこのようなケースにも十分に対応できます。

## 既存のMPAページの一部にReactを使用する

[Reactの公式サイト](https://ja.react.dev/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page)にもあるように、既存ページの一部にReactを使うのは極めて一般的です。

```ruby
def boo
  bar
end
```

1. RailsプロジェクトにReactをインストールする
2. Reactのコンポーネントを作成し、これを`<div id="root"></div>`に埋め込むコードを書く
3. Reactのコンポーネントを読み込むコードを書く

## 注意点

Reactのコンポーネントを`<div id="root"></div>`に埋め込む際、下記のように`DOMContentLoaded`イベントを使用することが多いかと思います。しかしHotwire環境で使用する場合は、`turbo:load`イベントを使用した方が無難です。Turbo Driveでページ遷移をする際はSPAになり、`DOMContentLoaded`イベントが発火しないことがあるためです。

