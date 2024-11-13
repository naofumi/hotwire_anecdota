---
title: PartialとHelperを使用したコンポーネント
section: Tips
layout: article
order: 005
---

## ViewComponent, Phlexの登場


## PartialとHelperでコンポーネントを作る方法

特にViewComponentのおかげで、Railsの世界でもコンポーネント化が注目されるようになりました。一時期は「Reactはコンポーネント化ができるけど、Railsはできない」みたいに言う人もいましたが、ViewComponentのお陰で反論しやすくなりました。

しかし、実はRailsは昔からコンポーネント化するための道具が揃っていました。PartialとView Helperです。ただし残念ながら、Railsがほとんどバックエンド専門になってしまった時代が長かったせいで、PartialとView Helperを十分に使いこなせない人が増えたように思います。

### Partial


### Helper

RailsのHelperはHTMLをほとんど含まないものに使うことが多いのですが、実際には柔軟にHTMLを書くことができ、コンポーネントを作るのに非常に有用です。私はHTMLが10行以内程度の小さなコンポーネントを作るのによく使用します。

Railsを長く使っている人でもhelperを有効に使う人は極めて珍しいと感じています。Partialを使ったコンポーネント化は見かけても、helperを使ったものは滅多に見かけません。非常に勿体無いと思います。 例えばRailsの`form_with`や`text_field`, `link_to`などは全てhelperですので、見直すと良いのではないかと思います。

HEREDOCでHTMLを書く方法

### XSS攻撃とSafeBufferの知識
