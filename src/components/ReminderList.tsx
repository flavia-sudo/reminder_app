import React from 'react';
import ReminderItem from './ReminderItem';
import { type Reminder } from '../types';
import { FaCheckSquare, FaCalendar } from "react-icons/fa";

interface ReminderListProps {
    reminders: Reminder[];
    onComplete: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

const ReminderList: React.FC<ReminderListProps> = ({reminders, onComplete, onEdit, onDelete}) => {
    if (reminders.length === 0) {
        return (
            <div className="text-center py-10">
                <FaCalendar className="w-12 h-12 mx-auto text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-600 mt-2">No reminders found</h3>
                <p className="text-gray-500">You have no reminders yet. Create one now!</p>
            </div>
        );
    }
    const activeReminders = reminders.filter(reminder => !reminder.completed);
    const completedReminders = reminders.filter(reminder => reminder.completed);

    return (
        <div className="space-y-4">
            {activeReminders.length > 0 && (
                <div>
                    <h2 className='text-xl font-semibold text-gray-700 mb-2 flex items-center space-x-2'>
                        <FaCalendar className="w-6 h-6" />
                        <span>Active Reminders ({activeReminders.length})</span>
                    </h2>
                    <div className="space-y-2">
                        {activeReminders.map((reminder) => (
                            <ReminderItem
                                key={reminder.id}
                                reminder={reminder}
                                onComplete={onComplete}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                </div>
            )}
            {completedReminders.length > 0 && (
                <div>
                    <h2 className='text-xl font-semibold text-gray-700 mb-2 flex items-center space-x-2'>
                        <FaCheckSquare className="w-6 h-6" />
                        <span>Completed Reminders ({completedReminders.length})</span>
                    </h2>
                    <div className="space-y-2">
                        {completedReminders.map((reminder) => (
                            <ReminderItem
                                key={reminder.id}
                                reminder={reminder}
                                onComplete={onComplete}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ReminderList