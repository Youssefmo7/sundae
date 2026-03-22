import { Header } from "../components/Header.js";
import { Footer } from "../components/Footer.js";
import { Card } from "../components/Card.js";
import MainButton from "../components/MainButton.js";

// import sliderImage from "../assets/slider 1.png";
// import storyImage from "../assets/Slider 2.png";
// import figure from "../assets/Figure.png";
// import followImage1 from "../assets/follow-image1.png";
// import followImage2 from "../assets/follow-image2.png";
// import followImage3 from "../assets/follow-image3.png";

import getProducts from "../utils/getProducts.js";
import { getCachedCategories } from "../utils/dataCache.js";
import { t } from "../utils/i18n.js";

const sliderImage = 'https://res.cloudinary.com/debrtvbnc/image/upload/v1774183650/slider_1_dacxyu.png'
const storyImage = 'https://res.cloudinary.com/debrtvbnc/image/upload/v1774183614/Slider_2_lyrmle.png'
const figure = 'https://res.cloudinary.com/debrtvbnc/image/upload/v1774183592/Figure_argyco.png'
const followImage1 = 'https://res.cloudinary.com/debrtvbnc/image/upload/v1774183588/follow-image1_omt0gb.png'
const followImage2 = 'https://res.cloudinary.com/debrtvbnc/image/upload/v1774183589/follow-image2_neqwwf.png'
const followImage3 = 'https://res.cloudinary.com/debrtvbnc/image/upload/v1774183594/follow-image3_wn6kbn.png'

export async function HomeFunctions() {
  const carousel = document.querySelector(".carousel")
  const track = document.querySelector(".track")
  const images = Array.from(track.children)
  const next = document.querySelector(".next")
  const prev = document.querySelector(".prev")
  const dotsContainer = document.querySelector(".dots")

  let index = 0
  let width = 100
  let autoplay

  images.forEach((_, i) => {
    const dot = document.createElement("div")
    dot.className = "dot"
    if (i === 0) dot.classList.add("active")
    dot.onclick = () => goTo(i)
    dotsContainer.appendChild(dot)
  })

  const dots = document.querySelectorAll(".dot")

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`
    dots.forEach(d => d.classList.remove("active"))
    dots[index].classList.add("active")
  }

  function goTo(i) {
    index = i
    update()
  }

  next.onclick = () => {
    index = (index + 1) % images.length
    update()
  }

  prev.onclick = () => {
    index = (index - 1 + images.length) % images.length
    update()
  }

  function startAutoPlay() {
    autoplay = setInterval(() => {
      next.onclick()
    }, 3000)
  }

  function stopAutoPlay() {
    clearInterval(autoplay)
  }

  carousel.onmouseenter = stopAutoPlay
  carousel.onmouseleave = startAutoPlay

  let startX = 0

  carousel.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX
  })

  carousel.addEventListener("touchend", e => {
    let endX = e.changedTouches[0].clientX
    if (startX - endX > 50) next.onclick()
    if (endX - startX > 50) prev.onclick()
  })

  startAutoPlay()

  const showProducts = (await getProducts(8)).rows;
  // console.log(showProducts);
  document.querySelector('.home-products-cards').innerHTML = showProducts.map(product => Card(product)).join('');

  const categories = await getCachedCategories();
  const categoriesContainer = document.querySelector('.categ-cards');
  if (categoriesContainer) {
    if (categories.length) {
      categoriesContainer.innerHTML = categories
        .map((category) => {
          const image = category.image || '';
          const name = category.name || 'Category';
          return `
            <div class="category-card">
              <div class="category-image">
                <img src="${image}" alt="${name}" />
              </div>
              <a class="category-btn" href="#/products">
                <span>${name}</span>
                <i class="fa-solid fa-arrow-right-long"></i>
              </a>
            </div>
          `;
        })
        .join('');
    } else {
      categoriesContainer.innerHTML = '<p class="p-desc">No categories available.</p>';
    }
  }
}

export function Home() {
  return `
    ${Header()}
    <div class="carousel">
      <div class="track">
        <img src="${sliderImage}" alt="${t('home.products_title')} 1">
        <img src="${sliderImage}" alt="${t('home.products_title')} 2">
        <img src="${sliderImage}" alt="${t('home.products_title')} 3">
      </div>

      <button class="btn prev">‹</button>
      <button class="btn next">›</button>

      <div class="dots"></div>
    </div>
    <div class="container home-background">
      <div class="story">
        <div class="container">
          <div class="story-info">
            <div class="left">
              <h3>${t('home.story_title')}</h3>
              <p>
                ${t('home.story_p1')}
              </p>
              <p>
                ${t('home.story_p2')}
              </p>
            </div>
            <div class="right"><img src="${storyImage}" alt="${t('home.story_title')}" /></div>
          </div>
        </div>
      </div>
      <div class="ent">
        <div class="container">
          <div class="banner">
            <div class="left">
              <img src="${figure}" alt="${t('home.banner_title')}" />
            </div>
            <div class="right">
              <h2>
                ${t('home.banner_title')}
                <br /> ${t('home.banner_title_2')}
                <br /> <span>${t('home.banner_title_3')}</span>
              </h2>
              <p>
                ${t('home.banner_desc')}
              </p>
              <a href="#/products" style="text-decoration: none">
                ${MainButton(t('home.explore'))}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="categories">
        <div class="container">
          <h2>${t('home.categories_title')}</h2>
          <div class="categ-cards"></div>
        </div>
      </div>
      <div class="home-products">
        <div class="container">
          <h2>${t('home.products_title')}</h2>
          <p>${t('home.products_subtitle')}</p>
          <div class="home-products-cards"></div>
          <div style="display: flex; justify-content: center; margin-top: 24px;">
            <a href="#/products" style="text-decoration: none">
              ${MainButton(t('home.view_all'))}
            </a>
          </div>
        </div>
      </div>
      <div class="follow-us">
        <div class="container">
          <div class="follow-images">
            <h2>${t('home.follow_title')} <a href="https://www.instagram.com/ice_cream_sundae0" target="_blank" style="font:inherit; text-decoration: none;"><span>${t('home.follow_highlight')}</span></a></h2>
            <p>${t('home.follow_desc')}</p>
            <div class="imgs">
              <div><img src="${followImage1}" alt="Instagram post 1" /></div>
              <div><img src="${followImage2}" alt="Instagram post 2" /></div>
              <div><img src="${followImage3}" alt="Instagram post 3" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    ${Footer()}
  `;
}
