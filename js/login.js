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
