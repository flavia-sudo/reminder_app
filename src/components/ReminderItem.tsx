import React from 'react'
import { type Reminder } from '../types';
import { FaUserAlt, FaBriefcase, FaRegHeart, FaUserGraduate, FaRegFolder, FaCalendar, FaClock, FaCheck, FaTrash } from "react-icons/fa";
import { IoMdAlert } from "react-icons/io";
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
    <div className={`bg-white rounded-xl shadow-md border-l-4 hover:shadow-lg transition-all duration-200 ${reminder.completed
        ? "border-green-400 opacity-75" : lapsedStatus
        ? "border-red-400 opacity-75"
        : "border-blue-400 opacity-100"
    }`}
    >
        <div className="flex items-center justify-between p-4">
            <div className='flex-1'>
                <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-2 rounded-lg ${getCategoryColor(reminder.category)}`}>
                        <CategoryIcon className="w-4 h-4"/>
                    </div>
                    <span className={`text-xs font-medium rounded-full border ${getPriorityColor(reminder.priority)}`}>
                        {reminder.priority}
                    </span>
                    <div className='flex items-center space-x-1 text-xs text-gray-500'>
                        <span>{getRingtoneEmoji(reminder.ringtone)}</span>
                    </div>
                    {lapsedStatus && !reminder.completed && (
                        <span className='flex items-center space-x-1 text-xs text-red-500'>
                            <IoMdAlert className='w-3 h-3'/>
                            <span>Lapsed</span>
                            </span>
                    )}
                </div>
                <h3 className={`font-semibold text-lg mb-2 ${reminder.completed ? "line-through" : "text-gray-800"}`}> {reminder.title}</h3>
                <p className={`text-sm ${reminder.completed ? "text-gray-400" : "text-gray-600"}`}>{reminder.description}</p>
                <div className='flex flex-wrap items-center text-sm text-gray-500'>
                    <FaCalendar className='w-4 h-4 mr-1'/>
                    <span>{formatDateTime(reminder.dateTime)}</span>
                    <span className='mx-2'>|</span>
                    <FaClock className='w-4 h-4 mr-1'/>
                    <span className={lapsedStatus && !reminder.completed ? "text-red-500" : ""}>{timeUtil}</span>
                </div>
            </div>
        </div>
        <div className='flex justify-end p-4 ml-2'>
            <button className='mr-2' onClick={() => onComplete(reminder.id)}>
                <FaCheck className='w-6 h-6 text-green-500'/>
            </button>
            <button onClick={() => onDelete(reminder.id)}>
                <FaTrash className='w-6 h-6 text-red-500'/>
            </button>
        </div>
    </div>
  )
}

export default ReminderItem