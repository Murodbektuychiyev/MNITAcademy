// 1. Firebase xizmatlarini import qilish
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. Firebase Konfiguratsiyasi
const firebaseConfig = {
    apiKey: "AIzaSyBPojRJlq-H-813eOaz13o44EJSDwRDQVw",
    authDomain: "mnitacademy-777.firebaseapp.com",
    projectId: "mnitacademy-777",
    storageBucket: "mnitacademy-777.firebasestorage.app",
    messagingSenderId: "645094960890",
    appId: "1:645094960890:web:9814e1bab983264a96a343",
    measurementId: "G-ZX2ZDBWLQ2"
};

// 3. Firebase-ni ishga tushirish
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const regionsList = [
    "Toshkent shahri", "Toshkent viloyati", "Samarqand viloyati", "Andijon viloyati",
    "Farg'ona viloyati", "Namangan viloyati", "Buxoro viloyati", "Qashqadaryo viloyati",
    "Surxondaryo viloyati", "Xorazm viloyati", "Navoiy viloyati", "Jizzax viloyati",
    "Sirdaryo viloyati", "Qoraqalpog'iston R."
];

document.addEventListener('DOMContentLoaded', function() {
    
    const regionSelect = document.getElementById('region');
    const video = document.getElementById('background-video');
    const toggleButton = document.getElementById('toggle-video-sound');
    const registerForm = document.getElementById('register-form'); 
    
    let initialInteractionOccurred = false;

    // =========================================================
    // 1. VILOYAT RO'YXATINI TO'LDIRISH FUNKSIYASI
    // =========================================================
    const populateRegions = () => {
        if (!regionSelect) return; 
        
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "Viloyatni tanlang...";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        regionSelect.appendChild(defaultOption);

        regionsList.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            regionSelect.appendChild(option);
        });
    };

    populateRegions();

    // =========================================================
    // 2. FIREBASE RO'YXATDAN O'TISH + BAZAGA YOZISH
    // =========================================================
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 

            const fullName = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            // Viloyatni olish (agar select mavjud bo'lsa)
            const selectedRegion = regionSelect ? regionSelect.value : "Tanlanmagan";

            if (password !== confirmPassword) {
                alert("Parollar mos kelmadi!");
                return;
            }

            try {
                // A. Authentication-da foydalanuvchi yaratish
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // B. Firestore Database-ga ma'lumotlarni yozish
                await setDoc(doc(db, "users", user.uid), {
                    name: fullName,
                    email: email,
                    region: selectedRegion,
                    uid: user.uid,
                    createdAt: new Date().toISOString()
                });

                alert("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
                window.location.href = "login.html";

            } catch (error) {
                console.error("Firebase Xatolik:", error);
                alert("Xato: " + error.message);
            }
        });
    }

    // =========================================================
    // 3. OVOZ BOSHQARUVI MANTIQLARI
    // =========================================================
    if (video && toggleButton) {
        video.muted = true;
        video.play().catch(error => {
            console.warn("Video autoplay bloklandi (Brauzer cheklovi).");
        });

        const updateButtonText = () => {
            toggleButton.innerHTML = video.muted ? '🔇 Ovoz' : '🔊 Ovoz';
            if (!video.muted && video.paused) {
                 video.play().catch(e => console.error("Xatolik:", e));
            }
        };

        const toggleVideoSound = (mutedState) => {
            video.muted = mutedState;
            updateButtonText();
        }
        
        updateButtonText();

        // --- A. BIRINCHI INTERAKTSIYA ---
        document.addEventListener('click', function handleInitialInteraction() {
            if (!initialInteractionOccurred) {
                toggleVideoSound(false); 
                initialInteractionOccurred = true;
                document.removeEventListener('click', handleInitialInteraction);
            }
        });
        
        // --- B. TUGMA ORQALI BOSHQARUV ---
        toggleButton.addEventListener('click', (event) => {
            event.stopPropagation();
            if (initialInteractionOccurred) {
                toggleVideoSound(!video.muted);
            } else {
                toggleVideoSound(false);
                initialInteractionOccurred = true;
                document.removeEventListener('click', handleInitialInteraction);
            }
        });
    } 
});
