import { useEffect, useState } from "react";
import { storage, tablesDb, account } from "../appwrite";
import { ID } from "appwrite";
import "../styles/admin.css";

export default function Admin() {
  // State for product form with multiple flavors
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    flavors: [{ name: "", description: "", image: null }],
  });

  // State for admin form
  const [adminForm, setAdminForm] = useState({
    username: "",
    password: "",
  });

  // State for category form
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    image: null,
  });

  // State for file names
  const [flavorFileNames, setFlavorFileNames] = useState(["No file chosen"]);
  const [categoryFileName, setCategoryFileName] = useState("No file chosen");

  // State for categories list
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await tablesDb.listRows({
        databaseId: import.meta.env.VITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_CATEGORIES,
      });
      setCategories(response.rows);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const addFlavorField = () => {
    setProductForm((prev) => ({
      ...prev,
      flavors: [...prev.flavors, { name: "", description: "", image: null }],
    }));
    setFlavorFileNames((prev) => [...prev, "No file chosen"]);
  };

  const removeFlavor = (index) => {
    setProductForm((prev) => ({
      ...prev,
      flavors: prev.flavors.filter((_, i) => i !== index),
    }));
    setFlavorFileNames((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFlavorField = (index, field, value) => {
    setProductForm((prev) => ({
      ...prev,
      flavors: prev.flavors.map((flavor, i) => {
        if (i === index) {
          return { ...flavor, [field]: value };
        }
        return flavor;
      }),
    }));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create product document with flavors
      const response = await tablesDb.createRow({
        databaseId: import.meta.env.VITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_PRODUCTS,
        rowId: ID.unique(),
        data: {
          name: productForm.name,
          description: productForm.description,
          category: productForm.category_id,
          image: "adjfkd",
        },
      });
      // Upload flavor images and create flavor rows
      const flavorPromises = (
        Array.isArray(productForm.flavors) ? productForm.flavors : []
      ).map(async (flavor) => {
        if (!flavor) return null;
        // If there's an image, upload it; otherwise keep image empty
        let fileId = "";
        if (flavor.image) {
          const file = await storage.createFile({
            bucketId: import.meta.env.VITE_BUCKET_ID,
            fileId: ID.unique(),
            file: flavor.image,
          });
          fileId = file.$id;
        }
        return tablesDb.createRow({
          databaseId: import.meta.env.VITE_DATABASE_ID,
          tableId: "flavors",
          rowId: ID.unique(),
          data: {
            productId: response.$id,
            name: flavor.name,
            description: flavor.description || "",
            image: fileId,
          },
        });
      });

      await Promise.all(flavorPromises);

      // Reset form
      setProductForm({
        name: "",
        description: "",
        price: "",
        category_id: "",
        flavors: [{ name: "", description: "", image: null }],
      });
      setFlavorFileNames(["No file chosen"]);
      // alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      // alert("Error adding product: " + error.message);
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      await account.create({
        userId: ID.unique(),
        email: adminForm.username,
        password: adminForm.password,
      });
      setAdminForm({ username: "", password: "" });
      alert("Admin added successfully!");
    } catch (error) {
      console.error("Error adding admin:", error);
      alert("Error adding admin: " + error.message);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      let fileId = "";
      if (categoryForm.image) {
        const file = await storage.createFile({
          bucketId: import.meta.env.VITE_BUCKET_ID,
          fileId: ID.unique(),
          file: categoryForm.image,
        });
        fileId = file.$id;
      }

      await tablesDb.createRow({
        databaseId: import.meta.env.VITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_CATEGORIES,
        rowId: ID.unique(),
        data: {
          name: categoryForm.name,
          image: fileId,
        },
      });

      setCategoryForm({ name: "", image: null });
      setCategoryFileName("No file chosen");
      alert("Category added successfully!");
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Error adding category: " + error.message);
    }
  };

  const logOut = async () => {
    await account.deleteSession({ sessionId: "current" });
    window.location.reload();
  };

  return (
    <>
      <div className="logout-header">
        <button className="btn-blue" onClick={logOut}>
          Logout
        </button>
      </div>
      <form className="admin-form" onSubmit={handleProductSubmit}>
        <div className="input-container">
          <h4>Add Product</h4>
        </div>
        <div className="input-container">
          <input
            type="text"
            value={productForm.name}
            onChange={(e) =>
              setProductForm({ ...productForm, name: e.target.value })
            }
            placeholder=""
            required
          />
          <label>Name</label>
        </div>
        <div className="input-container">
          <input
            type="text"
            value={productForm.description}
            onChange={(e) =>
              setProductForm({ ...productForm, description: e.target.value })
            }
            placeholder=""
            required
          />
          <label>Description</label>
        </div>
        {/* <div className="input-container">
          <input
            type="number"
            step="0.01"
            min="0"
            value={productForm.price}
            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
            placeholder=""
            required
          />
          <label>Price</label>
        </div> */}
        <div className="input-container">
          <select
            value={productForm.category_id}
            onChange={(e) =>
              setProductForm({ ...productForm, category_id: e.target.value })
            }
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.$id} value={category.$id}>
                {category.name}
              </option>
            ))}
          </select>
          {/* <label>Category</label> */}
        </div>

        <div className="flavors-section">
          {/* <h5>Flavors</h5> */}
          {productForm.flavors.map((flavor, index) => (
            <div key={index} className="flavor-container">
              <div className="input-container">
                <input
                  type="text"
                  value={flavor.name}
                  onChange={(e) =>
                    updateFlavorField(index, "name", e.target.value)
                  }
                  placeholder=""
                  required
                />
                <label>Flavor Name</label>
              </div>
              <div className="input-container">
                <input
                  type="text"
                  value={flavor.description}
                  onChange={(e) =>
                    updateFlavorField(index, "description", e.target.value)
                  }
                  placeholder=""
                />
                <label>Flavor Description</label>
              </div>
              <div className="fileInputContainer">
                <label htmlFor={`flavorImage${index}`} className="file-upload">
                  Choose Image
                </label>
                <p>{flavorFileNames[index]}</p>
                <input
                  type="file"
                  id={`flavorImage${index}`}
                  className="imageInput"
                  onChange={(e) => {
                    updateFlavorField(index, "image", e.target.files[0]);
                    const newFileNames = [...flavorFileNames];
                    newFileNames[index] =
                      e.target.files[0]?.name || "No file chosen";
                    setFlavorFileNames(newFileNames);
                  }}
                  accept="image/*"
                  required
                />
              </div>
              {index > 0 && (
                <div className="input-container">
                  <button
                    type="button"
                    onClick={() => removeFlavor(index)}
                    className="remove-flavor"
                  >
                    Remove Flavor
                  </button>
                </div>
              )}
            </div>
          ))}
          <div className="input-container">
            <button
              type="button"
              onClick={addFlavorField}
              className="add-flavor"
            >
              Add Another Flavor
            </button>
          </div>
        </div>

        <button type="submit">Add Product</button>
      </form>

      <form className="admin-form" onSubmit={handleAdminSubmit}>
        <div className="input-container">
          <h4>Add Admin</h4>
        </div>
        <div className="input-container">
          <input
            type="email"
            value={adminForm.username}
            onChange={(e) =>
              setAdminForm({ ...adminForm, username: e.target.value })
            }
            placeholder=""
            required
          />
          <label>Email</label>
        </div>
        <div className="input-container">
          <input
            type="password"
            value={adminForm.password}
            onChange={(e) =>
              setAdminForm({ ...adminForm, password: e.target.value })
            }
            placeholder=""
            required
          />
          <label>Password</label>
        </div>
        <button type="submit">Add Admin</button>
      </form>

      <form className="admin-form" onSubmit={handleCategorySubmit}>
        <div className="input-container">
          <h4>Add Category</h4>
        </div>
        <div className="input-container">
          <input
            type="text"
            value={categoryForm.name}
            onChange={(e) =>
              setCategoryForm({ ...categoryForm, name: e.target.value })
            }
            placeholder=""
            required
          />
          <label>Name</label>
        </div>
        <div className="fileInputContainer">
          <label htmlFor="categoryImage" className="file-upload">
            Choose Image
          </label>
          <p>{categoryFileName}</p>
          <input
            type="file"
            id="categoryImage"
            className="imageInput"
            onChange={(e) => {
              setCategoryForm({ ...categoryForm, image: e.target.files[0] });
              setCategoryFileName(e.target.files[0]?.name || "No file chosen");
            }}
            accept="image/*"
            required
          />
        </div>
        <button type="submit">Add Category</button>
      </form>
    </>
  );
  // let input = document.querySelector("#categoryForm .imageInput");
  // const fileNameCategory = document.querySelector("#categoryForm #fileName");
  // fileNameCategory.textContent = input.files[0] ? input.files[0].name : "No file chosen";
}

