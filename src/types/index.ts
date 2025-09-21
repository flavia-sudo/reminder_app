export interface Reminder {
    id: string;
    title: string;
    description: string;
    dateTime: string;
    category: "personal" | "work" | "health" | "education" | "other";
    priority: "low" | "medium" | "high";
    ringtone: "classic" | "digital" | "chime" | "urgent" | "gentle";
    completed: boolean;
    createdAt: string;
}

export interface ReminderForm {
    title: string;
    description: string;
    date: string;
    time: string;
    category: "personal" | "work" | "health" | "education" | "other";
    priority: "low" | "medium" | "high";
    ringtone: "classic" | "digital" | "chime" | "urgent" | "gentle";
}