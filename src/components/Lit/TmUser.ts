import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('tm-user')
export class TmUser extends LitElement {
  openModal = () => {
    dispatchEvent(new CustomEvent('openModal'));
  };

  render() {
    return html`<slot name="username" @click=${this.openModal}></slot>
      <slot name="user-icon" @click=${this.openModal}></slot>`;
  }
}
