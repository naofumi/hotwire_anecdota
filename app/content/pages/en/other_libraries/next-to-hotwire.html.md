---
title: Next.jsのサイトをHotwireに移行する
section: Tips
layout: article
order: 005
---

## Next.jsのサイトをHotwireに移行する手順

認証方法によっては大きな変更が必要なケースもありますので、ここでは認証については省略して紹介します。

* Rails側でNext.jsのページに対応するControllerとviewを作成
* viewをJSXからERBに変更
    * JSXのコンポーネントはRailsのpartialもしくはhelperに変換し、Rails側でもコンポーネント化することは可能です
    * しかしコンポーネントの粒度等が異なる可能性も高いので、JSXではなくHTMLとしてERBに変換した方が良いケースもあります。この際はブラウザの開発者メニューから要素をHTMLでコピーして、ERBに貼り付ければ十分です
* 必要なデータをRailsのControllerで取得して、ERBに流します 

## next.config.jsからrewrites()関数をエキスポート

https://nextjs.org/docs/app/api-reference/next-config-js/rewrites

## Next.jsのmiddlewareでrewrite()を指定

https://nextjs.org/docs/app/api-reference/functions/next-response#rewrite
