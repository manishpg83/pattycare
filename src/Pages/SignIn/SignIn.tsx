import { CssBaseline } from '@mui/material';
import Container from '@mui/material/Container';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { FC } from 'react';

export const SignIn: FC = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#c50059',
      },
      secondary: {
        main: '#00c56c',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="sm" 
      sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '70vh',
        }}>
      </Container>
    </ThemeProvider>
  );
};
