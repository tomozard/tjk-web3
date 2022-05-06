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
import { nftBalanceProps } from "../interface/token";
import NFT_ABI from "../abi/nft_abi.json";

function Market() {
  const { isAuthenticated, user } = useMoralis();
  const navigate = useNavigate();
  if (!isAuthenticated || !user) {
    navigate("/");
  }

  const [tjkNFTs, setTJKNft] = useState<nftBalanceProps>();

  const fetchTJKNFTs = async (address: string) => {
    const allNFTs = await Moralis.Web3API.token.getNFTOwners({
      chain: "rinkeby",
      // address: "0xa0e2284a5be9a7d4bdfe30840b9837d9ef9fd9fb",
      address: "0x1bc3c084052D1e31E925CA541D467cD8F1f2dF0c",
    });
    return allNFTs;
  };

  const mintNFT = async () => {
    const web3Provider = await Moralis.enableWeb3();
    const signer = web3Provider.getSigner();
    const ethers = Moralis.web3Library;
    const nftAddress = "0x1bc3c084052D1e31E925CA541D467cD8F1f2dF0c";
    const nftAbi = NFT_ABI;
    const nftContractWithSigner = new ethers.Contract(
      nftAddress,
      nftAbi,
      signer
    );
    const nft = await nftContractWithSigner.safeMint(
      "ipfs://QmQvm3PhzSRCTSMH32oZNJPz5t2rTcKk2u1L3uVBjELZce"
    );
    console.log(nft);
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchTJKNFTs(user?.get("ethAddress")).then((nfts) => {
        setTJKNft(nfts);
      });
    }
  }, [isAuthenticated, user]);
  return (
    <>
      <Container maxWidth="lg">
        <Typography variant="h5" gutterBottom component="div" pt={2}>
          TJK Market :{" "}
          <Button variant="contained" size="large" onClick={() => mintNFT()}>
            Spen 10 TJK for Mint NFT
          </Button>
        </Typography>
        <Grid container spacing={2} pb={2}>
          {tjkNFTs?.result?.map(
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
