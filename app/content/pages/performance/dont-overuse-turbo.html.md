---
title: Turboを使いすぎない
section: Performance
layout: article
order: 05
---

## Turboは必ずサーバ通信をする

Turboは必ずサーバ通信をします。サーバ通信をして、返ってきたHTMLを使用して画面を更新します。そしてサーバ通信は早くて100ms以下、遅い場合は数秒の単位で時間がかかります。

## Controllerにsleepを入れて試してみる

Turboを多く使う方がコードは簡単になりやすいのは間違いありません。しかしそれでUI/UXを悪くしてしまったら本末転倒です。そこでControllerにsleepを入れたり、ネットワーク通信を3Gにシミュレートすることをお勧めします。UI/UXがそれでも画面できるレベルなら問題ありません。

特に気をつけなければならないのは、ネットワーク環境が悪かったり、サーバ遅延が起こりやすいケースです。例えばイベント会場はWiFiや携帯ネットワークがつながりにくかったり、遅延したりしやすいので、そこで使うアプリは気を使う必要が出てきます。

## 対策

* 本当にTurboが必要かどうかを検討します。頻繁に変更される内容でなければ、内容を先読みしておいて、Stimulusで表示・非表示を切り替えることを検討します。
* [Prefetch](https://turbo.hotwired.dev/handbook/drive#prefetching-links-on-hover)を検討します。Touch UIの場合はhoverがありませんので、Turbo Driveのprefetchの効果が下がります。この場合は[`data-turbo-preload`](https://turbo.hotwired.dev/handbook/drive#preload-links-into-the-cache)も検討できます。
* 楽観的UIを検討します
* 適切なフィードバックを提供します
