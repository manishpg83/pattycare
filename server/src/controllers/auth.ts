import axios from "axios";
import { Request, Response } from "express";
import { apiUrl } from "../common/config";
import { Users } from "../dfxApi/Users";

export const authenticateUser = async (req: Request, res: Response) => {
  const { username, password, accessCode, timestamp } = req.body;
  const { authorization } = req.headers;

  // Validate provided values
  if (
    [username, password, accessCode, timestamp].includes("") ||
    [username, password, accessCode, timestamp].includes(undefined)
  ) {
    return {
      result: "error",
      error: "VALIDATION_ERROR",
    };
  }

  // Validate the access code
  const dow = timestamp.substr(timestamp.length - 1, 1);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  if (accessCode.toLowerCase() !== days[dow].toLowerCase()) {
    return {
      result: "error",
      error: "INVALID_LOGIN",
    };
  }

  // Validation passed, get access token from back end
  try {
    const loginData = {
      Email: username,
      Password: password,
    };

    const { data } = await axios.post(`${apiUrl}/users/auth`, loginData, {
      headers: {
        Authorization: authorization || "",
      },
    });

    return { result: "success", token: data.Token };
  } catch (e) {
    return { result: "error", error: "INVALID_LOGIN" };
  }
};

export const signUp = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const users = new Users();

  const result = await users.signUp(email, password);

  return res.status(result!.status).json(result!.data);
};

export const signIn = async (req: Request, res: Response) => {
  const { email, password, mfaToken, accessCode, timestamp } = req.body;

  // This is temporary validation via access code
  // Validate provided values
  if (
    [email, password, accessCode, timestamp].includes("") ||
    [email, password, accessCode, timestamp].includes(undefined)
  ) {
    return res.status(400).json({
      result: "error",
      error: "VALIDATION_ERROR",
    });
  }

  // Validate the access code
  const dow = timestamp.substr(timestamp.length - 1, 1);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  if (accessCode.toLowerCase() !== days[dow].toLowerCase()) {
    return res.status(401).json({
      result: "error",
      error: "INVALID_LOGIN",
    });
  }

  // Validation passed
  const users = new Users();
  const result = await users.signIn(email, password, mfaToken);

  res.status(result?.status).json(result?.data);
};

export const enterpriseSignIn = async (req: Request, res: Response) => {
  const { email, password, configId, mfaToken } = req.body;

  // This is temporary validation via access code
  // Validate provided values
  if (
    [email, password, configId].includes("") ||
    [email, password, configId].includes(undefined)
  ) {
    return res.status(400).json({
      result: "error",
      error: "VALIDATION_ERROR",
    });
  }

  const users = new Users();
  const result = await users.signIn(email, password, mfaToken, configId);

  res.status(result?.status || 400).json(result?.data);
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email || email === "") {
    return res.status(400).json({
      result: "error",
      error: "VALIDATION_ERROR",
    });
  }

  // Validation passed
  const users = new Users();
  const result = await users.resetPassword(email);

  res.status(result?.status).json(result?.data);
};
