import { updateButtonText, checkAuth, data } from "../script.js";
import { cartItems } from "./cart.js";

const navbar = document.createElement("div");
const loginModal = document.createElement("div");
let openAuthModal;
document.addEventListener("DOMContentLoaded", function () {
  checkAuth();
  loginModal.classList.add("fixed", "inset-0", "bg-gray-500", "bg-opacity-70", "flex", "justify-center", "items-center", "flex-col", "hidden");
  navbar.classList.add("bg-gray-700");

  navbar.innerHTML = `<div class="m-auto max-w-7xl flex py-3 px-12 justify-between">
          <h1 class="text-white self-center font-bold text-3xl"><a href="/">PC Builder</a></h1>
          <div class="flex w-32 justify-between">
          <button id="cartButton" class="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            <span id="cartItemsCount" class="hidden absolute top-0 left-4 font-bold text-l text-gray-800 rounded-full	bg-gray-200 w-full h-auto"></span>
            </button>
          <div class="relative">
            <button
              id="loginButton"
              class="flex items-end gap-1 rounded-md py-2 border-solid border-gray-800 text-white bg-transparent text-xl"></button>
            <div
              id="profileDropdown"
              class="border-solid border border-white top-12 right-0 absolute z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-600"
            ></div>
          </div>
          </div>
        </div>`;
  document.body.insertBefore(navbar, document.body.firstChild);
  document.body.appendChild(loginModal);
  openAuthModal = document.getElementById("loginButton");
  openAuthModal.addEventListener("click", openLoginModal);
  if (cartItems.length > 0 && data) {
    document.getElementById("cartItemsCount").classList.remove("hidden");
    document.getElementById("cartItemsCount").innerText = cartItems.length;
  }

  document.getElementById("cartButton").addEventListener("click", () => {
    window.location.href = "/cart.html";
  });
});

// const loginModal = document.getElementById("login-modal");

async function login() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const users = await getUsers();
    if (!users) {
      window.alert("Invalid username or password");
    }
    const result = users.find((user) => user.username === username && user.password === password);

    if (result) {
      window.alert(result.username);
      const currentDate = new Date();
      currentDate.setHours(currentDate.getHours() + 24);
      const cookieValue = {
        data: result,
        expiration: currentDate.toUTCString(),
      };
      document.cookie = `userData=${JSON.stringify(cookieValue)}; expires=${new Date(new Date().setHours(new Date().getHours() + 24)).toUTCString()}; path=/`;
      window.location.reload();
    } else {
      window.alert("Invalid username or password");
    }
  } catch (error) {}
}

export function openLoginModal() {
  loginModal.classList.remove("hidden");
  loginModal.innerHTML = `<div id="login-form" class="bg-white p-6 rounded-lg shadow-lg w-1/5 flex flex-col gap-2 items-center">
        <h2 class="text-xl font-semibold mb-4 text-center text-gray-600 capitalize">login</h2>
        <input id="loginUsername" class="py-3 px-3 border border-gray-300 rounded-md outline-none w-full" placeholder="Username" />
        <input id="loginPassword" class="py-3 px-3 border border-gray-300 rounded-md outline-none w-full" type="password" placeholder="Password" />
        <div class="flex flex-row w-full gap-2">
        <button id="forgotPassword" class="text-gray-400 text-left w-full">forgot password ?</button>
        <button id="notmember" class="text-gray-400 text-right w-full">not a member ?</button>
        </div>
        <button id="login" class="border border-gray-200 rounded-md w-1/2 p-3 bg-gray-700 text-white">LOG IN</button>
      </div>`;
  loginModal.addEventListener("click", function (event) {
    if (event.target === loginModal) {
      loginModal.classList.add("hidden");
    }
  });

  document.getElementById("notmember").addEventListener("click", openRegistrationModal);
  document.getElementById("login").addEventListener("click", login);
}

export function openRegistrationModal() {
  loginModal.innerHTML = `<div id="register-form" class="bg-white p-6 rounded-lg shadow-lg w-1/5 flex flex-col gap-2 items-center">
        <h2 class="text-xl font-semibold mb-4 text-center text-gray-600 capitalize">Create an account</h2>
        <input class="py-3 px-3 border border-gray-300 rounded-md outline-none w-full" type="text" placeholder="Username" />
        <input class="py-3 px-3 border border-gray-300 rounded-md outline-none w-full" type="password" placeholder="Password" />
        <input class="py-3 px-3 border border-gray-300 rounded-md outline-none w-full" type="text" placeholder="Email" />
        <button id="switchToLogin" class="text-gray-400 text-left w-full">already a member ?</button>
        <button id="register" class="border border-gray-200 rounded-md w-1/2 p-4 bg-gray-700 text-white">REGISTER</button>
      </div>`;

  loginModal.addEventListener("click", function (event) {
    if (event.target === loginModal) {
      loginModal.classList.add("hidden");
    }
  });
  console.log(document.getElementById("switchToLogin").addEventListener("click", openLoginModal));
}

async function getUsers() {
  try {
    const response = await fetch("users.json");
    if (!response.ok) {
      throw new Error("no response");
    }
    return response.json();
  } catch (error) {}
}

document.addEventListener("DOMContentLoaded", function () {
  updateButtonText();
});
