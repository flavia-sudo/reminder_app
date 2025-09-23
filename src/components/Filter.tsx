import React from 'react';
import { FaSearch, FaFilter } from "react-icons/fa";

interface FilterProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    categoryFilter: string;
    onCategoryChange: (category: string) => void;
    priorityFilter: string;
    onPriorityChange: (priority: string) => void;
    statusFilter: string;
    onStatusChange: (status: string) => void;
}
const Filter: React.FC<FilterProps> = ({ searchTerm, onSearchChange, categoryFilter, onCategoryChange, priorityFilter, onPriorityChange, statusFilter, onStatusChange}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
            <div className='flex items-center space-x-2 mb-4'>
                <FaFilter className="w-6 h-6 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-700">Filter & Search</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className='block text-sm font-medium text0gray-700 mb-1'>Search:</label>
                    <div className="relative">
                        <FaSearch className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search by title or description"
                            className="w-full px-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"/>
                    </div>
                </div>
                <div>
                    <label className='block text-sm font-medium text0gray-700 mb-1'>Status</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => onStatusChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500">
                        <option value="">All</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="lapsed">Lapsed</option>
                    </select>
                </div>

                <div>
                    <label className='block text-sm font-medium text0gray-700 mb-1'>Category</label>
                    <select
                        value={categoryFilter}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500">
                        <option value="">All</option>
                        <option value="personal">Personal</option>
                        <option value="work">Work</option>
                        <option value="health">Health</option>
                        <option value="education">Education</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div>
                    <label className='block text-sm font-medium text0gray-700 mb-1'>Priority</label>
                    <select
                        value={priorityFilter}
                        onChange={(e) => onPriorityChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500">
                        <option value="">All</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
            </div>
        </div>
    )
}

export default Filter