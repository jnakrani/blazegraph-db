import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { CiCirclePlus } from "react-icons/ci";
import BModal from "./BModal/BModal";
import DBModal from "./DatabaseModal/DBModal";
import RepositoryModal from "./DatabaseModal/RepositoryModal";
import { HTTP } from "../utils";
import { Card, Row, Col, Container } from "react-bootstrap";
import { IoCloseSharp } from "react-icons/io5";
import { IoMdCheckmark } from "react-icons/io";

const InfoItem = ({ label, value }) => (
  <div className="mb-2 d-flex">
    <div className="w-50">{label}</div>
    <div>{value}</div>
  </div>
);

const data = [
  {
    id: 1,
    label: "kb",
    url: "http://localhost:9999/blazegraph/namespace/kb/sparql",
  },
  {
    id: 2,
    label: "datamap",
    url: "http://111.222.333.44:9999/blazegraph/namespace/datamap/sparql",
  },
];

const MainContent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

  const [isOpenRepository, setIsOpenRepository] = useState(false);
  const handleCloseRepository = () => setIsOpenRepository(false);
  const handleOpenRepository = () => setIsOpenRepository(true);

  const [activeDatabase, setActiveDatabase] = useState(null);
  const [activeRepository, setActiveRepository] = useState(null);

  useEffect(() => {
    fetchActiveDatabase();
    fetchActiveRepository();
  }, []);

  const fetchActiveDatabase = async () => {
    try {
      const response = await HTTP.get("/active-database/");
      setActiveDatabase(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchActiveRepository = async () => {
    try {
      const response = await HTTP.get("/active-repository/");
      setActiveRepository(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewDatabase = () => {
    handleOpen();
  };

  const handleNewRepository = () => {
    handleOpenRepository();
  };

  const handleRefetch = () => {
    fetchActiveDatabase();
    fetchActiveRepository();
  };
  return (
    <React.Fragment>
      <div className="w-100 px-5 pt-4 bg-custom-light">
        <Navbar />
        <div className="mb-4">
          <h3 className="mb-4 fs-5">
            Active Database Information{" "}
            <CiCirclePlus
              onClick={() => handleNewDatabase()}
              style={{ cursor: "pointer" }}
            />
          </h3>

          {activeDatabase?.data?.status ? (
            <div className="mb-5">
              <Card className="border">
                <Card.Body>
                  <Row>
                    <Col xs={12} md={4}>
                      <h6>Basic Information</h6>
                      <InfoItem label="Database Type" value="Blazegraph" />
                      <InfoItem label="IP Address" value="localhost" />
                      <InfoItem label="Port" value="9999" />
                      <InfoItem label="Repositories" value="1" />
                    </Col>
                    <Col xs={12} md={8}>
                      <h6>Additional Information</h6>
                      <Row>
                        <Col xs={12} sm={6}>
                          <InfoItem
                            label="runningQueriesCount"
                            value={
                              activeDatabase?.data?.status
                                ?.runningQueriesCount || 0
                            }
                          />
                          <InfoItem
                            label="queryStartCount"
                            value={
                              activeDatabase?.data?.status?.queryStartCount || 0
                            }
                          />
                          <InfoItem
                            label="queryErrorCount"
                            value={
                              activeDatabase?.data?.status?.queryErrorCount || 0
                            }
                          />
                          <InfoItem
                            label="queryDoneCount"
                            value={
                              activeDatabase?.data?.status?.queryDoneCount || 0
                            }
                          />
                          <InfoItem
                            label="queryPerSecond"
                            value={
                              activeDatabase?.data?.status?.queriesPerSecond ||
                              0
                            }
                          />
                        </Col>
                        <Col xs={12} sm={6}>
                          <InfoItem
                            label="operatorTasksPerQuery"
                            value={
                              activeDatabase?.data?.status
                                ?.operatorTasksPerQuery || 0
                            }
                          />
                          <InfoItem
                            label="operatorStartCount"
                            value={
                              activeDatabase?.data?.status
                                ?.operatorStartCount || 0
                            }
                          />
                          <InfoItem
                            label="operatorHaltCount"
                            value={
                              activeDatabase?.data?.status?.operatorHaltCount ||
                              0
                            }
                          />
                          <InfoItem
                            label="operatorActiveCount"
                            value={
                              activeDatabase?.data?.status
                                ?.operatorActiveCount || 0
                            }
                          />
                          <InfoItem
                            label="deadlineQueueSize"
                            value={
                              activeDatabase?.data?.status?.deadlineQueueSize ||
                              0
                            }
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          ) : (
            <div className="mb-5">
              <Card className="border" style={{ height: "20vh" }}>
                <Card.Body>No active database found.</Card.Body>
              </Card>
            </div>
          )}
        </div>
        <div>
          <h3 className="mb-4 fs-5">
            Repository{" "}
            <CiCirclePlus
              onClick={() => handleNewRepository()}
              style={{ cursor: "pointer" }}
            />
          </h3>

          {activeRepository ? (
            <div className="mb-3">
              {activeRepository?.data?.map((item) => (
                <Card key={item.id} className="border p-2 mb-2">
                  <div className="d-flex align-items-center px-3 py-2">
                    <div className="col-2">
                      <p className="mb-0">{item.title}</p>
                    </div>

                    <div className="col-7 text-truncate">
                      <p
                        className="mb-0 text-truncate"
                        style={{ maxWidth: "100%" }}
                      >
                        {item.sparql_endpoint}
                      </p>
                    </div>

                    <div className="col-1 text-end">
                      <button
                        className="btn p-1 rounded-5 d-flex align-items-center justify-content-center"
                        style={{
                          height: "30px",
                          width: "30px",
                          background: "#E5F2FF",
                        }}
                      >
                        <IoCloseSharp />
                      </button>
                    </div>

                    <div className="col-1 text-end">
                      <button
                        className="btn p-1 rounded-5 d-flex align-items-center justify-content-center"
                        style={{
                          height: "30px",
                          width: "30px",
                          background: "#E5F2FF",
                        }}
                      >
                        <IoMdCheckmark />
                      </button>
                    </div>

                    <div className="col-1 text-end">
                      <button
                        className="btn p-1 rounded-5 d-flex align-items-center justify-content-center"
                        style={{
                          height: "30px",
                          width: "30px",
                          background: "#E5F2FF",
                        }}
                      >
                        <IoMdCheckmark />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="shadow-sm p-3 mb-5 bg-body rounded">
              <div className="card-body" style={{ height: "20vh" }}>
                No active repository found.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for creating a new database */}
      <BModal
        show={isOpen}
        onHide={handleClose}
        backdrop="static"
        title="Create a new database"
        keyboard={false}
        size="lg"
      >
        <DBModal handleClose={handleClose} refetch={handleRefetch} />
      </BModal>

      {/* Modal for connecting an existing database */}
      <BModal
        show={isOpenRepository}
        onHide={handleCloseRepository}
        backdrop="static"
        title="Connect with the existing database"
        keyboard={false}
        size="lg"
      >
        <RepositoryModal handleCloseRepository={handleCloseRepository} name_space={activeDatabase?.data?.database?.name_space}/>
      </BModal>
    </React.Fragment>
  );
};

export default MainContent;
