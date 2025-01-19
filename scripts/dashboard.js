// import { Chart, registerables } from "chart.js";
// Chart.register(...registerables);

let users, orders;

window.deleteUser = (index, button) => {
  users.splice(index, 1);
  const row = button.closest("tr");
  row.remove();
};

function displayUsers() {
  fetch("./users.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("error");
      }
      return response.json();
    })
    .then((data) => {
      users = data;
      const dashboard = document.getElementById("dashContent");
      dashboard.innerHTML = "";
      const usersList = document.createElement("table");
      usersList.classList.add("w-full", "border-collapse");
      const head = document.createElement("thead");
      head.classList.add("border-b", "border-gray-300", "text-gray-300", "font-bold", "text-xl", "uppercase");
      head.innerHTML = `<tr>
        <th class="py-4 text-left">username#id</th>
        <th class="py-4 text-left">email</th>
        <th class="py-4 text-left">role</th>
        <th class="py-4 text-left">Joining Date</th>
        <th class="py-4 text-left">Action</th></tr>`;
      usersList.appendChild(head);
      const tbody = document.createElement("tbody");

      users.forEach((user, index) => {
        const element = document.createElement("tr");
        element.classList.add();
        element.innerHTML = `
        <td class="py-4 font-semibold text-gray-600">${user.username}#${user.id}</td>
        <td class="py-4 font-semibold text-gray-600">${user.email}</td>
        <td class="py-4 font-semibold text-gray-600">${user.role}</td>
        <td class="py-4 font-semibold text-gray-600">${user.joiningDate}</td>
        <td class="py-4 font-semibold text-gray-600"><button onclick="deleteUser(${index}, this)"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg></button></td>`;
        tbody.appendChild(element);
      });
      usersList.appendChild(tbody);
      dashboard.appendChild(usersList);
    })
    .catch((error) => {});
}
function displaySales() {
  fetch("./orders.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("error");
      }
      return response.json();
    })
    .then((data) => {
      const dashboard = document.getElementById("dashContent");
      dashboard.innerHTML = "";
      const chartContainer = document.createElement("div");
      chartContainer.classList.add("w-4/5", "my-0", "mx-auto");
      const canvas = document.createElement("canvas");
      canvas.id = "salesChart";
      chartContainer.appendChild(canvas);
      dashboard.appendChild(chartContainer);

      const salesByMonth = Array(12).fill(0);
      data.forEach((order) => {
        const month = new Date(order.date).getMonth();
        salesByMonth[month] += 1;
      });

      const ctx = canvas.getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
          datasets: [
            {
              label: "Number of Sales",
              data: salesByMonth,
              backgroundColor: "rgba(253, 51, 0, 0.2)",
              borderColor: "rgb(255, 0, 0)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Sales Count",
              },
            },
            x: {
              title: {
                display: true,
                text: "Months",
              },
            },
          },
        },
      });
    })
    .catch((error) => {
      console.error("Failed to fetch orders:", error);
    });
}
function overview() {
  Promise.all([fetch("./orders.json"), fetch("./users.json")])
    .then(([ordersResponse, usersResponse]) => {
      if (!ordersResponse.ok || !usersResponse.ok) {
        throw new Error("Error fetching data");
      }
      return Promise.all([ordersResponse.json(), usersResponse.json()]);
    })
    .then(([ordersData, usersData]) => {
      const dashboard = document.getElementById("dashContent");
      dashboard.innerHTML = "";

      // Create chart container
      const chartContainer = document.createElement("div");
      chartContainer.style.width = "80%";
      chartContainer.style.margin = "0 auto";

      // Add canvas for the chart
      const canvas = document.createElement("canvas");
      canvas.id = "usersAndSalesChart";
      chartContainer.appendChild(canvas);

      dashboard.appendChild(chartContainer);

      // Initialize arrays to store sales and user counts by month
      const salesByMonth = Array(12).fill(0);
      const usersByMonth = Array(12).fill(0);

      // Calculate sales by month
      ordersData.forEach((order) => {
        const month = order.date ? new Date(order.date).getMonth() : null;
        if (month !== null) {
          salesByMonth[month] += 1;
        }
      });

      // Calculate user joins by month
      usersData.forEach((user) => {
        const month = user.joiningDate ? new Date(user.joiningDate).getMonth() : null;
        if (month !== null) {
          usersByMonth[month] += 1;
        }
      });

      console.log("Sales by Month:", salesByMonth);
      console.log("Users by Month:", usersByMonth);

      const ctx = canvas.getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
          datasets: [
            {
              label: "Total Sales",
              data: salesByMonth,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
            {
              label: "Total Users Joined",
              data: usersByMonth,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Count",
              },
            },
            x: {
              title: {
                display: true,
                text: "Months",
              },
            },
          },
        },
      });
    })
    .catch((error) => {
      console.error("Failed to fetch data:", error);
    });
}
document.addEventListener("DOMContentLoaded", () => {
  const usersButton = document.getElementById("usersButton");
  const salesButton = document.getElementById("salesButton");
  const overviewButton = document.getElementById("overviewButton");
  usersButton.addEventListener("click", () => {
    displayUsers();
  });
  salesButton.addEventListener("click", () => {
    displaySales();
  });
  overviewButton.addEventListener("click", () => {
    overview();
  });
});
