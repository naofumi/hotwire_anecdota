---
title: サイドパネル
section: Components
layout: article
order: 40
published: true
descriptors:
    component_names:
    - Side Panel
    server_request: true
    state_management:
    - 
    technologies:
    - Turbo Frames, Turbo Streams, React, jQuery, Server Generated JavaScript Response
    demo_urls:
    - ["Turbo Frames版", "/users?variant=hotwire"]
    - ["Turbo Streams版", "/users?variant=stream"]
    - ["React版", "/users?variant=react"]
    - ["jQuery版", "/users?variant=jquery"]
    - ["Server Generated JavaScript Response版", "/users?variant=sjr"]
    related_pages:
      - /concepts/approach
      - /concepts/server-perspective-frames-vs-streams
      - /introduction/history

---

ここで作成するUIは下記のものです。

様々な技術で実装し、Hotwireの特徴を見ていただくのが目的です。

![Side Panel](content_images/side-panel.mov "mx-auto")

## 考えるポイント --- points-to-consider

* サーバとの非同期通信: あり
  * サイドパネルの中身はサーバから非同期で取得し、画面の部分更新をします。
* 非同期通信でサーバが送信するレスポンスフォーマット
  * **HTML(`text/html`):** Turbo Frames版、Turbo Streams版、jQuery版
  * **JSON(`application/json`):** React版
  * **(`text/javascript`):** Server Generated JavaScript Response版
* 画面の部分更新の制御
  * **クライアント側での制御:** Turbo Frames版、jQuery版、React版
  * **サーバ側での制御:** Turbo Streams版、Server Generated JavaScript Response版

## Turbo Frames版 --- turbo-frames

### サイドパネルの枠 --- turbo-frame-side-panel

```erb:app/views/users/index.html+frame.erb
  ...
  <turbo-frame class="border rounded shadow h-96 p-4" id="user-profile">
  </turbo-frame>
  ...
```

* `<turbo-frame>`タグを使う必要があります。

### トリガー --- turbo-frame-trigger

```erb:app/views/users/_user.html+frame.erb
    ...
    <%= link_to user_user_profile_path(user), data: {turbo_frame: "user-profile"} do %>
      <span class="absolute inset-0"></span>
      <%= user.user_profile.name %>
    <% end %>
    ...
```

* `data: {turbo_frame: "user-profile"}` (`data-turbo-frame="user-profile"`)により、リンクをクリックした際のレスポンスが`<turbo-frame id="user-profile">`に挿入されるように**クライアント側から指示をしています**。

### サーバからのレスポンス --- turbo-frame-server-response

```erb:app/views/users/user_profiles/show.html+frame.erb
...
<turbo-frame id="user-profile">
  ...
  [サイドパネルの表示内容]
  ...
</turbo-frame>
...
```

* Turbo Frameの大きな特徴は、layoutなどの余計なもの（使わないもの）がレスポンスに含まれていても問題ない点です。（今回はこの機能を利用していません）
   * 余計な箇所は無視されます。
   * `<turbo-frame id="user-profile">`だけが切り出され、画面の部分更新に使用されます。
   * 部分更新専用のエンドポイントを作りたくない時に便利です。

## Turbo Streams版 --- turbo-streams

### サイドパネルの枠 --- turbo-stream-side-panel

```erb:app/views/users/index.html+streams.erb
  ...
  <div class="border rounded shadow h-96 p-4" id="user-profile">
  </div>
  ...
```

* Turbo Framesと異なり、特別なタグは必要ありません。

### トリガー --- turbo-stream-trigger

```erb:app/views/users/_user.html+stream.erb
    ...
    <%= link_to user_user_profile_path(user), data: {turbo_stream: true} do %>
      <span class="absolute inset-0"></span>
      <%= user.user_profile.name %>
    <% end %>
    ...
```

