import { appIdentifier, appName, appVersion, licenseKey } from '../common/config';
import { Base } from './Base';

export class Organizations extends Base {
  constructor() {
    super('/organizations');
  }

  async getToken(orgLicense: string = '') {
    const result = await this.post('/licenses', {
      Key: orgLicense !== '' ? orgLicense : licenseKey,
      DeviceTypeID: 'WIN32',
      Name: appName,
      Identifier: appIdentifier || '',
      Version: appVersion,
      TokenExpiresIn: 600,
      // TokenSubject: appUrl,
    });

    const { Token, DeviceID, RoleID } = result!.data;

    return { Token, DeviceID, RoleID };
  }

  async getOrgDetails(licenseKey: string) {
    const { Token } = await this.getToken(licenseKey);

    this.addHeaders({ Authorization: `Bearer ${Token}` });
    const result = await this.getAll('');

    return result;
  }
}
