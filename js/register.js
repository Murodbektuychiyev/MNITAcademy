const regionsList = [
    "Toshkent shahri", 
    "Toshkent viloyati",
    "Samarqand viloyati",
    "Andijon viloyati",
    "Farg'ona viloyati",
    "Namangan viloyati",
    "Buxoro viloyati",
    "Qashqadaryo viloyati",
    "Surxondaryo viloyati",
    "Xorazm viloyati",
    "Navoiy viloyati",
    "Jizzax viloyati",
    "Sirdaryo viloyati",
    "Qoraqalpog'iston R."
];

document.addEventListener('DOMContentLoaded', function() {
    
    const regionSelect = document.getElementById('region');
    const video = document.getElementById('background-video');
    const toggleButton = document.getElementById('toggle-video-sound');
    
    let initialInteractionOccurred = false;


    // =========================================================
    // 1. VILOYAT RO'YXATINI TO'LDIRISH FUNKSIYASI - O'zgarishsiz
    // =========================================================
    const populateRegions = () => {
        if (!regionSelect) {
            return; 
        }
        
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
    // 2. OVOZ BOSHQARUVI MANTIQI (YANGILANGAN)
    // =========================================================
    if (video && toggleButton) {
        
        video.muted = true;

        video.play().catch(error => {
            console.warn("Video autoplay bloklandi (Brauzer cheklovi).");
        });

        
        const updateButtonText = () => {
            toggleButton.innerHTML = video.muted ? '🔇 Ovoz' : '🔊 Ovoz';
            
            if (!video.muted && video.paused) {
                 video.play().catch(e => console.error("Video ijrosini qayta boshlashda xatolik:", e));
            }
        };

        const toggleVideoSound = (mutedState) => {
            video.muted = mutedState;
            updateButtonText();
        }
        
        updateButtonText();


        // --- A. BIRINCHI INTERAKTSIYA (EKRANGA BOSISH) ---

        document.addEventListener('click', function handleInitialInteraction() {
            if (!initialInteractionOccurred) {
                
                toggleVideoSound(false); 
                initialInteractionOccurred = true;
                
                document.removeEventListener('click', handleInitialInteraction);
            }
        });
        
        
        // --- B. KEYINGI BOSHQARUV (TUGMA ORQALI) ---
        
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
