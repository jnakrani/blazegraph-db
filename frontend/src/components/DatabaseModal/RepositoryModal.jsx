import React, { useState } from "react";
import { toast } from "react-toastify";
import { HTTP } from "../../utils"; // Make sure this is configured to point to your backend

const RepositoryModal = ({ handleCloseRepository }) => {
  const [databaseType, setDatabaseType] = useState("Blazegraph");
  const [ipAddress, setIpAddress] = useState(""); // IP address state
  const [port, setPort] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!databaseType || !ipAddress || !port) {
      toast.error("Please select the database type, IP address, and port.");
      return;
    }

    const data = {
      databaseType,
      ipAddress,
      port,
    };

    try {
      const response = await HTTP.post("/connect_database/", data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (response.data.success) {
        toast.success("Connected to the database successfully.");
        handleCloseRepository();
      } else {
        toast.error(
          response.data.message || "Failed to connect to the database."
        );
      }
    } catch (error) {
      console.error("There was an error connecting to the database!", error);
      toast.error("Failed to connect to the database. Please try again.");
    }
  };

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit}>
        <p className="text-muted">
          기존에 실행되고 있는 데이터베이스와 연결하기 위해 데이터베이스의
          유형과 IP, Port를 입력해주세요.
        </p>
        <p className="fw-bolder">Required</p>
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
          <label htmlFor="ipAddress" className="col-sm-3 col-form-label">
            IP Address
          </label>
          <div className="col-sm-9">
            <input
              type="text"
              id="ipAddress"
              className="form-control"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
            />
          </div>
        </div>

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

        <div className="d-flex justify-content-center mt-5">
          <button type="submit" className="btn btn-primary w-50">
            Connect Database
          </button>
        </div>
      </form>
    </React.Fragment>
  );
};

export default RepositoryModal;
