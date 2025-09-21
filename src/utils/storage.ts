import { type Reminder } from "../types";

const STORAGE_KEY = "reminders";
export const saveReminders = (reminders: Reminder[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
};

export const getReminders = (): Reminder[] => {
    try {
            const reminders = localStorage.getItem(STORAGE_KEY);
            return reminders ? JSON.parse(reminders) : [];
    } catch (error) {
        console.error("Error retrieving reminders:", error);
        return [];
    }
};

const activeTimers = new Map<string, number>();
const createRingtone = (type: string) => {
    const audioContext = new (window.AudioContext || (window as any).window.webkitAudioContext)();
    const ringtones = {
        classic: () => {
           const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 1);
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 1);

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 3); 
        },
        digital: () => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.type = "square";
            oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 1);
            oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 1);

            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 3);
    },
        chime: () => {
            const oscillator1 = audioContext.createOscillator();
            const oscillator2 = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator1.connect(gainNode);
            oscillator2.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator1.frequency.setValueAtTime(523, audioContext.currentTime);
            oscillator2.frequency.setValueAtTime(659, audioContext.currentTime);

            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

            oscillator1.start(audioContext.currentTime);
            oscillator2.start(audioContext.currentTime);
            oscillator1.stop(audioContext.currentTime + 3);
            oscillator2.stop(audioContext.currentTime + 3);
        },
        urgent: () => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.type = "sawtooth";
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.05);
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.15);
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.25);
            
            gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 3);
        },
        gentle: () => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.type = "sine";
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime); //A4
            oscillator.frequency.setValueAtTime(523, audioContext.currentTime + 0.3); //C5
            oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.6); //E5

            gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 3);
        }
    };

    return ringtones[type as keyof typeof ringtones] || ringtones.classic;
};

const showAlarmNotification = (reminder: Reminder) => {
    const playRingtone = createRingtone(reminder.ringtone);

    let soundCount = 0;
    const intervalId = setInterval(() => {
        playRingtone();
        soundCount++;
        if (soundCount >= 30) {
            clearInterval(intervalId);
        }
    }, 800);

    const notification = new Notification(`🚨 REMINDER ALERT: ${reminder.title}`, {
        body: `${reminder.description}\n\nTime: ${new Date(reminder.dateTime).toLocaleString()}\nRingtone: ${
            reminder.ringtone.charAt(0).toUpperCase() + reminder.ringtone.slice(1)
        }`,
        icon: "/vite.svg",
        tag: reminder.id,
        requireInteraction: true,
        silent: false,
    });

    // Show custom alarm modal
    showCustomAlarmModal(reminder, () => {
        notification.close();
        clearInterval(intervalId);
    });

    notification.onclick = () => {
        window.focus();
        notification.close();
        clearInterval(intervalId);
    };
};

// Custom alarm modal with ringtone info
const showCustomAlarmModal = (reminder: Reminder, onDismiss: () => void) => {
    // Remove any existing alarm modal
    const existingModal = document.getElementById("alarm-modal");
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement("div");
    modal.id = "alarm-modal";
    modal.className = "fixed inset-0 bg-red-600 bg-opacity-95 flex items-center justify-center z-[9999]";

    const ringtoneEmojis = {
        classic: "📞",
        digital: "💻",
        chime: "🔔",
        urgent: "🚨",
        gentle: "🎵",
    };

    modal.innerHTML = `
    <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border-4 border-red-500">
      <div class="text-center">
        <div class="text-6xl mb-4">🚨</div>
        <h2 class="text-2xl font-bold text-red-600 mb-4">REMINDER ALERT!</h2>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">${reminder.title}</h3>
        <p class="text-gray-600 mb-4">${reminder.description}</p>
        <div class="flex items-center justify-center space-x-2 mb-4">
          <span class="text-2xl">${ringtoneEmojis[reminder.ringtone]}</span>
          <span class="text-sm font-medium text-gray-600">${
              reminder.ringtone.charAt(0).toUpperCase() + reminder.ringtone.slice(1)
          } Ringtone</span>
        </div>
        <p class="text-sm text-gray-500 mb-6">
          Scheduled: ${new Date(reminder.dateTime).toLocaleString()}
        </p>
        <button
          id="dismiss-alarm"
          class="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors text-lg"
        >
          DISMISS ALARM
        </button>
      </div>
    </div>
  `;

    document.body.appendChild(modal);

    // Add dismiss functionality
    const dismissButton = document.getElementById("dismiss-alarm");
    const dismissAlarm = () => {
        modal.remove();
        onDismiss();
    };

    dismissButton?.addEventListener("click", dismissAlarm);

    // Auto-dismiss after 30 seconds
    setTimeout(dismissAlarm, 30000);

    // Dismiss on escape key
    const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            dismissAlarm();
            document.removeEventListener("keydown", handleKeyPress);
        }
    };
    document.addEventListener("keydown", handleKeyPress);
};

export const scheduleNotification = (reminder: Reminder): void => {
    if (reminder.completed) return;

    const reminderTime = new Date(reminder.dateTime).getTime();
    const now = Date.now();
    const timeUntilReminder = reminderTime - now;

    // Clear existing timer for this reminder
    const existingTimer = activeTimers.get(reminder.id);
    if (existingTimer) {
        clearTimeout(existingTimer);
    }

    if (timeUntilReminder <= 0) {
        // If the reminder time has already passed, show immediately
        showAlarmNotification(reminder);
        return;
    }

    const timerId = setTimeout(() => {
        if (!reminder.completed) {
            showAlarmNotification(reminder);
        }
        activeTimers.delete(reminder.id);
    }, timeUntilReminder);

    activeTimers.set(reminder.id, timerId);
};

export const cancelNotification = (reminderId: string): void => {
    const timerId = activeTimers.get(reminderId);
    if (timerId) {
        clearTimeout(timerId);
        activeTimers.delete(reminderId);
    }
};

// Auto-enable notifications on app load
export const initializeNotifications = async (): Promise<boolean> => {
    if (!("Notification" in window)) {
        return false;
    }

    if (Notification.permission === "granted") {
        return true;
    }

    if (Notification.permission === "denied") {
        return false;
    }

    const permission = await Notification.requestPermission();
    return permission === "granted";
};