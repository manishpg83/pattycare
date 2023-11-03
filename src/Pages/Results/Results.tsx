import React, { FC, useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useQuery } from '../../hooks';

export const Results: FC = () => {
  const [resultsData, setResultsData] = useState<any>();
  const query = useQuery();

  useEffect(() => {
    const results = query.get('results');

    try {
      if (!results || results === '') {
        return;
      }

      const resultsBuffer = Buffer.from(results, 'base64');
      const resultsObj = JSON.parse(resultsBuffer.toString());

      console.log(resultsObj);
      setResultsData(resultsObj);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const renderValue = (valueName: string, decimalDigits: number) => {
    return resultsData && resultsData[valueName] && !isNaN(resultsData[valueName])
      ? Math.round(resultsData[valueName] * Math.pow(10, decimalDigits)) /
          Math.pow(10, decimalDigits)
      : '-';
  };

  return (
    <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
      <Typography component="h1" variant="h4" align="center">
        Results
      </Typography>
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} sm={9}>
          <Typography variant="button">Heart Rate</Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="body1">{renderValue('HR_BPM', 0)}</Typography>
        </Grid>

        <Grid item xs={12} sm={9}>
          <Typography variant="button">Irregular Heartbeats</Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="body1">{renderValue('IHB_COUNT', 0)}</Typography>
        </Grid>

        <Grid item xs={12} sm={9}>
          <Typography variant="button">Breathing</Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="body1">{renderValue('BR_BPM', 0)}</Typography>
        </Grid>

        <Grid item xs={12} sm={9}>
          <Typography variant="button">Systolic Blood Pressure</Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="body1">{renderValue('BP_SYSTOLIC', 0)}</Typography>
        </Grid>

        <Grid item xs={12} sm={9}>
          <Typography variant="button">Diastolic Blood Pressure</Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="body1">{renderValue('BP_DIASTOLIC', 0)}</Typography>
        </Grid>

        <Grid item xs={12} sm={9}>
          <Typography variant="button">Heart Rate Variability</Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="body1">{renderValue('HRV_SDNN', 0)}</Typography>
        </Grid>

        <Grid item xs={12} sm={9}>
          <Typography variant="button">Cardiac Workload</Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="body1">{renderValue('BP_RPP', 0)}</Typography>
        </Grid>

        <Grid item xs={12} sm={9}>
          <Typography variant="button">Stress Index</Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="body1">{renderValue('MSI', 0)}</Typography>
        </Grid>

        <Grid item xs={12} sm={9}>
          <Typography variant="button">Body Mass Index</Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="body1">{renderValue('BMI', 0)}</Typography>
        </Grid>

        <Grid item xs={12} sm={9}>
          <Typography variant="button">Facial Skin Age</Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="body1">{renderValue('AGE', 0)}</Typography>
        </Grid>

        <Grid item xs={12} sm={9}>
          <Typography variant="button">Waist-to-Height Ratio</Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="body1">{renderValue('WAIST_TO_HEIGHT', 1)}</Typography>
        </Grid>

        <Grid item xs={12} sm={9}>
          <Typography variant="button">Body Shape Index</Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="body1">{renderValue('ABSI', 1)}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};
