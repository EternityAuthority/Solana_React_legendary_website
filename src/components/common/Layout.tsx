import React, { useState, PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import { State as StoreState, BootstrapState } from '../../store/reducer';
import Header from './Header';
import Footer from './Footer';

type Props = {};

export default function Layout(props: PropsWithChildren<Props>) {
  const { isAppReady } = useSelector((state: StoreState) => {
    return {
      isAppReady:
        state.common.isWalletConnected &&
        state.common.bootstrapState === BootstrapState.Bootstrapped,
    };
  });
  const [refresh, setRefresh] = useState(false);
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column',
        backgroundColor: 'rgb(251, 251, 251)',
      }}
    >
      <div
        style={{
          position: 'fixed',
          width: '100%',
          zIndex: 99,
        }}
      >
      <Header isAppReady={isAppReady} />
      </div>
      <div
        style={{
          width: '100%',
          marginTop: '94px',
          flex: 1,
          display: 'flex',
          marginBottom: '30px', // Compensates for the fixed position footer.
        }}
      >
        {window.localStorage.getItem('consent') ? (
          !isAppReady ? (
            <DisconnectedSplash />
          ) : (
            <div style={{ width: '100%' }}>{props.children}</div>
          )
        ) : (
          <RiskDisclosureForm
            onConsent={() => {
              window.localStorage.setItem('consent', 'true');
              setRefresh(!refresh);
            }}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}



const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

function RiskDisclosureForm({ onConsent }: { onConsent: () => void }) {
  return (
    <div
      style={{
        flex: '1',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
      }}
    >
      <div style={{ width: '100%', display: 'flex' }}>
        <div
          style={{ display: 'flex', marginLeft: 'auto', marginRight: 'auto' }}
        >
          <Typography
            style={{ marginBottom: '16px', maxWidth: '1000px' }}
            color="textSecondary"
            variant="h4"
          >
            The staking will be locked for 15 - 45 days , after that you can unstake any time.
          </Typography>
        </div>
      </div>
      <div style={{ display: 'flex', marginLeft: 'auto', marginRight: 'auto' }}>
        <Button variant="contained" color="primary" onClick={onConsent}>
          I agree
        </Button>
      </div>
    </div>
  );
}

function DisconnectedSplash() {
  const classes = useStyles();
  const { network, isDisconnected } = useSelector((state: StoreState) => {
    return {
      network: state.common.network,
      isDisconnected: !state.common.isWalletConnected,
    };
  });
  return (
    <div
      style={{
        flex: '1',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
      }}
    >
      <div style={{ width: '100%', display: 'flex' }}>
        {isDisconnected ? (
          <div
            style={{ display: 'flex', marginLeft: 'auto', marginRight: 'auto' }}
          >
            <Typography
              style={{ marginLeft: '24px' }}
              color="textSecondary"
              variant="h4"
            >
              Disconnected
            </Typography>
          </div>
        ) : (
          <div style={{ width: '100%' }}>
            <div style={{ width: '100%' }} className={classes.root}>
              <div>
                <Typography variant="h5">
                  {`Connecting to ${network.label}...`}
                </Typography>
              </div>
              <div
                style={{
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  width: '300px',
                }}
              >
                <LinearProgress style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
