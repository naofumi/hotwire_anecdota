---
title: Optimistic UI (楽観的UI)
layout: article
order: 110
published: true
descriptors:
  server_request: true
  state_management:
    - Stimulus Values
  technologies:
    - Stimulus
  demo_urls:
    - ["Turbo Driveによるデモ", "/todos?variant=drive"]
    - ["Turbo Streamsによるデモ", "/todos?variant=streams"]
    - ["楽観的UIによるデモ", "/todos?variant=optimistic"]
---

「いいね」ボタンの実装を通して、UI/UXを段階的に改善していきます。**最終的にはoptimistic UI (楽観的UI)まで実装し、ネイティブアプリのような操作性を実現します**。

下記のようなUIになります。

![likes.mov](content_images/likes.mov "max-w-[500px] mx-auto")
<div class="text-sm font-bold max-w-[500px] mx-auto">
モバイルネットワークのUI/UXを再現するためにサーバレスポンスに0.3秒の遅延を入れています
</div>

## 考えるポイント --- points-to-consider

* 「いいね」はサーバと同期する必要があります。したがってTurboを使います。Turboの中にもやり方は複数あります 
    * **Turbo Driveを使う方法:** 「いいね」ボタンを押すたびに画面全体をサーバで再レンダリングして、ブラウザに送ります
    * **Turbo Streamsを使う方法:** 「いいね」ボタンを押すたびに、該当の行だけを再レンダリングして、ブラウザに送ります
    * **楽観的UIを使う方法** 「いいね」ボタンを押すと、ブラウザのネイティブ機能やJavaScriptを使い、ユーザにフィードバックを与えます。その裏でTurbo DriveもしくはTurbo Streamsでサーバと非同期通信を行い、レスポンスを受け取ったらUIを更新します。
* 楽観的UIを実現するためには、「いいね」ボタンを押した直後に（サーバからのレスポンスを受け取る前）UIを更新する必要があります。これはStimulus Controllerで実現します。

## 実装 --- actual-implementation

実装は「子ページ」をそれぞれご確認ください。
