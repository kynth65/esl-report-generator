import { useCallback } from 'react';

export const useNotificationSound = () => {
    const playSound = useCallback((type: 'success' | 'error' | 'info' = 'success') => {
        if (typeof window === 'undefined' || !window.AudioContext && !window.webkitAudioContext) {
            return;
        }

        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            const playTone = (frequency: number, duration: number, delay: number = 0) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + delay);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, audioContext.currentTime + delay);
                gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + delay + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + delay + duration);
                
                oscillator.start(audioContext.currentTime + delay);
                oscillator.stop(audioContext.currentTime + delay + duration);
            };

            switch (type) {
                case 'success':
                    // Pleasant success sound - ascending chord
                    playTone(523.25, 0.15, 0);    // C5
                    playTone(659.25, 0.15, 0.08); // E5
                    playTone(783.99, 0.3, 0.15);  // G5
                    break;
                
                case 'error':
                    // Error sound - descending tones
                    playTone(440, 0.2, 0);     // A4
                    playTone(349.23, 0.3, 0.1); // F4
                    break;
                
                case 'info':
                    // Info sound - single gentle tone
                    playTone(523.25, 0.2, 0); // C5
                    break;
            }
        } catch (error) {
            console.warn('Could not play notification sound:', error);
        }
    }, []);

    return { playSound };
};

declare global {
    interface Window {
        AudioContext: typeof AudioContext;
        webkitAudioContext: typeof AudioContext;
    }
}