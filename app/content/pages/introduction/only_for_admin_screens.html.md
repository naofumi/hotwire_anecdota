---
title: Hotwireは管理画面限定？
layout: article
order: 60
published: true
---

Hotwireは決して管理画面限定ではありません。**管理画面が非常に得意だというだけで、UI/UXにこだわったエンドユーザ向け画面も、Hotwireで十分にこなせます**

## Hotwireは管理画面が得意 --- hotwire-is-good-for-admin

HotwireとRuby on Railsの組み合わせは、管理画面を高速にたくさん作るのが非常に得意です。自動的にコードを生成するScaffold機能も充実しており、自動テスト込みのCRUDのコードを自動生成してくれます。

もちろん[ActiveAdmin](https://github.com/activeadmin/activeadmin)、[RailsAdmin](https://www.ruby-toolbox.com/projects/rails_admin)、[Administrate](https://administrate-demo.herokuapp.com)や最近は[Avo](https://avohq.io)などのアドミ画面ライブラリも充実していますが、多くの場合はこれすらいらないぐらいに、Ruby on Railsは高速に管理画面が作れます。

**React用のJSON APIを設計するよりも早く、CRUDが出来上がってしまうこともあります。**

## 論より証拠なHotwireのエンドユーザ画面 --- hotwire-is-good-for-end-user

Hotwireが管理画面に適しているのは間違いありません。しかし**管理画面だけ**に向いているわけではありません。

下記の企業では、Hotwire（もしくは近い技術）をエンドユーザ画面で使用し、成功しています。

* Hotwireは[37signalsのメールアプリ Hey](https://www.hey.com)を作るために開発されたライブラリです。また[37signalsのプロジェクト管理システム Basecamp](https://basecamp.com)もこの祖先となる技術で作られています
* [CookpadはHotwireを採用](https://techlife.cookpad.com/entry/2024/11/13/130000)しています
* GitHubはHotwireの先祖となる技術(PJAX)で作られ、Turbo/Hotwire系の技術を使用して来ました。現在はTurboを使用しています。一部のページの画面の一部分でReactを使用しています
    * Hotwireのベースは少なくとも2012年のGitHubのPJAXに遡れます。10年以上、世界で有数のアクセス数のあるサイトでの実績があるコンセプトと言えます
