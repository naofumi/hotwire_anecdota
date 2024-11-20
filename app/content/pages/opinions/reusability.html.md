---
title: Stimulus controllerの再利用性
layout: article
order: 005
published: true
---

Stimulusは再利用性を意識した設計になっており、HTML属性を書き換えるだけで各Controllerに多くの引数を渡せる設計になっています。しかし、実際Stimulusを使ったコンポーネントライブラリーはまだ出てきているところであり、多くの人は自分でStimulus controllerをスクラッチから書いています。

自分が実際に書いているStimulus controllerを見ると、かなりシンプルなものが多く、わざわざライブラリにするほどのコード行数に満たないと感じることが多いのも事実です。ライブラリーにしたら機能が増えるし、
