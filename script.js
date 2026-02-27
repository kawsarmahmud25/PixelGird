// ==========================================
// 1. UI & Navigation Logic (Hamburger Menu)
// ==========================================
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const navLinks = document.querySelectorAll('.nav-links a');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    sidebar.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        sidebar.classList.remove('active');
    });
});

// ==========================================
// 2. Firebase Database Integration
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyBavEYDKi2WyklJnOxL2icIuV0Qt-HQc7o",
  authDomain: "pixel-gird.firebaseapp.com",
  databaseURL: "https://pixel-gird-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pixel-gird",
  storageBucket: "pixel-gird.firebasestorage.app",
  messagingSenderId: "16267197833",
  appId: "1:16267197833:web:8e7ff71df918ad803ab558",
  measurementId: "G-58SMHCEC74"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

if (document.getElementById('image-gallery')) {
    database.ref('portfolio/').on('value', (snapshot) => {
        const gallery = document.getElementById('image-gallery');
        gallery.innerHTML = ""; 
        
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            renderWatermarkedImage(data);
        });
    });
}

// ==========================================
// 3. Canvas Watermark & Render Engine (UPDATED)
// ==========================================
function renderWatermarkedImage(item) {
    const gallery = document.getElementById('image-gallery');
    const card = document.createElement('div');
    card.className = 'image-card';

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.crossOrigin = "anonymous";
    
    // 🔴 ফিক্স: গুগল ড্রাইভের CORS ব্লক এড়াতে Image Proxy ব্যবহার করা হলো
    img.src = `https://wsrv.nl/?url=https://drive.google.com/uc?id=${item.driveId}`;

    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // ওয়াটারমার্ক ডিজাইন
        ctx.font = `bold ${img.width / 15}px 'Plus Jakarta Sans', Arial`;
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.textAlign = "center";
        
        ctx.save();
        ctx.translate(canvas.width/2, canvas.height/2);
        ctx.rotate(-Math.PI / 4);
        ctx.fillText("PIXELGRID STUDIO", 0, 0); 
        ctx.restore();
    };

    // যদি ইমেজ লিংক ভুল হয় বা পাবলিক না থাকে
    img.onerror = function() {
        canvas.width = 600;
        canvas.height = 400;
        ctx.fillStyle = "#f1f5f9";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#64748b";
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("⚠️ Image Load Error", canvas.width/2, canvas.height/2);
        ctx.font = "14px Arial";
        ctx.fillText("গুগল ড্রাইভ লিংকটি 'Anyone with link' করা নেই", canvas.width/2, canvas.height/2 + 30);
    };

    card.innerHTML = `<div class="guard-overlay"></div>`;
    card.appendChild(canvas);
    card.innerHTML += `<div class="info">${item.title}</div>`;
    gallery.appendChild(card);
}

// ==========================================
// 4. Advanced Security (Anti-Theft)
// ==========================================
const alertBox = document.getElementById('alert-box');

function showSecurityAlert() {
    alertBox.style.display = 'block';
    setTimeout(() => alertBox.style.display = 'none', 2000);
}

document.onkeydown = (e) => {
    if (e.keyCode == 123 || (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 74)) || (e.ctrlKey && e.keyCode == 85)) {
        showSecurityAlert();
        return false;
    }
};

document.addEventListener('keyup', e => {
    if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText('Screenshot is strictly prohibited!');
        showSecurityAlert();
    }
});
