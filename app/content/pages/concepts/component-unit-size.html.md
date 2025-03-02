---
title: コンポーネントの粒度
layout: article
order: 500
---

## 視覚的とインタラクションのコンポーネント粒度

Reactの普及により、コンポーネントは視覚的な見た目とインタラクション（イベントに対する応答）をまとめたものを指すことが一般的になっています。

一方でHotwireは[プログレッシブエンハンスメント](https://ja.wikipedia.org/wiki/プログレッシブエンハンスメント)の伝統に従い、視覚的な見た目とインタラクションを分離しています。このため、それぞれを独立に考えることが可能であり、コンポーネント粒度をより柔軟に考えることが可能です。

例えばアコーディオンであれば、Reactはコンポーネントの中に見た目のHTMLとイベントハンドラの双方を持たせます。ステートもそのコンポーネントが持ちます。

一方でHotwireの場合はHTMLは別に作っておき、後からStimulus controllerと繋げます。Stimulus controllerは`*target`を介して、主要なHTML要素と繋げ、ステートはStimulusが持ちます。そのためHTMLとインタラクションが分離されます。

なお[Headless UI](https://headlessui.com)などのように、Reactの世界でも視覚的な見た目とインタラクションを分離する動きもあり、こちらはHotwireの考え方に近いと感じます。

## Hotwire用に作られているコンポーネントライブラリー

まだ進行中ですが、Hotwire用のコンポーネントライブラリーも作成されています。

## 自分で作るStimulus Controllerの粒度

一般論としてはStimulus Controllerは小さく作り、再利用可能な単位にすることが推奨されています。ウィジェットの単位にしても良いですし、場合によってはさらに細かく考えてCSSクラスの切り替えの粒度まで下げることも可能です。

実際にStimulus Controllerを書いていくと、Controller内部に各コードと比べて、それをHTMLと繋げるためのものが多いと感じることが頻繁にあります。そのような場合、Controllerを再利用可能にして一所懸命DRYにするよりも、その程度のコードは繰り返し書いても問題ないと思ったります。そうすることでControllerとHTMLを接続するコードを減らしたり、わかりやすくできれば、総合的にはプラスだと感じることが多いです。

したがって、もっと粒度を細かくできる場合であっても敢えてそれをやらないという選択もします。そしてHeadless UIと似た考えになりますが、ウィジェット単位のStimulus Controllerを書くのが良いのではないかと思います。

またページ全体に近いぐらいの大きいStimulus Controllerを書くことがあります。特にformなどはそうです。もちろんStimulus Controller同士をOutletで繋げることもできます。しかしformは一つの単位として扱いたい場合も多いので、その場合は一つのJavaScriptファイルにまとめた凝集度の高い設計が良いと感じています。

このようにStimulus Controllerの粒度は柔軟に考えて、ケースバイケースで調整することをお勧めします。ページ全体を覆うようなものがあっても決してアンチパターンではなく、その方がコードがわかりやすくなると思えばそれで良いと思います。

またStimulus Controllerは`target`を提供してくれるので、インタラクションに関係するすべてのHTML要素を包括するものを作りがちです。しかしその必要はありません。`target`で指定しなくても、CSSセレクタでHTML要素を指定することは全く問題ありません。関係するHTML要素が互いに遠く離れている場合などは、むしろ積極的にこれを行うことがあります。

例えばHTMLでも`label`タグと`input`タグはセットです。`label for=[inputのID]`と記述することで、labelとinputの関連性を指定します。Stimulusでも同じように`id`やその他の方法で関連性を指定しても良いのです。`target`は確かに便利ですが、これに縛られる必要はないと考えています。
