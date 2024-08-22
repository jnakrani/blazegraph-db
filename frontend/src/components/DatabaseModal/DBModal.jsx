import React, { useState } from "react";
import { toast } from "react-toastify";
import { HTTP } from "../../utils";
import "../../assets/css/modal.css";

const DBModal = ({ handleClose }) => {
  const [databaseType, setDatabaseType] = useState("Blazegraph");
  const [namespace, setNamespace] = useState(""); // New state variable for namespace
  const [port, setPort] = useState("9999");
  const [minMemory, setMinMemory] = useState("");
  const [maxMemory, setMaxMemory] = useState("");
  const [installationPath, setInstallationPath] = useState(""); // State for installation path

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!databaseType || !installationPath) {
      toast.error(
        "Please select the database type and provide the installation path."
      );
      return;
    }

    const data = {
      namespace,
      properties: {
        "com.bigdata.rdf.store.DataLoader":
          "com.bigdata.rdf.data.RDFDataLoader",
        "com.bigdata.rdf.store.DataLoader.context":
          "com.bigdata.rdf.data.RDFDataLoaderContext",
        "com.bigdata.rdf.sail.isolates": "true",
        "com.bigdata.rdf.sail.quads": "true",
        "com.bigdata.rdf.sail.axioms": "true",
        "com.bigdata.rdf.sail.includeInferred": "true",
        "com.bigdata.rdf.sail.incremental": "false",
      },
      port,
      minMemory,
      maxMemory,
      installationPath, // Include installation path in data
    };

    try {
      await HTTP.post("/create_database/", data, {
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          Accept: "application/json",
        },
      });
      toast.success("Database created successfully.");
      handleClose();
    } catch (error) {
      console.error("There was an error creating the database!", error);
      toast.error("Failed to create the database. Please try again.");
    }
  };

  const handleFolderChoose = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Extract the folder path (may vary by browser)
      setInstallationPath(file.webkitRelativePath || file.path || file.name);
    }
  };

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit}>
        <p className="text-muted mb-4">
          새로운 데이터베이스를 생성하기 위해 데이터베이스의 유형을 선택하고,
          설치 경로와 Port를 입력해주세요. 추가적으로 최소/최대 메모리 사용량을
          입력하면, 이에 맞게 데이터베이스가 실행됩니다.
        </p>

        <h6>Required</h6>
        <div className="mb-3 row align-items-center">
          <label htmlFor="databaseType" className="col-sm-3 col-form-label">
            Database Type
          </label>
          <div className="col-sm-3">
            <select
              id="databaseType"
              className="form-select border-0"
              value={databaseType}
              onChange={(e) => setDatabaseType(e.target.value)}
            >
              <option value="">Select Database Type</option>
              <option value="Blazegraph">Blazegraph</option>
            </select>
          </div>
        </div>

        <div className="mb-3 row align-items-center">
          <label htmlFor="installationPath" className="col-sm-3 col-form-label">
            Installation Path
          </label>
          <div className="col-sm-9 d-flex">
            <div>
              <button
                type="button"
                className="btn btn-primary me-3"
                onClick={handleFolderChoose}
                style={{ width: 'max-content'}}
              >
                Choose folder
              </button>
            </div>
            <input
                type="text"
                id="installationPath"
                className="form-control"
                value={installationPath}
                onChange={(e) => setInstallationPath(e.target.value)}
                placeholder="Enter or select installation path"
                readOnly
              />
          </div>
        </div>

        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          webkitdirectory=""
          onChange={handleFileChange}
        />

        <div className="mb-3 row align-items-center">
          <label htmlFor="port" className="col-sm-3 col-form-label">
            Port
          </label>
          <div className="col-sm-3">
            <input
              type="text"
              id="port"
              className="form-control"
              value={port}
              onChange={(e) => setPort(e.target.value)}
            />
          </div>
        </div>

        <h6>Optional</h6>
        <div className="mb-3 row align-items-center">
          <label htmlFor="minMemory" className="col-sm-5 col-form-label">
            Minimum Memory Usage (-Xms)
          </label>
          <div className="col-sm-3">
            <input
              type="text"
              id="minMemory"
              className="form-control"
              value={minMemory}
              onChange={(e) => setMinMemory(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-3 row align-items-center">
          <label htmlFor="maxMemory" className="col-sm-5 col-form-label">
            Maximum Memory Usage (-Xmx)
          </label>
          <div className="col-sm-3">
            <input
              type="text"
              id="maxMemory"
              className="form-control"
              value={maxMemory}
              onChange={(e) => setMaxMemory(e.target.value)}
            />
          </div>
        </div>

        <div className="d-flex justify-content-center mt-5">
          <button type="submit" className="btn btn-primary w-50">
            Create database
          </button>
        </div>
      </form>
    </React.Fragment>
  );
};

export default DBModal;