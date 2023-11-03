import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { auth, provider } from "../../firebase";

import {
  selectUserName,
  setSignOutState,
  setUserLoginDetails,
} from "../../user/userSlice";

export const Header: FC = () => {
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  let history = useHistory();
  const theme = createTheme({
    palette: {
      primary: {
        main: "#c50059",
      },
      secondary: {
        main: "#00c56c",
      },
    },
  });

  const dispatch = useDispatch();
  const userName = useSelector(selectUserName);

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        history.push("/profile");
      }
    });
  }, [userName]);

  const handleAuth = () => {
    if (!userName) {
      auth
        .signInWithPopup(provider)
        .then((result: any) => {
          setUser(result.user);
        })
        .catch((error: string) => {
          alert(error);
        });
    } else if (userName) {
      auth
        .signOut()
        .then(() => {
          dispatch(setSignOutState());
          setOpenLogoutDialog(false);
          history.push("/");
        })
        .catch((err: string) => alert(err));
    }
  };

  const setUser = (user: any) => {
    dispatch(
      setUserLoginDetails({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      })
    );
  };

  // Function to open the logout confirmation dialog
  const handleOpenLogoutDialog = () => {
    setOpenLogoutDialog(true);
  };

  // Function to close the logout confirmation dialog
  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="absolute"
        color="primary"
        elevation={0}
        sx={{
          position: "relative",
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" color="inherit" noWrap>
            Pattycare
          </Typography>
          {!userName ? (
            <Button onClick={handleAuth} variant="contained">
              Login
            </Button>
          ) : (
            <Button onClick={handleOpenLogoutDialog} variant="contained">
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Dialog
        open={openLogoutDialog}
        onClose={handleCloseLogoutDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            minWidth: "400px",
            minHeight: "150px",
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Logout Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              textAlign: "center",
            }}
            id="alert-dialog-description"
          >
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogoutDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAuth} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};
