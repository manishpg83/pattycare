import React, { FC } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import crypto from 'crypto';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { publicKey } from './publikcKey';

export const Demo: FC = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data: any) => {
    const { age, diabetic, height, hypertension, medication, gender, smoker, weight } = data;

    // Get the token ID
    const { data: configResponseData } = await axios.get('/api/configId');

    // Get a token from the back end
    const { data: tokenResponseData } = await axios.post('/api/token');
    const { Token, RefreshToken } = tokenResponseData;

    const payload = {
      identifier: uuidv4(), // Unique identifier for the user, it will be used to tag the measurement
      age: parseInt(age),
      height: parseInt(height),
      weight: parseInt(weight),
      gender,
      smoking: smoker === 'yes' ? '1' : '0',
      antihypertensive: hypertension === 'yes' ? '1' : '1',
      bloodpressuremedication: medication === 'yes' ? '1' : '0',
      diabetes: diabetic,
    };

    const buffer = Buffer.from(JSON.stringify(payload));
    const encryptedProfile = crypto.publicEncrypt(publicKey, buffer);
    const sessionId = uuidv4(); // Unique identifier for the session, passed back as part of the result object to identify the measurement

    const sessionIdValue = !!sessionId ? sessionId : 'undefined';

    window.location.href = `https://awe.na-east.nuralogix.ai/c/${
      configResponseData.configId
    }/${encodeURIComponent(encryptedProfile.toString('base64'))}/${encodeURIComponent(
      Token
    )}/${encodeURIComponent(RefreshToken)}/${sessionIdValue}`;
  };

  return (
    <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography component="h1" variant="h4" align="center">
          Demo
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <TextField
              required
              id="age"
              label="What is your current age?"
              fullWidth
              variant="standard"
              {...register('age', { required: true })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="height"
              label="Height (cm)"
              fullWidth
              variant="standard"
              {...register('height', { required: true })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="weight"
              label="Weight (kg)"
              fullWidth
              variant="standard"
              {...register('weight', { required: true })}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Controller
              name="gender"
              control={control}
              rules={{ required: { value: true, message: 'req' } }}
              render={({ field: { name, value, onChange } }) => (
                <FormControl component="fieldset" required>
                  <FormLabel component="legend">What is your sex at birth?</FormLabel>
                  <RadioGroup row aria-label="gender" name={name} value={value} onChange={onChange}>
                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                  </RadioGroup>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Controller
              name="smoker"
              control={control}
              rules={{ required: { value: true, message: 'req' } }}
              render={({ field: { name, value, onChange } }) => (
                <FormControl component="fieldset" required>
                  <FormLabel component="legend">Do you smoke?</FormLabel>
                  <RadioGroup row aria-label="smoke" name={name} value={value} onChange={onChange}>
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Controller
              name="hypertension"
              control={control}
              rules={{ required: { value: true, message: 'req' } }}
              render={({ field: { name, value, onChange } }) => (
                <FormControl component="fieldset" required>
                  <FormLabel component="legend">Do you have hypertension?</FormLabel>
                  <RadioGroup
                    row
                    aria-label="hypertension"
                    name={name}
                    value={value}
                    onChange={onChange}
                  >
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Controller
              name="medication"
              control={control}
              rules={{ required: { value: true, message: 'req' } }}
              render={({ field: { name, value, onChange } }) => (
                <FormControl component="fieldset" required>
                  <FormLabel component="legend">
                    Are you taking blood pressure medication?
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-label="medication"
                    name={name}
                    value={value}
                    onChange={onChange}
                  >
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Controller
              name="diabetic"
              control={control}
              rules={{ required: { value: true, message: 'req' } }}
              render={({ field: { name, value, onChange } }) => (
                <FormControl component="fieldset" required>
                  <FormLabel component="legend">Are you diabetic?</FormLabel>
                  <RadioGroup
                    row
                    aria-label="diabetic"
                    name={name}
                    value={value}
                    onChange={onChange}
                  >
                    <FormControlLabel value="type1" control={<Radio />} label="Type 1" />
                    <FormControlLabel value="type2" control={<Radio />} label="Type 2" />
                    <FormControlLabel value="0" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              )}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" type="submit" sx={{ mt: 3, ml: 1 }}>
            Continue
          </Button>
        </Box>
      </form>
    </Paper>
  );
};
