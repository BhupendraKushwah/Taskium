import PropTypes from "prop-types";
import { convertDate } from "../../utils/date-format";
import { useProject } from "../../context/ProjectContext/ProjectContext";
import {Button} from "../commonComponent/customFields";

const ProjectDetails = ({ project }) => {
    const { deleteProject } = useProject();

    const deleteProjectHandler = (id) => {
        deleteProject(id);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md relative group cursor-pointer hover:shadow-lg transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Project Logo */}
                <div className="project-logo bg-secondary p-2 rounded-md flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20">
                    <svg
                        height="100%"
                        width="100%"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 496.8 496.8"
                        className="hover-svg"
                    >
                        <path
                            fill="#1FC5C9"
                            d="M392.4,456.8c0,22.4-14.4,39.2-36.8,39.2H112.4c-22.4,0-24-16.8-24-39.2V57.6C88.4,36,90,16,112.4,16 h259.2c22.4,0,20.8,20,20.8,41.6V456.8z"
                        />
                        <polygon fill="#F9D93D" points="232.4,88 232.4,496 464.4,496 464.4,153.6 395.6,88" />
                        <polyline fill="#E2B947" points="352.4,88 232.4,88 232.4,496 464.4,496" />
                        <g>
                            {[212.8, 252.8, 292.8, 332.8, 372.8, 412.8].map((y) => (
                                <path
                                    key={y}
                                    fill="#F2EB9E"
                                    d={`M424.4,${y}c0,1.6-1.6,3.2-3.2,3.2h-66.4c-1.6,0-3.2-1.6-3.2-3.2v-2.4c0-1.6,1.6-3.2,3.2-3.2h66.4 c1.6,0,3.2,1.6,3.2,3.2V${y}z`}
                                />
                            ))}
                        </g>
                        <path
                            fill="#1FC5C9"
                            d="M352.4,455.2c0,23.2-16.8,40.8-40,40.8H59.6c-23.2,0-27.2-17.6-27.2-40.8V40.8 c0-23.2,4-40.8,27.2-40.8h252.8c23.2,0,40,17.6,40,40.8V455.2z"
                        />
                        <path
                            fill="#0E94AA"
                            d="M56.4,0h256c23.2,0,40,17.6,40,40.8V456c0,23.2-16.8,40.8-40,40.8h-256"
                        />
                        <path
                            fill="#058AA0"
                            d="M311.6,0c23.2,0,40.8,17.6,40.8,40.8V456c0,23.2-16.8,40.8-40,40.8"
                        />
                        <g>
                            {[143.6, 194.8, 245.2].map((cx) => (
                                <circle key={cx} fill="#1FC5C9" cx={cx} cy="85.6" r="7.2" />
                            ))}
                        </g>
                        <polygon fill="#E2B947" points="464.4,220 464.4,152 395.6,152" />
                        <polygon fill="#F2EB9E" points="395.6,88 395.6,152 464.4,152" />
                        <polygon
                            fill="#FFFFFF"
                            points="185.2,268 139.6,313.6 171.6,345.6 249.2,268 171.6,189.6 139.6,221.6"
                        />
                    </svg>
                </div>

                {/* Project Details */}
                <div className="project-details flex-1 text-sm">
                    <p className="text-md text-primary truncate">
                        {project.name}
                    </p>
                    <p className="text-gray-600 text-xs">
                        {convertDate(project.startDate)}
                    </p>
                </div>
            </div>

            {/* Team Members and Created Date */}
            <div className="mt-3">
                <ul className="list-none text-sm space-y-1">
                    {project.team.map((member, index) => (
                        <li key={index} className="text-sm truncate">
                            <span className="text-gray-600">{member.role}:</span>
                            <span className="text-xs ml-1">{member.name}</span>
                        </li>
                    ))}
                    <li>
                        <span className="text-gray-600">Created On:</span>
                        <span className="text-xs ml-1">{convertDate(project.startDate)}</span>
                    </li>
                </ul>
            </div>

            {/* Status */}
            <div className="status absolute text-sm right-4 top-4">
                <p>
                    <span className="text-xs">Status:</span>
                    {new Date(project.dueDate) < new Date() ? (
                        <span className="text-red-400 ml-1 text-xs">Completed</span>
                    ) : (
                        <span className="text-primary ml-1 text-xs">In Progress</span>
                    )}
                </p>
            </div>

            {/* Delete Button */}
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:flex sm:justify-end">
                <Button
                    handleClick={() => deleteProjectHandler(project.id)}
                    type="button"
                    bgColor="bg-white"
                    textColor="text-red-500"
                    className="border rounded p-1 hover:bg-red-200 hover:border-red-500 border-1 transition-colors duration-200"
                >
                    <i className="ph-duotone ph-trash text-lg"></i>
                </Button>
            </div>
        </div>
    );
};

ProjectDetails.propTypes = {
    project: PropTypes.object.isRequired
}

export default ProjectDetails;
