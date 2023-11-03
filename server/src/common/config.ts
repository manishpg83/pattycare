import dotenv from 'dotenv';
import * as pjson from '../../package.json';

dotenv.config();

export const appPort = process.env.APP_PORT || 3000;
export const apiUrl = process.env.API_URI || 'https://api.deepaffex.ai';
export const licenseKey = process.env.LICENSE_KEY || '';
export const appName = process.env.APP_NAME || 'acmeco';
export const appIdentifier = process.env.APP_IDENTIFIER || 'acmeco';
export const appUrl = process.env.APP_URL || '';
export const appVersion = pjson.version || '0.0.0';
export const requiresAuth = process.env.REQUIRE_AUTH || true;
export const publicUrl = process.env.PUBLIC_URL || '';
export const studyId = process.env.STUDY_ID || '';
export const configId = process.env.CONFIG_ID || '';
