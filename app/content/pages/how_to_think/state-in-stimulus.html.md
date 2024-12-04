---
title: Stimulusとステート
section: Tips
layout: article
order: 100
---

## Stimulusのステートの考え方

![Stimulus State](content_images/stimulus_state.webp)

Reactにおけるステートは、基本的には`useState`または`useContext`から返されるステート変数を指します。ステートがRedux Store, URL, cookie, localStorage等に保管されているケースもありますが、常に`useState`と同じような仕組みで利用することになります。またステートは勝手に変更してはならず、必ず用意された関数でセットする必要があります(`useState`の場合は第２引数)。

それに対してStimulusはステート管理に明確なルールはありません。ステートとしては何を使っても良いのですが、一般的にはDOMそのものを使います。HTML要素の`data-*-value`や`class`等の属性についてはStimulusが用意している機能がありますが、特にこれに限らず、何を使っても問題ありません。また直接URL, cookie, localStorage等をステートとして使っても良いでしょう。

