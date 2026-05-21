export const ERROR_CATALOGUE = [
  {
    code: 400,
    description: "Bad Request",
    cause: "Invalid request parameters",
    resolution: "Check request body and query params",
  },
  {
    code: 401,
    description: "Unauthorized",
    cause: "Missing or invalid token",
    resolution: "Login again or refresh token",
  },
  {
    code: 404,
    description: "Not Found",
    cause: "Endpoint does not exist",
    resolution: "Verify API path",
  },
  {
    code: 500,
    description: "Internal Server Error",
    cause: "Server failure",
    resolution: "Retry request later",
  },
];