* `data: {turbo_stream: true}` (`data-turbo-stream="true"`)により、リンクをクリックした際のリクエストヘッダーに`Accept: text/vnd.turbo-stream.html ...`がつきます。
   * Turbo Streamsそのものの動作には不要ですが、Railsで[`respond_to`](https://api.rubyonrails.org/classes/ActionController/MimeResponds.html#method-i-respond_to)を使用した際に`turbo_stream`フォーマットを識別できるようになります。 

### サーバからのレスポンス --- turbo-stream-server-response

```erb:app/views/users/user_profiles/show.turbo_stream+stream.erb
<%= turbo_stream.update 'user-profile' do %>
  ...
  [サイドパネルの表示内容]
  ...
<% end %>

<!-- 下記のレスポンスになります
<turbo-stream action="update" target="user-profile"><template>
  ...
  [サイドパネルの表示内容]
  ...
</template></turbo-stream> 
-->
```

* サーバが**どのDOM要素に対して(id)**、**どのような操作をするか(update)**を行うかを指定します。

## React版 --- react

### コード --- react-code

```jsx:app/javascript/application_react_users.jsx
function UsersIndex() {
  const [users, setUsers] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    fetch("/users", {
      headers: {Accept: "application/json"},
    }).then(res => res.json())
      .then(data => setUsers(data))
  }, [])

  return (<>
           ...
           <tbody className="divide-y divide-gray-200">
           {users.map(user =>
             
             <tr key={`user-${user.id}`}
                 className={`cursor-pointer ${selectedUser?.id === user.id
                                              ? "bg-yellow-200"
                                              : ""}`}
                 // setSelectedUser(user)がトリガー
                 // これでステートを変更して、サイドパネルに表示するユーザを指定し、
                 // 再レンダーを起こす
                 onClick={() => setSelectedUser(user)}>
                 ...
             </tr>)}
           </tbody>
           ...
      { // サイドパネルの枠 
      } 
      <div className="border rounded shadow h-96 p-4" id="user-profile">
        {selectedUser && <UserProfile userId={selectedUser.id}/>}
      </div>
    </div>
  </>)
}

function UserProfile({userId}) {
  const [userProfile, setUserProfile] = useState(null)

  useEffect(() => {
    fetch(` /users/${userId}/user_profile`, {
      headers: {Accept: "application/json"},
    }).then(res => res.json())
      .then(data => setUserProfile(data))
  }, [userId])

  return (<>
      {userProfile
       ? <div>
          ...
          [サイドパネルの表示内容]
          ...
       </div>
       : <div>Loading...</div>
      }
    </>
  )
}
```

* Reactの場合は、イメージとしては画面の部分更新をしているというよりは、クリックのたびに全てを再レンダリングし、変更された箇所だけを画面に反映させる感じになります。**分けている**感覚が薄いコードになります。

## jQuery版 --- jquery

下記のServer Generated JavaScript Response版とともに、Hotwireが公開される前の2020年ごろまで、Ruby on Railsフロントエンドでよく使用されていた方法です。

### サイドパネルの枠 --- jquery-side-panel

```erb:app/views/users/index.html+jquery.erb
  ...
  <div class="border rounded shadow h-96 p-4" id="user-profile">
  </div>
  ...
```

* Turbo Streams版と全く同じです。

### トリガー --- jquery-trigger

```erb:app/views/users/_user.html+jquery.erb
...
<tr id="<%= dom_id user %>"
    data-js="click-user-row"
    data-href="<%= url_for user_user_profile_path(user) %>"
    class="cursor-pointer user-row">
  <td><%= user.user_profile.name %></td>
  <td><%= user.email %></td>
</tr>
...
```

* `data-js="click-user-row"`により、下記のjQueryと接続しています。

```js:app/javascript/jquery/users.ts
...

const components = $("[data-js='click-user-row']")
const frame = $("#user-profile")
const highlightClass = "bg-yellow-200"

components.each(function (index, el) {
  init(el)
})

function init(el: HTMLElement) {
  const component = $(el)

  component.on("click", function (event) {
    event.preventDefault();
    select(component)

    frame.load(component.data('href'))
  })
}
```

* jQueryにより、テーブルの行がクリックされると`load()`関数が呼ばれます。
    * `load()`によりサーバにリクエストが投げられ、HTMLレスポンスを受け取ります。
    * HTMLレスポンスは`frame`(サイドパネルの枠)の中に挿入されます。
* ちなみに上記の[jQueryはTypeScriptで書いています](https://www.npmjs.com/package/@types/jquery)。

### サーバからのレスポンス --- jquery-server-response

```erb:app/views/users/user_profiles/show.html+jquery.erb
<div>
...
[サイドパネルの表示内容]
...
</div>
```

* Turbo Frames同様、サーバからのレスポンスを使って**どのように画面の部分更新をするかは全てクライアント側のjQueryが決めています**ので、サーバからは表示内容だけを返信しています。

## Server Generated JavaScript Response版 --- sjr

[RailsのUJS (Unobtrusive JavaScript)](https://github.com/rails/rails-ujs)([jQuery版](https://github.com/rails/jquery-ujs))を使用する方法です。[Server-generated JavaScript Responsesのポスト](https://signalvnoise.com/posts/3697-server-generated-javascript-responses)でDHHが詳しく解説しています。

上記のjQuery版とともに、Hotwireが公開される前の2020年ごろまで、Ruby on Railsフロントエンドでよく使用されていた方法です。

### サイドパネルの枠 --- sjr-side-panel

```erb:app/views/users/index.html+sjr.erb
  ...
  <div class="border rounded shadow h-96 p-4" id="user-profile">
  </div>
  ...
```

* Turbo Streams版, jQuery版と全く同じです。

### トリガー --- sjr-trigger

```erb:app/views/users/_user.html+sjr.erb
...
    <%= link_to user_user_profile_path(user), data: {remote: "true"} do %>
      <span class="absolute inset-0"></span>
      <%= user.user_profile.name %>
    <% end %>
...
```

* Rails UJSの機能を使いますので、`data: {remote: "true"}`(`data-remote="true"`)を書くだけで以下のことが行われます。
  * AJAXを使って、非同期でサーバにリクエストが投げられます。
  * リクエストヘッダーには`Accept: text/javascript`をつけて、JavaScriptのレスポンスを要求します。
  * サーバから帰ってきたJavaScriptを受け取り、これを実行します。（下記）

### サーバからのレスポンス --- sjr-server-response

```js:app/views/users/user_profiles/show.js+srj.erb
var frame = document.getElementById("user-profile");

// [サイドパネルの表示内容]
frame.innerHTML = "<%= j render 'show', user_profile: @user_profile %>";
// ...
```

* Railsのerbを使ってJavaScriptを記述しています。(拡張子が`.js`)
* `frame.innerHTML`を使って、`app/views/users/user_profiles/_show.html.erb` partialの中身をサイドパネル枠の中に挿入しています。
   * `#j`は[JavaScript用にエスケープするヘルパー](https://api.rubyonrails.org/classes/ActionView/Helpers/JavaScriptHelper.html#method-i-escape_javascript)です。 
* Turbo Streams同様、**サーバがどのDOM要素に対して("#user-profile")、どのような操作をするか(innerHTMLに代入)を行うかを指定します**。

## まとめ --- summary

* Hotwireは"HTML over the wire"というぐらいなので、画面の部分更新をする際にサーバからHTMLが返ってくるのが大きな特徴です。
* ただしHTMLを返すと言っても、Ruby on Railsは20年間の間に様々な手法を試してきました(ここで紹介できてなかったものもまだあります)。HotwireのTurbo FramesおよびTurbo Streamsはこの知見の上に進化してきたものです。
* Turbo FramesとTurbo Streamsの違いについては、[Turbo FramesとTurbo Streamsの違い](/concepts/server-perspective-frames-vs-streams)でも紹介しています。
