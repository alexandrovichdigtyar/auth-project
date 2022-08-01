import {
  Box,
  Button, Grid, Modal, TextField, Typography,
} from '@mui/material';
import { Container } from '@mui/system';
import {
  Field, Form, Formik, FormikProps,
} from 'formik';
import * as Yup from 'yup';
import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  linkWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
} from 'firebase/auth';
import GoogleIcon from '@mui/icons-material/Google';
import { Facebook } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase-config';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

type loginPropsType = {
  email: string,
  password: string,
}

type authConnectInfoType = {
  pendingCred: any,
  emailAuth: string | null,
}

type formValuesType = {
  email: string,
  password: string,
  confirmPassword: string,
  passwordAccept: string,
}

type FieldParamsType = {
  field: {
    name: string,
  }, meta: {
    touched: boolean,
    error: boolean,
  }
}

export type RenderTextFieldType = (input: FieldParamsType) => void

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [isConfirmingPassword, setIsConfirmingPassword] = useState(false);
  const [authConnectInfo, setAuthConnectInfo] = useState<authConnectInfoType>({
    pendingCred: null,
    emailAuth: null,
  });
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const homePage: string = '/homePage';

  const renderTextField: RenderTextFieldType = ({ field, meta }) => (
    <TextField
      label={field.name}
      type={field.name === 'confirmPassword' || field.name === 'password' ? 'password' : 'input'}
      {...field}
      variant="outlined"
      error={meta.error && meta.touched}
      helperText={meta.error || (field.name === 'email' || field.name === 'passwordAccept' ? errorMessage : null)}
      size="small"
      fullWidth
    />
  );

  const errorHandller = (error: string) => {
    switch (error) {
      case 'auth/invalid-email':
        setErrorMessage('Invalid email, try again');
        break;
      case 'auth/wrong-password':
        setErrorMessage('Email and pass do not match');
        break;
      case 'auth/too-many-requests':
        setErrorMessage('The limit has been reached, try again later');
        break;
      default:
    }
  };

  const validateForm = Yup.object().shape({
    password: Yup.string()
      .min(6, 'Too Short!')
      .max(20, 'Too Long!')
      .required('Required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });

  const loginUser = async (props: loginPropsType) => {
    const { email, password } = props;
    signInWithEmailAndPassword(auth, email, password)
      .catch((error) => errorHandller(error.code));
  };

  const registerUser = async (props: loginPropsType) => {
    const { email, password } = props;
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => navigate(homePage))
      .catch((error) => errorHandller(error.code));
  };

  const onSubmitHandller = (props: loginPropsType) => {
    isLogin ? loginUser(props) : registerUser(props);
  };

  const signInWithGoogle = () => {
    const googleProvider = new GoogleAuthProvider();
    signInWithPopup(auth, googleProvider).then(() => navigate(homePage));
  };

  const emailLinkingHandler = (props: FormikProps<formValuesType>) => {
    if (authConnectInfo.emailAuth) {
      signInWithEmailAndPassword(auth, authConnectInfo.emailAuth, props.values.passwordAccept)
        .then(() => {
          if (auth.currentUser) {
            linkWithCredential(auth.currentUser, authConnectInfo.pendingCred).then(() => {
              setIsConfirmingPassword(false);
              setIsConfirmingPassword(false);
            });
          }
        }).catch((error) => errorHandller(error.code));
    }
  };

  const renderPasswordConfirmWindow = (props: FormikProps<formValuesType>) => (
    <Modal
      open
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Field name="passwordAccept">
          {renderTextField}
        </Field>
        <Button onClick={() => emailLinkingHandler(props)}>
          Confirm
        </Button>
      </Box>
    </Modal>
  );

  const signInWithFacebook = () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .catch((err) => {
        if (err.code === 'auth/account-exists-with-different-credential') {
          setAuthConnectInfo({
            emailAuth: err.customData.email,
            pendingCred: FacebookAuthProvider.credentialFromError(err),
          });
          setErrorMessage('');
          const googleProv = new GoogleAuthProvider();

          fetchSignInMethodsForEmail(auth, err.customData.email).then((methods) => {
            if (methods[0] === 'password') {
              setIsConfirmingPassword(true);
            } else if (methods[0] === 'google.com') {
              signInWithRedirect(auth, googleProv).then((googleProv) => {
                if (auth.currentUser) {
                  linkWithCredential(auth.currentUser, googleProv);
                }
              });
            }
          });
        }
      });
  };

  const renderForm = (props: FormikProps<formValuesType>) => {
    const { isValid, touched } = props;
    return (
      <Container maxWidth="sm" style={{ marginTop: '100px' }}>
        <Form>
          <Grid
            container
            flexDirection="column"
            alignContent="center"
            alignItems="center"
            spacing={2}
            justifyContent="center"
          >
            <Grid item xs={12} sm={6}>
              <Field name="email">
                {renderTextField}
              </Field>
            </Grid>
            <Grid item>
              <Field type="password" name="password">
                {renderTextField}
              </Field>
            </Grid>
            {!isLogin && (
              <Grid item xs={12} sm={6}>
                <Field name="confirmPassword">
                  {renderTextField}
                </Field>
              </Grid>
            )}
            <Grid />
            <Grid item alignItems="center">
              <Button type="submit" disabled={!touched || !isValid} size="medium">
                save
              </Button>
            </Grid>
            <Typography align="center">
              Don’t have an account?
              <Button onClick={() => { setIsLogin(!isLogin); setErrorMessage(''); }} type="reset" size="small">
                {isLogin ? (
                  <span>
                    Sign Up
                  </span>
                ) : (
                  <span>
                    I already have an account
                  </span>
                )}
              </Button>
            </Typography>
          </Grid>
        </Form>
        <Grid
          container
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item>
            <Button onClick={signInWithGoogle} startIcon={<GoogleIcon color="success" />}>
              Sign in with google
            </Button>
          </Grid>
          <Grid item>
            <Button onClick={signInWithFacebook} startIcon={<Facebook />}>
              Sign in with Facebook
            </Button>
          </Grid>
        </Grid>
      </Container>
    );
  };

  const initialValues: formValuesType = {
    email: '', password: '', confirmPassword: '', passwordAccept: '',
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validateForm}
      onSubmit={onSubmitHandller}
      enableReinitialize
    >
      {isConfirmingPassword ? renderPasswordConfirmWindow : renderForm}
    </Formik>
  );
}

export default Login;
