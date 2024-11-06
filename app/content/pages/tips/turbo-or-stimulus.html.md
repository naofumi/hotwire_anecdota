---
title: TurboとStimulusの使い分け
section: Tips
layout: section
order: 005
---

## 考え方

TurboとStimulusは基本的には全く異なることを担当しています。Turboはサーバと通信した結果を画面に反映する役割を担い、一方のStimulusはブラウザだけで完結するものを扱います。つまりサーバ側で随時変更される内容を表示する場合はTurbo、変更されにくいものはStimulusという具合です。

しかし開発の容易さや既存コードからの移行を考えた場合、Stimulus的な処理であってもTurboでやることがあります。あるいはパフォーマンス最適化の観点から、コードが多少ややこしくなっても敢えてStimulusを使うこともあります。

![Turbo or Stimulus](content_images/turbo-or-stimulus.webp)

