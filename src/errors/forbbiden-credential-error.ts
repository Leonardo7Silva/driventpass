import { ApplicationError } from "../protocols";

export function unauthorizedCredentialError(): ApplicationError {
  return {
    name: "UnauthorizedError",
    message: "You do not have access to this credential",
  };
}