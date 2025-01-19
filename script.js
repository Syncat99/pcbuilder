import { openLoginModal, openRegistrationModal } from "./scripts/navbar.js";
let configurations = [];
export let data = null;

export function checkCookie(cookieName) {
  const name = cookieName + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(name) === 0) {
      return true;
    }
  }
  return false;
}

export function deleteCookie() {
  document.cookie = "userData=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
}

export function getCookie() {
  const value = document.cookie;
  const parts = value.split("userData=");

  if (parts.length <= 1) {
    return false;
  }
  try {
    return JSON.parse(decodeURIComponent(parts.pop()));
  } catch (error) {
    return false;
  }
}
export function checkAuth() {
  const cookie = getCookie();
  if (!cookie) {
    console.log(cookie);
    data = null;
    return false;
  }
  if (cookie) {
    const cookieData = cookie;
    const expirationDate = new Date(cookieData.expiration); // Parse the stored expiration date
    if (expirationDate > new Date()) {
      data = cookie.data;
      return cookie;
    } else {
      deleteCookie();
      return false;
    }
  }
}

export function updateButtonText() {
  const button = document.getElementById("loginButton");
  if (checkAuth()) {
    button.removeEventListener("click", openLoginModal);

    if (data.role === "admin") {
      profileDropdown.innerHTML = `<ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
              <li>
                <a href="/dashboard.html" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
              </li>
              <li>
                <a href="/settings.html" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
              </li>
              <li id="sign-out" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">Sign out</li>
            </ul>`;
    } else {
      profileDropdown.innerHTML = `<ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
              <li>
                <a href="/settings.html" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
              </li>
              <li id="sign-out" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">Sign out</li>
            </ul>`;
    }
    document.getElementById("sign-out").addEventListener("click", () => {
      deleteCookie();
      window.location.reload();
    });
    button.addEventListener("click", function () {
      profileDropdown.classList.toggle("hidden");
    });
    button.id = "profileButton";
    button.innerHTML = `${data.username} <svg class="-mr-1 size-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
        <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
      </svg>`;
  } else {
    button.id = "loginButton";
    button.textContent = "Login";
  }
}
const builderButton = document.getElementById("goToBuilder");
if (builderButton) {
  builderButton.addEventListener("click", () => {
    if (!checkAuth()) {
      openLoginModal();
      return;
    }
    window.location.href = "/builder.html";
  });
}

const goToShopButton = document.getElementById("goToShop");
if (goToShopButton) {
  goToShopButton.addEventListener("click", () => {
    window.location.href = "/shop.html";
  });
}

document.addEventListener("DOMContentLoaded", function () {
  fetch("./configurations.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load JSON");
      }
      return response.json();
    })
    .then((data) => {
      configurations = data;
      const buildsList = document.getElementById("prebuilt-list");
      configurations.forEach((item, index) => {
        const element = document.createElement("div");
        element.classList.add("m-0", "min-w-96", "scale-75", "bg-gray-200", "p-4", "items-center", "min-h-96", "flex", "flex-col", "bg-gray-200", "rounded-md");
        element.innerHTML = `
        <div class="flex p-4 w-full flex-col justify-center gap-2.5">
          <div class="flex max-h-44">
            <img class="w-44 h-auto" src="./components/cases/${item.case.model}.png"/>
            <div class="flex flex-col w-1/2">
              <img class="h-1/2 w-auto" src="./components/cpu/${item.cpu.brand}.png"/>
              <img class="h-1/2 w-auto" src="./components/gpu/${item.gpu.brand}.png"/>
            </div>
          </div>
          <div class="flex flex-col gap-2 p-4 bg-gray-300 rounded-md min-h-48 justify-between">
            <span class="font-medium">${item.cpu.brand} ${item.cpu.model}</span>
            <span class="font-medium">${item.gpu.brand} ${item.gpu.model}</span>
            <span class="font-medium">${item.ram.brand} ${item.ram.model}</span>
            <span class="font-medium">${item.motherboard.brand} ${item.motherboard.model}</span>
            
        </div>
        <div class="flex w-full justify-between items-center">
            <span class="font-bold">PRICE : ${Math.floor(
              Object.values(item).reduce((total, component) => {
                return total + (component.price || 0); // Add component price if it exists
              }, 0) * 10
            )
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ".")} DH</span>
            <button id="addToCart" class="self-end bg-indigo-400 rounded-lg p-3 w-fit font-bold text-gray-100">Add to cart</button>
          </div>`;
        buildsList.appendChild(element);
      });
    })
    .catch((error) => {});
});
