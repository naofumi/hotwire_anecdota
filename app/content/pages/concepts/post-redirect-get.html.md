---
title: Turbo Streamsによる高速化
section: Performance
layout: section
order: 60
---

## Hotwireは原則としてPost/Redirect/Get パターンを使用

* Next.jsもRemixも原則としてこれを採用。ただしNext.jsは高速化処理をしている
* HotwireはTurbo Drive, Turbo FramesではPost/Redirect/Getのパターンが必須
* Post/Redirect/Getは２往復のサーバ通信が必要になるので、勿体無い(非同期であれば、Post/Redirect/Getが回避するタイプの２重ポスト問題はそもそも起こらない)
* Hotwireの場合はTurbo Streamsを使うことで、１往復のサーバ通信で済ませることができる
