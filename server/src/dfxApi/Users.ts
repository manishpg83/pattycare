import axios from 'axios';
import crypto from 'crypto';
import { Base64Binary } from '../common/Base64Binary';
import * as config from '../common/config';
import { Base } from './Base';
import { Organizations } from './Organizations';

export class Users extends Base {
  constructor() {
    super('/users');
  }

  async signUp(email: string, password: string) {
    try {
      const { Token: DeviceToken, DeviceID, RoleID } = await new Organizations().getToken();
      this.addHeaders({ Authorization: `Bearer ${DeviceToken}` });

      const result = await this.post('', {
        Email: email,
        Password: password,
      });

      const { status, data } = result!;

      if (status < 400) {
        console.log('STATUS_OK', data);

        return { status, data };
      } else {
        console.log('STATUS', data);
        return { status, data };
      }
    } catch (e) {
      console.log('ERROR', e);
    }
  }

  async signIn(email: string, password: string, mfaToken?: string, configId?: string) {
    try {
      // If config ID is provided, fetch the org config
      // Todo: needs refactor
      let licenseKey = config.licenseKey;
      if (configId && configId !== '') {
        const encryptionKey = [
          181, 83, 81, 118, 246, 200, 218, 84, 111, 135, 89, 107, 244, 233, 104, 118,
        ];

        const branchUrl = `https://api2.branch.io/v1/url?url=https://anura.app.link/${configId}&branch_key=key_live_plt1q750sVtoLr1VL8ZPtmdmwEprvhRK`;

        const { status, data } = await axios.get(branchUrl);

        if (status >= 400) {
          return { status, data: 'CONFIG_FETCH_ERROR' };
        } else {
          const configObject = data.data['!appConfig'];

          // Decode the config object from Base64
          const byteArray = Base64Binary.decodeArrayBuffer(configObject);

          // const key = byteArray.slice(0, 14);
          const iv = byteArray.slice(14, 16 + 14);
          const encryptedData = byteArray.slice(16 + 14, byteArray.byteLength);

          crypto.createHash('sha256').update(Buffer.from(encryptionKey)).digest();

          let decipher = crypto.createDecipheriv(
            'aes-128-cbc',
            Buffer.from(encryptionKey),
            Buffer.from(iv)
          );
          let decrypted = decipher.update(Buffer.from(encryptedData));

          let tail = '';

          try {
            tail = decipher.final().toString();
          } catch (encErr) {}

          const paddingSize = decrypted[decrypted.length - 1];
          const trimmedDecrypted = decrypted.slice(0, decrypted.length - paddingSize);

          const configObj =
            tail === ''
              ? JSON.parse(`${trimmedDecrypted.toString()}`)
              : JSON.parse(`${decrypted.toString()}${tail}`);

          licenseKey = configObj.license.key;
        }
      }

      console.log('USING LICENSE KEY', licenseKey);

      const {
        Token: DeviceToken,
        DeviceID,
        RoleID,
      } = await new Organizations().getToken(licenseKey);
      this.addHeaders({ Authorization: `Bearer ${DeviceToken}` });

      const result = await this.post('/auth', {
        Email: email,
        Password: password,
        ...(mfaToken && mfaToken !== '' && { MFAToken: mfaToken }),
      });

      const { status, data } = result!;

      if (status < 400) {
        const { Token } = data;

        return { status, data: { Token, DeviceID, RoleID } };
      } else {
        return { status, data };
      }
    } catch (e) {
      return null;
    }
  }

  async resetPassword(email: string) {
    try {
      const { Token: DeviceToken } = await new Organizations().getToken();
      this.addHeaders({ Authorization: `Bearer ${DeviceToken}` });

      const result = await this.patch('/sendreset/mobile', {
        Email: email,
      });

      const { status, data } = result!;

      if (status < 400) {
        return { status, data };
      } else {
        return { status, data };
      }
    } catch (e) {
      return null;
    }
  }
}
