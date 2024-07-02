import React from "react";
import "../css/ControlPanel.css";
import { IoGridOutline } from "react-icons/io5";
import { FaWifi } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";

const ControlPanel = ({ currentView }) => {
  let heading = "";
  let icons = null;

  switch (currentView) {
    case "home":
      heading = "Ana's Workspace";
      icons = (
        <section className="control-icons flex space-x-10 mx-10">
          <span className="control-icon"><IoSettingsOutline /></span>
          <span className="control-icon"><IoGridOutline /></span>
          <span className="control-icon"><FaWifi /></span>
        </section>
      );
      break;
    case "integration":
      heading = "Integration";
      icons = (
        <section className="control-icons flex space-x-10 mx-10">
          <span className="control-icon"><IoSettingsOutline /></span>
        </section>
      );
      break;
    case "dashboard":
      heading = "Dashboard";
      icons = (
        <section className="control-icons flex space-x-10 mx-10">
          <span className="control-icon"><IoSettingsOutline /></span>
        </section>
      );
      break;
    case "profile":
      heading = "Profile";
      icons = (
        <section className="control-icons flex space-x-10 mx-10">
          <span className="control-icon"><IoSettingsOutline /></span>
        </section>
      );
      break;
    case "admin":
      heading = "Admin";
      icons = (
        <section className="control-icons flex space-x-10 mx-10">
          <span className="control-icon"><IoSettingsOutline /></span>
        </section>
      );
      break;
    case "help":
      heading = "Help";
      icons = (
        <section className="control-icons flex space-x-10 mx-10">
          <span className="control-icon"><IoSettingsOutline /></span>
        </section>
      );
      break;
    default:
      heading = "Ana's Workspace";
      icons = (
        <section className="control-icons flex space-x-10 mx-10">
          <span className="control-icon"><IoGridOutline /></span>
          <span className="control-icon"><FaWifi /></span>
        </section>
      );
      break;
  }

  return (
    <div className="control-panel my-2 flex justify-between items-center">
      <h1 className="text-white text-4xl workspace-header">{heading}</h1>
      {icons}
    </div>
  );
};

export default ControlPanel;
