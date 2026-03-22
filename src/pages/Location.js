import { Header } from '../components/Header.js';
import { Footer } from '../components/Footer.js';
import MainButton from '../components/MainButton.js';
import { tablesDb } from '../appwrite.js';
import { ID } from 'appwrite';

export function LocationFunctions() {
  const form = document.querySelector('.location-form-container');
  const toast = document.getElementById('location-toast');
  if (!form) return;

  const showToast = (message, type = 'success') => {
    if (!toast) return;
    toast.textContent = message;
    toast.className = `location-toast show ${type}`;
    clearTimeout(showToast.timeoutId);
    showToast.timeoutId = setTimeout(() => {
      toast.className = 'location-toast';
    }, 3200);
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const firstName = String(formData.get('firstName') || '').trim();
    const lastName = String(formData.get('lastName') || '').trim();
    const name = `${firstName} ${lastName}`.trim();
    const email = String(formData.get('email') || '').trim();
    const whatsapp = String(formData.get('phoneNumber') || '').trim();
    const message = String(formData.get('message') || '').trim();

    if (!firstName || !lastName || !email || !whatsapp || !message) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    try {
      await tablesDb.createRow({
        databaseId: import.meta.env.VITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_MESSAGES,
        rowId: ID.unique(),
        data: {
          name: name,
          email: email,
          whatsapp: whatsapp,
          message: message
        }
      });

      form.reset();
      showToast('Message sent successfully.');
    } catch (error) {
      console.error('Failed to send message:', error);
      showToast('Failed to send message. Please check your credentials and try again.', 'error');
    }
  });
}

export function Location() {
  return `
    ${Header()}
    <div class="location-banner"><p>Our Location</p><h6 class="path">Home / Our Location</h6></div>
    <div class="location-background">
      <div id="location-toast" class="location-toast" role="status" aria-live="polite"></div>
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
