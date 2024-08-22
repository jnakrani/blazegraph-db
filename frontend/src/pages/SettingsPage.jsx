import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";
import React from "react";

const SettingsPage = () => {
  return (
    <React.Fragment>
      <div className="d-flex">
        <Sidebar />
        <MainContent />
      </div>
    </React.Fragment>
  );
};

export default SettingsPage;
