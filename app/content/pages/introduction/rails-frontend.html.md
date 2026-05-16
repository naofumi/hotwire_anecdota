---
title: Railsフロントエンド。何を選ぶ？
layout: article
order: 100
published: true
---

新規にインストールしたRuby on RailsアプリのフロントエンドはERBとHotwireですが、デフォルトの他にさまざまな選択肢があります。下記では個人的な意見も含みますが、現在の選択肢を簡単に紹介しました。

## ERB, Hotwire --- erb-hotwire

* デフォルトで使用できます。セットアップが簡単です。
* コード量が少なく、非常に効率よく開発できます。
* JSON APIを用意する必要がなく、シリアライズすら不必要なので、viewテンプレートの中で**生きたオブジェクト**を参照できます。ドメインモデルが複雑でも必要なデータに簡単にアクセスできます。
* 画面に描画されたものだけがブラウザに送信されますので、不意のデータ漏洩の心配はほとんどありません。
* ERBはMinitestのController testおよびRSpec Request specで描画されます。その際に不正なgetterやメソッドへのアクセスなどがあればエラーになります。完璧ではありませんが、かなり多くのエラーが簡単なテストで防げます。
* Hotwire等で高度なUI/UXが実現できます。
* 必要であればReactなどのモダンフロントエンドを埋め込むこともできます。

## ERBとReact SPAの共存 --- ERB-and-react-spa

ここでは2000年ごろに多かったタイプのRuby on Rails ERB – Reactの組み合わせに言及しています。

