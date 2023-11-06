import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/system';
import { FC } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import logo from '../assets/images/logo1.jpeg';
import { Header, Profile, Demo, Results, SignIn } from '../Pages';
import ProtectedRoute from '../ProtectedRoute';

export const App: FC = () => {
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
      <Router>
        <Header />
        <Container component="main" maxWidth="sm">
          <Box
            p="5"
            mt="10"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={logo}
              style={{
                height: '400px',
                width: '400px',
              }}
            />
          </Box>
          <Switch>
            <Route exact path="/">
              <SignIn />
            </Route>
            <Route path="/results">
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            </Route>
            <Route path="/profile">
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            </Route>
            <Route path="/demo">
              <ProtectedRoute>
                <Demo />
              </ProtectedRoute>
            </Route>
          </Switch>
        </Container>
      </Router>
    </ThemeProvider>
  );
};
