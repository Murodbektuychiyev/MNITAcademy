document.addEventListener('DOMContentLoaded', function() {
    
    const video = document.getElementById('background-video');
    const toggleButton = document.getElementById('toggle-video-sound');

    let initialInteractionOccurred = false;

    if (video && toggleButton) {
        
        video.muted = true;

        
        // =========================================================
        // 2. VIDEO AUTOPLAY MANTIQI
        // =========================================================
        
        video.play().catch(error => {
            console.warn("Video autoplay bloklandi (Brauzer cheklovi).");
        });

        
        // =========================================================
        // 3. OVOZNI BOSHQARISH FUNKSIYALARI
        // =========================================================

        const updateButtonStatus = () => {
            toggleButton.innerHTML = video.muted ? '🔇 Ovoz' : '🔊 Ovoz';
            
            if (!video.muted && video.paused) {
                 video.play().catch(e => console.error("Video ijrosini qayta boshlashda xatolik:", e));
            }
        };
        
        updateButtonStatus();

        const toggleVideoSound = (mutedState) => {
            video.muted = mutedState;
            updateButtonStatus();
        }


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

    } else {
        console.warn("HTML elementlari to'g'ri bog'lanmagan. IDs: 'background-video' yoki 'toggle-video-sound' topilmadi.");
    }
});
