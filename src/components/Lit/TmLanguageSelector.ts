import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('tm-language-selector')
export class TmLanguageSelector extends LitElement {
  changeLanguage = (ev: Event) => {
    const selectValue = (ev.target as HTMLSelectElement).value;
    document.cookie = `language=${selectValue}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
    localStorage.removeItem('posts');
    localStorage.removeItem('gigs');
    location.href = '';
  };

  render() {
    return html` <slot @change=${this.changeLanguage}></slot>`;
  }

  static styles = css`
    select {
      width: fit-content;
      padding: 3px;
      font-size: 1.2em;
      font-family: monospace;
      text-transform: uppercase;
      border-radius: 10px;
    }
  `;
}
