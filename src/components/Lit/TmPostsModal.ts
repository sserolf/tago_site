import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('tm-posts-modal')
export class TmPostsModal extends LitElement {
  openModal = () => {
    const shadowRoot = this.shadowRoot;
    const slot = shadowRoot?.querySelector('slot');
    const assignedElements = slot?.assignedElements({ flatten: true }) ?? [];
    const slottedImg = assignedElements[0];
    const div = document.querySelector('#postsModal') as HTMLDivElement;
    const img = document.querySelector('#postsModalImg') as HTMLImageElement;
    img.src = slottedImg.getAttribute('src') as string;
    div.onclick = () => {
      div.style.display = 'none';
      img.src = '';
    };
    div.style.display = 'flex';
  };

  render() {
    return html`<slot @click=${this.openModal}></slot>`;
  }
}
