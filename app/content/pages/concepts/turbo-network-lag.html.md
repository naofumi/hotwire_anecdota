---
title: Turboとネットワーク遅延
layout: article
order: 320
published: true
---

## Turboはネットワーク遅延が発生しやすい --- turbo-often-creates-network-delays

Turboはネットワーク通信をしますので、ネットワークが遅いとUI/UXを低下させる恐れがあります。そこで[Turboには下記の対策が組み込まれています](/concepts/why-is-hotwire-fast)。

* **積極的なキャッシュ:** デフォルトでStale-while-revalidate型のキャッシュが使われます。
* **プレフェッチ:** 動的なページを含め、積極的にプレフェッチをします。
* **ローディング状態をデフォルトで表示:** Turboはデフォルトで[プログレスバーを表示](https://turbo.hotwired.dev/handbook/drive#displaying-progress)します。またローディング中は`aria-busy`や`busy`の属性を自動的にHTMLに付けますので、CSSだけでローディング状態を表示できます。

このようにHotwire/Turboは[システム状態の視認性](https://u-site.jp/alertbox/ten-usability-heuristics#section-1)を確保するために多くの工夫が組み込まれていますが、それでもネットワーク遅延には注意する必要があります。

## Controllerにsleepを入れて試す --- add-sleep-to-your-controller

Turboを多く使う方がコードは簡単になりやすいです。**可能ならばなるべくサーバ側で作業した方がほぼ必ずコードがシンプルなります**。

**しかしUI/UXが悪くなってしまったら本末転倒です**。

そこでControllerにsleepを入れたり、ネットワーク通信を3Gにシミュレートすることをお勧めします。そうしてまずはネットワークレスポンスが遅い状態を確認します。対策が必要かどうかを検討し、必要ならば下記の方針を検討します。（不要なケースもあります。そこはケースバイケースで判断します）

## 対策 --- solutions

* 本当にTurboが必要かどうかを検討します。頻繁に変更される内容でなければ、内容を先読みしておいて、Stimulusで表示・非表示を切り替えることも一つのやり方です
* [Prefetch](https://turbo.hotwired.dev/handbook/drive#prefetching-links-on-hover)を検討します（マイスホバー時にフライングしてリクエストを投げる方法）。モバイルのTouch UIの場合はhoverがありませんので、Turbo Driveのprefetchの効果が出にくくなります。この場合は[`data-turbo-preload`](https://turbo.hotwired.dev/handbook/drive#preload-links-into-the-cache)も検討できます
* Pending UI （待ちUI）と呼ばれるローダーアニメーションなどの表示を検討します
    * Turboは`<form>`や`<turbo-frames>`に`aria-busy`属性を自動的につけてくれますので、これを使えばCSSだけでローダーアニメーションが表示できる可能性があります
    * Turbo Drive, Turbo Streamsの場合は`<form>`や`<html>`タグに`aria-busy`属性が自動的につきます。また画面の最上部に横に走るローダーが自動的に表示されます
    * `<form>`送信の時は`data-turbo-submits-with`属性を使って待ちUIを実現することもできます
* Optimistic UI（楽観的UI）を検討します。楽観的UIを提供してくれるネイティブなウィジェット（例えばradioボタンやcheckboxなど）を使ったり、Stimulus controllerを作ったりすれば楽観的UIが用意できるでしょう。楽観的UIは[「いいね」ボタン](/examples/like_button)で紹介しています

## まとめ --- summary

* Turboを使ったネットワーク通信は遅延の恐れがあります。これがUI/UXを損なわないかどうかは常に確認が必要です。
* TurboはNext.jsと比較してより多くの対策をデフォルトで用意してくれています。それでも完全ではないので、しっかり対策することが必要です。
* いくつか対策はあります。どれを実施するべきかはケースバイケースで適宜判断をする必要があります。
