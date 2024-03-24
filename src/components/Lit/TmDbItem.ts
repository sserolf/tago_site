import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('tm-db-item')
export class TmDbItem extends LitElement {
  showContent = (ev: Event) => {
    alert((ev.target as HTMLElement).innerText);
  };

  render() {
    return html`<slot @click=${this.showContent}></slot>`;
  }
}
