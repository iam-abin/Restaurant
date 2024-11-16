import axios from "axios";
import { BASE_URL_BACKEND } from "../utils/constants";

export const axiosInstance = axios.create({ baseURL: BASE_URL_BACKEND, withCredentials: true });