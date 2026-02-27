// ==========================================
// 1. UI & Navigation Logic 
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
  appId: "1:16267197833:web:8e7ff71df918ad803ab558"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

if (document.getElementById('image-gallery')) {
    database.ref('portfolio/').on('value', (snapshot) => {
        const gallery = document.getElementById('image-gallery');
        gallery.innerHTML = ""; 
        
        const items = [];
        snapshot.forEach((childSnapshot) => {
            items.push(childSnapshot.val());
        });
        
        items.reverse().forEach((data) => {
            renderImage(data);
        });
    });
}

// ==========================================
// 3. Fast Image Render & WhatsApp Request
// ==========================================
function renderImage(item) {
    const gallery = document.getElementById('image-gallery');
    const card = document.createElement('div');
    card.className = 'image-card';

    // ইমেজ সোর্স (ImgBB বা ড্রাইভ)
    const imageSrc = item.imageUrl || 
                    (item.driveId && item.driveId.startsWith('http') ? item.driveId : `https://drive.google.com/thumbnail?id=${item.driveId}&sz=w1000`);

    // 🔴 আপনার WhatsApp নাম্বারটি এখানে বসান (দেশের কোড সহ, + ছাড়া)
    const waNumber = "8801960193514"; 
    
    // অটোমেটিক মেসেজ (টাইটেল সহ)
    const waMessage = encodeURIComponent(`হ্যালো, আমি আপনাদের ওয়েবসাইট PixelGird থেকে "${item.title}" ডিজাইনটি সম্পর্কে জানতে চাই।`);
    const waLink = `https://wa.me/${waNumber}?text=${waMessage}`;

    // ক্যানভাস মুক্ত ক্লিন ইমেজ, WhatsApp বাটন এবং Pro Features
    card.innerHTML = `
        <div class="image-wrapper">
            <div class="guard-overlay" oncontextmenu="return false;"></div>
            <img src="${imageSrc}" alt="${item.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/800x450?text=Image+Not+Found'">
            
            <a href="${waLink}" target="_blank" class="get-wa-btn">
                <svg viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z"/></svg>
                Get Image
            </a>
        </div>
        
        <div class="info">${item.title}</div>

        <h4>👑 প্রিমিয়াম ফিচার সমুহ: </h4>
        <br>
        <div class="pro-features">
            <span class="tag-hq">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> High Quality
            </span>
            <span class="tag-wm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> No Watermark
            </span>
            <span class="tag-cz">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg> Customizable
            </span>
        </div>
    `;
    
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
        navigator.clipboard.writeText('Screenshot disabled!');
        showSecurityAlert();
    }
});