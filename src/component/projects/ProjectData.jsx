import PropTypes from "prop-types";
import { convertDate } from "../../utils/date-format";

const ProjectDetails = ({ project }) => {
 
    return (
        <div className="bg-white p-3 rounded shadow w-1/3 relative">
            <div className="flex flex-wrap content-center items-center gap-2">
                <div className="project-logo bg-secondary p-3 rounded">
                    <svg
                        height="50px"
                        width="50px"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 496.8 496.8"
                        className="hover-svg"
                    >
                        <path
                            fill="#1FC5C9"
                            d="M392.4,456.8c0,22.4-14.4,39.2-36.8,39.2H112.4c-22.4,0-24-16.8-24-39.2V57.6C88.4,36,90,16,112.4,16
                            h259.2c22.4,0,20.8,20,20.8,41.6V456.8z"
                        />
                        <polygon fill="#F9D93D" points="232.4,88 232.4,496 464.4,496 464.4,153.6 395.6,88" />
                        <polyline fill="#E2B947" points="352.4,88 232.4,88 232.4,496 464.4,496" />
                        <g>
                            {[212.8, 252.8, 292.8, 332.8, 372.8, 412.8].map((y) => (
                                <path
                                    key={y}
                                    fill="#F2EB9E"
                                    d={`M424.4,${y}c0,1.6-1.6,3.2-3.2,3.2h-66.4c-1.6,0-3.2-1.6-3.2-3.2v-2.4c0-1.6,1.6-3.2,3.2-3.2h66.4
                                    c1.6,0,3.2,1.6,3.2,3.2V${y}z`}
                                />
                            ))}
                        </g>
                        <path
                            fill="#1FC5C9"
                            d="M352.4,455.2c0,23.2-16.8,40.8-40,40.8H59.6c-23.2,0-27.2-17.6-27.2-40.8V40.8
                            c0-23.2,4-40.8,27.2-40.8h252.8c23.2,0,40,17.6,40,40.8V455.2z"
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
                <div className="project-details flex align-center flex-col text-sm">
                    <p className="text-md text-primary">
                        {project.name}
                    </p>
                    <p className="text-gray-600 text-xs">
                        {convertDate(project.startDate)}
                    </p>
                </div>
            </div>
            <div className="mt-2 mb-4">
                <ul className="list-none text-sm">
                    {project.team.map((member, index) => (
                        <li key={index} className="text-sm">
                            <span className="text-gray-600">{member.role}:</span><span className="text-xs ml-1">{member.name}</span>
                        </li>
                    ))}
                    <li><span className="text-gray-600">Created On:</span><span className="text-xs ml-1">{project.startDate}</span></li>
                </ul>
            </div>
            <div className="status absolute text-sm right-2 top-2">
                <p className="">
                    <span className="text-xs">Status:</span>
                    {new Date(project.dueDate) < new Date()? <span className="text-red-400 ml-1 text-xs">Completed</span>:<span className="text-primary ml-1 text-xs">In Progress</span>}
                </p>
            </div>
        </div>
    );
};

ProjectDetails.propTypes = {
    project: PropTypes.object.isRequired
}

export default ProjectDetails;
