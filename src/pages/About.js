
import { Header } from '../components/Header.js';
import { Footer } from '../components/Footer.js';
import aboutStoryOne from '../assets/about1.png';
import aboutStoryTwo from '../assets/about2.png';
import aboutStoryThree from '../assets/about3.png';

const statistics = [
  { value: '91+', label: 'Awards Win' },
  { value: '95%', label: 'Satisfied Clients' },
  { value: '5+', label: 'Years of Experience' },
  { value: '600+', label: 'Employees Working' }
];

const aboutBlocks = [
  {
    title: 'Our Journey Began With a Simple Dream',
    text: 'Established in April 2019, Pharma Gel for Food Industries is a leading Egyptian company dedicated to redefining the ice cream experience. Under our flagship brand, Sundae, we combine passion with precision to deliver premium-quality products and flavor innovation.',
    image: aboutStoryOne,
    imageShape: 'circle'
  },
  {
    title: 'Our Vision & Mission',
    text: 'Our mission is simple: to provide a unique and joyful experience every day. We aim to be the preferred choice for families through high-quality products, fresh ingredients, and continuous development focused on customer delight.',
    image: aboutStoryTwo,
    imageShape: 'rounded',
    reverse: true
  },
  {
    title: 'Quality & Innovation',
    text: 'At Sundae, quality is our foundation. Our production lines follow strict standards and modern hygiene protocols. We prioritize premium ingredients and full process control to maintain excellent taste, consistency, and safety in every batch.',
    image: aboutStoryThree,
    imageShape: 'circle'
  }
];

export function About() {
  const blocksMarkup = aboutBlocks
    .map((block) => `
      <section class="about-story-row ${block.reverse ? 'reverse' : ''}">
        <div class="about-story-media ${block.imageShape}">
          <img src="${block.image}" alt="${block.title}" />
        </div>
        <div class="about-story-copy">
          <h2>${block.title}</h2>
          <p>${block.text}</p>
          <button class="about-read-more">Read More <i class="fa-solid fa-arrow-right"></i></button>
        </div>
      </section>
    `)
    .join('');

  const statsMarkup = statistics
    .map(
      (stat) => `
        <article class="stat-item">
          <h3>${stat.value}</h3>
          <p>${stat.label}</p>
        </article>
      `
    )
    .join('');

  return `
    ${Header()}
    <section class="about-hero home-background">
      <div class="about-hero-inner">
        <h1>About us</h1>
        <h6 class="path">Home / About us</h6>
      </div>
    </section>

    <section class="about-dark">
      <div class="container about-content">
        ${blocksMarkup}

        <section class="about-stats">
          <h2>Our Statistics</h2>
          <div class="about-stats-grid">
            ${statsMarkup}
          </div>
        </section>

        <section class="about-promise">
          <h2>Promise For Our Happy Fans</h2>
          <p class="stars">★★★★★</p>
          <p>
            With a diverse range of flavors and products designed to suit every member of the family,
            Sundae is committed to being with you every day, turning every moment into a celebration of taste.
          </p>
        </section>
      </div>
    </section>
    ${Footer()}
  `;
}
