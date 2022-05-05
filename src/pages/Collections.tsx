import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Moralis from "moralis";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import { nftBalanceProps } from "../interface/token";
import {
  Card,
  CardHeader,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";

function Collections() {
  const { isAuthenticated, account } = useMoralis();
  const navigate = useNavigate();
  if (!isAuthenticated) {
    navigate("/");
  }
  const Web3Api = useMoralisWeb3Api();
  const fetchNFTs = async (address: string) => {
    const nfts = await Web3Api.Web3API.account.getNFTs({
      chain: "rinkeby",
      address,
    });
    // console.log("🚀 ~ file: App.tsx ~ line 113 ~ fetchNFTs ~ nfts", nfts);
    return nfts;
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (account) {
        fetchNFTs(account).then((nfts) => {
          console.log(
            "🚀 ~ file: Collections.tsx ~ line 34 ~ fetchNFTs ~ nfts",
            nfts
          );
          setNftBalances(nfts);
        });
      }
    }
  }, [isAuthenticated]);

  const [nftBalances, setNftBalances] = useState<nftBalanceProps>();
  return (
    <>
      <Container maxWidth="lg">
        <Typography variant="h5" gutterBottom component="div" pt={2}>
          My Collections :
        </Typography>
        <Grid container spacing={2} pb={2}>
          {nftBalances?.result?.map(
            (nft) =>
              nft.metadata && (
                <Grid item xs={12} sm={6} md={4} lg={3} key={nft.block_number}>
                  <Card sx={{ maxWidth: 360 }}>
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
                    {/* <CardActions disableSpacing></CardActions> */}
                  </Card>
                </Grid>
              )
          )}
        </Grid>
      </Container>
    </>
  );
}

export default Collections;
