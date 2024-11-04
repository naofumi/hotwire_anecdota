---
title: Stimulusの中からReactを呼ぶ
section: Tips
layout: section
order: 005
---

## Stimulusの中からReactを呼ぶ

Reactでは単方向データフローを維持するために、ステートを介したDOM操作がルールになっています。そのためReactの中にHotwireを入れるのは困難です。

ただし逆は全く問題ありません。StimulusやTurboの中でReactを使うことは簡単ですし、Componentにpropsを渡す方法としても使用できます。
