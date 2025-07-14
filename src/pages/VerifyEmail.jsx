// src/pages/VerifyEmail.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box, CircularProgress, Alert, Button } from '@mui/material';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyUserEmail = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');

      if (!token) {
        setVerificationStatus('error');
        setMessage('Verification token not found in URL.');
        return;
      }

      try {
        // Mengirim token ke backend untuk verifikasi
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-email?token=${token}`);
        setVerificationStatus('success');
        setMessage(response.data.message || 'Your email has been successfully verified!');
      } catch (error) {
        setVerificationStatus('error');
        setMessage(error.response?.data?.message || 'Email verification failed. Please try again or register again.');
      }
    };

    verifyUserEmail();
  }, [location.search]);

  const handleLoginRedirect = () => {
    navigate('/auth'); // Redirect to login page
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 8 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: 'background.paper',
        }}
      >
        {verificationStatus === 'verifying' && (
          <>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography component="h1" variant="h5">
              Verifying your email...
            </Typography>
          </>
        )}
        {verificationStatus === 'success' && (
          <>
            <Alert severity="success" sx={{ mb: 2, width: '100%' }}>
              {message}
            </Alert>
            <Button variant="contained" onClick={handleLoginRedirect}>
              Go to Login
            </Button>
          </>
        )}
        {verificationStatus === 'error' && (
          <>
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {message}
            </Alert>
            <Button variant="outlined" onClick={handleLoginRedirect}>
              Go to Login
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default VerifyEmail;