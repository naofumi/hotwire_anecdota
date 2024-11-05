---
title: TurboとStimulusの使い分け
section: Tips
layout: section
order: 005
---

## TurboとStimulusの使い分けの考え方

TurboとStimulusは基本的には全く異なることを担当しています。Turboはサーバと通信した結果を画面に反映する役割を担い、一方のStimulusはブラウザだけで完結するものを扱います。

しかし開発の容易さを考えた場合、本来はStimulusでも十分な処理であってもTurboにやらせてしまいたくなることがあります。あるいはユーザへのフィードバックをなるべく早く返すために、コードが多少ややこしくなってもStimulusを使うことがあります。

ここではこのようなケースを確認し、いつどのようにStimulusとTurboを使い分けるべきかを考えます。

![Turbo or Stimulus](content_images/turbo-or-stimulus.webp)

## Accordionの例
