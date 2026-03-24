import { Header } from '../components/Header.js';
import { Footer } from '../components/Footer.js';
import MainButton from '../components/MainButton.js';
import { tablesDb } from '../appwrite.js';
import { ID } from 'appwrite';
import { t } from '../utils/i18n.js';

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
      showToast(t('location.toast_required'), 'error');
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
      showToast(t('location.toast_success'));
    } catch (error) {
      console.error('Failed to send message:', error);
      showToast(t('location.toast_error'), 'error');
    }
  });
}

export function Location() {
  return `
    ${Header()}
    <h1 class="sr-only">Sundae Ice Cream | صنداي آيس كريم</h1>
    <div class="location-banner"><p>${t('location.title')}</p><h6 class="path">${t('location.path')}</h6></div>
    <div class="location-background">
      <div id="location-toast" class="location-toast" role="status" aria-live="polite"></div>
      <form class="location-form-container">
        <p class="getInTouch">${t('location.get_in_touch')}</p>
        <div class="location-fields-container">
          <div style="flex: 1;">
            <div class="input-container">
              <label for="firstName">${t('location.first_name')}</label>
              <input type="text" name="firstName" placeholder="" />
            </div>
            <div class="input-container">
              <label for="lastName">${t('location.last_name')}</label>
              <input type="text" name="lastName" placeholder="" />
            </div>
            <div class="input-container">
              <label for="phoneNumber">${t('location.whatsapp')}</label>
              <input type="tel" name="phoneNumber" placeholder="" />
            </div>
          </div>
          <div style="flex: 1;">
            <div class="input-container">
              <label for="email">${t('location.email')}</label>
              <input type="email" name="email" placeholder="" />
            </div>
            <div class="textarea-container">
              <label for="message">${t('location.message')}</label>
              <textarea name="message" placeholder=""></textarea>
            </div>
          </div>
        </div>
        ${MainButton(t('location.submit'))}
      </form>
    </div>
    ${Footer()}
  `;
}
