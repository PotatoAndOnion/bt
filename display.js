import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import {getAuth, signOut, onAuthStateChanged,} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";


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
const db = getFirestore(app);
var uid = null;
const auth = getAuth();
const admin = "ducks@email.com"



onAuthStateChanged(auth, (user) => {
  if (user) {
    uid = user.uid;
    document.getElementById("user-email").innerHTML = user.email;
    document.getElementById("logout").textContent = "Logout";
    
    console.log(user.email);  
    if (user.email === "ducks@email.com") {
      document.getElementById("admin-link").style.display = "block";
    } else {
      document.getElementById("admin-link").style.display = "none";
    }
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




const renderProducts = async () => {
    const productContainer = document.getElementById("render-post");

    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        querySnapshot.forEach((doc) => {
            const product = doc.data();
            const productDiv = document.createElement("div");
            productDiv.className = "product";
            productDiv.innerHTML = `
                <h3>${product.product_name}</h3>
                <p>Description: ${product.product_desc}</p>
                <p>Price: ${product.price}</p>
                <img src="${product.product_img}" alt="Product Image">
            `;
            productContainer.appendChild(productDiv);
        });
    } catch (error) {
        console.error("Error fetching products:", error);
    }
};

renderProducts();