---
title: 簡単なCRUD
section: Tips
layout: article
order: 5
published: true
---

Hotwireを開発した37signals社は、Ruby on Railsを使って（発明して）ずっとプロジェクト管理ソフトウェアを作ってきた会社です。ですからHotwireおよびその全身のRails UJS(Unobtrusive JavaScript)はCRUDが得意ですし、そのためのちょっとした工夫があります。

## `<form>`要素だけで非同期通信

Next.jsは最近`<Form>`コンポーネントを用意したり、`<form>`コンポーネントをServer Actionに対応させてきましたが、CRUDに注力していないせいか、Pages Routerまでは`<form>`要素の拡張はしていませんでした。一方でプロジェクト管理ソフトウェアを開発していた37signalsは、10年以上前からHTMLの`<form>`要素を拡張し、非同期通信に対応させてきました。

## GET, POSTに対応

* GETの場合は、SPA的な画面遷移をします
* POSTの場合は Turbo Streamなどと対応

## イベントを発火

## 「本当に...しますか？」

## 自動的にDisable

## Disable時にpending UI

## aria-busyでpending UIを簡単に作成できる

## POST時はStatus 300, 400, 500で自動的に処理を変える
