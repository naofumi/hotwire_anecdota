---
title: TypeScript vs. ERBの型安全性
subtitle: 静的型を頑張って記述しても、それだけでは型安全性は高くなりません。
description: "TypeScriptが内部の型しか保証せず、実行時やJSON APIとの不整合を防げない点をReactとERBから比較します。RubyとERBは存在しない属性へのアクセスを実行時エラーにし、Controller testやRequest specで検出できるため、追加の契約検証なしでも本番バグを防ぎやすいと論じます。"
layout: article
order: 90
published: true
---

TypeScriptだけをいくら使用しても型安全にはなりません。逆にRuby ERBを使用すればほとんど何もしなくても高い型安全性が得られます。これはJavaScript/Reactが弱い型である一方、Rubyは強い型を持つからです。

![TypeScript vs. ERBの型安全性](https://www.youtube.com/watch?v=pUmNdI2PIj0 "mx-auto max-w-full")

* RubyおよびERBは実行時に[強い型付け](https://ja.wikipedia.org/wiki/%E5%9E%8B%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0#%E5%BC%B7%E3%81%84%E5%9E%8B%E4%BB%98%E3%81%91%E3%81%A8%E5%BC%B1%E3%81%84%E5%9E%8B%E4%BB%98%E3%81%91)となるため、存在しないフィールドにアクセスするとエラーが発生してすぐに気づきます。
   * 簡単なテスト(controller test, request spec)でカバーできます。
   * 例えばDBのフィールド名を変更したけれども、アプリ側で変更忘れがあった場合がこれに当たります。
* 一方でReact/JSXは実行時に[弱い型付け](https://ja.wikipedia.org/wiki/%E5%9E%8B%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0#%E5%BC%B7%E3%81%84%E5%9E%8B%E4%BB%98%E3%81%91%E3%81%A8%E5%BC%B1%E3%81%84%E5%9E%8B%E4%BB%98%E3%81%91)になるため、存在しないプロパティをアクセスしてもエラーは発生しません。
   * JSXが`undefined`を空白文字列に自動変換してしまうためです。`undefined`なら`throw`するようにJSXが設計されていればこのようの問題は回避できたはずですが、Reactはそのように設計されていません。[^undefined] 
   * QAでも気づきにくい場合があるため、本番に出てしまうリスクが高いバグです。
   * E2Eテストがあっても、普通はすり抜けてしまいます。
   * TypeScriptは実行時には存在しないため、実行時には役に立ちません。TypeScriptが保証できるのは「定義した型が正確であればこうなるはず」だけであって、前提となる型の正確性は保証できません。
   * 例えばバックエンドがJSON APIのプロパティ名を変えてしまい、フロントエンドで未対応の場合がこれに当たります。

[^undefined]: ちなみにJavaScriptは`undefined`を`"undefined"`文字列に自動変換します。これも問題ではありますが、空白文字列よりは多少目立ちますのでまだマシです。

## 結論 --- conclusion

* 面倒なツールを導入して細かいテスト等を用意しない限り、Ruby/ERBの方がTypeScript/Reactよりも型安全になります。ここでいう型安全性は、本番にバグを出すリスクを減らしてくれるという意味です。
* 画面に表示するデータをなるべく正確にしたいというのであれば、TypeScript/ReactよりもRuby/ERBの方が安全だと言えます。
