---
title: PartialとHelperを使用したコンポーネント
section: Tips
layout: article
order: 30
published: true
---

Ruby on Railsでは「コンポーネント」という言葉こそ使わないものの、viewを再利用可能なパーツに分ける方法が用意されています。ここではこれを紹介します。

## Partialを使う方法

Partialは[Rails Guideで詳しく解説されています](https://guides.rubyonrails.org/action_view_overview.html#partials)。

PartialはHTMLが多く、比較的大きなコンポーネントを作成するのに適しています。また下記のように`yield`を使うことで、ドーナッツ型のコンポーネントを作ることもできます。(Reactの`children` propsのように機能しますが、Rubyの`yield`なのでコンポーネントからpropsを受け取ることもできます)

**コンポーネントの呼び出し側**

```erb:app/views/components/accordion.html.erb
    ...
    <%= render 'accordion_row',
               title: "携帯プランの変更はどうすればいいですか？" do %>
      携帯プランの変更は、店頭・公式アプリ・ウェブサイトから可能です。アプリやウェブでは24時間対応しており、数分で完了します。
    <% end %>
   ...
```

**コンポーネントの定義**

```erb:app/views/components/_accordion_row.html.erb
<div class="py-4 border-b border-gray-300"
     data-controller="accordion">
  <button class="group w-full flex justify-between text-xl cursor-pointer"
          data-action="click->accordion#toggle"
          data-accordion-target="trigger"
          aria-expanded="false">
    <span><%= title %></span>
    <div class="group-aria-[expanded=true]:rotate-180 pt-2 transition-all duration-300">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
      </svg>
    </div>
  </button>
  <div data-accordion-target="revealable" class="h-0 overflow-hidden transition-all duration-300 text-sm">
    <!-- ここでyieldを使って、renderしたときのブロックを挿入している -->
    <div class="mt-4"><%= yield %></div>
  </div>
</div>
```

## Helperを使う方法

View HelperからもHTMLを出力できますので、コンポーネントが作れます。比較的小さなコンポーネントを作るときに便利です。Helperを使ってHTMLを出力する際は[ActionView Tag Helper](https://api.rubyonrails.org/classes/ActionView/Helpers/TagHelper.html)を使うのが一番安全です。その際は[`safe_join`](https://api.rubyonrails.org/classes/ActionView/Helpers/OutputSafetyHelper.html#method-i-safe_join)も使うことになると思います。

HTML文字列をそのまま出力する場合は[`html_safe`](https://api.rubyonrails.org/classes/String.html#method-i-html_safe)や[`raw`](https://api.rubyonrails.org/classes/ActionView/Helpers/OutputSafetyHelper.html#method-i-raw)を使いますが、XSS脆弱性を
導入してしまう恐れがありますので、[`html_safeの使い方`](https://zenn.dev/kanazawa/articles/d7ec7e90041c23)を確認することを強くお勧めします。

```ruby:app/helpers/react_helper.rb
module ReactHelper
  # Create a React component that has been previously registered
  # in `application_react.js`.
  def react_component(name, props = {}, id: "root")
    tag.div id:, data: { react_component: name, props: }
  end
end
```

上記では下記のようなHTMLが出力されます。

```html
<div id="root" 
     data-react-component="HelloWorld" 
     data-props="{&quot;name&quot;:&quot;John&quot;}"></div>
```

## CSSを使う方法

あえてコンポーネントを作成しなくても、CSSだけで十分に再利用性とDRYが実現できることが多々あります。これについては[CSSによるコンポーネント(UI部品)の考え方](/concepts/components)で解説しています。
