import { checkAuth } from "../script.js";
import { openLoginModal } from "./navbar.js";
import { cartItems } from "./cart.js";
import { data as userData } from "../script.js";
let count = 1;
let config = {
  userId: "",
  orderId: "",
  case: "",
  cpu: "",
  gpu: "",
  psu: "",
  motherboard: "",
  ram: "",
  ssd: "",
  hdd: "",
  price: 0,
};
function updateItemsCount() {
  if (cartItems.length > 0) {
    document.getElementById("cartItemsCount").classList.remove("hidden");
    document.getElementById("cartItemsCount").innerText = cartItems.length;
  }
}
document.addEventListener("DOMContentLoaded", function () {
  const price = document.getElementById("totalPrice");

  document.addEventListener("click", (event) => {
    const dropdown = event.target.closest("[data-dropdown]");
    if (dropdown) {
      const dropdownTarget = dropdown.getAttribute("data-dropdown");
      const dropdownElement = document.getElementById(`${dropdownTarget}-items`);
      document.querySelectorAll("[id$='-items']").forEach((dropElement) => {
        if (dropElement !== dropdownElement) {
          dropElement.classList.add("hidden");
        }
      });
      if (dropdownElement) {
        dropdownElement.classList.toggle("hidden");
      }
    }
  });

  fetch("../components.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load JSON");
      }
      return response.json();
    })
    .then((data) => {
      const componentTypes = ["cases", "cpus", "gpus", "psus", "motherboards", "rams", "ssds", "hdds"];
      componentTypes.forEach((type) => {
        const parentList = document.getElementById(type);
        if (!parentList) return;

        const container = document.createElement("div");
        container.id = `${type}-items`;
        container.classList.add("hidden");

        data[type].forEach((item, index) => {
          const unitType = type.slice(0, -1);
          const unit = document.createElement("div");
          unit.id = `${unitType}-${index}`;
          unit.className = "p-2 border-b border-gray-400 flex justify-between";

          unit.innerHTML = `
            <div class="flex gap-2">
              <input type="radio" name="${unitType}" value="${item.brand} ${item.model}" data-price="${item.price}" class="component-radio">
              <span class="font-bold">${item.brand} ${item.model}</span>
            </div>
            <span id="componentPrice" class="self-end">${Math.floor(item.price) * 10} DH</span>
          `;

          container.appendChild(unit);
        });

        parentList.appendChild(container);
      });

      document.addEventListener("change", (event) => {
        if (event.target.classList.contains("component-radio")) {
          config[event.target.name] = {
            model: event.target.value,
            price: event.target.getAttribute("data-price"),
          };
          document.querySelectorAll("#chosenComponents > div").forEach((childDiv) => {
            if (childDiv.querySelector("span:nth-of-type(2)")) {
              const value = config[childDiv.querySelector("span:nth-of-type(2)").id.replace("chosen", "").toLowerCase()];
              if (value !== undefined && value !== null && value.model) {
                childDiv.querySelector("span:nth-of-type(2)").innerText = value.model;
              }
            }
          });
          let totalPrice =
            Math.floor(
              Object.values(config).reduce(
                (total, component) => (component && typeof component === "object" && component.price ? total + parseFloat(component.price) : total),
                0
              )
            ) * 10;
          price.innerText = `${totalPrice} DH`;
          config.price = totalPrice;
          config.userId = userData.id;
          console.log(config);
        }
      });
      const decrementCount = document.getElementById("decrementCount");
      if (decrementCount) {
        decrementCount.addEventListener("click", () => {
          if (count > 1) --count;
          else return;
          document.getElementById("buildCount").innerText = count;
        });
      }
      const incrementCount = document.getElementById("incrementCount");
      if (incrementCount) {
        incrementCount.addEventListener("click", () => {
          ++count;
          document.getElementById("buildCount").innerText = count;
        });
      }
      const buildCount = document.getElementById("buildCount");
      if (buildCount) {
        buildCount.innerText = count;
      }
      const addToCart = document.getElementById("addToCart");
      config.orderId = `ORDER-${Date.now().toString(36)}`;
      if (addToCart) {
        addToCart.addEventListener("click", () => {
          const isConfigValid = Object.entries(config).every(([key, value]) => {
            if (key === "hdd") return true;
            return value !== "";
          });
          if (isConfigValid) {
            console.log("test");
            for (let i = 0; i < count; i++) {
              cartItems.push({ ...config });
            }
            updateItemsCount();
            console.log(cartItems);
          }
        });
      }
    })
    .catch((error) => {
      console.error("Error loading components:", error);
    });
});
