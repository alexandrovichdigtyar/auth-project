import {
  AppBar, Avatar, Button, Grid, Typography,
} from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import HomeSharpIcon from '@mui/icons-material/HomeSharp';
import { auth } from '../../firebase-config';
import { setCurrentUser } from '../../reduxToolkit/userSlice';
import { useAppDispatch, useAppSelector } from '../../reduxToolkit/hooks';

export default function Header() {
  const currentUser = useAppSelector((state) => state.userReducer.currentUser);
  const dispatch = useAppDispatch();

  const logoutUser = async () => {
    signOut(auth).then(() => dispatch(setCurrentUser(null)));
  };

  return (
    <AppBar color="primary">
      <Grid
        container
        justifyContent="space-between"
        direction="row"
        alignItems="center"
        alignSelf="center"
        maxWidth="1200px"
      >
        <Grid item>
          <Link to="/homePage">
            <HomeSharpIcon fontSize="large" color="info" />
          </Link>
        </Grid>
        <Grid item>
          <Typography>
            {currentUser ? (
              <>
                <Button>
                  {currentUser.photoURL
                    ? (<Avatar src={currentUser.photoURL} />)
                    : <Avatar>{currentUser.email}</Avatar>}
                </Button>
                {' '}

                <Button onClick={logoutUser} color="secondary">
                  logout
                </Button>
              </>
            ) : (
              <Button color="primary" variant="outlined">
                <Link to="/login">
                  Login
                </Link>
              </Button>
            )}
          </Typography>
        </Grid>
      </Grid>
    </AppBar>
  );
}