// const productFormSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     const res = await storage.createFile({
//       bucketId: import.meta.env.VITE_BUCKET_ID,
//       fileId: ID.unique(),
//       file: productForm.current.image.files[0]
//     })
//     // console.log(res);
//     const name = productForm.current.name.value
//     const description = productForm.current.description.value
//     const price = productForm.current.price.value
//     const category = productForm.current.category_id.value
//     const image = res.$id

//     const productInfo = {name, description, price, category, image};

//     const res2 = await tablesDb.createRow({
//       databaseId: import.meta.env.VITE_DATABASE_ID,
//       tableId: import.meta.env.VITE_TABLE_ID_PRODUCTS,
//       rowId: ID.unique(),
//       data: productInfo
//     })
//     productForm.reset();
//     console.log(res2);
//   } catch (err) {
//     console.log("ERROR: ", err)
//   }
// }

// const categoryForm = useRef(null);
// const categoryFormSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     const res = await storage.createFile({
//       bucketId: import.meta.env.VITE_BUCKET_ID,
//       fileId: ID.unique(),
//       file: categoryForm.current.image.files[0]
//     })
//     // console.log(res);
//     const name = categoryForm.current.name.value
//     const image = res.$id

//     const categoryInfo = {name, image};

//     const res2 = await tablesDb.createRow({
//       databaseId: import.meta.env.VITE_DATABASE_ID,
//       tableId: import.meta.env.VITE_TABLE_ID_CATEGORIES,
//       rowId: ID.unique(),
//       data: categoryInfo
//     })
//     setRunEffect(prev => prev+1);
//     categoryForm.current.reset();
//     console.log(res2);
//   } catch (err) {
//     console.log("ERROR: ", err)
//   }
// }