* セットアップは複雑です。
    * ReactのビルドはWebpack, Rspack, esbuild, Viteなどのバンドラーを使用します。
    * ビルドされたJavaScriptを通常はRails ERBが生成したHTMLから呼び出し、Reactはその中の`<div id="root"></div>`要素などにマウントします。
    * Reactで複数のURL(複数のページ)に対応するためにReact Routerなどのクライアントルータも用意します。
    * ReactをマウントするRails ERBを一つだけ用意することもありますし、各URLごとに個別のERBテンプレートを用意することもあります。個別のERBテンプレートを用意する理由はレガシー移行のためだったり(従来のERBページとの共存)、認証・認可のためだったりします。
    * [react-rails gem](https://github.com/reactjs/react-rails)や[react_on_rails gem](https://github.com/shakacode/react_on_rails)などを使って、上記のステップの一部を代替することがあります。
    * その他、[jsbundling-rails](https://github.com/rails/jsbundling-rails)、[Webpacker](https://github.com/rails/webpacker)、[Shakapacker](https://github.com/shakacode/shakapacker)、[Vite Ruby Rails Integration](https://vite-ruby.netlify.app/guide/rails.html)を使いこともあります。
* [HotwireとReactの工数の差](/introduction/key_difference_between_hotwire_and_react#differences-in-work)で紹介しているように、JSON APIを導入しているためにReact SPAはHotwireと比べて大幅に工数が増えます。
* ドメインモデルが複雑な場合は、JSON APIにネストしたデータを組み込む工数がかかります。
* 機密データをJSON APIに載せてしまっても、画面に表示されないために気づけません。データ漏洩のリスクが高まります。
* フロントエンドとバックエンド双方がJSON API契約を守っていることの担保が困難です。下記のことを考慮する必要がありますので、かなりの作業が必要です。
   * [TypeScriptはJSON API契約遵守を保証してくれません](/introduction/type_safety)。フロントエンド内部の型安全性しか担保してくれません。
   * Open API(Swagger)を書いただけではフロントエンドとバックエンドが遵守している保証にはなりません。
   * [OpenAPI Generator](https://openapi-generator.tech/)等のcode generatorを使ってもフロントエンドのコードがOpen APIを遵守していることを確認するだけです。
   * [Committee Rails gem](https://github.com/willnet/committee-rails)等を使用してバックエンドのレスポンスがOpen APIを遵守していることは確認できます。
* 認証はERBページと同じように、HTTP-only cookieを使用します。ERBページにCSRFトークンが載ってきますので、CSRF対策も簡単です。

## フロントはReact SPAのみ --- react-spa-only

* Ruby on Railsとの共存が不要になるため、セットアップは簡略化されます。
* Hotwireと比較して工数が増大すること、および複雑なドメインモデルへの対応、機密データの漏洩、JSON API契約遵守の困難さについては先に紹介したReact SPAと同じです。
* 認証を考える必要があります。
   * 以前はフロントエンドJavaScriptにトークン管理をさせて、APIリクエストヘッダーにトークンを載せる方法も多く使用されていました。
   * 最近の潮流としてはHTTP-only Cookieを使った認証が多くなっています。ERBを使用した従来の方法と同じもので、認証処理が大幅に簡略化されます。この場合はCSRF対策をしないと脆弱性になります。
   * Ruby on RailsをAPIモードで使用していて、後からHTTP-only Cookieに対応させた場合、注意が必要です。Cookie処理のミドルウェアを戻すだけでなく、忘れずにCSRF対策のミドルウェアも戻すようにしましょう。CSRFトークンの管理は別途考える必要があります。

なお、[Next.jsのstatic export](https://nextjs.org/docs/pages/guides/static-exports)を使ってReact SPAを作り方法もありますが、下記の点に注意する必要があります。

* [Dynamic Routingが難しくなります](https://tech-blog.tabelog.com/entry/using-static-exports-in-production#Dynamic-Routing%E3%81%8C%E4%BD%BF%E3%81%88%E3%81%AA%E3%81%84)。回避策として以下の方法を見かけます。
    * Next.jsの前にNGINXなどのサーバを置き、`/bookings/[id]`のようなURLを`/bookings?id=[id]`にrewriteする方法。他にもAWS CloudFront、Netlify redirectsやCloudflare Transform rulesなどがあります。
    * 最初から`/bookings/[id]`のようなURLを諦め、`/bookings?id=[id]`を使う方法があります。ただしこれをやると2000年ごろのウェブっぽくなりますので、なるべくなら避けたいです。

## Inertia.jsで作るReact SPA --- inertia-js

このようにReactとRailsを繋げること自体はとても一般的なのですが、その割には簡単ではありません。そこで注目されているのが[Inertia.js](https://inertia-rails.dev/)です。

Inertia.jsを使うと５分もかからない非常に簡単なセットアップで、ReactとRailsを繋げることができます。

![Rails Inertia](https://www.youtube.com/watch?v=R2AnbYKaJhc)

Inertia.jsは非常にopinionatedです。通常のReactのように色々なライブラリを技術選定して使うのではなく、フレームワーク作者たちが用意したルータを使い、作者たちが指定した方法でデータをReactコンポーネントに渡していきます(この方法がまたRailsと相性が抜群です)。その意味ではRailsの発想（[The menu is omakase](https://rubyonrails.org/doctrine#omakase)）に近く、Reactの良さを活かしつつも高速な開発が可能になります。

* セットアップが非常に簡単です。
* JSON APIを明確に用意する必要がなく、クライアントサイドからAPIにfetchするコードも不要なので、記述するコード量は少なくなります。効率よく開発ができます。
* JSON APIを明確に用意する必要はありませんが、データをサーバからブラウザに送ることに変わりはありません。シリアライズ可能なデータしか送信できず、**生きたオブジェクト**を使ってDOMを生成することはできません。ドメインモデルが複雑な場合は形を整える必要があります。
* 認証はERBページと同じようにHTTP-only cookieを使用するために簡単です。CSRF対策もInertia.jsがやってくれます。
* ページコンテンツは全てReactで描画されますので、ReactでできるUI/UXは基本的に可能です。
* ただし通常のSPA同様、複雑なドメインモデルへの対応、機密データの漏洩、JSON API契約遵守の困難さがあります。

Inertia.jsは独自の考え方があり、良さを活かすためには下記のことに留意する必要があります。

* **データはページ専用に作ります:** React SPAではしばしばモデル単位のAPIエンドポイントを用意して、１ページあたり複数回fetchをします。それに対してInertia.jsでは全てのデータを一気にブラウザに送信する**ページ専用 API**の考え方になります。


## Next.jsサーバ --- next-js-server

* Ruby on Railsとの共存が不要（そもそも難しい）ため、セットアップは簡略化されます。ただし異なるホストにデプロイすることになりますので、Cookieのドメイン設定やCORS対策をしておく必要があります。
* Hotwireと比較して工数が増大すること、および複雑なドメインモデルへの対応、機密データの漏洩、JSON API契約遵守の困難さについては先に紹介したReact SPAと同じです。
* **認証:** ReactをSPAとして使用する場合、(CSRFにさえ気をつければ)HTTP-only cookieの認証で十分です。しかしNext.jsサーバを間に設置すると認証の選択肢が増えて、一気に迷います。[実際に苦労している例も多く見かけます](https://zenn.dev/naofumik/articles/1d1fba86ee0df2)。
   * 最もシンプルな方法は**Next.jsに認証の役割を一切持たせず**、Next.jsは伝令役に徹して単に[cookieをそのままブラウザとAPIサーバ間で転送させる仕組み](https://zenn.dev/naofumik/articles/1d1fba86ee0df2#gmo-%E3%83%9A%E3%83%91%E3%83%9C%EF%BC%9Acookie%E8%BB%A2%E9%80%81)です(例ではNext.jsではなくExpressを使ったSSRサーバを使用していますが、考え方は同じです)。
