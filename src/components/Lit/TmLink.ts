import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('tm-link')
export class TmLink extends LitElement {
  goToSection = () => {
    (document.querySelector('input') as HTMLInputElement).click();
  };

  render() {
    return html`<slot @click=${this.goToSection}></slot>`;
  }
}
