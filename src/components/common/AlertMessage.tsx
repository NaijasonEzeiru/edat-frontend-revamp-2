import React, {useEffect} from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';

const AlertMessage = ({ alerts, onClose }) => {
  return (
    <>
      {alerts.map((alert, index) => (
        <Snackbar
          key={index}
          open={alert.open}
          autoHideDuration={1000}
          onClose={() => onClose(index)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          TransitionComponent={Slide}
          TransitionProps={{ direction: 'down' }}
        >
          <Alert severity={alert.severity} onClose={() => onClose(index)}>
            {alert.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};


export default AlertMessage;
