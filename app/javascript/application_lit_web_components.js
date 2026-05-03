import {css, html, LitElement} from 'lit';

const buttonStyles = css`
    .button {
        border-radius: var(--lit-radius-md);
        font-weight: var(--lit-font-weight-semibold);
        appearance: button;
        box-shadow: var(--lit-shadow-md);
        box-sizing: border-box;
        cursor: pointer;
        border: none;
    }
    .button--sm {
        font-size: var(--lit-text-sm);
        line-height: var(--lit-text-sm--line-height);
        padding: calc(var(--lit-spacing) * 1.5) calc(var(--lit-spacing) * 2.5);
    }
    .button--lg {
        font-size: var(--lit-text-lg);
        padding: calc(var(--lit-spacing) * 2.5) calc(var(--lit-spacing) * 3.5);
    }

    .button--primary {
        color: var(--lit-color-white);
        background-color: var(--lit-color-primary);

        &:hover {
            background-color: var(--lit-color-primary-light);
        }
    }
`;

class Button extends LitElement {
  static properties = {
    variant: {type: String},
    size: {type: String}
  };

  static styles = [
    buttonStyles,
  ];

  render() {
    const variantClass = this.variant ? `button--${this.variant}` : '';
    const sizeClass = this.size ? `button--${this.size}` : '';
    return html`
      <button class="button ${variantClass} ${sizeClass}">
        <slot></slot>
      </button>
    `;
  }
}
customElements.define('lit-button', Button);

const cardStyles = css`
    .card {
        border: 1px solid var(--lit-color-gray-200);
        border-radius: var(--lit-radius-md);
        box-shadow: var(--lit-shadow-md);
        padding: calc(var(--lit-spacing) * 4)
    }

    .heading2 {
        font-size: calc(var(--lit-text-3xl));
    }
`;

class Card extends LitElement {
  static properties = {
    title: {type: String}
  }

  static styles = cardStyles

  render() {
    return html`
      <div class="card">
        <h2 class="heading2">${this.title}</h2>
        <slot></slot>
      </div>`
  }
}

customElements.define('lit-card', Card);
