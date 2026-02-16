import { Header } from '../components/Header.js';
import { Footer } from '../components/Footer.js';
import MainButton from '../components/MainButton.js';

export function Location() {
  return `
    ${Header()}
    <div class="location-banner"><p>Our Location</p><h6 class="path">Home / Our Location</h6></div>
    <div class="location-background">
      <form class="location-form-container">
        <p class="getInTouch">Get in <span>Touch</span> With Us</p>
        <div class="location-fields-container">
          <div style="flex: 1;">
            <div class="input-container">
              <label for="firstName">First Name</label>
              <input type="text" name="firstName" placeholder="" />
            </div>
            <div class="input-container">
              <label for="lastName">Last Name</label>
              <input type="text" name="lastName" placeholder="" />
            </div>
            <div class="input-container">
              <label for="phoneNumber">WhatsApp Number</label>
              <input type="tel" name="phoneNumber" placeholder="" />
            </div>
          </div>
          <div style="flex: 1;">
            <div class="input-container">
              <label for="email">Email Address</label>
              <input type="email" name="email" placeholder="" />
            </div>
            <div class="textarea-container">
              <label for="message">Write your message</label>
              <textarea name="message" placeholder=""></textarea>
            </div>
          </div>
        </div>
        ${MainButton("Submit")}
      </form>
    </div>
    ${Footer()}
  `;
}