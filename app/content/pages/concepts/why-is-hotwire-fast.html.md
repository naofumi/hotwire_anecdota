---
title: Hotwireが速い理由
section: Performance
layout: article
order: 15
published: true
---

[フロントエンドエンジニアのためのHotwire入門](https://hotwire-n-next.castle104.com/)では、Hotwireの方がNext.jsやReactよりもUI/UXが優れている点を具体的に解説しています。

その中ではページの表示速度についても言及しています。

詳細は上記のサイトを確認していただきたいのですが、ここでは一部をかいつまんでHotwireが速い理由を紹介します。

## Hotwireが速い理由 --- why-is-hotwire-fast

* **HotwireはサーバでHTMLをレンダリングします:** Next.jsやRemixのSSRは一般にSPAよりもページロードが速くなります。主な理由はJavaScriptが未ロードでもページが表示できることと、フェッチのウォーターフォールが発生しないためです。**HotwireもサーバでHTMLをレンダリングしますので、SSR同様に速くなります**。
* **Hotwire/Turboは積極的にキャッシュします:** Turboはstale-while-revalidate型のキャッシュを積極的に使用しています。訪問したページをキャッシュし、次回同じページに訪問したときは最初にキャッシュを表示します（プレビュー）。そして裏でサーバにリクエストを送信して最新情報を取得したのち、表示されている内容を入れ替えます。これにより**瞬間的なプレビューと最新情報の表示を両立しています**。
* **Hotwire/Turboは積極的にプレフェッチします:** Next.jsもプレフェッチ機能がありますが、デフォルトでは動的コンテンツのプレフェッチはしません。それに対して**Turboはより積極的なプレフェッチを行い、動的コンテンツもプレフェッチします**。このためHotwire/Turboの方が高速に感じることが多いです。  
  想像になりますがRailsサーバは各オブジェクトがいつ更新されたかを簡単に知れるため、[サーバ側でさまざまなキャッシュ戦略が取れます](https://guides.rubyonrails.org/caching_with_rails.html#types-of-caching)。そのためプレフェッチによってサーバへのリクエストが増えてもサーバ側キャッシュで対処しやすく、積極的なプレフェッチをデフォルトにできていると考えられます。

## Next.jsのキャッシュ --- nextjs-cache

Next.jsのv14でデフォルトで積極的にキャッシュを取り入れましたが、v15ではデフォルトをオフに変更しました。その後に[キャッシュの仕組みを大きく変更しました](https://nextjs.org/blog/our-journey-with-caching)。現時点では動的コンテンツをデフォルトで積極的にキャッシュしたりプレフェッチしたりするような設計にはなっていません。

