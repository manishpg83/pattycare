import axios from 'axios';
import { apiUrl, appIdentifier, appName, appVersion, licenseKey } from '../common/config';

export interface TokenDetails {
  DeviceID: string;
  Token: string;
  RoleID: string;
}

export const decodeToken = (token: string) => {
  const base64String = token.split('.')[1];
  const decodedValue = JSON.parse(Buffer.from(base64String, 'base64').toString('ascii'));
  return decodedValue;
};

export const getToken = async () => {
  try {
    const response = await axios.post(`${apiUrl}/organizations/licenses`, {
      Key: licenseKey,
      DeviceTypeID: 'WIN32',
      Name: appName,
      Identifier: appIdentifier,
      Version: appVersion,
      TokenExpiresIn: 600,
    });

    const { DeviceID, Token, RoleID, RefreshToken } = response.data;

    return { result: 'success', DeviceID, Token, RoleID, RefreshToken };
  } catch (e) {
    return { result: 'error', error: e };
  }
};
