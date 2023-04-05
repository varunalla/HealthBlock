import React, { FunctionComponent, useContext, useEffect } from 'react';
import { HealthContext } from '../providers/HealthProvider';
const WalletComponent: FunctionComponent<{}> = () => {
  const { currentAccount, checkIfWalletIsConnected, connectWallet } = useContext(HealthContext);
  useEffect(() => {
    (async () => {
      await checkIfWalletIsConnected?.();
    })();
  }, []);

  return (
    <div className='text-white'>
      {currentAccount && <div> Account: {currentAccount}</div>}
      {!currentAccount && <button onClick={() => connectWallet?.()}>Connect</button>}
    </div>
  );
};
export default WalletComponent;
