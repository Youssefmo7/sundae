import auth from '../utils/auth.js';
import { tablesDb, account } from '../appwrite.js';
import { ID } from 'appwrite';

try {
  await account.get();
} catch (err) {
  window.location.href = './../../login.html';
}

const productCategorySelect = document.getElementById('product-category');
const statProducts = document.getElementById('stat-products');
const statCategories = document.getElementById('stat-categories');
const statusMessage = document.getElementById('status-message');
const dashboardDate = document.getElementById('dashboard-date');

function showStatus(message, type = 'success') {
  if (!statusMessage) return;

  statusMessage.className = `status-message show ${type}`;
  statusMessage.textContent = message;

  clearTimeout(showStatus.timeoutId);
  showStatus.timeoutId = setTimeout(() => {
    statusMessage.className = 'status-message';
    statusMessage.textContent = '';
  }, 3200);
}

function updateDashboardDate() {
  if (!dashboardDate) return;

  dashboardDate.textContent = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function createFlavorGroupMarkup(canRemove = false) {
  return `
    <div class="flavor-group">
      <div class="input-container">
        <input type="text" placeholder=" " class="flavor-name" required />
        <label>Flavor Name</label>
      </div>
      <div class="input-container file-input-container">
        <input type="file" accept="image/*" class="flavor-image" required />
        <label class="fixed-label">Flavor Image</label>
      </div>
      ${canRemove ? '<button type="button" class="btn remove-flavor-btn">Remove</button>' : ''}
    </div>
  `;
}

async function uploadImageToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'products');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData
    }
  );

  if (!response.ok) {
    throw new Error('Failed to upload image to Cloudinary');
  }

  const data = await response.json();
  return data.secure_url;
}

async function saveProductToAppwrite(productData, flavors) {
  try {
    const product = await tablesDb.createRow({
      databaseId: import.meta.env.VITE_DATABASE_ID,
      tableId: import.meta.env.VITE_TABLE_ID_PRODUCTS,
      rowId: ID.unique(),
      data: {
        name: productData.name,
        price: parseFloat(productData.price),
        category: productData.category,
        description: productData.description,
        slogan: productData.slogan,
        image: productData.image,
        flavors: JSON.stringify(flavors)
      }
    });

    return product;
  } catch (error) {
    throw new Error(`Failed to save product: ${error.message}`);
  }
}

async function fetchCategories() {
  const response = await tablesDb.listRows({
    databaseId: import.meta.env.VITE_DATABASE_ID,
    tableId: import.meta.env.VITE_TABLE_ID_CATEGORIES
  });

  return response;
}

async function fetchProducts() {
  const response = await tablesDb.listRows({
    databaseId: import.meta.env.VITE_DATABASE_ID,
    tableId: import.meta.env.VITE_TABLE_ID_PRODUCTS
  });

  return response;
}

function renderCategoryOptions(categories) {
  if (!productCategorySelect) return;

  const optionHtml = categories
    .map((cat) => `<option value="${cat.$id}">${cat.name}</option>`)
    .join('');

  productCategorySelect.innerHTML = '<option value="">Select a category</option>' + optionHtml;
}

function updateStats({ productsTotal, categoriesTotal }) {
  if (statProducts) statProducts.textContent = String(productsTotal ?? 0);
  if (statCategories) statCategories.textContent = String(categoriesTotal ?? 0);
}

async function loadDashboardData() {
  try {
    const [productsRes, categoriesRes] = await Promise.all([fetchProducts(), fetchCategories()]);

    renderCategoryOptions(categoriesRes.rows || []);
    updateStats({
      productsTotal: productsRes.total ?? productsRes.rows?.length ?? 0,
      categoriesTotal: categoriesRes.total ?? categoriesRes.rows?.length ?? 0
    });
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
    showStatus('Failed to load dashboard data.', 'error');
  }
}

updateDashboardDate();
loadDashboardData();

const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await auth.logoutUser();
  });
}

const addFlavorBtn = document.getElementById('add-flavor-btn');
const flavorInputs = document.getElementById('flavor-inputs');

if (addFlavorBtn && flavorInputs) {
  addFlavorBtn.addEventListener('click', (e) => {
    e.preventDefault();
    flavorInputs.insertAdjacentHTML('beforeend', createFlavorGroupMarkup(true));
  });

  flavorInputs.addEventListener('click', (e) => {
    const button = e.target.closest('.remove-flavor-btn');
    if (!button) return;

    const group = button.closest('.flavor-group');
    if (group) group.remove();
  });
}

const addProductForm = document.getElementById('add-product-form');
if (addProductForm) {
  addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const productImageInput = document.getElementById('product-image');
    if (!productImageInput.files?.[0]) {
      showStatus('Please choose a product image.', 'error');
      return;
    }

    const submitBtn = addProductForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Uploading...';

    try {
      const pImageUrl = await uploadImageToCloudinary(productImageInput.files[0]);
      const productData = {
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        description: document.getElementById('product-description').value,
        price: document.getElementById('product-price').value,
        image: pImageUrl,
        slogan: document.getElementById('product-slogan').value
      };

      const flavorGroups = document.querySelectorAll('.flavor-group');
      const flavors = [];

      for (const group of flavorGroups) {
        const nameInput = group.querySelector('.flavor-name');
        const imageInput = group.querySelector('.flavor-image');

        if (!nameInput.value || imageInput.files.length === 0) {
          continue;
        }

        const imageUrl = await uploadImageToCloudinary(imageInput.files[0]);

        flavors.push({
          name: nameInput.value,
          imageUrl
        });
      }

      if (flavors.length === 0) {
        showStatus('Please add at least one flavor with an image.', 'error');
        return;
      }

      await saveProductToAppwrite(productData, flavors);
      addProductForm.reset();

      if (flavorInputs) {
        flavorInputs.innerHTML = createFlavorGroupMarkup(false);
      }

      await loadDashboardData();
      showStatus('Product added successfully.');
    } catch (error) {
      console.error('Error adding product:', error);
      showStatus(`Failed to add product: ${error.message}`, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

const addCategoryForm = document.getElementById('add-category-form');
if (addCategoryForm) {
  addCategoryForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = addCategoryForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Uploading...';

    try {
      const imageInput = document.getElementById('category-image');
      if (!imageInput.files?.[0]) {
        showStatus('Please choose a category image.', 'error');
        return;
      }

      const imageUrl = await uploadImageToCloudinary(imageInput.files[0]);
      const categoryData = {
        name: document.getElementById('category-name').value,
        image: imageUrl
      };

      await tablesDb.createRow({
        databaseId: import.meta.env.VITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_CATEGORIES,
        rowId: ID.unique(),
        data: categoryData
      });

      addCategoryForm.reset();
      await loadDashboardData();
      showStatus('Category added successfully.');
    } catch (error) {
      console.error('Error adding category:', error);
      showStatus(`Failed to add category: ${error.message}`, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}
