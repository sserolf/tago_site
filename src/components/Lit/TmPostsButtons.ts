import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { ChildrenData, PostsResponse } from 'src/types/posts';

@customElement('tm-posts-buttons')
export class TmPostsButtons extends LitElement {
  @property({ type: Array }) posts: PostsResponse[] = [];
  @property({ type: Number }) postsCount = 0;

  loadMoreNews = async () => {
    let posts: PostsResponse[] = [];
    if (localStorage.getItem('posts')) {
      posts = JSON.parse(localStorage.getItem('posts') as string).posts;
      this.postsCount = posts.length;
    } else {
      const jsonPath = 'posts.json';
      const response = await fetch(
        `${jsonPath}?${new URLSearchParams({
          language: (document.querySelector('html') as HTMLElement).lang,
        })}`,
      ).then((response) => response.json());
      localStorage.setItem('posts', JSON.stringify(response));
      posts = response.posts;
      this.postsCount = posts.length;
    }
    if (this.posts.length === 0) {
      this.posts.push(...posts.slice(4, 8));
    } else {
      this.posts.push(...posts.slice(this.posts.length + 4, this.posts.length + 8));
    }
    this.requestUpdate();
  };

  removeNews = () => {
    this.posts = [];
    this.postsCount = 0;
    this.requestUpdate();
  };

  connectedCallback() {
    super.connectedCallback();
    window.onbeforeunload = () => {
      localStorage.removeItem('posts');
    };
  }

  render() {
    return html`${this.posts.length > 0
      ? this.posts.map((post) => {
          let carousel: ChildrenData[] = [],
            video,
            image;
          if (post.media_type === 'CAROUSEL_ALBUM') {
            carousel = post.children as ChildrenData[];
          } else if (post.media_type === 'VIDEO') {
            video = post.media_url;
          } else {
            image = post.media_url;
          }
          return html`<article class="post">
            ${post.permalink
              ? html` <a href="${post.permalink}" class="igPost">${post.dateToShow} IG POST </a>`
              : nothing}
            ${post.title
              ? html`<span class="igPost">${post.dateToShow} - ${post.title}</span>`
              : nothing}
            ${!post.permalink && !post.title
              ? html`<span class="igPost">${post.dateToShow}</span>`
              : nothing}
            ${post.caption ? html`<p>${post.caption}</p>` : nothing}
            ${image
              ? html`<img
                  loading="lazy"
                  src="${image}"
                  alt=${post.title ? post.title : post.id ? post.id : 'alt'}
                />`
              : nothing}
            ${video ? html`<video src="${video}" controls></video>` : nothing}
            ${carousel
              ? carousel.map((carouselItem: ChildrenData) => {
                  if (carouselItem.media_type === 'VIDEO') {
                    return html`<video src=${carouselItem.media_url} controls></video>`;
                  } else {
                    return html`<img
                      loading="lazy"
                      src=${carouselItem.media_url}
                      alt=${carouselItem.id ? carouselItem.id : 'alt'}
                    />`;
                  }
                })
              : nothing}
          </article>`;
        })
      : nothing}
    ${this.postsCount != this.posts.length + 4
      ? html`<button @click=${this.loadMoreNews}><slot name="moreNews"></button>`
      : nothing}
    ${this.postsCount > 0
      ? html`<button @click=${this.removeNews}><slot name="closeNews"></button>`
      : nothing}`;
  }

  static styles = css`
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

    .post {
      margin: 10px 0;
    }

    img {
      border-radius: 5px;
      width: 100%;
      height: auto;
      scale: 0.99;
      transition: scale 0.2s;
    }

    img:hover {
      scale: 1;
    }

    .igPost {
      color: purple;
      transition: color 0.2s;
      font-size: 1.25em;
      font-weight: bold;
      text-decoration: underline;
      cursor: pointer;
    }

    .igPost:hover {
      color: blue;
    }

    p {
      white-space: pre-line;
    }

    video {
      width: 100%;
      height: auto;
    }
  `;
}
