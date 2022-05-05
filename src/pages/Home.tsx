import { useState, useEffect } from "react";
import Moralis from "moralis";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import TOKEN_ABI from "../abi/token_abi.json";
import {
  nativeBalanceProps,
  tokenBalanceProps,
  nftBalanceProps,
} from "../interface/token";
import { Container } from "@mui/material";
function Home() {
  const {
    authenticate,
    isAuthenticated,
    isAuthenticating,
    user,
    account,
    logout,
  } = useMoralis();
  const [nativeBalance, setNativeBalance] = useState<nativeBalanceProps>({
    balance: "0",
  });
  const [tokenBalances, setTokenBalances] = useState<tokenBalanceProps[]>([]);
  const [nftBalances, setNftBalances] = useState<nftBalanceProps>();
  const [allNFTs, setAllNft] = useState<nftBalanceProps>();
  const Web3Api = useMoralisWeb3Api();

  useEffect(() => {
    if (isAuthenticated) {
      if (account) {
        fetchNativeBalance(account).then((balances) => {
          setNativeBalance(balances);
        });
        fetchTokenBalances(account).then((balances) => {
          setTokenBalances(balances);
        });
        fetchNFTs(account).then((nfts) => {
          setNftBalances(nfts);
        });
        fetchAllNFTs(account).then((nfts) => {
          setAllNft(nfts);
        });
        getTJKBalance(account).then((balance) => {
          console.log(
            "🚀 ~ file: App.tsx ~ line 79 ~ getTJKBalance ~ balance",
            balance
          );
        });
        // mintTJK(account, Moralis.Units.ETH(1)).then((mint) => {
        //   console.log("🚀 ~ file: App.tsx ~ line 79 ~ mintTJK ~ mint", mint);
        // });
      }
    }
  }, [isAuthenticated]);

  const fetchNativeBalance = async (address: string) => {
    const balances = await Web3Api.account.getNativeBalance({
      chain: "rinkeby",
      address,
    });
    return balances;
  };

  const fetchTokenBalances = async (address: string) => {
    const balances = await Web3Api.account.getTokenBalances({
      chain: "rinkeby",
      address,
    });
    return balances;
  };

  const fetchNFTs = async (address: string) => {
    const nfts = await Web3Api.Web3API.account.getNFTs({
      chain: "rinkeby",
      address,
    });
    console.log("🚀 ~ file: App.tsx ~ line 113 ~ fetchNFTs ~ nfts", nfts);
    // const nftsForContract = await Web3Api.Web3API.account.getNFTsForContract({
    //   chain: "rinkeby",
    //   address: address,
    //   token_address: "0xa0e2284a5be9a7d4bdfe30840b9837d9ef9fd9fb"
    // });
    // console.log("🚀 ~ file: App.tsx ~ line 116 ~ fetchNFTs ~ nftsForContract", nftsForContract)
    return nfts;
  };

  const fetchAllNFTs = async (address: string) => {
    const allNFTs = await Moralis.Web3API.token.getNFTOwners({
      chain: "rinkeby",
      // address: "0xa0e2284a5be9a7d4bdfe30840b9837d9ef9fd9fb",
      address: "0x1bc3c084052D1e31E925CA541D467cD8F1f2dF0c",
    });
    return allNFTs;
  };

  const getTJKBalance = async (address: string) => {
    const balanceOfTJK = await Moralis.Web3API.native.runContractFunction({
      chain: "rinkeby",
      address: "0x2904c76f66b57A77FaA446533428B66a431c6b67",
      function_name: "balanceOf",
      // @ts-ignore-start
      abi: TOKEN_ABI,
      // @ts-ignore-end
      params: { account: address },
    });

    return balanceOfTJK;
  };

  // const mintTJK = async (to: string, amount: string) => {
  //   const mint = await Moralis.Web3API.native({
  //     // chain: "rinkeby",
  //     // address: "0x2904c76f66b57A77FaA446533428B66a431c6b67",
  //     // function_name: "mint",
  //     // // @ts-ignore-start
  //     // abi: TOKEN_ABI,
  //     // // @ts-ignore-end
  //     // params: { to, amount },
  //     chain: "rinkeby",
  //     contractAddress: "0x2904c76f66b57A77FaA446533428B66a431c6b67",
  //     functionName: "mint",
  //     abi: TOKEN_ABI,
  //     params: { to, amount },
  //   });

  //   return mint;
  // };

  return (
    <Container maxWidth="lg">
      <div>
        <h1>Moralis Hello World!</h1>
        {isAuthenticated && (
          <>
            <p>Account Address : {account}</p>
            <p>
              {"Coin Balance : " +
                Moralis.Units.FromWei(nativeBalance.balance) ?? ""}
            </p>
            <p>{"Token Balance : "}</p>
            <ul>
              {tokenBalances?.map((balance) => (
                <li key={balance.token_address}>
                  {balance.symbol +
                    " : " +
                    Moralis.Units.FromWei(balance.balance)}
                </li>
              ))}
            </ul>
            <p>{"NFT Total: " + nftBalances?.total}</p>
            <ul>
              {nftBalances?.result?.map((nft) => (
                <li key={nft.token_id}>
                  {nft.metadata &&
                    nft.name +
                      "#" +
                      nft.token_id +
                      " : " +
                      JSON.parse(nft?.metadata).name}
                  {nft.metadata && (
                    <>
                      <br />
                      <img
                        src={JSON.parse(nft.metadata).image}
                        alt={JSON.parse(nft?.metadata).name}
                        width="200"
                      />
                    </>
                  )}
                </li>
              ))}
            </ul>
            <p>{"All NFT Total: " + allNFTs?.total}</p>
            <ul>
              {allNFTs?.result?.map((nft) => (
                <li key={nft.token_id}>
                  {nft.metadata &&
                    nft.name +
                      "#" +
                      nft.token_id +
                      " : " +
                      JSON.parse(nft?.metadata).name}
                  <br />
                  {" Owner Address : " + nft.owner_of}
                  {nft.metadata && (
                    <>
                      <br />
                      <img
                        src={JSON.parse(nft.metadata).image}
                        alt={JSON.parse(nft?.metadata).name}
                        width="200"
                      />
                    </>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </Container>
  );
}

export default Home;
