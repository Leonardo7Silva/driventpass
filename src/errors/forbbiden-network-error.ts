import { ApplicationError } from "../protocols";

export function unauthorizedNetworkError(): ApplicationError {
  return {
    name: "UnauthorizedError",
    message: "You do not have access to this network",
  };
}