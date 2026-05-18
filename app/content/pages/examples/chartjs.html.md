---
title: Chart.js埋め込み
layout: article
order: 130
published: true
descriptors:
  server_request: false
  state_management:
    - Stimulus Values
  technologies:
    - Stimulus
  demo_urls:
    - ["Chart.jsデモ", "/components/chartjs"]
  related_pages:
    - /examples/using_with_react

---

ここで作るのは下記のようなUIです。Stimulusを使って、ERBのページにChart.jsを埋め込み、かつChart.jsの表示をインタラクティブに変更しています。

![chartjs.mov](content_images/chartjs.mov "mx-auto")

## 考えるポイント --- thinking-points

* [Chart.js](https://www.chartjs.org)を使ってChartを表示するのが目的です 
* StimulusはChart.jsなどの外部ライバラリを埋め込むのに非常に適しています。
    * Stimulusはライフサイクルフックの`connect()`や`disconnect()`を提供しています。`DOMContentLoaded`などの頼るのではなく[MutationObserver API](https://developer.mozilla.org/ja/docs/Web/API/MutationObserver)を使用しているため、インタラクティブにDOMが変更されるページに適しています。
    * Stimulus Valuesステートは`data-*-values`HTML属性と同期されるため、埋め込まれたライブラリ(今回はChart.js)とHTMLを簡単に連携できます。

なおReactの場合はインテグレーションである[react-chartjs-2](https://github.com/reactchartjs/react-chartjs-2)を使うことが多いかと思いますが、Stimulusを使うとインテグラーションがなくても簡単にChart.jsをラップできます。

## コード --- code

### Chart.jsを埋め込んだページ --- chart-js-view

```erb:app/views/components/chartjs.html.erb
<% set_breadcrumbs [["ChartJS", component_path(:chartjs)]] %>

<%= render 'template',
           title: "ChartJS",
           description: "" do %>
  <div data-controller="chartjs"
       data-chartjs-label-value="UFO sightings per year!!!!"
       data-chartjs-data-value="<%= json_escape [{ year: 2010, count: 10 },
                                                 { year: 2011, count: 20 },
                                                 { year: 2012, count: 15 },
                                                 { year: 2013, count: 25 },
                                                 { year: 2014, count: 22 },
                                                 { year: 2015, count: 30 },
                                                 { year: 2016, count: 28 },
                                                ].to_json %>">

    <div class="flex justify-between">
      <% [2010, 2011, 2012, 2013, 2014, 2015, 2016].each_with_index do |year, index| %>
        <div>
          <div><%= year %>:</div>
          <input type="range" min="0" max="100" value="10" step="10" class="w-20"
                 data-chartjs-bar-param="<%= index %>"
                 data-action="input->chartjs#changeBar"/>
        </div>
      <% end %>
    </div>
    <div class="w-full">
      <canvas data-chartjs-target="chart"></canvas>
    </div>
  </div>
<% end %>
```

* 簡略化のために、Chartに渡すデータはViewに埋め込んでいます。通常であればControllerからインスタンス変数で渡すでしょう。
   * データは`to_json`でJSONに変換しておけば、StimulusのValueとして正しく処理されます。念のために`#json_escape`で処理しています。なおRailsのhelperを使えば`tag.div(..., data: { chartjs_data_value: [{year: 2011, count: 20}, ...]})`と書いて、RailsにJSON化とエスケープを任せることもできます。
* `<input type="range" ...>`タグのところはデータを変更するスライダーです。ここがイベントを受け取るActionになります
   * `data-action="input->chartjs#changeBar"`により、スライダーの値が変更されると`ChartjsController`の`changeBar`メソッドが呼び出されます
   * この際、どのスライダーが操作されたかは`data-chartjs-bar-param`で伝えます。
* `<canvas data-chartjs-target="chart"></canvas>`は`ChartjsController`からの出力を受ける`target`です

### `ChartjsController` Stimulus controller --- stimulus-controller

```js:app/javascript/controllers/chartjs_controller.js
import {Controller} from "@hotwired/stimulus"
import Chart from "chart.js/auto"

// Connects to data-controller="chartjs"
export default class extends Controller {
  static values = {
    data: {type: Array, default: []},
    label: String
  }
  static targets = ["chart"]

  connect() {
  }

  disconnect() {
    this.chart?.destroy()
  }

  changeBar(event) {
    const value = event.currentTarget.value
    const barIndex = Number(event.params.bar)
    const newDataValue = [...this.dataValue]
    newDataValue[barIndex] = {year: 2010 + barIndex, count: value}

    // We create a new dataValue object and use the
    // `this.dataValue` setter to update the value.
    // This is to trigger the `this.dataValueChange()` callback.
    // This is unnecessary if you call `this.#render()` directly
    // in this function.
    this.dataValue = newDataValue
  }

  dataValueChanged() {
    this.#render()
  }

  #render() {
    this.#renderChart()
  }

  #renderChart() {
    const data = this.dataValue
    if (this.chart) {
      this.chart.data = this.#data()
      this.chart.update()
    } else {
      this.chart = new Chart(
        this.chartTarget,
        {
          type: 'bar',
          data: this.#data()
        }
      );
    }
  }

  #data() {
    return {
      labels: this.dataValue.map(row => row.year),
      datasets: [
        {
          label: this.labelValue,
          data: this.dataValue.map(row => row.count)
        }
      ]
    }
  }
}
```

* Chartjsを制御するStimulus controllerです
* `static values`で使用するStimulus Valuesを宣言しています
   * `data`はChartに表示するデータです。Array型として持ちます。HTMLの`data-chartjs-data-values`属性にJSON型でステートが保持されます
   * `label`はChartの表題になります
* `static targets`でControllerで処理されたデータの出力先を指定します
   * 今回はChartを表示する`<canvas>`タグを指定します 
* `disconnect()`はライフサイクルに関するものです。このStimulus Controllerが画面から消えるなどした場合に呼び出されます。ここではChartjsオブジェクトを削除して、メモリリークを防ぎます
* `changeBar`はイベントハンドラです。スライダーをクリックして値を変更した時に呼び出されます
   * 注意点しなければならないのは`newDataValue`という新しいArrayを作って`this.dataValue`にセットしている点です。古い`this.dataValue`の値を変更するだけではダメで、全く新しいArrayを渡す必要があります。
   * 従来のArrayを変更しただけでは`dataValueChanged`コールバックが呼ばれません。この辺りは[Reactのステート変更と同じ](https://ja.react.dev/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax)です。
* `dataValueChanged`はStimulus Valueステートが変更された時に自動的に呼ばれるコールバックです。この中で`#render()`を呼びます
* `#render()`ではさらに`#renderChart()`を呼び出し、Chart.jsにデータを渡す処理を書いています。ここでは[Chart.jsのチュートリアル通りのデータ](https://www.chartjs.org/docs/latest/getting-started/usage.html#build-a-new-application-with-chart-js)を渡しています
   * 初回ロードの時は新しいChartを`new Chart()`で作ります
   * Chartのデータを変更するときは、`this.chart`にセットされた既存のChartを書き換えて`update()`を呼びます
