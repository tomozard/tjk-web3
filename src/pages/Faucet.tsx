import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMoralis } from "react-moralis";
import Moralis from "moralis";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import TOKEN_ABI from "../abi/token_abi.json";
import FAUCET_ABI from "../abi/faucet_abi.json";
import { useMoralisWeb3Api } from "react-moralis";
function Faucet() {
  const { isAuthenticated, account } = useMoralis();
  const navigate = useNavigate();
  if (!isAuthenticated) {
    navigate("/");
  }
  const Web3Api = useMoralisWeb3Api();
  const [faucetBalances, setFaucetBalances] = useState<string>("0");
  const [tokenBalances, setTokenBalances] = useState<string>("0");
  const [tokenAllowance, setTokenAllowance] = useState<string>();
  const [tokenSymbol, setTokenSymbol] = useState<string>();

  const getFaucetBalance = async (address: string) => {
    const balanceOfFaucet = await Moralis.Web3API.native.runContractFunction({
      chain: "rinkeby",
      address: "0x2904c76f66b57A77FaA446533428B66a431c6b67",
      function_name: "balanceOf",
      // @ts-ignore-start
      abi: TOKEN_ABI,
      // @ts-ignore-end
      params: { account: address },
    });

    return balanceOfFaucet;
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

  const fetchTokenAllowance = async (address: string) => {
    const allowance = await Moralis.Web3API.native.runContractFunction({
      chain: "rinkeby",
      address: "0x2904c76f66b57A77FaA446533428B66a431c6b67",
      function_name: "allowance",
      // @ts-ignore-start
      abi: TOKEN_ABI,
      // @ts-ignore-end
      params: {
        owner: address,
        spender: "0x700C3d73ADCE643C1F3409a18aE9E8FAE15fcfF9",
      },
    });
    console.log(allowance);

    return allowance;
  };

  const callFaucet = async () => {
    const web3Provider = await Moralis.enableWeb3();
    const signer = web3Provider.getSigner();
    const ethers = Moralis.web3Library;
    const faucetAddress = "0x700C3d73ADCE643C1F3409a18aE9E8FAE15fcfF9";
    const faucetAbi = FAUCET_ABI;

    const faucetContractWithSigner = new ethers.Contract(
      faucetAddress,
      faucetAbi,
      signer
    );
    await faucetContractWithSigner.requestTokens();
  };

  const fetchTokenSymbol = async () => {
    //Get metadata for one token. Ex: USDT token on ETH
    const symbol = await Moralis.Web3API.native.runContractFunction({
      chain: "rinkeby",
      address: "0x2904c76f66b57A77FaA446533428B66a431c6b67",
      function_name: "symbol",
      // @ts-ignore-start
      abi: TOKEN_ABI,
      // @ts-ignore-end
      params: {},
    });
    console.log(symbol);

    return symbol;
  };

  useEffect(() => {
    if (isAuthenticated && account) {
      getFaucetBalance("0x700C3d73ADCE643C1F3409a18aE9E8FAE15fcfF9").then(
        (balance) => {
          setFaucetBalances(balance);
        }
      );
      getTJKBalance(account).then((balance) => {
        setTokenBalances(balance);
      });
      fetchTokenAllowance(account).then((allowance) => {
        setTokenAllowance(allowance);
      });
      fetchTokenSymbol().then((symbol) => {
        setTokenSymbol(symbol);
      });
    }
  }, []);

  return (
    <>
      <Container maxWidth="lg">
        <Stack spacing={2} py={2}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Balance
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {tokenBalances &&
                  Number(
                    Moralis.Units.FromWei(tokenBalances)
                  ).toLocaleString()}{" "}
                {tokenSymbol}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                size="large"
                onClick={() => callFaucet()}
              >
                Send Me 10 {tokenSymbol}
              </Button>
            </CardActions>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Allowance for Donation
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {tokenAllowance &&
                  Number(
                    Moralis.Units.FromWei(tokenAllowance)
                  ).toLocaleString()}{" "}
                {tokenSymbol}
              </Typography>
            </CardContent>
            <CardActions>
              <TextField
                autoFocus
                // margin="dense"
                id="allowance"
                label="Set Amount Allowance"
                type="number"
                fullWidth
                variant="standard"
              />
              <Button variant="contained" size="large">
                Set
              </Button>
            </CardActions>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Faucet Donation
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Balance of faucet{" "}
                {faucetBalances &&
                  Number(
                    Moralis.Units.FromWei(faucetBalances)
                  ).toLocaleString()}{" "}
                {tokenSymbol}
              </Typography>
            </CardContent>
            <CardActions>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Donate Amount"
                type="number"
                fullWidth
                variant="standard"
              />
              <Button variant="contained" size="large">
                Donate
              </Button>
            </CardActions>
          </Card>
        </Stack>
      </Container>
    </>
  );
}

export default Faucet;
