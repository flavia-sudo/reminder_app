import React from 'react'
import { FaRegClock } from "react-icons/fa6";

const Header = () => {
  return (
    <header className="w-full text-white shadow-lg bg-gradient-to-r from-purple-600 to-purple-700">
        <div className="min-w-full py-6 mx-auto lg:px-20 sm:px-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <FaRegClock className="text-3xl mr-2" />
                    <div>
                        <h1 className="text-2xl font-bold">Smart Reminder System</h1>
                        <p className="text-sm text-purple-100">Manage your reminders easily</p>
                    </div>
                </div>
                {/* <div className="flex">
                    <div className="text-center">
                        <div className="text-2xl font-bold">{activeCount}</div>
                        <div className="text-sm text-purple-100">Active</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">{completedCount}</div>
                        <div className="text-sm text-purple-100">Completed</div>
                    </div>
                </div> */}
            </div>
        </div>
    </header>
  )
}

export default Header;