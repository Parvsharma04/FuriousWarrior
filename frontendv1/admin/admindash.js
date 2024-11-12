// Sales Chart
var salesCtx = document.getElementById("salesChart").getContext("2d");
var salesChart = new Chart(salesCtx, {
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales",
        data: [12, 19, 3, 5, 2, 3],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

// Products Chart
var productsCtx = document.getElementById("productsChart").getContext("2d");
var productsChart = new Chart(productsCtx, {
  type: "doughnut",
  data: {
    labels: [
      "Cybersecurity Course",
      "Interview Preparation",
      "Career Counseling",
    ],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Top Products",
      },
    },
  },
});

const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebarClose = document.getElementById("sidebarClose");
const contentWrapper = document.querySelector(".content-wrapper");

function toggleSidebar() {
  sidebar.classList.toggle("show");
  contentWrapper.classList.toggle("sidebar-open");
}

sidebarToggle.addEventListener("click", toggleSidebar);
sidebarClose.addEventListener("click", () => {
  sidebar.classList.remove("show");
  contentWrapper.classList.remove("sidebar-open");
});
