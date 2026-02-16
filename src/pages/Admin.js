import auth from '../utils/auth.js';
import { tablesDb, account } from '../appwrite.js';
import { ID } from 'appwrite';
import { Cloudinary } from "@cloudinary/url-gen";

try {
  await account.get();
} catch(err) {
  window.location.href = 'login.html';
}

(async () => {
  const categories = await tablesDb.listRows({
    databaseId: import.meta.env.VITE_DATABASE_ID,
    tableId: import.meta.env.VITE_TABLE_ID_CATEGORIES
  }).then(res => res.rows);
  console.log(categories);

  let categorySelect = document.getElementById('product-category');
  categorySelect.innerHTML += (categories.map(cat => `<option value="${cat.$id}">${cat.name}</option>`).join(''));
})();

const cloud = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUD_NAME
  }
});


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
    console.log("flavors: ", flavors);
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
  // Handle logout
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await auth.logoutUser();
  });
}

// Handle add flavor button
const addFlavorBtn = document.getElementById('add-flavor-btn');
if (addFlavorBtn) {
  addFlavorBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const flavorInputs = document.getElementById('flavor-inputs');
    flavorInputs.innerHTML += `
      <div class="flavor-group">
        <div class="input-container">
          <input type="text" placeholder="" class="flavor-name" required />
          <label>Flavor Name</label>
        </div>
        <div class="input-container">
          <input type="file" accept="image/*" class="flavor-image" required />
          <label>Flavor Image</label>
        </div>
      </div>
    `;
  });
}

// Handle form submission
const addProductForm = document.getElementById('add-product-form');
if (addProductForm) {
  addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get product data
    const pImageUrl = await uploadImageToCloudinary(document.getElementById('product-image').files[0]);
    const productData = {
      name: document.getElementById('product-name').value,
      category: document.getElementById('product-category').value,
      description: document.getElementById('product-description').value,
      price: document.getElementById('product-price').value,
      image: pImageUrl,
      slogan: document.getElementById('product-slogan').value
    };

    // Get flavor data
    const flavorGroups = document.querySelectorAll('.flavor-group');
    const flavors = [];

    // Show loading state
    const submitBtn = addProductForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Uploading...';

    try {
      // Process each flavor
      for (const group of flavorGroups) {
        const nameInput = group.querySelector('.flavor-name');
        const imageInput = group.querySelector('.flavor-image');
        console.log("nameInput: ", nameInput);
        console.log("imageInput: ", imageInput);

        if (nameInput.value && imageInput.files.length > 0) {
          // Upload image to Cloudinary
          const imageUrl = await uploadImageToCloudinary(imageInput.files[0]);

          flavors.push({
            name: nameInput.value,
            imageUrl: imageUrl
          });
        }
      }

      // Validate that we have at least one flavor
      if (flavors.length === 0) {
        alert('Please add at least one flavor with an image');
        return;
      }

      // Save to Appwrite
      await saveProductToAppwrite(productData, flavors);

      // Success message and reset form
      alert('Product added successfully!');
      addProductForm.reset();

      // Remove extra flavor inputs
      const flavorInputs = document.getElementById('flavor-inputs');
      flavorInputs.innerHTML = `
        <div class="flavor-group">
          <div class="input-container">
            <input type="text" placeholder="" class="flavor-name" required />
            <label>Flavor Name</label>
          </div>
          <div class="input-container">
            <input type="file" accept="image/*" class="flavor-image" required />
            <label>Flavor Image</label>
          </div>
        </div>
      `;
    } catch (error) {
      console.error('Error adding product:', error);
      alert(`Failed to add product: ${error.message}`);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

const addCategoryForm = document.getElementById('add-category-form');
addCategoryForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const imageInput = document.getElementById('category-image');

  // Upload image to Cloudinary
  const imageUrl = await uploadImageToCloudinary(imageInput.files[0]);
  const categoryData = {
    name: document.getElementById('category-name').value,
    image: imageUrl
  };

  const category = await tablesDb.createRow({
    databaseId: import.meta.env.VITE_DATABASE_ID,
    tableId: import.meta.env.VITE_TABLE_ID_CATEGORIES,
    rowId: ID.unique(),
    data: categoryData
  });

  return category;
})