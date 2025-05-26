// Error envelope for API responses
export interface ApiError {
  status: "error";
  code: string; // machine‑readable, e.g. EMAIL_EXISTS
  message: string;
}
