import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Gig } from 'src/types/gigs';

@customElement('tm-gigs-buttons')
export class TmGigsButtons extends LitElement {
  @property({ type: Array }) gigs: Gig[] = [];
  @property({ type: Number }) gigsCount = 0;

  loadMoreGigs = async () => {
    let pastGigs: Gig[] = [];
    if (localStorage.getItem('gigs')) {
      pastGigs = JSON.parse(localStorage.getItem('gigs') as string).gigs.pastGigs;
      this.gigsCount = pastGigs.length;
    } else {
      const jsonPath = 'gigs.json';
      const response = await fetch(
        `${jsonPath}?${new URLSearchParams({
          language: (document.querySelector('html') as HTMLElement).lang,
        })}`,
      ).then((response) => response.json());
      localStorage.setItem('gigs', JSON.stringify(response));
      pastGigs = response.gigs.pastGigs;
      this.gigsCount = pastGigs.length;
    }
    if (this.gigs.length === 0) {
      this.gigs.push(...pastGigs.slice(4, 8));
    } else {
      this.gigs.push(...pastGigs.slice(this.gigs.length + 4, this.gigs.length + 8));
    }
    this.requestUpdate();
  };

  removeGigs = () => {
    this.gigs = [];
    this.gigsCount = 0;
    this.requestUpdate();
  };

  connectedCallback() {
    super.connectedCallback();
    window.onbeforeunload = () => {
      localStorage.removeItem('gigs');
    };
  }

  render() {
    return html` ${this.gigs.length > 0
      ? this.gigs.map((gig) => {
          return html`<li class="pastGig">
            ${gig.url
              ? html`<a href="${gig.url}" target="_blank">${gig.name}</a>`
              : html`<span>${gig.name}</span>`}
            <span>${gig.dateToShow}</span>
          </li>`;
        })
      : nothing}
    ${this.gigsCount != this.gigs.length + 4
      ? html`<button @click=${this.loadMoreGigs}><slot name="moreGigs"></button>`
      : nothing}
    ${this.gigsCount > 0
      ? html`<button @click=${this.removeGigs}><slot name="closeGigs"></button>`
      : nothing}`;
  }

  static styles = css`
    a {
      color: darkblue;
      transition: color 0.2s;
    }

    a:hover {
      color: #06f;
    }

    li {
      display: flex;
      justify-content: space-between;
      min-height: 48px;
      align-items: center;
    }

    button {
      border-color: black;
      border-radius: 6px;
      color: black;
      font-size: 15px;
      margin: 10px 0;
      padding: 10px;
      width: 100%;
      cursor: pointer;
      scale: 1;
      transition: scale 0.2s;
    }

    button:hover {
      scale: 1.01;
    }
  `;
}
