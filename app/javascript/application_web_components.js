class WordCount extends HTMLElement {
  connectedCallback() {
    console.log("connected")
    const html = `
      <div class="text-red-400">
        <p>Hello World</p>
      </div>
    `
    this.innerHTML = html
  }

  disconnectedCallback() {
    console.log("disconnected")
  }
}

customElements.define("word-count", WordCount);
