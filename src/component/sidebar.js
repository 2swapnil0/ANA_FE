import React, { useState, useEffect } from "react";
import { CiGrid41 } from "react-icons/ci";
import { TbSettingsDown } from "react-icons/tb";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { TiHomeOutline } from "react-icons/ti";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineGroup, MdLogout } from "react-icons/md";
import { IoIosHelpCircleOutline } from "react-icons/io";
import "../css/sidebar.css";
import { useStore } from "../api/store.js";
import {
  fetchInitialData,
  fetchAgentState,
  checkInternetStatus,
  createProject,
  deleteProject,
} from "../api/api.js";

const Sidebar = ({ onNavigate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProjectContainerVisible, setIsProjectContainerVisible] = useState(false);
  const [isCreateProjectModalVisible, setIsCreateProjectModalVisible] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [message, setMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState("");
  const { projectList, setSelectedProject } = useStore((state) => ({
    projectList: state.projectList,
    setSelectedProject: state.setSelectedProject,
  }));

  useEffect(() => {
    async function fetchData() {
      await fetchInitialData();
      await fetchAgentState();
      checkInternetStatus();
      setInterval(checkInternetStatus, 5000);
    }
    fetchData();
  }, []);

  const toggleSidebar = (expand) => {
    setIsExpanded(expand);
  };

  const handleProjectSelect = (projectName) => {
    setSelectedProject(projectName);
    localStorage.setItem("selectedProject", projectName);
    setIsProjectContainerVisible(false);
  };

  const toggleProjectContainer = () => {
    setIsExpanded(false);
    setIsProjectContainerVisible(!isProjectContainerVisible);
  };

  const handleCreateProject = async () => {
    try {
      const result = await createProject(newProjectName);
      setMessage(result);
      await fetchInitialData();
      handleProjectSelect(newProjectName);
      setNewProjectName("");
      setIsCreateProjectModalVisible(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleDeleteProject = async () => {
    try {
      const result = await deleteProject(projectToDelete);
      setMessage(result);
      await fetchInitialData();
      setShowDeleteConfirmation(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
    } catch (error) {
      setMessage(error.message);
    }
  };  

  const openDeleteConfirmation = (projectName) => {
    setProjectToDelete(projectName);
    setShowDeleteConfirmation(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  // Handle Escape key press to close modals
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsCreateProjectModalVisible(false);
        setShowDeleteConfirmation(false);
        setIsProjectContainerVisible(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <main className={`sidebar flex flex-col mx-3 my-4 gap-4 items-center rounded-lg py-4 px-2 sidebar-bg ${isExpanded ? "sidebar-expanded" : ""}`}
      onMouseEnter={() => toggleSidebar(true)}
      onMouseLeave={() => toggleSidebar(false)}
    >
      <div className="menu-item  ml-4 flex items-center text-center cursor-pointer" onClick={() => onNavigate('home')}  >
        <img src="/assets/ANA Logo (1).png" alt="Logo" className="logo-img" />
        <span className={`ana-text ${isExpanded ? "expanded-ana-text" : ""}`} >Ana</span>
      </div>
      <section className="menu-section my-2 ml-4 flex flex-col gap-1 cursor-pointer">
        <div className="menu-item flex" onClick={() => onNavigate('dashboard')}>
          <a className="side-icon"><CiGrid41 /></a>
          <span className="icon-text">Dashboard</span>
        </div>
        <div className="menu-item flex items-center" onClick={() => onNavigate('integration')}>
          <a className="side-icon"><TbSettingsDown /></a>
          <span className="icon-text">Integration</span>
        </div>
        <div className="menu-item flex items-center" onClick={toggleProjectContainer}>
          <a className="side-icon"><HiOutlinePencilSquare /></a>
          <span className="icon-text">Project</span>
        </div>
        <div className="menu-item flex items-center" onClick={() => onNavigate('home')}>
          <a className="side-icon"><TiHomeOutline /></a>
          <span className="icon-text">Home</span>
        </div>
      </section>
      <section className="menu-section mt-auto my-2 ml-4 flex flex-col gap-1 cursor-pointer">
        <div className="menu-item flex items-center"  onClick={() => onNavigate('profile')}>
          <a className="side-icon"><FaRegUserCircle /></a>
          <span className="icon-text">Profile</span>
        </div>
        <div className="menu-item flex items-center"  onClick={() => onNavigate('admin')}>
          <a className="side-icon"><MdOutlineGroup /></a>
          <span className="icon-text">Admin</span>
        </div>
        <div className="menu-item flex items-center"  onClick={() => onNavigate('help')}>
          <a className="side-icon"><IoIosHelpCircleOutline /></a>
          <span className="icon-text">Help</span>
        </div>
        <div className="menu-item flex items-center">
          <a className="side-icon"><MdLogout /></a>
          <span className="icon-text">Logout</span>
        </div>
      </section>

      {isProjectContainerVisible && (
        <div className="modal-overlay" onClick={toggleProjectContainer}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="workspace-header"><h1 style={{ color: "white" }}>Select Project</h1></span>
              <button className="modal-close-btn" onClick={toggleProjectContainer}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              {projectList.length > 0 ? (
                projectList.map((project, index) => (
                  <div className="modal-item" key={index}>
                    <button
                      type="button"
                      className="modal-project-btn"
                      onClick={() => { handleProjectSelect(project); toggleProjectContainer(); }}
                    >
                      {project}
                    </button>
                    <button
                      type="button"
                      className="modal-delete-btn"
                      onClick={() => openDeleteConfirmation(project)}
                      aria-label="Delete project"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))
              ) : (
                <span>No projects available</span>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="modal-new-project-btn"
                onClick={() => setIsCreateProjectModalVisible(true)}
              >
                <i className="fas fa-plus"></i>
                New project
              </button>
            </div>
          </div>
        </div>
      )}

      {isCreateProjectModalVisible && (
        <div className="modal-overlay" onClick={() => setIsCreateProjectModalVisible(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Project</h2>
              <button className="modal-close-btn" onClick={() => setIsCreateProjectModalVisible(false)}>
                &times;
              </button>
            </div>
            <div className="">
              <input
                className="create-input text-white"
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter new project name"
              />
            </div>
            <div className="modal-footer">
              <button className="create-btn" onClick={handleCreateProject}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirmation && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Delete Project</h2>
              <button className="modal-close-btn" onClick={cancelDelete}>&times;</button>
            </div>
            <div className="modal-body text-white">
              <p>Are you sure you want to delete the project?</p>
            </div>
            <div className="modal-footer">
              <button className="create-btn" onClick={handleDeleteProject}>Yes</button>
              <button className="create-btn ml-2" onClick={cancelDelete}>No</button>
            </div>
          </div>
        </div>
      )}

      {/* Success message */}
      {showSuccessMessage && (
        <div className="success-message fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg bg-green-500 text-white">
          <p>{message}</p>
        </div>
      )}
    </main>
  );
};

export default Sidebar;
