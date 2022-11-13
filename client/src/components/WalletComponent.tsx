import React, { FunctionComponent } from "react";
import { useEthers } from "@usedapp/core";
const WalletComponent: FunctionComponent<{}> = () => {
    const { account, activateBrowserWallet, deactivate } = useEthers()
    return (<div className="text-white">
        {account &&
            <div>
                Wallet ID :  {account}
            </div>
        }
        {!account &&
            <button onClick={() => activateBrowserWallet()}>
                Connect
            </button>
        }
    </div>)
}
export default WalletComponent;