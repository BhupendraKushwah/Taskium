import { FaProjectDiagram, FaTasks, FaUsers, FaCalendarAlt, FaClock, FaExclamationCircle } from 'react-icons/fa';
import Calendar from '../component/commonComponent/calendar/Calender'
import { motion } from "framer-motion";

const DashboardContent = () => {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Active Projects */}
                <motion.div
                    className="bg-white p-4 rounded shadow"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                >
                    <h4 className="font-medium flex items-center space-x-2">
                        <FaProjectDiagram />
                        <span>Active Projects</span>
                    </h4>
                    <p className="text-gray-600">10 projects ongoing</p>
                </motion.div>

                {/* Tasks Due Today */}
                <motion.div
                    className="bg-white p-4 rounded shadow"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                >
                    <h4 className="font-medium flex items-center space-x-2" >
                        <FaTasks />
                        <span>Tasks Due Today</span>
                    </h4>
                    <p className="text-gray-600">5 tasks pending</p>
                </motion.div>

                {/* Team Members */}
                <motion.div
                    className="bg-white p-4 rounded shadow"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                >
                    <h4 className="font-medium flex items-center space-x-2" >
                        <FaUsers />
                        <span>Team Members</span>
                    </h4>
                    <p className="text-gray-600">20 members active</p>
                </motion.div>
            </div>

            {/* Main Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-6">
                    {/* Recent Activities */}
                    <motion.div
                        className="bg-white p-4 rounded shadow"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="dashboard-header mb-4">
                            <h4 className="font-medium flex items-center space-x-2" >
                                <FaClock />
                                <span>Recent Activities</span>
                            </h4>
                        </div>
                        <ul className="space-y-2">
                            <li className="text-gray-600">John updated the &quot;Marketing&quot; project</li>
                            <li className="text-gray-600">Anna completed the &quot;Landing Page&quot; task</li>
                            <li className="text-gray-600">Team meeting scheduled for 3 PM</li>
                        </ul>
                    </motion.div>

                    {/* Upcoming Deadlines */}
                    <motion.div
                        className="bg-white p-6 rounded shadow"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h4 className="font-medium mb-4 flex items-center space-x-2" >
                            <FaCalendarAlt />
                            <span>Upcoming Deadlines</span>
                        </h4>
                        <ul className="space-y-2">
                            <li className="text-gray-600">Website redesign - Jan 25, 2025</li>
                            <li className="text-gray-600">Product launch - Feb 1, 2025</li>
                            <li className="text-gray-600">Team performance reviews - Feb 15, 2025</li>
                        </ul>
                    </motion.div>

                    {/* Pending Approvals */}
                    <motion.div
                        className="bg-white p-6 rounded shadow"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h4 className="font-medium mb-4 flex items-center space-x-2" >
                            <FaExclamationCircle />
                            <span>Pending Approvals</span>
                        </h4>
                        <ul className="space-y-2">
                            <li className="text-gray-600">Budget for Q1 - Awaiting review</li>
                            <li className="text-gray-600">Hiring request for designer - Pending</li>
                            <li className="text-gray-600">Marketing campaign - Needs feedback</li>
                        </ul>
                    </motion.div>
                </div>

                {/* Calendar Section */}
                <div
                    className="bg-white p-2 rounded shadow sticky top-0"
                    style={{ maxHeight: "80vh", overflowY: "auto" }}
                >
                    <h4 className="font-medium mb-4 flex items-center space-x-2" >
                        <FaCalendarAlt />
                        <span>Calendar</span>
                    </h4>
                    <div className="overflow-hidden">
                        <Calendar />
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardContent;
