import { db } from "./firebase-config.js";
import {
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

document.addEventListener("DOMContentLoaded", () => {
  const searchAffiliateBtn = document.getElementById("searchAffiliateBtn");
  if (searchAffiliateBtn) {
    searchAffiliateBtn.addEventListener("click", searchAffiliate);
  }
});

function searchAffiliate() {
  const affiliateNameInput = document.getElementById("affiliateNameInput");
  const nickname = affiliateNameInput.value.trim();
  if (!nickname) {
    alert("Please enter an affiliate name.");
    return;
  }
  loadAffiliateData(nickname);
}

function loadAffiliateData(nickname) {
  const ordersRef = ref(db, "orders");

  onValue(
    ordersRef,
    (snapshot) => {
      const orders = snapshot.val() || {};
      const searchResultsDiv = document.getElementById(
        "affiliateSearchResults"
      );
      searchResultsDiv.innerHTML = ""; // Clear previous results

      let totalEarnings = 0;
      const filteredOrders = Object.values(orders).filter(
        (order) => order.affiliate === nickname && order.status === "completed"
      );

      if (filteredOrders.length === 0) {
        searchResultsDiv.innerHTML =
          "<p>No completed sales found for this affiliate.</p>";
        return;
      }

      const earningsList = document.createElement("ul");
      earningsList.style.listStyleType = "none";
      earningsList.style.padding = "0";

      filteredOrders.forEach((order) => {
        const earnings = order.finalPrice * 0.1;
        totalEarnings += earnings;

        const orderBox = document.createElement("div");
        orderBox.className = "order-box";
        orderBox.innerHTML = `
        <p><strong>Player:</strong> ${order.player}</p>
        <p><strong>Mission:</strong> ${order.mission}</p>
        <p><strong>Sale Amount:</strong> ${order.finalPrice.toLocaleString()}</p>
        <p><strong>Earning:</strong> ${earnings.toLocaleString()} points</p>
        <p><strong>Date:</strong> ${new Date(
          order.timestamp
        ).toLocaleDateString()}</p>
      `;
        earningsList.appendChild(orderBox);
      });

      const totalEarningsDiv = document.createElement("div");
      totalEarningsDiv.style.textAlign = "center";
      totalEarningsDiv.style.fontSize = "1.2em";
      totalEarningsDiv.style.marginTop = "20px";
      totalEarningsDiv.innerHTML = `Total Earnings: <strong>${totalEarnings.toLocaleString()}</strong> points`;

      searchResultsDiv.appendChild(totalEarningsDiv);
      searchResultsDiv.appendChild(earningsList);
    },
    { onlyOnce: true }
  );
}
