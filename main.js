import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc ,
  doc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
var uid = null;
const db = getFirestore(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    uid = user.uid;
    document.getElementById("user-email").innerHTML = user.email;
    document.getElementById("create-products").style.display = "block";
    document.getElementById("logout").textContent = "Logout";
  } else {
    document.getElementById("logout").textContent = "Log In"; 
  }
});

document.getElementById("logout").addEventListener("click", function () {
  signOut(auth)
    .then(() => {
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.log(error);
    });
});

document.getElementById("add-product").addEventListener("click", function (e) {
  e.preventDefault(); 
  
  const product_name = document.getElementById("product-name").value;
  const product_desc = document.getElementById("product-desc").value;
  const price = document.getElementById("price").value;
  const img = document.getElementById("product-img").value;
  const docRef = collection(db, "products");
  
  addDoc(docRef, {
    product_desc: product_desc,
    product_name: product_name,
    user_id: uid,
    added_at: new Date(),
    product_img: img,
    price: price,
  }).then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
    document.getElementById("product-name").value = "";
    document.getElementById("product-desc").value = "";
    document.getElementById("price").value = "";
    document.getElementById("product-img").value = ""; 
    renderProduct();
  }).catch((error) => {
    console.error("Error adding product: ", error);
  });
});



const renderProduct = async () => {
  const productTableBody = document.getElementById("product-table-body");
  productTableBody.innerHTML = "";

  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    querySnapshot.forEach((doc) => {
      const product = doc.data();
      const row = document.createElement("tr");
      row.innerHTML = `
  <td>${product.product_name}</td>
  <td>${product.product_desc}</td>
  <td>${product.price}</td>
  <td><img src="${product.product_img}" alt="Product Image" style="max-width: 100px;"></td>
  <td>
    ${uid === product.user_id ? 
      `<button class="delete-btn" data-product-id="${doc.id}">Delete</button>` : ""}
    ${uid === product.user_id ? 
      `<a href="update.html?id=${doc.id}"><button class="update-btn">Update</button></a>` : ""}
  </td>
`;
      productTableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

document.getElementById("product-table-body").addEventListener("click", async (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const productId = event.target.getAttribute("data-product-id");
    await deleteProduct(productId);
  }
});

async function deleteProduct(productId) {
  try {
    await deleteDoc(doc(db, "products", productId));
    console.log("Product deleted successfully!");
    renderProduct(); 
  } catch (error) {
    console.error("Error deleting product: ", error);
  }
}

renderProduct();
