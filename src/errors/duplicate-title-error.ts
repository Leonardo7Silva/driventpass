import { ApplicationError } from "@/protocols";

export function duplicatedTitleError(): ApplicationError {
  return {
    name: "DuplicatedEmailError",
    message: "A credential with that title already exists",
  };
}