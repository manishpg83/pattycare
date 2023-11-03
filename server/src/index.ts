import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { tokenController } from './controllers';
import { publicUrl, appPort, requiresAuth, configId } from './common/config';

const app = express();
app.use(express.json());

const port = appPort || 3000;

app.use(cors());

app.use(`${publicUrl}`, express.static('build'));

app.get(`/`, async (req, res) => {
  res.json({
    status: 'ok',
  });
});

app.get(`${publicUrl}/health`, async (req, res) => {
  res.json({
    status: 'ok',
  });
});

app.get(`/health`, async (req, res) => {
  res.json({
    status: 'ok',
  });
});

app.get(`${publicUrl}/api`, (req, res) => {
  res.send('The sedulous hyena ate the antelope!');
});

app.get(`${publicUrl}/api/status`, (req, res) => {
  res.json({
    status: 'ok',
    auth: requiresAuth,
  });
});

app.get(`${publicUrl}/api/configId`, async (req, res, next) => {
  res.json({
    status: 'ok',
    configId: configId,
  });
});

app.post(`${publicUrl}/api/token`, async (req, res, next) => {
  const result = await tokenController.getToken();

  if (result && result.result === 'success') {
    res.send(result);
  } else {
    next(result.error);
  }
});

app.get(`${publicUrl}/*`, (req, res) => {
  res.sendFile(`${process.cwd()}/build/index.html`);
});

app.use((error: any, request: Request, response: Response, next: NextFunction) => {
  response.status(500).send({
    status: 'ERROR',
    details: JSON.stringify(error),
  });
  // Check the error is a validation error
  // if (error instanceof ValidationError) {
  //   // Handle the error
  //   response.status(400).send(error.validationErrors);
  //   next();
  // } else {
  //   // Pass error on if not a validation error
  //   next(error);
  // }
});

app.listen(port, () => {
  return console.log(`Anura Web server is listening on ${port} under ${publicUrl}`);
});
