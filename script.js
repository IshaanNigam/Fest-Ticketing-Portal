/* Sitewide Festival Data */

const artistsList = [
    { name: "The Local Train", genre: "Hindi Rock", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNSW4Nevx5Llg-wmnzY1pXNCvsqtVi7-JYnYSxXOxWqBD6dwUkKN0R9421OYlLwZKrZQKbYqA0brrsSW8BYYF4dFc5cLS6kV8DsZUsZOo&s=10" },
    { name: "Nucleya", genre: "Bass / EDM", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS47kOo3vW_9VBzQp4ZUflZ1Z0XOt7inFpiYo0OLSf-Rw&s" },
    { name: "Arijit Singh", genre: "Bollywood Pop", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8sOjybrQUDbJdTeyMwLen0BF6w7jy6jZzAMz27GeidQ&s" },
    { name: "Divine", genre: "Gully Hip-Hop", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAi15w2cT0VjYmUjwhHtXpUDyacWCp7EDHg1nV7fsK-A&s=10" }
];

const foodMenu = [
    { name: "Burger Combo", price: 180, desc: "Crispy patty, with lettuce and cheese alongside fries & drink" },
    { name: "Pizza Slice", price: 150, desc: "Cheesy wood-fire cooked slice" },
    { name: "Loaded Nachos", price: 120, desc: "Jalapeño salsa & warm cheese" },
    { name: "Cold Mojito", price: 80, desc: "Chilled mint refresher" }
];

const gamesList = [
    { name: "Laser Tag Arena", price: 200, desc: "15-min tactical team battle" },
    { name: "VR Simulator", price: 200, desc: "High immersion VR coaster" },
    { name: "Escape Room", price: 200, desc: "Solve puzzles & break out" },
    { name: "Arcade Alley", price: 180, desc: "1-Hour retro arcade pass" }
];

const passTiers = [
    { name: "Bronze Pass", price: 499, perks: "General Entry + 1 Free Drink" },
    { name: "Silver Pass", price: 899, perks: "VIP Stage Access + Fast-Track Entry" },
    { name: "Gold Pass", price: 1499, perks: "All-Access + Merch Bag + Lounge Access" }
];


/*  USER SELECTIONS */
let currentPhotoUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"; // default placeholder
let selectedArtists = [];
let selectedFood = {};
let selectedGames = [];
let chosenPass = passTiers[1]; // default to Silver Pass


/* RUN ON STARTUP */
document.addEventListener("DOMContentLoaded", function () {
    loadSavedTheme();
    renderArtists();
    renderFood();
    renderGames();
    renderPasses();
    loadSavedPasses();
});


/* ============================================================
     FILE UPLOAD FROM PC / PHONE (FileReader)
   ============================================================ */
function handleFileUpload(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            currentPhotoUrl = e.target.result;
            document.getElementById("avatar-preview").src = currentPhotoUrl;
        };
        reader.readAsDataURL(file);
    }
}

function switchTab(tabName) {
    // Hide all sections
    document.querySelectorAll(".view-section").forEach(view => view.classList.remove("active"));
    document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));

    // Show selected section
    document.getElementById("view-" + tabName).classList.add("active");
    document.getElementById("tab-" + tabName).classList.add("active");

    if (tabName === "passes") {
        loadSavedPasses();
    }
}

function startGenerator() {
    switchTab("generator");
    goToStep(1);
}

function goToStep(stepNumber) {
    // Name and Roll should not be empty
    if (stepNumber > 1) {
        const username = document.getElementById("user-name").value.trim();
        const userroll = document.getElementById("user-roll").value.trim();
        if (!username || !userroll) {
            alert("Please fill in your Name and Roll Number first!");
            return;
        }
    }

    // Update top progress indicators (1 to 6)
    for (let i = 1; i <= 6; i++) {
        const badge = document.getElementById("step-badge-" + i);
        if (badge) {
            badge.classList.toggle("active", i === stepNumber);
        }
    }

    // Show the correct step panel
    document.querySelectorAll(".wizard-step").forEach(step => step.classList.remove("active"));
    document.getElementById("step-" + stepNumber).classList.add("active");

    // If arriving at step 6, compute total bill & render summary
    if (stepNumber === 6) {
        updateReview();
    }
}

/* ARTIST SELECTION */
function renderArtists() {
    const artistContainer = document.getElementById("artists-container");
    let html = "";

    artistsList.forEach(artist => {
        const isSelected = selectedArtists.includes(artist.name);
        html += `
      <div class="selection-card ${isSelected ? 'selected' : ''}" onclick="toggleArtist('${artist.name}')">
        <img src="${artist.img}" alt="${artist.name}">
        <span class="card-tag">${artist.genre}</span>
        <h4>${artist.name}</h4>
        <p class="card-desc">Scheduled performance and Merchs</p>
        <button class="btn btn-outline" style="width: 100%;">
          ${isSelected ? '✓ Selected' : '+ Select Artist'}
        </button>
      </div>
    `;
    });

    artistContainer.innerHTML = html;
}

