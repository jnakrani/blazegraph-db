import Sidebar from "../components/Sidebar";
import React from "react";
import FileUpload from "../components/FileUpload";

const UploadPage = () => {
  return (
    <React.Fragment>
      <div className="d-flex">
        <Sidebar />
        <FileUpload />
      </div>
    </React.Fragment>
  );
};

export default UploadPage;
