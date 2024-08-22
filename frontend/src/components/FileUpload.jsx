import { useState, useEffect } from "react";
import {
  // Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Navbar from "./Navbar";
import "../assets/css/FileUpload.css";
import { HTTP } from "../utils";
import { toast } from "react-toastify";
import allImages from "../constant/images";
import { Form, Dropdown, DropdownButton, Button } from "react-bootstrap";
import { CiFileOn } from "react-icons/ci";

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [showFileList, setShowFileList] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(-1);
  const [activeRepository, setActiveRepository] = useState(null);
  const [selectedgraph, setSelectedgraph] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchActiveRepository();
  }, []);

  // Fetch files from the server
  const fetchFiles = async () => {
    try {
      const response = await HTTP.get("/files", {
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        withCredentials: true,
      });
      setFiles(response.data.files);
    } catch (error) {
      console.error("There was an error fetching the files!", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? -1 : index);
  };

  const handleSelect = (index) => {
    let newFiles = [...files];
    newFiles[index].selected = !newFiles[index].selected;
    setFiles(newFiles);
  };

  const handleDelete = (index) => {
    let newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleGraphIdChange = (index, graphId) => {
    let newFiles = [...files];
    newFiles[index].graphId = graphId;
    setFiles(newFiles);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const allowedExtensions = ["ttl", "rdf", "xml", "nt", "jsonld"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      const fileSize = file.size; // File size in bytes

      const findActiveGraph = activeRepository?.data?.find(
        (item) => item?.repository_id === selectedgraph
      );
      console.log(findActiveGraph, selectedgraph);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("size", fileSize);
      formData.append("graph_id", findActiveGraph?.repository_id);
      formData.append("namespace", findActiveGraph?.title);

      try {
        await HTTP.post("/upload/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-Requested-With": "XMLHttpRequest",
            Accept: "application/json",
          },
        });
        toast.success(`File ${file.name} uploaded successfully.`);
        fetchFiles();
        setShowFileList(true);
        document.getElementById("fileInput").value = "";
      } catch (error) {
        console.error("There was an error uploading the file!", error);
        setError("Error uploading file. Please try again.");
      }
    } else {
      setError(
        "Invalid file type. Allowed types are: .ttl, .rdf, .xml, .nt, .jsonld"
      );
    }
  };

  const handleImportClick = () => {
    document.getElementById("fileInput").click();
  };

  const fetchActiveRepository = async () => {
    try {
      const response = await HTTP.get("/active-repository/");
      setActiveRepository(response.data);
      if (response.data.data.length > 0) {
        setSelectedgraph(response.data.data[0]?.repository_id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-100 px-5 pt-4 bg-custom-light">
      <Navbar />

      <div
        onClick={() => handleImportClick()}
        className="d-flex border rounded-3 p-4 mb-5"
        style={{ width: "513px" }}
      >
        <CiFileOn size={70} className="me-3" />
        <div>
          <h6>File Upload</h6>
          <p>
            RDF/XML, TTL, TRIPLES, JSON-LD 등의 파일 형식을 지원하고, 여러
            파일의 선택이 가능합니다.
          </p>
        </div>
      </div>

      <div className="">
        {showFileList && files.length > 0 && (
          <div>
            {/* <ul>
              {files.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul> */}
          </div>
        )}

        <input
          type="file"
          accept=".ttl,.rdf,.xml,.nt,.jsonld"
          onChange={handleFileUpload}
          className="form-control mb-4"
          id="fileInput"
          style={{ display: "none" }}
        />
        <div className="d-flex align-items-center mb-3">
          <div className="me-3">
            <label htmlFor="databaseType" className="form-label">
              Select Active Repository
            </label>
            <select
              id="databaseType"
              className="form-select"
              value={selectedgraph}
              onChange={(e) => setSelectedgraph(e.target.value)}
            >
              {activeRepository?.data?.map((item) => (
                <option key={item.repository_id} value={item.repository_id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleImportClick}>
            Import
          </button>
        </div>
        {error && <p className="text-danger">{error}</p>}

        {files.length === 0 ? (
          <p className="text-center text-danger fw-bolder text-uppercase">
            No record found
          </p>
        ) : (
          <>
            {/* <table className="table">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col" className="text-muted">
                  File
                </th>
                <th scope="col" className="text-muted">
                  Named Graph ID
                </th>
                <th scope="col" className="text-muted">
                  File size
                </th>
                <th scope="col" className="text-muted">
                  Delete
                </th>
                <th scope="col" className="text-muted">
                  Import
                </th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={file.selected}
                      onChange={() => handleSelect(index)}
                    />
                  </td>
                  <td>{file.name}</td>
                  <td>
                   
                      <div className="col-sm-3">
            <select
              id="databaseType"
              className="form-select border-0"
            >
              <option value="">graph1</option>
              <option value="Blazegraph">graph2</option>
              <option value="Blazegraph">None</option>
              <option value="Blazegraph">추가</option>
            </select>
          </div>

                   
                  </td>
                  <td>{file.size}</td>
                  <td>
                    <p onClick={() => handleDelete(index)}>
                      <img src={allImages.cancel} alt="" />
                    </p>
                  </td>
                  <td>
                    <p onClick={() => handleImportClick(index)}>
                      <img src={allImages.download} alt="" />
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table> */}

            <div className="d-flex pb-2 mb-2 fw-bold px-5">
              <div className="col-sm-1">Select</div>
              <div className="col-sm-6">File</div>
              <div className="col-sm-2">Named Graph ID</div>
              <div className="col-sm-1 text-center">File Size</div>
              <div className="col-sm-1 text-center">Delete</div>
              <div className="col-sm-1 text-center">Import</div>
            </div>
            {files.map((file, index) => (
              <div
                key={index}
                className="d-flex align-items-center border rounded-3 px-5 py-2 mb-2"
              >
                <div className="col-sm-1">
                  <Form.Check
                    type="checkbox"
                    checked={file.selected}
                    onChange={() => handleSelect(index)}
                  />
                </div>
                <div className="col-sm-6">{file.name}</div>
                <div className="col-sm-2">
                  <div className="col-sm-6">
                    <select id="databaseType" className="form-select border-0">
                      {activeRepository?.data?.map((item) => (
                        <option value="Blazegraph">{item.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-sm-1 text-center">{file.size}</div>
                <div className="col-sm-1 text-center">
                  <p onClick={() => handleDelete(index)} className="mb-0">
                    <img src={allImages.cancel} alt="" />
                  </p>
                </div>
                <div className="col-sm-1 text-center">
                  <p onClick={() => handleImportClick()} className="mb-0">
                    <img src={allImages.download} alt="" />
                  </p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
