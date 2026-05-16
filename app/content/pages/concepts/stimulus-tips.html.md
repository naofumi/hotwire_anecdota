---
title: Stimulusのコツ
layout: article
order: 110
published: true
---

Stimulusを使うコツとして、私は下記を意識するようにしています。

## なるべくブラウザネイティブな機能を使う --- use-browser-native-features

* ブラウザネイティブな機能を使えば、コードが少なくなり、メンテナンス性が向上します
* ブラウザネイティブのアクセシビリティがついてくるので、アクセシビリティの心配が減ります

## HTML生成をなるべく避ける --- avoid-html-generation

* StimulusはHTMLを生成するような機能を用意していません。JSXのように効率的にHTMLを生成するツールは用意されていません。
* これは[設計上の意図的なもの](/concepts/why-avoid-rendering-html-in-stimulus)です。レンダリングだけを考えるとブラウザでHTMLを生成しても工数は増えないように考えがちですが、[JSONを準備だけで多くの工数がかかるケースが多いです](/introduction/key_difference_between_hotwire_and_react)。
* もちろんStimulusの中でHTMLを生成することはできます。その場合は[記述量を最小限にすることをお勧めします](/concepts/why-avoid-rendering-html-in-stimulus#when-html-is-allowed)。

## ステートを意識する --- state-management

* Stimulusを使う時も、Reactと同様にステートを考慮します。ただしStimulusの場合はステートの種類が多く、どれを使用するかはケースバイケースで判断することになります。
    * ネイティブなHTML要素(`<input>`タグなど)のステート
    * `aria`属性
    * [StimulusのValues](https://stimulus.hotwired.dev/reference/values)
    * CSSクラス
    * hiddenなどのHTML要素の属性
    * Zustandなどのステートライブラリ
    * Stimulusコントローラのインスタンスプロパティ
* ステートを画面に反映させる方法を意識します。これもケースバイケースでいろいろなやり方があります。
    * CSSのセレクタ・擬似セレクタで表示を変える方法
       * Aria属性やHTML属性、Stimulus values、hidden属性などをステートとしている場合は、`:checked`, `[aria-expanded="true"]`, `[data-xxx-yyy-value="zzz"]`, `[hidden]`のようなCSSを書くだけで自動的にステートを表示に反映できます。
    * StimulusコントローラからDOM要素の属性、classやコンテンツを直接変更して表示を変えられます。
    * Stimulus Valuesを使っている場合は、ステートが変更された時に[`xxxValueChanged()`コールバック](https://stimulus.hotwired.dev/reference/values#change-callbacks)が自動的に呼び出されます。この中に画面更新処理を記述できます。

## イベント処理、ステート変更、表示更新の責務を分離する --- event-state-view-separation

* Reactはすべての責務を一つのコンポーネントに押し込めます。
* 一方でStimulusは責務の分離を可能にしています。
   * 表示はHTMLおよびCSSで記述します。
   * ユーザイベントに対する応答はStimulusコントローラで記述します。
   * イベントに応答して画面表示を変える場合は、まずはCSSによる変更を検討します。
   * CSSだけでは十分に表示を変えられない場合は、Stimulusの中からHTMLのコンテンツ等を書き換えます。 

## コードが複雑になったら単方向データフローを意識する --- single-direction-data-flow

* Stimulusの処理が複雑になった場合、[単方向データフローをはじめとしたStimulusコントローラの構造を意識する](/concepts/stimulus-typical-structure)ことで改善するケースが多いです。

