---
title: Post/Redirect/Getパターンと高速化
layout: article
order: 60
published: true
---

## 広く使われているPost/Redirect/Get パターン

* Next.jsもRemixも原則としてこれを採用。ただしNext.jsは高速化処理をしている
* HotwireはTurbo Drive, Turbo FramesではPost/Redirect/Getのパターンが必須
* Post/Redirect/Getは２往復のサーバ通信が必要になるので、勿体無い(非同期であれば、Post/Redirect/Getが回避するタイプの２重ポスト問題はそもそも起こらない)
* Hotwireの場合はTurbo Streamsを使うことで、１往復のサーバ通信で済ませることができる

## 非同期通信ではPost/Getでも良い

ネイティブブラウザのform POSTはナビゲーションを起こすものであり、`document.location`の変更を伴います。`document.location`がformの`action`を指すようになります。Postの後にRedirectを入れるのは、`document.location`が`form.action`をずっと指したままの状態であるのは都合が悪いためです。

しかし非同期通信を使用した場合は、ずっと同じ`document.location`のままでモーダルを出したりしながらformを送信することがあります。この場合は`document.location`がformの`action`を指すことがありませんので、Postの後にRedirectを入れる必要がありません。そのため、PostからすぐにGetをしても良いのです。

<form action="foo" method="post" data-turbo="false">
<button type="submit">Submit Me (Turbo Off)</button>
</form>

<form action="foo" method="post" data-turbo="false">
<button type="submit">Submit Me (Turbo On)</button>
</form>

HotwireはTurbo DriveやTurbo Framesの中でform POSTをした場合はPost/Redirect/Getパターンを期待しますし、これをやらないとうまく動きません。しかしこれはMPAからの移行をシンプルにしたり、エラーハンドリングを容易にするためのものであり、非同期通信の場合は従わなくても構いません。

HotwireでPost/Getをしたい場合は、この制約を受けないTurbo Streamsでレスポンスを返します。