function toggleArtist(artistName) {
    const index = selectedArtists.indexOf(artistName);
    if (index === -1) {
        selectedArtists.push(artistName);
    } else {
        selectedArtists.splice(index, 1);
    }

    // Re-render to show changes instantly
    renderArtists();
}


/* FOOD QUANTITY SELECTION */
function renderFood() {
    const foodContainer = document.getElementById("food-container");
    let html = "";

    foodMenu.forEach(item => {
        const qty = selectedFood[item.name] || 0;
        html += `
      <div class="selection-card ${qty > 0 ? 'selected' : ''}">
        <h4>${item.name}</h4>
        <p class="card-desc">${item.desc}</p>
        <div class="card-price">₹${item.price}</div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeFoodQty('${item.name}', -1)">-</button>
          <span class="qty-display">${qty}</span>
          <button class="qty-btn" onclick="changeFoodQty('${item.name}', 1)">+</button>
        </div>
      </div>
    `;
    });

    foodContainer.innerHTML = html;
}

function changeFoodQty(foodName, amount) {
    let count = selectedFood[foodName] || 0;
    count += amount;

    if (count <= 0) {
        delete selectedFood[foodName];
    } else {
        selectedFood[foodName] = count;
    }
    renderFood();
}


/*GAMES & ACTIVITIES SELECTION */
function renderGames() {
    const container = document.getElementById("games-container");
    let html = "";

    gamesList.forEach(game => {
        const isSelected = selectedGames.includes(game.name);
        html += `
      <div class="selection-card ${isSelected ? 'selected' : ''}" onclick="toggleGame('${game.name}')">
        <h4>${game.name}</h4>
        <p class="card-desc">${game.desc}</p>
        <div class="card-price">₹${game.price}</div>
        <button class="btn btn-outline" style="width: 100%; margin-top: 0.5rem;">
          ${isSelected ? '✓ Added' : '+ Add Activity'}
        </button>
      </div>
    `;
    });

    container.innerHTML = html;
}

function toggleGame(gameName) {
    const index = selectedGames.indexOf(gameName);
    if (index === -1) {
        selectedGames.push(gameName);
    } else {
        selectedGames.splice(index, 1);
    }
    renderGames();
}


/* ============================================================
    PASS CATEGORIES
   ============================================================ */
function renderPasses() {
    const container = document.getElementById("passes-tier-container");
    let html = "";

    passTiers.forEach(pass => {
        const isSelected = chosenPass.name === pass.name;
        html += `
      <div class="selection-card ${isSelected ? 'selected' : ''}" onclick="choosePass('${pass.name}')">
        <span class="card-tag">Tier Pass</span>
        <h3>${pass.name}</h3>
        <p class="card-desc">${pass.perks}</p>
        <div class="card-price">₹${pass.price}</div>
        <button class="btn btn-outline" style="width: 100%; margin-top: 0.5rem;">
          ${isSelected ? '● Selected Pass' : 'Choose This Pass'}
        </button>
      </div>
    `;
    });

    container.innerHTML = html;
}

function choosePass(passName) {
    chosenPass = passTiers.find(p => p.name === passName);
    renderPasses();
}


/* ============================================================
   PRICE CALCULATION & REVIEW SUMMARY (Step 6)
   ============================================================ */
function calculateTotals() {
    const passPrice = chosenPass.price;

    // Calculate Food Subtotal
    let foodTotal = 0;
    foodMenu.forEach(item => {
        if (selectedFood[item.name]) {
            foodTotal += item.price * selectedFood[item.name];
        }
    });

    // Calculate Games Subtotal
    let gamesTotal = 0;
    gamesList.forEach(game => {
        if (selectedGames.includes(game.name)) {
            gamesTotal += game.price;
        }
    });

    const grandTotal = passPrice + foodTotal + gamesTotal;
    return { passPrice, foodTotal, gamesTotal, grandTotal };
}

function updateReview() {
    const name = document.getElementById("user-name").value;
    const roll = document.getElementById("user-roll").value;
    const totals = calculateTotals();

    let foodListText = [];
    for (const [foodName, qty] of Object.entries(selectedFood)) {
        foodListText.push(`${foodName} (x${qty})`);
    }

    // Update Review Summary box
    document.getElementById("review-content").innerHTML = `
    <div class="review-item"><span class="review-label">Name:</span> <strong>${name}</strong></div>
    <div class="review-item"><span class="review-label">Roll Number:</span> <strong>${roll}</strong></div>
    <div class="review-item"><span class="review-label">Pass Category:</span> <strong>${chosenPass.name}</strong></div>
    <div class="review-item"><span class="review-label">Artists:</span> <span>${selectedArtists.join(", ") || "None"}</span></div>
    <div class="review-item"><span class="review-label">Food:</span> <span>${foodListText.join(", ") || "None"}</span></div>
    <div class="review-item"><span class="review-label">Activities:</span> <span>${selectedGames.join(", ") || "None"}</span></div>
  `;

    document.getElementById("price-breakdown-content").innerHTML = `
    <h4>Price Breakdown</h4>
    <div class="price-row">
      <span>${chosenPass.name}</span>
      <span>₹${totals.passPrice}</span>
    </div>
    <div class="price-row">
      <span>Food Pre-orders</span>
      <span>₹${totals.foodTotal}</span>
    </div>
    <div class="price-row">
      <span>Games & Activities</span>
      <span>₹${totals.gamesTotal}</span>
    </div>
    <div class="price-row total">
      <span>Final Total</span>
      <span>₹${totals.grandTotal}</span>
    </div>
  `;
}


