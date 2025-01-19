import { data } from "../script.js";
export let cartItems = [
  {
    userId: 1,
    orderId: "ORDER-5263854",
    case: {
      model: "CoolerMaster MasterBox Q300L",
      price: "59.99",
    },
    cpu: {
      model: "AMD Ryzen 5 5600X",
      price: "199.99",
    },
    gpu: {
      model: "NVIDIA RTX 3060",
      price: "329.99",
    },
    hdd: {
      model: "Seagate Barracuda 2TB",
      price: "54.99",
    },
    motherboard: {
      model: "MSI MAG B550 TOMAHAWK",
      price: "179.99",
    },
    psu: {
      model: "Corsair RM750x",
      price: "129.99",
    },
    ram: {
      model: "Corsair Vengeance LPX 16GB 3200MHz",
      price: "84.99",
    },
    ssd: {
      model: "Samsung 970 EVO Plus 1TB",
      price: "119.99",
    },
    price: 1158.93,
  },
  {
    userId: 1,
    orderId: "ORDER-4398251",
    case: {
      model: "NZXT H510",
      price: "79.99",
    },
    cpu: {
      model: "Intel Core i7-12700K",
      price: "399.99",
    },
    gpu: {
      model: "AMD RX 6700 XT",
      price: "479.99",
    },
    hdd: {
      model: "Western Digital Blue 1TB",
      price: "39.99",
    },
    motherboard: {
      model: "Gigabyte AORUS X570",
      price: "299.99",
    },
    psu: {
      model: "EVGA SuperNOVA 750 G5",
      price: "139.99",
    },
    ram: {
      model: "G.Skill Trident Z Royal 32GB 3600MHz",
      price: "199.99",
    },
    ssd: {
      model: "Crucial P5 Plus 2TB",
      price: "249.99",
    },
    price: 1889.93,
  },
];
function itemsDisplay() {
  if (!data) {
    cartItems = [];
    console.log(cartItems);
  }
  const itemsList = document.getElementById("cartItems");
  if (itemsList) {
    itemsList.innerHTML = "";
    if (cartItems.length === 0) {
      itemsList.innerHTML = `<h1 class="text-center text-gray-400 font-bold text-3xl">Your cart is empty</h1>`;
    }
  }
  cartItems.forEach((item, index) => {
    const element = document.createElement("div");
    element.id = `item-${index + 1}`;
    element.setAttribute("data-key", index + 1);
    element.classList.add("flex", "justify-between", "items-center", "text-gray-300", "bg-gray-500", "rounded-md", "px-4");
    element.innerHTML = `<div class="flex gap-2.5 items-center"><img src="./components/cases/${item.case.model.substring(
      item.case.model.indexOf(" ") + 1
    )}.png" class="w-20 h-auto" />
        <span id="itemTitle">${item.cpu.model} - ${item.gpu.model} - ${item.ram.model} - ${item.ssd.model}</span></div>
        <div class="flex gap-2 items-center"><span id="itemPrice">${Math.floor(item.price * 10)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, " ")} DH</span>
        <button id="deleteItem"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg></button></div>`;
    itemsList.appendChild(element);
  });
  const price = document.getElementById("price");
  if (price) {
    price.innerText = `${(Math.floor(cartItems.reduce((total, order) => total + order.price, 0)) * 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} DH`;
  }
  const total = document.getElementById("total");
  if (total) {
    total.innerText = `${(Math.floor(cartItems.reduce((total, order) => total + order.price, 0)) * 10 + 300)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")} DH`;
  }
}
document.addEventListener("DOMContentLoaded", function () {
  itemsDisplay();
  document.addEventListener("click", (event) => {
    const deleteButton = event.target.closest("button"); // Ensure the clicked element is a deleteButton
    if (deleteButton) {
      const parent = deleteButton.closest("div[data-key]"); // Find the closest parent with a `data-key` attribute
      if (parent) {
        console.log(parent.getAttribute("data-key"));
        cartItems.splice(parent.getAttribute("data-key") - 1, 1);
        itemsDisplay();
      }
    }
  });
});
