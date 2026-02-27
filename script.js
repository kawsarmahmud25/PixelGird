// ==========================================
// 1. UI & Navigation Logic (Hamburger Menu)
// ==========================================
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const navLinks = document.querySelectorAll('.nav-links a');

// হ্যামবার্গারে ক্লিক করলে মেনু ওপেন/ক্লোজ হবে
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    sidebar.classList.toggle('active');
});

// মেনুর কোনো লিংকে ক্লিক করলে মেনু অটোমেটিক বন্ধ হয়ে যাবে
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        sidebar.classList.remove('active');
    });
});

// ==========================================
// 2. Firebase Database Integration
// ==========================================
// আপনার ফায়ারবেস কনফিগারেশন দিন (আগের মতোই)
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBavEYDKi2WyklJnOxL2icIuV0Qt-HQc7o",
  authDomain: "pixel-gird.firebaseapp.com",
  databaseURL: "https://pixel-gird-default-rtdb.asia-southeast1.firebasedatabase.app", // এই নতুন লাইনটি যোগ করা হয়েছে
  projectId: "pixel-gird",
  storageBucket: "pixel-gird.firebasestorage.app",
  messagingSenderId: "16267197833",
  appId: "1:16267197833:web:8e7ff71df918ad803ab558",
  measurementId: "G-58SMHCEC74"
};
// ফায়ারবেস ইনিশিয়ালাইজেশন
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// ডাটাবেস থেকে ইমেজ এনে গ্যালারিতে দেখানো
if (document.getElementById('image-gallery')) {
    database.ref('portfolio/').on('value', (snapshot) => {
        const gallery = document.getElementById('image-gallery');
        gallery.innerHTML = ""; // আগের কন্টেন্ট ক্লিয়ার
        
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            renderWatermarkedImage(data);
        });
    });
}

// ==========================================
// 3. Canvas Watermark & Render Engine
// ==========================================
function renderWatermarkedImage(item) {
    const gallery = document.getElementById('image-gallery');
    const card = document.createElement('div');
    card.className = 'image-card';

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.crossOrigin = "anonymous";
    img.src = `https://drive.google.com/thumbnail?id=${item.driveId}&sz=w1000`;

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
        ctx.fillText("PIXELGRID STUDIO", 0, 0); // ওয়াটারমার্কের টেক্সট
        ctx.restore();
    };

    // সিকিউরিটি লেয়ার এবং টাইটেল যুক্ত করা
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
    // F12, Ctrl+Shift+I, Ctrl+U ব্লক করা
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