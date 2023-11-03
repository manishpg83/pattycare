import axios from 'axios';
import { Request, Response } from 'express';
import crypto from 'crypto';
import { Organizations } from '../dfxApi';
import { Base64Binary } from '../common/Base64Binary';

export const fetchConfig = async (req: Request, res: Response) => {
  try {
    const encryptionKey = [
      181, 83, 81, 118, 246, 200, 218, 84, 111, 135, 89, 107, 244, 233, 104, 118,
    ];
    const { configId } = req.params;

    const branchUrl = `https://api2.branch.io/v1/url?url=https://anura.app.link/${configId}&branch_key=key_live_plt1q750sVtoLr1VL8ZPtmdmwEprvhRK`;

    const { status, data } = await axios.get(branchUrl);

    if (status >= 400) {
      return res.status(status).send(data);
    }

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

    // Fetch the org ID from the license
    const { ID, OrgAddresses, Name } = await new Organizations().getOrgDetails(
      configObj.license.key
    );

    res.json({
      orgId: ID,
      orgName: Name,
      studyId: configObj.license.studyID,
      orgAddresses: OrgAddresses,
      results: configObj.results.pageKeys,
    });
  } catch (e) {
    res.status(404).send({
      code: 'REQUEST_FAILED',
      message: e,
    });
  }
};
