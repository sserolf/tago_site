import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('tm-main-content')
export class TmMainContent extends LitElement {
  toggleNavMenu = () => {
    const navElement = document.querySelector('nav') as HTMLElement;
    navElement.classList.toggle('nav-opened');
    const navOpened = document.querySelector('.nav-opened') as HTMLElement;
    if (navOpened) {
      const mainElement = document.querySelector('main') as HTMLElement;
      mainElement.classList.add('main-nav-opened');
      this.addEventListener('click', this.closeNavMenu);
    }
  };

  closeNavMenu = () => {
    const navOpened = document.querySelector('.nav-opened') as HTMLElement;
    if (navOpened) {
      navOpened.classList.remove('nav-opened');
      this.removeEventListener('click', this.closeNavMenu);
    }
  };

  scrollToTop = () => {
    const mainElement = document.querySelector('main') as HTMLElement;
    mainElement.scrollTo(0, 0);
    location.hash = '';
    this.closeNavMenu();
  };

  connectedCallback() {
    super.connectedCallback();
    const logoElement = document.querySelector('.band') as HTMLElement;
    logoElement.addEventListener('click', this.scrollToTop);
    const menu = document.querySelector('.menu') as HTMLElement;
    menu.addEventListener('click', this.toggleNavMenu);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.closeNavMenu);
    const logoElement = document.querySelector('.band') as HTMLElement;
    logoElement.removeEventListener('click', this.scrollToTop);
    const menu = document.querySelector('.menu') as HTMLElement;
    menu.removeEventListener('click', this.toggleNavMenu);
    super.disconnectedCallback();
  }

  render() {
    return html`<slot></slot>`;
  }
}
