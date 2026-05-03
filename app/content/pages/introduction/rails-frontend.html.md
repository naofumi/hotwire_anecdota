---
title: Railsフロントエンドの選択肢
layout: article
order: 100
published: true
---

新規にインストールしたRuby on RailsアプリのフロントエンドはERBとHotwireですが、デフォルトの他にさまざまな選択肢があります。下記では個人的な意見も含みますが、現在の選択肢を簡単に紹介しました。

## ERB, Hotwire --- erb-hotwire

Ruby on Railsは初期のバージョンからAjaxをサポートしていて、2004年から非同期通信による部分的な画面更新をサポートしていました。当初からHTMLはサーバでレンダリングし、ブラウザにそのまま送信するパターンを採用しており、Hotwireはその直系の子孫と言えます。

* ERBのViewテンプレートを書き、必要に応じてJavaScriptを書きます。コード量が少なく、非常に高い開発効率が得られます。インストール、セットアップ、デプロイも簡単です。
* サーバでHTMLをレンダリングしますので、認可が複雑な場合や多数のモデルを組み合わせる場合に便利です。サーバのモデルを直接参照しながらコードが書けますので、効率が良くなります。
* JavaScriptはvanilla JavaScriptで書きます。jQueryも可能です。Hotwire/Stimulusは複雑化してしまいやすいJavaScriptを整理する目的で用意されていますので、通常はStimulusの中にvanilla JavaScriptを書きます。
* 非同期で画面が動的に切り替わるUIの場合、JavaScriptのイベントハンドラの繋げ方が問題になります。Vanilla JavaScriptはjQueryはで[`DOMContentLoaded`イベント](https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event)を待つことが多いのですが、Turboで画面遷移をしたり画面を部分的に更新した場合は`DOMContentLoaded`が発火しません。Hotwire/Stimulusはこれとは異なり、
[MutationObserver API](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)を使用しますので、より簡単・確実にHTMLとJavaScriptを繋げることができます。
* Hotwire/Turboはサーバとの非同期通信を担当します。JavaScriptから直接Turboを呼び出すことは珍しく、主に`<a>`タグや`<form>`タグが裏で自動的にTurboのリクエストを飛ばし、かつレスポンスを非同期的に画面に埋め込みます。リクエストのabortによるレースコンディションの防止、エラーハンドリングなどはTurboが担当しますので、アプリ開発者は意識する必要がありません。
* B2C向けの比較的複雑なUIも問題なくこなします。

## React SPA --- react-spa

ここでいうReact SPAは、Next.jsなどと異なり、フロントエンド用の動的なサーバを使用しないものを対象にしています。またここではReactしか言及しませんが、Vueなどの他のモダンフロントエンドも基本的には同じです。**かなり一般的だったReact SPAのセットアップですが、簡単に使えるソリューションはなかなかないです。** チームごとに自作している部分が多く、アーキテクチャを含めて異なることも珍しくありません。

### RailsにReact SPAを載せる方法のタイプ別 --- react-spa-types

* フロントエンドはReactを使用します。ReactはWebpack, Rspack, esbuild, Viteなどのバンドラーでビルドして、静的なJavaScriptファイルとしてブラウザに読み込ませます。
* 複数のURLに対応させるためには大きく２通りの方法があります。
  * ReactRouterなどのクライアントサイドルータを使用する方法。
  * 各URLに対応するRailsのERB viewを返し、そのERBの中にReactのコンポーネントをマウントする方法。
  * 上記の２つを組み合わせた方法。  
    二重管理が発生して開発負担は増える一方、UI/UX的なメリットが少ないタイプです。ERBからReactへのリプレイス途中でこの形になっているケースが多い印象です。
* ReactのJavaScriptファイルはRuby on Railsのassetとしてデプロイすることが多いですが、FEとBEの独立性を強化したい場合はJavaScriptファイルを別の静的ファイルサーバにデプロイすることもできます。

これらのタイプ別にReactをマウントする方法を考え、クライアントサイドのルータをインストールし、自前で仕組みを用意する必要があります。

### RailsとReactと繋げるgem --- react-spa-gems

Railsのgemはいくつかありますが、実際にはカスタムで作るケースも多いです。

