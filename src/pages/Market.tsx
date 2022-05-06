import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMoralis } from "react-moralis";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import Moralis from "moralis";
import { nftResultProps } from "../interface/token";
import NFT_ABI from "../abi/nft_abi.json";
import TOKEN_ABI from "../abi/token_abi.json";

function Market() {
  const { isAuthenticated, user } = useMoralis();
  const navigate = useNavigate();
  if (!isAuthenticated || !user) {
    navigate("/");
  }
  const [tokenAllowance, setTokenAllowance] = useState<string>();
  const nftAddress = "0x1bc3c084052D1e31E925CA541D467cD8F1f2dF0c";
  const tokenAddress = "0x2904c76f66b57A77FaA446533428B66a431c6b67";
  const [tjkNFTs, setTJKNft] = useState<nftResultProps[]>();

  const fetchTJKNFTs = async (address: string) => {
    console.log(
      "🚀 ~ file: Market.tsx ~ line 36 ~ fetchTJKNFTs ~ fetchTJKNFTs"
    );
    const allNFTs = await Moralis.Web3API.token.getNFTOwners({
      chain: "rinkeby",
      // address: "0xa0e2284a5be9a7d4bdfe30840b9837d9ef9fd9fb",
      address: nftAddress,
    });
    return allNFTs;
  };

  const setAllowance = async () => {
    // console.log("🚀 ~ file: Faucet.tsx ~ line 120 ~ Faucet ~ data", data);
    const web3Provider = await Moralis.enableWeb3();
    const signer = web3Provider.getSigner();
    const ethers = Moralis.web3Library;
    const tokenContractWithSigner = new ethers.Contract(
      tokenAddress,
      TOKEN_ABI,
      signer
    );
    const approve = await tokenContractWithSigner.approve(
      nftAddress,
      Moralis.Units.ETH(100)
    );
    const tx = await approve.wait();
    if (tx && user) updateUI(user);
    // console.log(
    //   "🚀 ~ file: Faucet.tsx ~ line 133 ~ constonSetAllowance:SubmitHandler<InputAllowance>= ~ approve",
    //   approve
    // );
  };

  const fetchTokenAllowance = async (address: string) => {
    const allowance = await Moralis.Web3API.native.runContractFunction({
      chain: "rinkeby",
      address: tokenAddress,
      function_name: "allowance",
      // @ts-ignore-start
      abi: TOKEN_ABI,
      // @ts-ignore-end
      params: {
        owner: address,
        spender: nftAddress,
      },
    });

    return allowance;
  };

  const mintNFT = async () => {
    const web3Provider = await Moralis.enableWeb3();
    const signer = web3Provider.getSigner();
    const ethers = Moralis.web3Library;
    const nftContractWithSigner = new ethers.Contract(
      nftAddress,
      NFT_ABI,
      signer
    );

    const nft = await nftContractWithSigner.safeMint(
      "ipfs://QmQvm3PhzSRCTSMH32oZNJPz5t2rTcKk2u1L3uVBjELZce"
    );
    console.log("🚀 ~ file: Market.tsx ~ line 51 ~ mintNFT ~ nft", nft);
    const tx = await nft.wait();
    console.log("🚀 ~ file: Market.tsx ~ line 53 ~ mintNFT ~ tx", tx);
    if (tx && user) {
      setTJKNft([]);
      console.log("1");
      await timeout(4000);
      console.log("2");
      updateUI(user);
      console.log("3");
    }
    // navigate("/market");
    // console.log(nft);
  };

  const updateUI = (user: Moralis.User<Moralis.Attributes>) => {
    fetchTokenAllowance(user.get("ethAddress")).then((allowance) => {
      setTokenAllowance(allowance);
    });
    console.log("🚀 ~ file: Market.tsx ~ line 64 ~ updateUI ~ updateUI");
    fetchTJKNFTs(user?.get("ethAddress")).then((nfts) => {
      console.log(
        "🚀 ~ file: Market.tsx ~ line 64 ~ fetchTJKNFTs ~ nfts",
        nfts
      );
      setTJKNft(nfts.result);
    });
  };

  const timeout = (delay: number) => {
    return new Promise((res) => setTimeout(res, delay));
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      updateUI(user);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (tjkNFTs) {
      console.log(
        "🚀 ~ file: Market.tsx ~ line 74 ~ useEffect ~ tjkNFTs",
        tjkNFTs
      );
    }
  }, [tjkNFTs]);
  return (
    <>
      <Container maxWidth="lg">
        <Typography variant="h5" gutterBottom component="div" pt={2}>
          TJK Market :{" "}
          {Number(tokenAllowance) < Number(Moralis.Units.ETH(10)) ? (
            <Button
              variant="contained"
              size="large"
              onClick={() => setAllowance()}
            >
              Set Allowance 100 TJK
            </Button>
          ) : (
            <Button variant="contained" size="large" onClick={() => mintNFT()}>
              Spen 10 TJK for Mint NFT
            </Button>
          )}
        </Typography>
        <Grid container spacing={2} pb={2}>
          {tjkNFTs?.map(
            (nft) =>
              nft.metadata && (
                <Grid item xs={12} sm={6} md={4} lg={3} key={nft.block_number}>
                  <Card sx={{ maxWidth: 360 }}>
                    <CardActionArea>
                      <CardHeader
                        title={nft.name + "#" + nft.token_id}
                        subheader={JSON.parse(nft?.metadata).name}
                      />
                      <CardMedia
                        sx={{ bgcolor: "#cfe8fc" }}
                        component="img"
                        height="250"
                        image={JSON.parse(nft.metadata).image}
                        alt={JSON.parse(nft?.metadata).name}
                      />
                      <CardContent>
                        Owner :{" "}
                        {nft.owner_of?.toString().substring(0, 5) +
                          "..." +
                          nft.owner_of?.toString().slice(-4)}
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              )
          )}
        </Grid>
      </Container>
    </>
  );
}

export default Market;
