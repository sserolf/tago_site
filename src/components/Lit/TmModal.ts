import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('tm-modal')
export class TmModal extends LitElement {
  @property({ type: Boolean }) show?: boolean = false;

  closeModal = () => {
    this.show = false;
  };
  openModal = () => {
    this.show = true;
  };

  checkTarget = (e: Event) => {
    if (e.target === e.currentTarget) {
      this.closeModal();
    }
  };

  connectedCallback() {
    super.connectedCallback();
    addEventListener('closeModal', this.closeModal);
    addEventListener('openModal', this.openModal);
  }

  disconnectedCallback() {
    removeEventListener('closeModal', this.closeModal);
    removeEventListener('openModal', this.openModal);
    super.disconnectedCallback();
  }

  render() {
    return this.show
      ? html`<div class="modal" @click=${this.checkTarget}>
          <div class="modal-content">
            <slot @click=${this.closeModal}></slot>
            <h2>MENÚ</h2>
            <div class="closeSession">
              <a href="logout">Cerrar sesión</a>
            </div>
          </div>
        </div>`
      : nothing;
  }

  static styles = css`
    .modal {
      display: block;
      position: fixed;
      z-index: 1;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgb(0, 0, 0);
      background-color: rgba(0, 0, 0, 0.4);
    }

    .modal-content {
      position: relative;
      background-color: #fefefe;
      margin: 15% auto;
      padding: 20px;
      border: 1px solid #888;
      width: 80%;
      max-width: 400px;
    }

    h2 {
      margin: 0;
    }

    .closeSession {
      margin: 10px 0;
      font-size: 15px;
      padding: 0 0 0 5px;
    }
  `;
}
