
import { Header } from '../components/Header.js';
import { Footer } from '../components/Footer.js';
// import aboutStoryOne from '../assets/about1.png';
// import aboutStoryTwo from '../assets/about2.png';
// import aboutStoryThree from '../assets/about3.png';
import { t } from '../utils/i18n.js';

const aboutStoryOne = 'https://res.cloudinary.com/debrtvbnc/image/upload/v1774183598/about1_qbin3h.png';
const aboutStoryTwo = 'https://res.cloudinary.com/debrtvbnc/image/upload/v1774183619/about2_mzfe2r.png';
const aboutStoryThree = 'https://res.cloudinary.com/debrtvbnc/image/upload/v1774183608/about3_ohc8n1.png';

export function About() {
  const statistics = [
    { value: '91+', label: t('about.stat.awards') },
    { value: '95%', label: t('about.stat.clients') },
    { value: '5+', label: t('about.stat.years') },
    { value: '600+', label: t('about.stat.employees') }
  ];

  const aboutBlocks = [
    {
      title: t('about.block1.title'),
      text: t('about.block1.text'),
      image: aboutStoryOne,
      imageShape: 'circle'
    },
    {
      title: t('about.block2.title'),
      text: t('about.block2.text'),
      image: aboutStoryTwo,
      imageShape: 'rounded',
      reverse: true
    },
    {
      title: t('about.block3.title'),
      text: t('about.block3.text'),
      image: aboutStoryThree,
      imageShape: 'circle'
    }
  ];
  const blocksMarkup = aboutBlocks
    .map((block) => `
      <section class="about-story-row ${block.reverse ? 'reverse' : ''}">
        <div class="about-story-media ${block.imageShape}">
          <img src="${block.image}" alt="${block.title}" loading="lazy" decoding="async" />
        </div>
        <div class="about-story-copy">
          <h2>${block.title}</h2>
          <p>${block.text}</p>
          <button class="about-read-more">${t('about.read_more')} <i class="fa-solid fa-arrow-right"></i></button>
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
    <h1 class="sr-only">Sundae Ice Cream | صنداي آيس كريم</h1>
    <section class="about-hero home-background">
      <div class="about-hero-inner">
        <h1>${t('about.title')}</h1>
        <h6 class="path">${t('about.path')}</h6>
      </div>
    </section>

    <section class="about-dark">
      <div class="container about-content">
        ${blocksMarkup}

        <section class="about-stats">
          <h2>${t('about.stats_title')}</h2>
          <div class="about-stats-grid">
            ${statsMarkup}
          </div>
        </section>

        <section class="about-promise">
          <h2>${t('about.promise_title')}</h2>
          <p class="stars">★★★★★</p>
          <p>
            ${t('about.promise_desc')}
          </p>
        </section>
      </div>
    </section>
    ${Footer()}
  `;
}
