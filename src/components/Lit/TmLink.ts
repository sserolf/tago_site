import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('tm-link')
export class TmLink extends LitElement {
  closeNavMenu = () => {
    (document.querySelector('nav') as HTMLInputElement).classList.remove('nav-opened');
  };

  render() {
    return html`<slot @click=${this.closeNavMenu}></slot>`;
  }
}