/*GENERATE TICKET & LOCALSTORAGE ARCHIVE*/
function generateTicket() {
    const name = document.getElementById("user-name").value;
    const roll = document.getElementById("user-roll").value;
    const totals = calculateTotals();
    const ticketId = "FEST26-" + Math.floor(100000 + Math.random() * 900000);

    // Format lists for the pass
    let foodText = [];
    for (const [item, qty] of Object.entries(selectedFood)) {
        foodText.push(`${item} (x${qty})`);
    }

    document.getElementById("ticket-pass-id").innerText = "ID: #" + ticketId;
    document.getElementById("ticket-tier-badge").innerText = chosenPass.name.toUpperCase();
    document.getElementById("ticket-photo").src = currentPhotoUrl;
    document.getElementById("ticket-name").innerText = name;
    document.getElementById("ticket-roll").innerText = "Roll No: " + roll;
    document.getElementById("ticket-artists").innerText = selectedArtists.join(", ") || "General Admission";
    document.getElementById("ticket-perks").innerText = chosenPass.perks;
    document.getElementById("ticket-food").innerText = foodText.join(", ") || "None";
    document.getElementById("ticket-games").innerText = selectedGames.join(", ") || "None";
    document.getElementById("ticket-total-price").innerText = "₹" + totals.grandTotal;

    // Show ticket screen
    document.querySelectorAll(".wizard-step").forEach(step => step.classList.remove("active"));
    document.getElementById("step-ticket").classList.add("active");

    // Save to localStorage
    const newPass = {
        id: ticketId,
        name: name,
        roll: roll,
        photo: currentPhotoUrl,
        tier: chosenPass.name,
        total: totals.grandTotal,
        date: new Date().toLocaleDateString()
    };

    const currentSaved = JSON.parse(localStorage.getItem("fest_tickets") || "[]");
    currentSaved.unshift(newPass);
    localStorage.setItem("fest_tickets", JSON.stringify(currentSaved));
}

function printTicket() {
    window.print();
}

function resetWizard() {
    document.getElementById("user-name").value = "";
    document.getElementById("user-roll").value = "";
    const photoInput = document.getElementById("user-photo");
    if (photoInput) photoInput.value = "";

    currentPhotoUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200";
    document.getElementById("avatar-preview").src = currentPhotoUrl;

    selectedArtists = [];
    selectedFood = {};
    selectedGames = [];
    chosenPass = passTiers[1];

    renderArtists();
    renderFood();
    renderGames();
    renderPasses();
    goToStep(1);
}


/* ============================================================
    MY PASSES TAB (Load passes from localStorage)
   ============================================================ */
function loadSavedPasses() {
    const container = document.getElementById("saved-passes-list");
    const passes = JSON.parse(localStorage.getItem("fest_tickets") || "[]");

    if (passes.length === 0) {
        container.innerHTML = `<div class="empty-state"><p>No tickets generated yet.</p></div>`;
        return;
    }

    let html = "";
    passes.forEach(pass => {
        html += `
      <div class="saved-pass-card">
        <div class="saved-pass-top">
          <img src="${pass.photo}" alt="User">
          <div>
            <h4>${pass.name}</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted);">${pass.roll}</p>
            <span class="badge" style="font-size: 0.7rem;">${pass.tier}</span>
          </div>
        </div>
        <p style="font-size: 0.9rem; margin-bottom: 0.35rem;"><strong>ID:</strong> #${pass.id}</p>
        <p style="font-size: 0.9rem; margin-bottom: 0.35rem;"><strong>Issued:</strong> ${pass.date}</p>
        <p style="font-size: 1.1rem; font-weight: 700; color: var(--primary);">₹${pass.total}</p>
        <button class="btn btn-secondary" style="margin-top: 1rem; width: 100%; color: #ef4444;" onclick="deletePass('${pass.id}')">
          Delete Pass
        </button>
      </div>
    `;
    });

    container.innerHTML = html;
}

function deletePass(passId) {
    let passes = JSON.parse(localStorage.getItem("fest_tickets") || "[]");
    passes = passes.filter(p => p.id !== passId);
    localStorage.setItem("fest_tickets", JSON.stringify(passes));
    loadSavedPasses();
}


/* Theme toggle*/
function loadSavedTheme() {
    const saved = localStorage.getItem("fest_theme");
    const btn = document.getElementById("theme-toggle");
    if (saved === "dark") {
        document.body.classList.add("dark-mode");
        if (btn) btn.innerText = "☀️";
    }
}

function toggleDarkMode() {
    const isDark = document.body.classList.toggle("dark-mode");
    const btn = document.getElementById("theme-toggle");
    btn.innerText = isDark ? "☀️" : "🌙";
    localStorage.setItem("fest_theme", isDark ? "dark" : "light");
}