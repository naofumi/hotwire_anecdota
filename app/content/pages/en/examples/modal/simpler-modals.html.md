---
title: より簡単なモーダルの作り方
layout: article
order: 30
published: true
siblings: true
---

[柔軟性が高いモーダル](/examples/modal#modal-considerations)では、Hotwireで柔軟性をMaxにした時のものを紹介しました。

ここでは、少しずつ難易度を減らす方法を検討したいと思います。

![interactive-flow-hotwire.webp](content_images/interactive-flow-hotwire.webp "max-w-[600px] mx-auto")

## モーダルの開閉を簡略化するハック --- auto-open-close-modal-hack

モーダルを開けたり閉じる方法として、Stimulusを使うこと以外に、サーバ側から制御することも可能です。ただしこの場合はアニメーションなどが不可能になることに加えて、本来ブラウザが管理するステート（モーダル開閉状態）をサーバが管理してしまいます。そのため、（あまりお勧めしない）ハックとして紹介いたします。

「JavaScriptを書かずにモーダルが作れた！」と紹介されているブログ記事等は、すべてこれを使用しています。ここではあえてコードは用意しませんが、[Next.jsとHotwireを比較したサイトでは取り上げています](https://hotwire-n-next.castle104.com/commentaries/modal_dialogs#turbo-without-custom-javascript)ので、ご確認いただければと思います。

1. [モーダル表示でアニメーションをつける](/examples/modal/modal-show-with-animation)ものでは、[モーダルの枠](/examples/modal/modal-show-with-animation#modal-frame)をあらかじめ一覧ページに埋め込んでいました。
2. 今回のハックでは、モーダルの表示・非表示をサーバだけで制御します。そのため、モーダルの枠はサーバから、状況に応じて送信するようにします。

## CRUD処理をシンプルにする --- simplify-crud

[柔軟性が高いモーダル](/examples/modal#modal-considerations)が複雑になった大きな要因は、サーバサイドバリデーションのエラーへの対処でした。成否によってモーダルを自動的に閉じる・閉じない、トーストの表示の有無、表示内容が変わるため、処理が分岐しました。

一方で**クライアントサイドバリデーションで十分だと思えば、サーバからのレスポンスは成功しかないと想定できるので、モーダルの処理は簡単になります**。

なおこのケースでももちろんサーバサイドバリデーションは行います。これはセキュリティ要件でもあるためです。ただしサーバサイドバリデーションエラーが生じるケースは、悪意のあるユーザがCURLなどでリクエストを捏造したケースに限られますので、サーババリデーション失敗時のUIを用意する必要がなくなります。（この場合はActiveRecordのバリデーションすら不要で、データベース側の制約で十分というケースも出てくるでしょう）

このようにしておけば、formの送信は必ず成功するという前提のもと、レスポンスを受けたら必ずモーダルを閉じるようにできます。そしてモーダルの中身を書き換えてエラーを表示する必要がなくなります。

## オススメ --- recommendation

Turboリクエストでネットワーク通信をする以上、ネットワークが速いこと、あるいはネットワークリクエストが常に成功するという前提を置くわけにはいきません。したがってサーバサイドでモーダルを開閉する方法（最初に紹介したハック）には私は否定的です。モーダルはブラウザサイドで瞬時に開け閉めして、適切なフィードバックをユーザに与えるべきだと私は思います。

一方でクライアントサイドバリデーションで十分というケースは多いと思います。必須入力かどうか、あるいは文字列の長さ、正規表現との適合の[クライアントサイドバリデーションはブラウザ側の機能としても用意されており](https://developer.mozilla.org/ja/docs/Learn/Forms/Form_validation)、HTML属性を追加するだけで実装できます。またこれをスタイリングするためのCSS擬似要素も整っています（[:user-invalid](https://developer.mozilla.org/ja/docs/Web/CSS/:user-invalid), [:user_valid](https://developer.mozilla.org/ja/docs/Web/CSS/:user-valid)）。DBのデータに依存する特殊なバリデーション（例えばユニークの保証）が必要ない限りは、クライアントサイドバリデーションで十分にバリデーションすることにより、より単純なモーダルで対応できるようにするのが良いと思います。

つまり[モーダル表示でアニメーションをつける](/examples/modal/modal-show-with-animation)のところは実施しつつ、[バリデーションが失敗した時にTurbo Streamでモーダルを書き換えることは行わない](/examples/modal/modal-form-failure)やり方です。

この辺りは[Hotwireはもっと簡単にならないのか？](/opinions/why-isnt-hotwire-simpler)の結論と同じです。より簡単なモーダルを作るためには、設計や要件そのものを見直し、「本質的な複雑さ」を減らすのが有効です。

もちろん、個人的には[モーダルをなるべく使わないことが一番のおすすめ](/opinions/should_you_use_modals)です
