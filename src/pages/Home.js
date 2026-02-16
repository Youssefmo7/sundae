import { Header } from "../components/Header.js";
import { Footer } from "../components/Footer.js";
import { Card } from "../components/Card.js";

import sliderImage from "../assets/slider 1.png";
import storyImage from "../assets/Slider 2.png";
import figure from "../assets/Figure.png";
import followImage1 from "../assets/follow-image1.png";
import followImage2 from "../assets/follow-image2.png";
import followImage3 from "../assets/follow-image3.png";
import MainButton from "../components/MainButton.js";

import p1 from '../assets/p1.png'
import getProducts from "../utils/getProducts.js";

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
}

const showCategories = `
    <div class="card">
      <img src="${p1}" alt="" />
      <h3>Trend Vanilla</h3>
      <p>A new Trend vanilla with cone and chocolate and chips.</p>
      <a href="#/products/111"><button>View</button></a>
    </div>
    <div class="card">
      <img src="${p1}" alt="" />
      <h3>Trend Vanilla</h3>
      <p>A new Trend vanilla with cone and chocolate and chips.</p>
      <a href="#/products/111"><button>View</button></a>
    </div>
    <div class="card">
      <img src="${p1}" alt="" />
      <h3>Trend Vanilla</h3>
      <p>A new Trend vanilla with cone and chocolate and chips.</p>
      <a href="#/products/111"><button>View</button></a>
    </div>
  `;

export function Home() {
  return `
    ${Header()}
    <div class="carousel">
      <div class="track">
        <img src="${sliderImage}" alt="Slider Image 1">
        <img src="${sliderImage}" alt="Slider Image 2">
        <img src="${sliderImage}" alt="Slider Image 3">
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
              <h3>The story of Sundae Ice Cream</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur. Enim nibh gravida morbi
                nisl magnis id aliquet. Et euismod nisi donec egestas fames
                urna. Lectus ut quam massa viverra vel enim. Interdum faucibus
                facilisis turpis fermentum.
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur. Enim nibh gravida morbi
                nisl magnis id aliquet. Et euismod nisi donec egestas fames
                urna. Lectus ut quam massa viverra vel enim. Interdum faucibus
                facilisis turpis fermentum.
              </p>
            </div>
            <div class="right"><img src="${storyImage}" alt="Our story" /></div>
          </div>
        </div>
      </div>
      <div class="ent">
        <div class="container">
          <div class="banner">
            <div class="left">
              <img src="${figure}" alt="Ice cream figure" />
            </div>
            <div class="right">
              <h2>
                Relive the Sweet
                <br /> Memories of Classic
                <br /> <span>Ice Creams</span>
              </h2>
              <p>
                From rich chocolate fudge to creamy vanilla sundaes, discover
                our menu of classic ice cream creations.
              </p>
              <a href="#/products" style="text-decoration: none">
                ${MainButton("Explore Our Products")}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="categories">
        <div class="container">
          <h2>Choose your favorite ice cream category</h2>
          <div class="categ-cards">${showCategories}</div>
        </div>
      </div>
      <div class="home-products">
        <div class="container">
          <h2>Sundae Products</h2>
          <p>Some Of Our Best Products</p>
          <div class="home-products-cards"></div>
          <div style="display: flex; justify-content: center; margin-top: 24px;">
            <a href="#/products" style="text-decoration: none">
              ${MainButton("View all Products")}
            </a>
          </div>
        </div>
      </div>
      <div class="follow-us">
        <div class="container">
          <div class="follow-images">
            <h2>Follow Us on <span>Instagram</span></h2>
            <p>Join our Instagram community for updates, special deals, and more!</p>
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