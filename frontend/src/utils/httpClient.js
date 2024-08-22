import axios from "axios";
import config from "../config/config";

const HTTP = axios.create({
  baseURL: config.baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    // Note: 'Access-Control-Allow-Origin' is typically handled by the server, not the client.
  },
});

export default HTTP;
