---
title: Turboが速い理由
section: Performance
layout: article
order: 410
published: true
---

[フロントエンドエンジニアのためのHotwire入門](https://hotwire-n-next.castle104.com/)では、Hotwireの方がNext.jsやReactよりもUI/UXが優れている点を具体的に解説しています。

その中ではページの表示速度についても言及しています。

詳細は上記のサイトを確認していただきたいのですが、ここでは一部をかいつまんでHotwire/Turboが速い理由を紹介します。

## Turboが速い理由 --- why-is-turbo-fast

* **TurboはサーバでHTMLをレンダリングします:** Next.jsやRemixのSSRは一般にSPAよりもページロードが速くなります。主な理由はJavaScriptが未ロードでもページが表示できることと、フェッチのウォーターフォールが発生しないためです。**TurboもサーバでHTMLをレンダリングしますので、SSR同様に速くなります**。
* **Turboは積極的にキャッシュします:** Turboはstale-while-revalidate型のキャッシュを積極的に使用しています。訪問したページをキャッシュし、次回同じページに訪問したときは最初にキャッシュを表示します（プレビュー）。そして裏でサーバにリクエストを送信して最新情報を取得したのち、表示されている内容を入れ替えます。これにより**瞬間的なプレビューと最新情報の表示を両立しています**。
* **Turboは積極的にプレフェッチします:** Next.jsもプレフェッチ機能がありますが、デフォルトでは動的コンテンツのプレフェッチはしません。それに対して**Turboはより積極的なプレフェッチを行い、動的コンテンツもプレフェッチします**。このためTurboの方が高速に感じることが多いです。  
  想像になりますがRailsサーバは各オブジェクトがいつ更新されたかを簡単に知れるため、[サーバ側でさまざまなキャッシュ戦略が取れます](https://guides.rubyonrails.org/caching_with_rails.html#types-of-caching)。そのためプレフェッチによってサーバへのリクエストが増えてもサーバ側キャッシュで対処しやすく、積極的なプレフェッチをデフォルトにできていると考えられます。

## 気をつけないといけない点 --- points-to-consider

Turboはデフォルトで高速になっていますが、キャッシュを使用しますので注意が必要です。これをオフにしなければならないこともあります。その時は下記の属性や`meta`タグなどが有用です（随時追加されますので、[公式マニュアル](https://turbo.hotwired.dev/reference/attributes)をご覧ください）。

* `data-turbo="false"`: Turbo Driveをオフにします。最終手段です。
* `data-turbo-prefetch="false"`: プレフェッチをオフにします。サーバ負担が気になるリンクにつけます。
* `data-turbo-temporary`: 特定のHTML要素がキャッシュされるのを防ぎます。
* `<meta name="turbo-cache-control">`: [特定のページのキャッシュ挙動を制御](https://turbo.hotwired.dev/handbook/building#opting-out-of-caching)します。
* `<meta name="turbo-visit-control" content="reload"> `: Turboで遷移してきた場合でもページ全体をリロードします。(Turbo Frameを使用した場合を含め)常にページ全体を描画したい場合や、React Router/Next.js/Inertia.jsの`<Link>`タグからsoft navigationしてきた際に使用します。
* `<meta name="turbo-root"> `: [Turboを特定のサブディレクトリに限定したい場合](https://turbo.hotwired.dev/handbook/drive#setting-a-root-location)に使用します。例えばReactのページは`/react/*`、Turboのページは`/turbo/*`に分けられます。なおより細かく挙動を制御したい場合は[`turbo:click`イベント](https://turbo.hotwired.dev/reference/events#turbo%3Aclick)をハンドルして、Turbo Drive的な画面遷移(soft navigation)と通常のページ遷移(hard navigation)を切り替えられます。
* `<meta name="turbo-prefetch" content="false">`: このページの[プレフェッチ](https://turbo.hotwired.dev/handbook/drive#prefetching-links-on-hover)を無効にします。重たいリンクが多いページなどで有効でしょう。

## Next.jsのキャッシュ --- nextjs-cache

Next.jsのv14でデフォルトで積極的にキャッシュを取り入れましたが、v15ではデフォルトをオフに変更しました。その後に[キャッシュの仕組みを大きく変更しました](https://nextjs.org/blog/our-journey-with-caching)。現時点では動的コンテンツをデフォルトで積極的にキャッシュしたりプレフェッチしたりするような設計にはなっていません。

