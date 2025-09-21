export const formatDateTime = (dateTime: string): string => {
    const date = new Date(dateTime);
    return date.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const getTimeUtil = (dateTime: string): string => {
    const now = new Date().getTime();
    const targetTime = new Date(dateTime).getTime();
    const diff = targetTime - now;

    if (diff <= 0) {
        return "Lapsed"
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
    }
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
};

export const isLapsed = (dateTime: string): boolean => {
    return new Date(dateTime) < new Date();
};

export const getCurrentDateTime = (): { date: string; time: string } => {
    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const time = now.toTimeString().slice(0, 5);
    return { date, time };
}