* [react-rails gem](https://github.com/reactjs/react-rails)
* [react_on_rails gem](https://github.com/shakacode/react_on_rails)
* [Next.js static export](https://nextjs.org/docs/pages/guides/static-exports)を使用するプロジェクトもあります。これはNext.jsで開発したアプリに静的なHTMLファイルを生成させ、これを静的HTMLサーバにデプロイするものですが、[Dynamic Routingが難しい](https://tech-blog.tabelog.com/entry/using-static-exports-in-production#Dynamic-Routing%E3%81%8C%E4%BD%BF%E3%81%88%E3%81%AA%E3%81%84)という難点があります。回避策として以下の方法を見かけます。
  * Next.jsの前にNGINXなどのサーバを置き、`/bookings/[id]`のようなURLを`/bookings?id=[id]`にrewriteする方法。他にもAWS CloudFront、Netlify redirectsやCloudflare Transform rulesなどがあります。
  * 最初から`/bookings/[id]`のようなURLを諦め、`/bookings?id=[id]`を使う方法があります。ただしこれをやると2000年ごろのウェブっぽくなりますので、なるべくなら避けたいです。

### RailsとReactの統合を自作する方法 --- react-spa-custom

上記はRailsからReactのマウントまでをサポートするものでした。しかし自分でRailsとバンドラーを繋げて、そこから自分でコードを書いてReactをマウントする方法がむしろ一般的です。使用するバンドラー(Webpack, Shakapacker, esbuild, rollup.js, Bun, Vite)をRailsに繋げる方法として下記のgemがあります。ただしバンドラーの設定も複雑なことが多く、自作するケースも見かけます。

* [jsbundling-rails](https://github.com/rails/jsbundling-rails)
* [Webpacker](https://github.com/rails/webpacker)、および後継の[Shakapacker](https://github.com/shakacode/shakapacker)
* [Vite Ruby Rails Integration](https://vite-ruby.netlify.app/guide/rails.html)

### Inertia.jsという選択肢 --- inertia-js

このようにReactとRailsを繋げること自体はとても一般的なのですが、その割には簡単ではありません。その中で最近注目されているのが[Inertia.js](https://inertia-rails.dev/)です。

Inertia.jsを使うと５分もかからない非常に簡単なセットアップで、ReactとRailsを繋げることができます。

![Rails Inertia](https://www.youtube.com/watch?v=R2AnbYKaJhc)

Inertia.jsは非常にopinionatedです。通常のReactのように色々なライブラリをインストールして使うのではなく、作者たちが用意したルータを使い、作者たちが指定した方法でデータをReactコンポーネントに渡していきます(この方法がまたRailsと相性が抜群です)。その意味ではRailsの発想に近く、Reactの良さを活かしつつも高速な開発が可能になります。

## Next.jsサーバ --- next-js-server

Next.jsは当初はSSRを売りとして登場してきました。従来のSPAだと初期ロード時は下図のようにページロードが遅く、🌀が数秒間表示されることも珍しくありませんでした(下図)。これを解消するためにサーバでHTMLをレンダーし(SSR)、サーバにHTMLを返すことをVercelは提唱しました。

しかしReactのセットアップが複雑だったこともあってか、Next.jsはSSRだけでなくSPAのベースとしても使用されています。当初こそは上述したNext.jsのstatic exportが使用されていましたが、近年ではSSRを使っていない場合であっても、**Next.jsのサーバを用意して(SSRを使わずに)SPAを運用しているケースを多く見かけます**。

![SPA loading](content_images/spaslow.png "mx-auto max-w-[500px]")

Next.jsはあまりにも多様な使用方法があるため、説明し切るのは困難です。ここではいくつかの注意点だけリストアップしたいと思います。

* **認証:** ReactをSPAとして使用する場合、一般的にはRailsがHTMLを送信しますので、通常のcookie認証で十分です。しかしNext.jsサーバを間に設置すると認証の選択肢が増えて、一気に迷います。[実際に苦労している例も多く見かけます](https://zenn.dev/naofumik/articles/1d1fba86ee0df2)。シンプルな方法はNext.jsに認証の役割を一切持たせず、伝令役に徹して単に[cookieをそのままブラウザとAPIサーバ間で転送させる仕組み](https://zenn.dev/naofumik/articles/1d1fba86ee0df2#gmo-%E3%83%9A%E3%83%91%E3%83%9C%EF%BC%9Acookie%E8%BB%A2%E9%80%81)です(例ではNext.jsではなくExpressを使ったSSRサーバを使用していますが、考え方は同じです)。JWTやトークン認証をいろいろ考えると書かなければならないカスタムコードが増え、セキュリティ的な考慮も増えてます。
* **BFFの役割:** Next.jsはサーバなので、位置的にはBFF (Backend for Frontend)となります。ただしNext.js <-> Railsモノリスというシンプルな構成だとそもそもの[BFFの役割が明確ではありません](https://techblog.zozo.com/entry/zozo-aggregation-api-bff)。複数のマイクロサービスを集積するものでもなく、複数クライアント(モバイル、ウェブなど)にカスタマイズする必要もないからです。このような場合、**Next.jsをあえてBFFとして使わない選択肢の方がシンプルになることもあります**。つまりNext.jsはあくまでも初期HTMLをレンダーする役割に徹し、以降は直接Railsサーバと通信するやり方です。

このようにNext.jsは一見するとシンプルなソリューションに見えますが、React SPAよりも複雑になる場合もあります。**使い方が非常に多いために迷いますが、Next.jsのメリットを活かしながらシンプルな構成となるように注意する必要があるでしょう**。

## 型安全性との戦い --- type-safety

