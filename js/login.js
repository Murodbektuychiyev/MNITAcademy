document.addEventListener('DOMContentLoaded', function() {
    
    const video = document.getElementById('background-video');
    const toggleButton = document.getElementById('toggle-video-sound');

    let initialInteractionOccurred = false;

    if (video && toggleButton) {
        
        video.muted = true;

        video.play().catch(error => {
            console.warn("Video autoplay bloklandi. Foydalanuvchi harakatini kuting:", error);
        });

        const updateButtonText = () => {
            toggleButton.innerHTML = video.muted ? '🔇 Ovoz' : '🔊 Ovoz';
        };
        
        const toggleVideoSound = (mutedState) => {
            video.muted = mutedState;
            updateButtonText();
            
            if (!mutedState && video.paused) {
                 video.play().catch(e => console.error("Video ijrosini qayta boshlashda xatolik:", e));
            }
        }
        
        updateButtonText();


        // =================================================
        // 2. INTERAKTIVLIK MANTIQI (Birinchi klik / Tugma)
        // =================================================
        
        document.addEventListener('click', function handleInitialInteraction() {
            if (!initialInteractionOccurred) {
                
                toggleVideoSound(false); 
                initialInteractionOccurred = true;
                
                document.removeEventListener('click', handleInitialInteraction);
            }
        });
               
        
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

    } else {
        console.warn("HTML elementlari topilmadi: 'background-video' yoki 'toggle-video-sound'.");
    }
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase sozlamalari
const firebaseConfig = {
    apiKey: "AIzaSyBPojRJlq-H-813eOaz13o44EJSDwRDQVw", // ESLATMA: Bu kalitni productionda yashirish tavsiya etiladi
    authDomain: "mnitacademy-777.firebaseapp.com",
    projectId: "mnitacademy-777",
    storageBucket: "mnitacademy-777.firebasestorage.app",
    messagingSenderId: "645094960890",
    appId: "1:645094960890:web:9814e1bab983264a96a343",
    measurementId: "G-ZX2ZDBWLQ2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('background-video');
    const toggleButton = document.getElementById('toggle-video-sound');
    const loginForm = document.getElementById('login-form');

    // --- 1. VIDEO BOSHQARUVI ---
    if (video && toggleButton) {
        let initialInteraction = false;

        const updateButtonUI = () => {
            toggleButton.innerHTML = video.muted ? '🔇 Ovoz' : '🔊 Ovoz';
        };

        const enableSound = () => {
            if (!initialInteraction) {
                video.muted = false;
                video.play().catch(err => console.warn("Video ijro etilmadi:", err));
                updateButtonUI();
                initialInteraction = true;
            }
        };

        // Sahifaning istalgan joyiga birinchi klikda ovozni yoqish
        document.addEventListener('click', enableSound, { once: true });

        // Tugma bosilganda ovozni yoqish/o'chirish
        toggleButton.addEventListener('click', (e) => {
            e.stopPropagation(); // document'dagi click hodisasi bilan to'qnashmasligi uchun
            video.muted = !video.muted;
            updateButtonUI();
            initialInteraction = true; // Tugma bosilsa ham interaktsiya hisoblanadi
        });
    }

    // --- 2. AUTHENTIFIKATSIYA (Login) ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                await signInWithEmailAndPassword(auth, email, password);
                // Muvaffaqiyatli kirilganda yo'naltirish
                window.location.href = "main-page.html"; 
            } catch (error) {
                console.error("Xatolik kodi:", error.code);
                let errorMsg = "Email yoki parol noto'g'ri!";
                
                if (error.code === 'auth/too-many-requests') {
                    errorMsg = "Ko'p urinish bo'ldi. Biroz kutib turing.";
                } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                    errorMsg = "Login yoki parol xato.";
                }
                
                alert(errorMsg);
            }
        });
    }
});
