import PropTypes from "prop-types";
import { convertDate } from "../../utils/date-format";
import { useProject } from "../../context/ProjectContext/ProjectContext";
import { Button } from "../commonComponent/customFields";
import { useState } from "react";
import { getImage } from "../commonComponent/common";

const ProjectDetails = ({ project, handlePreview }) => {
  const { deleteProject } = useProject();
  const [isTeamExpanded, setIsTeamExpanded] = useState(false);

  const deleteProjectHandler = (id) => {
    deleteProject(id);
  };

  const isCompleted = new Date(project.dueDate) < new Date();

  return (
    <div className="rounded-2xl bg-gradient-to-br from-white to-teal-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 p-6 w-full max-w-sm shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 min-h-[380px] mx-auto border border-teal-100 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <span className="w-12 h-12 bg-teal-200 dark:bg-teal-700 rounded-xl flex items-center justify-center shadow-sm">
            {project.image ? (
              <img
                src={getImage('project/small', project.image)}
                alt={project.projectName}
                onClick={() => handlePreview(project?.image)}
                className="w-12 h-12 cursor-pointer object-cover rounded-xl"
              />
            ) : (
              <span className="text-xl font-bold text-teal-700 dark:text-teal-200">
                {project.projectName[0].toUpperCase()}
              </span>
            )}
          </span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate max-w-[160px]">
              {project.projectName}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Started: {convertDate(project.startDate)}
            </p>
          </div>
        </div>
        <span className="text-xs font-medium text-teal-700 dark:text-teal-200 bg-teal-100 dark:bg-teal-800 px-2 py-1 rounded-full shadow-sm">
          P-{project.id}
        </span>
      </div>

      {/* Focus Tag */}
      <div className="mb-5">
        <div className="flex items-center gap-3 bg-teal-100 dark:bg-teal-800 p-3 rounded-lg shadow-sm">
          <i className="ph ph-target text-teal-600 dark:text-teal-300 text-xl"></i>
          <div>
            <p className="text-sm text-gray-800 dark:text-gray-300 font-medium">Current Focus:</p>
            <span className="text-sm font-semibold text-teal-700 dark:text-teal-200 bg-teal-200 dark:bg-teal-700 px-2 py-1 rounded-full">
              {project.focus}
            </span>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="flex justify-between items-center mb-5">
        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Status:</span>
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full shadow-sm ${isCompleted
              ? "bg-teal-200 text-teal-800 dark:bg-teal-700 dark:text-teal-200"
              : "bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200"
            }`}
        >
          {isCompleted ? "Done" : "In Progress"}
        </span>
      </div>

      {/* Team */}
      <div className="mb-5">
        <button
          className="w-full text-sm text-gray-700 dark:text-gray-300 font-semibold flex items-center justify-between py-2 hover:text-teal-700 dark:hover:text-teal-300 transition-colors duration-200 cursor-pointer"
          onClick={() => setIsTeamExpanded(!isTeamExpanded)}
        >
          Team ({project.teamMembers.length})
          <i
            className={`ph ph-caret-${isTeamExpanded ? "up" : "down"} text-xl text-teal-600 dark:text-teal-300`}
          ></i>
        </button>
        {isTeamExpanded && (
          <ul className="mt-2 space-y-2 text-sm text-gray-700 dark:text-gray-300">
            {project.teamMembers.map((member, index) => (
              <li
                key={index}
                className="flex items-center gap-3 bg-teal-50 dark:bg-gray-700 rounded-lg px-3 py-2 hover:bg-teal-100 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                <span className="w-6 h-6 bg-teal-200 dark:bg-teal-600 rounded-full flex items-center justify-center text-xs font-semibold text-teal-700 dark:text-teal-200">
                  {member.name[0]}
                </span>
                <span>
                  <span className="font-medium text-teal-800 dark:text-teal-300">
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
      <div className="text-sm text-gray-700 dark:text-gray-300 mb-5">
        <p>
          Due:{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {convertDate(project.dueDate)}
          </span>
        </p>
      </div>

      {/* Footer with Delete Button */}
      <div className="flex justify-end">
        <Button
          handleClick={() => deleteProjectHandler(project.id)}
          type="button"
          bgColor="bg-teal-600"
          textColor="text-white"
          className="px-4 py-1.5 rounded-full hover:bg-teal-700 dark:hover:bg-teal-800 transition-all duration-200 flex items-center gap-2 text-sm font-medium shadow-md"
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