import { h, render} from "preact";
import {useState} from "preact/hooks";
import htm from 'https://esm.sh/htm';


const html = htm.bind(h);

document.addEventListener("turbo:load", () => {
  const root = document.getElementById("root")

  render(html`<${PreactCounter} initialCount="23"/>`, root);
});

function PreactCounter(props) {
  const [count, setCount] = useState(Number(props.initialCount))

  function increment() {
    setCount(count + 1)
  }

  function decrement() {
    setCount(count - 1)
  }

  return html`
    <h1>Preact Hello</h1>
    <p>${count}</p>
    <button onClick=${increment}>Increment</button>
    <button onClick=${decrement}>Decrement</button>
  `
}
