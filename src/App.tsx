import React, { useState, useEffect, useMemo } from "react";
import { FaPlus, FaBell } from "react-icons/fa";
import type { Reminder, ReminderFormData } from "./types";
import {
    saveReminders,
    getReminders,
    scheduleNotification,
    cancelNotification,
    initializeNotifications,
} from "./utils/storage";
import { isLapsed } from "./utils/date";
import Header from "./components/Header";
import ReminderForm from "./components/ReminderForm";
import FilterBar from "./components/Filter";
import ReminderList from "./components/ReminderList";

function App() {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [notificationEnabled, setNotificationEnabled] = useState(false);

    // Filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        const loadedReminders = getReminders();
        setReminders(loadedReminders);

        // Initialize notifications and schedule existing reminders
        initializeNotifications().then((granted) => {
            setNotificationEnabled(granted);
            if (granted) {
                // Schedule notifications for existing active reminders
                loadedReminders.forEach((reminder) => {
                    if (!reminder.completed) {
                        scheduleNotification(reminder);
                    }
                });
            }
        });
    }, []);

    // Auto-migrate existing reminders to include ringtone
    useEffect(() => {
        const migratedReminders = reminders.map((reminder) => {
            if (!reminder.ringtone) {
                return { ...reminder, ringtone: "classic" as const };
            }
            return reminder;
        });

        if (migratedReminders.some((r, i) => r !== reminders[i])) {
            setReminders(migratedReminders);
        }
    }, [reminders]);

    useEffect(() => {
        saveReminders(reminders);

        // Schedule notifications for all active reminders
        reminders.forEach((reminder) => {
            if (!reminder.completed) {
                scheduleNotification(reminder);
            }
        });
    }, [reminders]);

    const addReminder = (data: ReminderFormData) => {
        const newReminder: Reminder = {
            id: Date.now().toString(),
            title: data.title,
            description: data.description,
            dateTime: `${data.date}T${data.time}`,
            category: data.category,
            priority: data.priority,
            ringtone: data.ringtone,
            completed: false,
            createdAt: new Date().toISOString(),
        };

        setReminders((prev) => [...prev, newReminder]);

        // Schedule notification for new reminder
        if (notificationEnabled) {
            scheduleNotification(newReminder);
        }
    };

    const completeReminder = (id: string) => {
        // Cancel notification when reminder is completed
        cancelNotification(id);

        setReminders((prev) =>
            prev.map((reminder) => (reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder))
        );
    };

    const deleteReminder = (id: string) => {
        // Cancel notification when reminder is deleted
        cancelNotification(id);

        setReminders((prev) => prev.filter((reminder) => reminder.id !== id));
    };

    const enableNotifications = async () => {
        const granted = await initializeNotifications();
        setNotificationEnabled(granted);

        if (granted) {
            // Show success message
            const successNotification = new Notification("🔔 Notifications Enabled!", {
                body: "You will now receive alarm-style alerts for your reminders.",
                icon: "/vite.svg",
            });

            setTimeout(() => successNotification.close(), 3000);

            // Schedule notifications for all active reminders
            reminders.forEach((reminder) => {
                if (!reminder.completed) {
                    scheduleNotification(reminder);
                }
            });
        } else {
            // Show error message if permission denied
            alert(
                "⚠️ Notification permission denied. You won't receive alarm alerts for your reminders. Please enable notifications in your browser settings."
            );
        }
    };

    // Filter and search reminders
    const filteredReminders = useMemo(() => {
        return reminders
            .filter((reminder) => {
                // Search filter
                const matchesSearch =
                    reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    reminder.description.toLowerCase().includes(searchTerm.toLowerCase());

                // Category filter
                const matchesCategory = !categoryFilter || reminder.category === categoryFilter;

                // Priority filter
                const matchesPriority = !priorityFilter || reminder.priority === priorityFilter;

                // Status filter
                let matchesStatus = true;
                if (statusFilter === "active") {
                    matchesStatus = !reminder.completed;
                } else if (statusFilter === "completed") {
                    matchesStatus = reminder.completed;
                } else if (statusFilter === "overdue") {
                    matchesStatus = !reminder.completed && isLapsed(reminder.dateTime);
                }

                return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
            })
            .sort((a, b) => {
                // Sort by priority and date
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                const aPriority = priorityOrder[a.priority];
                const bPriority = priorityOrder[b.priority];

                if (aPriority !== bPriority) {
                    return bPriority - aPriority;
                }

                return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
            });
    }, [reminders, searchTerm, categoryFilter, priorityFilter, statusFilter]);

    const activeRemindersCount = reminders.filter((r) => !r.completed).length;
    const completedRemindersCount = reminders.filter((r) => r.completed).length;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header activeCount={activeRemindersCount} completedCount={completedRemindersCount} />

            <main className="py-8 mx-auto max-w-8xl lg:px-40 sm:px-4">
                {/* Action Bar */}
                <div className="flex flex-col items-start justify-between gap-4 px-4 mb-8 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Your Reminders</h2>
                        <p className="text-gray-600">Manage your time effectively with smart reminders</p>
                    </div>

                    <div className="flex items-center space-x-3">
                        {!notificationEnabled && (
                            <button
                                onClick={enableNotifications}
                                className="flex items-center px-4 py-2 space-x-2 text-blue-600 transition-colors border border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100"
                            >
                                <FaBell className="w-4 h-4" />
                                <span>Enable Notifications</span>
                            </button>
                        )}

                        <button
                            onClick={() => setIsFormVisible(true)}
                            className="flex items-center px-6 py-3 space-x-2 text-white transition-colors bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
                        >
                            <FaPlus className="w-4 h-4" />
                            <span>Add Reminder</span>
                        </button>
                    </div>
                </div>

                {/* Filter Bar */}
                <FilterBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    categoryFilter={categoryFilter}
                    onCategoryChange={setCategoryFilter}
                    priorityFilter={priorityFilter}
                    onPriorityChange={setPriorityFilter}
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                />

                {/* Reminders List */}
                <ReminderList reminders={filteredReminders} onComplete={completeReminder} onEdit={editReminder} onDelete={deleteReminder} />

                {/* Reminder Form Modal */}
                <ReminderForm
                    isVisible={isFormVisible}
                    onClose={() => setIsFormVisible(false)}
                    onSubmit={addReminder}
                />
            </main>
        </div>
    );
}

export default App;