// const adminForm = useRef(null);
// const adminFormSubmit = async (e) => {
//   e.preventDefault();
//   const name = adminForm.current.name.value;
//   const email = adminForm.current.email.value;
//   const password = adminForm.current.password.value;
//   account.create({
//     userId: ID.unique(),
//     email: email,
//     password: password,
//     name: name
//   })
//   adminForm.current.reset();
// }

// const handleLogout = async () => {
//   await account.deleteSession({sessionId: 'current'});
//   window.location.reload();
// }

// return (
//   <>
//     <div className='logout-header'><button className='btn-blue' onClick={handleLogout}>Logout</button></div>
//     <form className='admin-form' id="productForm" ref={productForm} onSubmit={productFormSubmit}>
//       <div className="input-container"><h4>Add Product</h4></div>
//       <div className="input-container">
//         <input type="text" name="name" placeholder="" />
//         <label>Name</label>
//       </div>
//       <div className="input-container">
//         <input type='text' name="description" placeholder="" />
//         <label>Description</label>
//       </div>
//       <div className="input-container">
//         <input type="number" step="1" name="price" placeholder=""/>
//         <label>Price</label>
//       </div>
//       <div className="input-container">
//         <select name="category_id" id="categorySelect">{showCategories}</select>
//         {/* <input type="number" name="category_id" id="category_id" placeholder=""/> */}
//         {/* <label>Category</label> */}
//       </div>
//       <div className="fileInputContainer">
//         <label htmlFor="1" className="file-upload">Choose Image</label>
//         <p id="fileName">No file chosen</p>
//         <input type="file" id="1" className="imageInput" name="image" onChange={fileInputProduct} required />
//       </div>
//       <button type="submit">Add </button>
//     </form>
//     <form className='admin-form' id="adminForm" ref={adminForm} onSubmit={adminFormSubmit}>
//       <div className="input-container"><h4>Add Admin</h4></div>
//       <div className="input-container">
//         <input type="text" placeholder="" name="name"/>
//         <label htmlFor="name">Name</label>
//       </div>
//       <div className="input-container">
//         <input type="email" placeholder="" name="email"/>
//         <label htmlFor="email">Email</label>
//       </div>
//       <div className="input-container">
//         <input type="password" placeholder="" name="password" />
//         <label htmlFor="password">Password</label>
//       </div>
//       <button type="submit">Add</button>
//     </form>
//     <form className='admin-form' id="categoryForm" ref={categoryForm} onSubmit={categoryFormSubmit}>
//       <div className="input-container"><h4>Add Category</h4></div>
//       <div className="input-container">
//         <input type="text" placeholder="" name="name"/>
//         <label htmlFor="name">Name</label>
//       </div>
//       <div className="fileInputContainer">
//         <label htmlFor="2" className="file-upload">Choose Image</label>
//         <p id="fileName">No file chosen</p>
//         <input type="file" id="2" className="imageInput" name="image" onChange={fileInputCategory} required />
//       </div>
//       <button type="submit">Add</button>
//     </form>
//   </>
// );
// }
