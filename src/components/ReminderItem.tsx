import React from 'react'
import { type Reminder } from '../types';
import { FaUserAlt, FaBriefcase, FaRegHeart, FaUserGraduate, FaRegFolder } from "react-icons/fa";
import { formatDateTime, getTimeUtil, isLapsed } from '../utils/date';

interface ReminderItemProps {
    reminder: Reminder;
    onComplete: (id: string) => void;
    onDelete: (id: string) => void;
}
const ReminderItem: React.FC<ReminderItemProps> = ({reminder, onComplete, onDelete}) => {
    const categoryIcons = {
        personal: FaUserAlt,
        work: FaBriefcase,
        health: FaRegHeart,
        education: FaUserGraduate,
        other: FaRegFolder,
    };
    const CategoryIcon = categoryIcons[reminder.category];
    const getRingtoneEmoji = (ringtone: string) => {
        const ringtoneEmojis = {
            classic: "📞",
            digital: "💻",
            chime: "🔔",
            urgent: "🚨",
            gentle: "🎵",
        };
        return ringtoneEmojis[ringtone as keyof typeof ringtoneEmojis] || "📞";
    };
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "low":
                return "text-green-500 bg-green-50 border-green-200";
            case "medium":
                return "text-yellow-500 bg-yellow-50 border-yellow-200";
            case "high":
                return "text-red-500 bg-red-50 border-red-200";
            default:
                return "text-gray-500 bg-gray-50 border-gray-200";
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "personal":
                return "text-blue-500 bg-blue-50 border-blue-200";
            case "work":
                return "text-orange-500 bg-orange-50 border-orange-200";
            case "health":
                return "text-green-500 bg-green-50 border-green-200";
            case "education":
                return "text-purple-500 bg-purple-50 border-purple-200";
            default:
                return "text-gray-500 bg-gray-50 border-gray-200";
        }
    };

    const lapsedStatus = isLapsed(reminder.dateTime);
    const timeUtil = getTimeUtil(reminder.dateTime);
  return (
    <div 
  )
}

export default ReminderItem