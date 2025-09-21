import React, { useState, useEffect } from 'react'
import { getCurrentDateTime } from '../utils/date';
import { FaPlus, FaVolumeUp } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { type ReminderForm } from '../types';

interface ReminderFormProps {
    onSubmit: (data: ReminderForm) => void;
    isVisible: boolean;
    onClose: () => void;
}
const ReminderForm: React.FC<ReminderFormProps> = ({ onSubmit, isVisible, onClose }) => {
    const [formData, setFormData] = useState<ReminderForm>({
        title: '',
        description: '',
        date: '',
        time: '',
        category: 'personal',
        priority: 'low',
        ringtone: 'classic',
    });
    useEffect(() => {
        if (isVisible) {
            const { date, time } = getCurrentDateTime();
            setFormData((prev) => ({ ...prev, date, time, ringtone: "classic" }));
        }
    }, [isVisible]);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.title.trim() && formData.date && formData.time) {
            onSubmit(formData);
            setFormData({
                title: '',
                description: '',
                date: '',
                time: '',
                category: 'personal',
                priority: 'low',
                ringtone: 'classic',
            });
            onClose();
        }
    };

    if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Create New Reminder</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <IoMdClose className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="px-6 py-4 bg-green-50 border-b border-green-100">
                    <div className="flex items-center space-x-2 text-green-700">
                        <FaVolumeUp className="w-4 h-4" />
                        <span className="text-sm font-medium">
                            Notifications are always enabled - select your preferred ringtone below
                        </span>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter reminder title"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Add details about this reminder"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                            <input
                                type="time"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ringtone</label>
                        <select
                            value={formData.ringtone}
                            onChange={(e) => setFormData({ ...formData, ringtone: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="classic">📞 Classic Alarm</option>
                            <option value="digital">💻 Digital Beep</option>
                            <option value="chime">🔔 Gentle Chime</option>
                            <option value="urgent">🚨 Urgent Alert</option>
                            <option value="gentle">🎵 Gentle Melody</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="personal">Personal</option>
                                <option value="work">Work</option>
                                <option value="health">Health</option>
                                <option value="education">Education</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 font-medium"
                    >
                        <FaPlus className="w-4 h-4" />
                        <span>Create Reminder</span>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ReminderForm