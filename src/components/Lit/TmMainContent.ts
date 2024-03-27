import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('tm-main-content')
export class TmMainContent extends LitElement {
  closeNavMenu = () => {
    const inputElement = document.querySelector('input') as HTMLInputElement;
    if (inputElement.checked) {
      inputElement.checked = false;
    }
  };

  scrollToTop = () => {
    const mainElement = document.querySelector('main') as HTMLElement;
    mainElement.scrollTo(0, 0);
    location.hash = '';
  };

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.closeNavMenu);
    const logoElement = document.querySelector('.band') as HTMLElement;
    logoElement.addEventListener('click', this.scrollToTop);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.closeNavMenu);
    const logoElement = document.querySelector('.band') as HTMLElement;
    logoElement.removeEventListener('click', this.scrollToTop);
    super.disconnectedCallback();
  }

  render() {
    return html`<slot></slot>`;
  }
}
