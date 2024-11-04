---
title: Stimulusで複雑なステートを使用
section: Tips
layout: section
order: 005
---

## ステート管理の課題

![ステートの中央管理](content_images/central-state-management.webp)

## Stimulusは`*values`を使って複雑なステートに対応できる

## Stimulusはデータバインディングがない

Stimulusは[データバインディング](https://ja.wikipedia.org/wiki/データバインディング)がないため、ステートの変更をUIに反映させる処理を書く必要があります。

データバインディングを行うためには、データ変更時に周辺のHTMLを含めて書き直すのが一般的。Stimulusは原則としてHTMLを大きく書き換えないので、データバインディングが少し煩雑になる。

## ERBコードとの比較

## Reactコードとの比較
