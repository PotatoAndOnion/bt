import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDlG6p7VCEP6Q3XI8J06Whk7ajQChAUUPU",
  authDomain: "a-project-1c132.firebaseapp.com",
  projectId: "a-project-1c132",
  storageBucket: "a-project-1c132.appspot.com",
  messagingSenderId: "171458035988",
  appId: "1:171458035988:web:bc81149cd135b5ebcd8201",
  measurementId: "G-17SP4V15VV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
let uid = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    uid = user.uid;
    document.getElementById("user-email").innerHTML = user.email;
    document.getElementById("create-product-place").style.display = "block";
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

const search = window.location.search;
const params = new URLSearchParams(search);
const id = params.get("id");

const getProduct = async () => {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const product = docSnap.data();
      document.getElementById("product-name").value = product.product_name;
      document.getElementById("product-desc").value = product.product_desc;
      document.getElementById("product-img").value = product.product_img;
      document.getElementById("price").value = product.price;
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error getting product:", error);
  }
};

getProduct();

document.getElementById("update-product").addEventListener("click", function (e) {
  e.preventDefault();
  const product_name = document.getElementById("product-name").value;
  const product_desc = document.getElementById("product-desc").value;
  const product_img = document.getElementById("product-img").value;
  const price = document.getElementById("price").value;

  const docRef = doc(db, "products", id);
  updateDoc(docRef, {
    product_name: product_name,
    product_desc: product_desc,
    product_img: product_img,
    price: price,
    updated_at: new Date()
  })
    .then(() => {
      console.log("Product successfully updated!");
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Error updating product:", error);
    });
});