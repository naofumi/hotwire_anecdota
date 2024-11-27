---
title: Turboのアキレス腱はネットワーク
layout: article
order: 05
published: true
---

## Turboは必ずサーバ通信をする

Turboは必ずサーバ通信をします。サーバ通信をして、返ってきたHTMLを使用して画面を更新します。そしてサーバ通信は早くて100ms以下、遅い場合は数秒の単位で時間がかかります。

**これがTurboのアキレス腱です**。ネットワーク環境が悪いとUI/UXを大きく低下させる恐れがあります。例えばイベント会場はWiFiや携帯ネットワークがつながりにくかったり、遅延したりしやすいので、そこで使うアプリの場合は十分に気を使う必要が出てきます。

レスポンスが遅い場合、何らかのフィードバックをユーザに与える必要があります。ヤコブ・ニールセンの10ユーザビリティヒューリスティックスの一番目は[「システム状態の視認性」](https://u-site.jp/alertbox/ten-usability-heuristics#section-1)です。これを怠るとUI/UXを悪化させる恐れがあります。

## Controllerにsleepを入れて試す

Turboを多く使う方がコードは簡単になりやすいのは間違いありません。しかしそれでUI/UXを悪くしてしまったら本末転倒です。そこでControllerにsleepを入れたり、ネットワーク通信を3Gにシミュレートすることをお勧めします。そうしてまずはネットワークレスポンスが遅い状態を確認します。通常は、何らかの対策が必要だと気づくでしょう。

## 対策

* 本当にTurboが必要かどうかを検討します。頻繁に変更される内容でなければ、内容を先読みしておいて、Stimulusで表示・非表示を切り替えることを検討します
* [Prefetch](https://turbo.hotwired.dev/handbook/drive#prefetching-links-on-hover)を検討します。Touch UIの場合はhoverがありませんので、Turbo Driveのprefetchの効果が下がります。この場合は[`data-turbo-preload`](https://turbo.hotwired.dev/handbook/drive#preload-links-into-the-cache)も検討できます
* Pending UI （待ちUI）。ローダーアニメーションなどの表示です。Turboは`<form>`や`<turbo-frames>`に`aria-busy`属性を自動的につけてくれますので、これを使えばCSSだけでローダーアニメーションが表示できる可能性があります。また`<form>`送信の時は`data-turbo-submits-with`属性を使って待ちUIを実現することもできます
* Optimistic UI（楽観的UI）を検討します。楽観的UIを提供してくれるネイティブなウィジェット（例えばradioボタンやcheckboxなど）を使ったり、Stimulus controllerを作ったりすれば楽観的UIが用意できるでしょう
