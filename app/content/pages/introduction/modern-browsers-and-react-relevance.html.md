---
title: 新しいブラウザ機能とReactの必要性
layout: article
order: 120
published: true
---

最近のブラウザ機能の進歩は目覚ましく、Reactを使わなくても、あるいはほとんどJavaScriptを書かなくても多機能なUIが作りやすくなっています。重厚なJavaScriptを使わなくても、ブラウザの機能だけで優れたUIが作れます[^jquery]。加えてReactのUIライブラリを使用するとライブラリのバージョン更新が必要になりますが、ネイティブなブラウザ機能を使用する場合はその心配もありません。

[^jquery]: 以前はJavaScriptの機能不足やブラウザ機能の不統一を補うライブラリとしてjQueryが人気を博しましたが、JavaScriptの進歩とIEの消滅により必要性が低下しました。ブラウザの機能が進歩すると、多機能なUIを実現するためのライブラリ等も同様に重要性が低下するでしょう。

**HotwireでUIを作る際は最新のブラウザ機能に注目し、使えるものは積極的に活用することを強くお勧めします**。最新のブラウザ機能が利用できると書くコードが減り、かつ高い保守性が得られます。

以下では特に有用なものをいくつかピックアップしました。

### `<dialog>` --- dialog

[`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog)でモーダルや確認ダイアログを簡単に作れます。背景の操作禁止やフォーカスまわりもブラウザが面倒を見てくれます。`::backdrop`でオーバーレイもスタイルできるため、昔よりはるかに少ないコードで実用的なモーダルが組めます。

### `<details>` / `<summary>` --- details-summary

[`<details>` / `<summary>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details)でアコーディオンUIを標準HTMLだけで作れます。[`<details name="...">`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDetailsElement/name)でアコーディオンの排他制御までできます。

### `popover` --- popover

[`popover`属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover)でメニューやオーバレイが作れます。ドロップダウンメニュー、ヘルプ吹き出し、簡易メニューのようなUIは`popover`で扱いやすくなりました。`Esc`や外側クリックで閉じるような「light dismiss」も標準で備わっていて、divを絶対配置して自前制御する必要が減ります。また[`popovertarget`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button#popovertarget)でトリガーとポップオーバーをHTMLだけで結びつけられます。

### `View Transitions API` --- view-transitions

[`View Transitions API`](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)で画面遷移や状態変化のアニメーションが作れます。一覧から詳細へ、タブ切り替え、並び替え、SPA/MPA間の遷移などを、少ない実装で滑らかに見せられます。

### `CSS Anchor Positioning` --- anchor-positioning

[`CSS Anchor Positioning`](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning)でツールチップやメニューの位置合わせが楽になりました。ボタンに対してツールチップをくっつける、入力欄に対して補助UIを追従させる、といった処理は昔から地味に大変でした。新しいAnchor Positioningを使うと、要素同士を関連づけて位置決めしやすくなり、オーバーフロー時の逃がし方までCSSで扱えるようになってきています。

### Client-side validation --- client-side-validation

[HTML標準のClient-side validation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation)は`required`、`type="email"`、`minlength`、`pattern`などを付けるだけで、多くの入力チェックをブラウザ標準で任せられます。`Constraint Validation API`を使えば、`checkValidity()`や`reportValidity()`、`setCustomValidity()`で振る舞いも拡張できるため、バリデーションライブラリなしでも十分に組めます。また擬似CSSの`user-valid` `user-invalid`により、UI/UX的に最適なタイミングでエラーを表示できます。

### `:has()` --- has-selector

[`:has()`](https://developer.mozilla.org/en-US/docs/Web/CSS/%3Ahas)で親要素や周辺要素の状態をCSSだけで扱いやすくなリマした。

### `Scroll-driven Animations` --- scroll-driven-animations

[`Scroll-driven Animations`](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations)でスクロール連動UIをCSS主体で書けるようになりました。スクロール進捗バー、読み進めに応じたアニメーション、要素が見えてきたタイミングでの演出などを、JavaScriptのスクロール監視より自然に書けるようになってきました。

### `content-visibility` --- content-visibility

[`content-visibility`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/content-visibility)で重い画面を軽くしやすくなりました。長いリストや下の方にある重いセクションを、必要になるまで描画コストを抑えて扱えます。JavaScriptの仮想リストや細かい最適化に頼らなくても、初期表示を速くしやすくなっています。

### `:open`, `:popover-open` --- open-selectors

[`:open`](https://developer.mozilla.org/en-US/docs/Web/CSS/%3Aopen)や[`:popover-open`](https://developer.mozilla.org/en-US/docs/Web/CSS/%3Apopover-open)などの状態セレクタが便利です。開いている`details`、表示中の`popover`、開いている`select`などに対してCSSを当てやすくなりました。JavaScriptでclassを付け外ししなくても、UIの状態をそのまま見た目に反映しやすくなっています。
