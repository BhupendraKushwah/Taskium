import PropTypes from "prop-types";
import { convertDate } from "../../utils/date-format";
import { useProject } from "../../context/ProjectContext/ProjectContext";
import { Button } from "../commonComponent/customFields";
import { useState } from "react";

const ProjectDetails = ({ project }) => {
  const { deleteProject } = useProject();
  const [isTeamExpanded, setIsTeamExpanded] = useState(false);

  const deleteProjectHandler = (id) => {
    deleteProject(id);
  };

  const isCompleted = new Date(project.dueDate) < new Date();

  // Mock focus tag (could be dynamic in a real app)
  const focusTag = "Design";

  return (
    <div className="rounded-2xl bg-gradient-to-br from-white to-teal-50 p-6 w-full max-w-sm shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 min-h-[320px] mx-auto border border-teal-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <span className="w-12 h-12 bg-teal-200 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-xl font-bold text-teal-700">
              {project.name[0]}
            </span>
          </span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 truncate max-w-[160px]">
              {project.name}
            </h3>
            <p className="text-xs text-gray-600">
              Started: {convertDate(project.startDate)}
            </p>
          </div>
        </div>
        <span className="text-xs font-medium text-teal-700 bg-teal-100 px-2 py-1 rounded-full shadow-sm">
          P-{project.id}
        </span>
      </div>

      {/* Focus Tag */}
      <div className="mb-5">
        <div className="flex items-center gap-3 bg-teal-100 p-3 rounded-lg shadow-sm">
          <i className="ph ph-target text-teal-600 text-xl"></i>
          <div>
            <p className="text-sm text-gray-800 font-medium">Current Focus:</p>
            <span className="text-sm font-semibold text-teal-700 bg-teal-200 px-2 py-1 rounded-full">
              {focusTag}
            </span>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="flex justify-between items-center mb-5">
        <span className="text-sm text-gray-700 font-medium">Status:</span>
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full shadow-sm ${
            isCompleted
              ? "bg-teal-200 text-teal-800"
              : "bg-yellow-200 text-yellow-800"
          }`}
        >
          {isCompleted ? "Done" : "In Progress"}
        </span>
      </div>

      {/* Team */}
      <div className="mb-5">
        <button
          className="w-full text-sm text-gray-700 font-semibold flex items-center justify-between py-2 hover:text-teal-700 transition-colors duration-200 cursor-pointer"
          onClick={() => setIsTeamExpanded(!isTeamExpanded)}
        >
          Team ({project.team.length})
          <i
            className={`ph ph-caret-${isTeamExpanded ? "up" : "down"} text-xl text-teal-600`}
          ></i>
        </button>
        {isTeamExpanded && (
          <ul className="mt-2 space-y-2 text-sm text-gray-700">
            {project.team.map((member, index) => (
              <li
                key={index}
                className="flex items-center gap-3 bg-teal-50 rounded-lg px-3 py-2 hover:bg-teal-100 transition-colors duration-200"
              >
                <span className="w-6 h-6 bg-teal-200 rounded-full flex items-center justify-center text-xs font-semibold text-teal-700">
                  {member.name[0]}
                </span>
                <span>
                  <span className="font-medium text-teal-800">
                    {member.role}:
                  </span>{" "}
                  {member.name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Due Date */}
      <div className="text-sm text-gray-700 mb-5">
        <p>
          Due:{" "}
          <span className="font-semibold text-gray-900">
            {convertDate(project.dueDate)}
          </span>
        </p>
      </div>

      {/* Footer with Delete Button */}
      <div className="flex justify-end">
        <Button
          handleClick={() => deleteProjectHandler(project._id)}
          type="button"
          bgColor="bg-teal-600"
          textColor="text-white"
          className="px-4 py-1.5 rounded-full hover:bg-teal-700 transition-all duration-200 flex items-center gap-2 text-sm font-medium shadow-md"
        >
          <i className="ph-duotone ph-trash text-lg"></i>
          Delete
        </Button>
      </div>
    </div>
  );
};

ProjectDetails.propTypes = {
  project: PropTypes.object.isRequired,
};

export default ProjectDetails;