let userBalance = 0.00;

const gameNames = [
    "Aviator", "JetX", "Chicken Road", "Roulette", "Avai Master", "Red Hot", "Lucky Crash", "Rocket", 
    "Chicken vs Zombie", "Buffalo", "Keno", "Rabbit Wild", "Fish Golden Fate", "Book of Dead", "Slots", 
    "3 Fortune", "777 Slots", "God of Olympus", "Avitor Red", 
    ...Array.from({length: 61}, (_, i) => `YAYA Game ${i + 20}`)
];

window.onload = function() {
    loadGames();
    loadScrollingGames();
    startBannerSlider();
};

function loadGames() {
    const grid = document.getElementById('gamesGrid');
    grid.innerHTML = '';
    
    gameNames.forEach((name, index) => {
        let imgIdx = (index < 19) ? (index + 1) : ((index % 20) + 1);
        let card = document.createElement('div');
        card.className = 'game-card';
        card.onclick = () => openGame(name);
        card.innerHTML = `
            <img src="game${imgIdx}.jpg" alt="${name}" onerror="this.src='game1.jpg'">
            <p>${name}</p>
        `;
        grid.appendChild(card);
    });
}

function loadScrollingGames() {
    const scrollBar = document.getElementById('scrollingGames');
    scrollBar.innerHTML = '';
    for(let i=0; i<10; i++) {
        let item = document.createElement('div');
        item.className = 'scroll-item';
        item.onclick = () => openGame(gameNames[i]);
        item.innerHTML = `
            <img src="game${i+1}.jpg" alt="Game" onerror="this.src='game1.jpg'">
            <p>${gameNames[i]}</p>
        `;
        scrollBar.appendChild(item);
    }
}

let currentSlide = 0;
function startBannerSlider() {
    const slides = document.querySelectorAll('.banner-slider .slide');
    if(slides.length === 0) return;
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 3500);
}

function openGame(gameName) {
    document.getElementById('activeGameTitle').innerText = gameName;
    document.getElementById('gameMessage').innerText = "በቂ ሂሳብ የሎትም! (Insufficient Balance)";
    openModal('gameModal');
}

function filterGames() {
    let input = document.getElementById('gameSearch').value.toLowerCase();
    let cards = document.querySelectorAll('.game-card');
    cards.forEach(card => {
        let title = card.querySelector('p').innerText.toLowerCase();
        card.style.display = title.includes(input) ? 'block' : 'none';
    });
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active-section'));
    document.querySelectorAll('.bottom-nav-bar button').forEach(btn => btn.classList.remove('active-tab'));
    
    let bannerSec = document.getElementById('mainBannerSection');
    let scrollSec = document.getElementById('mainScrollSection');
    
    if(tabId === 'depositTab') {
        bannerSec.style.display = 'none';
        scrollSec.style.display = 'none';
    } else {
        bannerSec.style.display = 'block';
        scrollSec.style.display = 'block';
    }

    document.getElementById(tabId).classList.add('active-section');
    
    if(tabId === 'gamesTab') document.getElementById('tabBtnGames').classList.add('active-tab');
    if(tabId === 'depositTab') document.getElementById('tabBtnDeposit').classList.add('active-tab');
    if(tabId === 'kenoTab') document.getElementById('tabBtnKeno').classList.add('active-tab');
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function toggleProfileMenu() {
    let menu = document.getElementById('profileDropdown');
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}

function registerUser() {
    let phone = document.getElementById('regPhone').value;
    if(!phone) { alert("እባክዎ ስልክ ቁጥር ያስገቡ"); return; }
    alert("በሰላም ተመዝግበዋል!");
    closeModal('registerModal');
    loginSuccess(phone);
}

function loginUser() {
    let phone = document.
    getElementById('loginPhone').value;
    if(!phone) { alert("እባክዎ ስልክ ቁጥር ያስገቡ"); return; }
    alert("በሰላም ገብተዋል!");
    closeModal('loginModal');
    loginSuccess(phone);
}

function loginSuccess(phone) {
    document.getElementById('navButtons').style.display = 'none';
    document.getElementById('userPanel').style.display = 'flex';
    userBalance = 0.00;
    updateBalanceDisplay();
}

function logout() {
    document.getElementById('navButtons').style.display = 'flex';
    document.getElementById('userPanel').style.display = 'none';
    document.getElementById('profileDropdown').style.display = 'none';
    userBalance = 0.00;
    updateBalanceDisplay();
}

function updateBalanceDisplay() {
    document.getElementById('userBalance').innerText = userBalance.toFixed(2);
}

function copyPhone() {
    navigator.clipboard.writeText("0997791266");
    alert("ስልክ ቁጥር ተገልብጧል (Copied): 0997791266");
}

function submitDepositStep1() {
    let amt = document.getElementById('depositAmountInput').value;
    if(!amt) { alert("እባክዎ የብር መጠን ያስገቡ"); return; }
    document.getElementById('smsSection').style.display = 'block';
}
// ከዚህ በፊት የነበሩት ፌንክሽኖች (ለምሳሌ submitSmsCode) ካሉ ከነሱ በታች ወይም በመጨረሻው መስመር ላይ ይህንን ያስገቡ፡


function submitSmsCode() {
    let sms = document.getElementById('smsInput').value;
    if(!sms) { alert("እባክዎ የ SMS መልእክት ይለጥፉ (Paste)"); return; }
    document.getElementById('waitingMsg').style.display = 'block';
}

// Withdraw functionality with Telebirr, Amount, and Insufficient Balance check
// ከዚህ በፊት የነበሩት ፌንክሽኖች (ለምሳሌ submitSmsCode) ካሉ ከነሱ በታች ወይም በመጨረሻው መስመር ላይ ይህንን ያስገቡ፡

function requestWithdraw() {
    let amt = parseFloat(document.getElementById('withdrawAmount').value) || 0;
    
    // በቂ ባላንስ ከሌለ (ከ userBalance በላይ ከሆነ)
    if(amt > userBalance || userBalance <= 0) {
        alert("በቂ ሂሳብ የሎትም!");
        return;
    }

    // በቂ ባላንስ ካለ ከሂሳብ ቀንሶ Withdraw እንዲያደርግ
    userBalance -= amt;
    updateBalanceDisplay();
    alert("የ Withdraw ጥያቄዎ በ Telebirr በኩል ተልኳል (ኤጀንት: 0997791266)");
    closeModal('withdrawModal');
}
function requestWithdraw() {
    let amt = parseFloat(document.getElementById('withdrawAmount').value) || 0;
    
    if(amt <= 0) {
        alert("እባክዎ ትክክለኛ የብር መጠን ያስገቡ");
        return;
    }

    if(amt > userBalance || userBalance <= 0) {
        alert("በቂ ሂሳብ የሎትም!");
        return;
    }

    userBalance -= amt;
    updateBalanceDisplay();
    alert("የ Withdraw ጥያቄዎ በ Telebirr በኩል ተልኳል (ኤጀንት: 0997791266)");
    closeModal('withdrawModal');
}

function openSupport() {
    window.open("https://t.me/0997791266", "_blank");
}