import { t } from '../utils/i18n.js';

export function Whatsapp() {
    return `
    <div class="whatsapp" onclick=toggleWhatsappNumbers()>
        <i class="fa-brands fa-whatsapp"></i>
    </div>
    <div class="whatsappNums">
        <ul>
            <li><a href="https://wa.me/+201066245666" target="_blank">${t('whatsapp.no1')}</a></li>
            <li><a href="https://wa.me/+201211604000" target="_blank">${t('whatsapp.no2')}</a></li>
        </ul>
    </div>
    `
}

window.toggleWhatsappNumbers = () => {
    document.querySelector('.whatsappNums').classList.toggle('showWhatsappNums');
}