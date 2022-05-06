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
  Alert,
  Grid,
} from "@mui/material";
import TOKEN_ABI from "../abi/token_abi.json";
import FAUCET_ABI from "../abi/faucet_abi.json";
import { useMoralisWeb3Api } from "react-moralis";
import { SubmitHandler, useForm } from "react-hook-form";

type InputAllowance = {
  amount: string;
};

function Faucet() {
  const { isAuthenticated, user } = useMoralis();
  const navigate = useNavigate();
  if (!isAuthenticated || !user) {
    navigate("/");
  }
  const Web3Api = useMoralisWeb3Api();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputAllowance>();
  const {
    register: registerDonate,
    handleSubmit: handleSubmitDonate,
    formState: { errors: errorsDoante },
  } = useForm<InputAllowance>();
  const [faucetBalances, setFaucetBalances] = useState<string>("0");
  const [tokenBalances, setTokenBalances] = useState<string>("0");
  const [tokenAllowance, setTokenAllowance] = useState<string>();
  const [tokenSymbol, setTokenSymbol] = useState<string>();
  const tokenAddress = "0x2904c76f66b57A77FaA446533428B66a431c6b67";
  const nftAddress = "0x1bc3c084052D1e31E925CA541D467cD8F1f2dF0c";
  const faucetAddress = "0x700C3d73ADCE643C1F3409a18aE9E8FAE15fcfF9";

  const getFaucetBalance = async (address: string) => {
    const balanceOfFaucet = await Moralis.Web3API.native.runContractFunction({
      chain: "rinkeby",
      address: tokenAddress,
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
      address: tokenAddress,
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
      address: tokenAddress,
      function_name: "allowance",
      // @ts-ignore-start
      abi: TOKEN_ABI,
      // @ts-ignore-end
      params: {
        owner: address,
        spender: faucetAddress,
      },
    });
    console.log(allowance);

    return allowance;
  };

  const callFaucet = async () => {
    const web3Provider = await Moralis.enableWeb3();
    const signer = web3Provider.getSigner();
    const ethers = Moralis.web3Library;
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
      address: tokenAddress,
      function_name: "symbol",
      // @ts-ignore-start
      abi: TOKEN_ABI,
      // @ts-ignore-end
      params: {},
    });
    console.log(symbol);

    return symbol;
  };

  const onSetAllowance: SubmitHandler<InputAllowance> = async (data) => {
    // console.log("🚀 ~ file: Faucet.tsx ~ line 120 ~ Faucet ~ data", data);
    if (Number(data.amount) > 0) {
      const web3Provider = await Moralis.enableWeb3();
      const signer = web3Provider.getSigner();
      const ethers = Moralis.web3Library;
      const tokenContractWithSigner = new ethers.Contract(
        tokenAddress,
        TOKEN_ABI,
        signer
      );

      const approve = await tokenContractWithSigner.approve(
        faucetAddress,
        Moralis.Units.ETH(data.amount)
      );
      console.log(
        "🚀 ~ file: Faucet.tsx ~ line 133 ~ constonSetAllowance:SubmitHandler<InputAllowance>= ~ approve",
        approve
      );
    }
  };

  const onDonate: SubmitHandler<InputAllowance> = async (data) => {
    // console.log("🚀 ~ file: Faucet.tsx ~ line 120 ~ Faucet ~ data", data);
    if (Number(data.amount) > 0) {
      const web3Provider = await Moralis.enableWeb3();
      const signer = web3Provider.getSigner();
      const ethers = Moralis.web3Library;
      const faucetContractWithSigner = new ethers.Contract(
        faucetAddress,
        FAUCET_ABI,
        signer
      );

      const donate = await faucetContractWithSigner.donateTofaucet(
        Moralis.Units.ETH(data.amount)
      );
      console.log(
        "🚀 ~ file: Faucet.tsx ~ line 133 ~ constonSetAllowance:SubmitHandler<InputAllowance>= ~ donate",
        donate
      );
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      getFaucetBalance("0x700C3d73ADCE643C1F3409a18aE9E8FAE15fcfF9").then(
        (balance) => {
          setFaucetBalances(balance);
        }
      );
      getTJKBalance(user.get("ethAddress")).then((balance) => {
        setTokenBalances(balance);
      });
      fetchTokenAllowance(user.get("ethAddress")).then((allowance) => {
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
              <form
                onSubmit={handleSubmit(onSetAllowance)}
                noValidate
                style={{ width: "100%" }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={9}>
                    <TextField
                      label="Input Amount Allowance"
                      variant="standard"
                      fullWidth
                      defaultValue={Moralis.Units.FromWei(tokenBalances) ?? 0}
                      type="number"
                      {...register("amount", {
                        required: true,
                        min: 0,
                        max: Number(Moralis.Units.FromWei(tokenBalances)),
                      })}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Button
                      variant="contained"
                      size="large"
                      type="submit"
                      fullWidth
                    >
                      Set
                    </Button>
                  </Grid>
                  {errors.amount && (
                    <Grid item xs={12}>
                      <Alert severity="error">
                        This field is required and must be 0 to{" "}
                        {Moralis.Units.FromWei(tokenBalances)!}{" "}
                      </Alert>
                    </Grid>
                  )}
                </Grid>
              </form>
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
              <form
                onSubmit={handleSubmitDonate(onDonate)}
                noValidate
                style={{ width: "100%" }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={9}>
                    <TextField
                      label="Input Donate Amount"
                      variant="standard"
                      fullWidth
                      defaultValue={Moralis.Units.FromWei(tokenBalances) ?? 0}
                      type="number"
                      {...registerDonate("amount", {
                        required: true,
                        min: 0,
                        max: Number(Moralis.Units.FromWei(tokenBalances)),
                      })}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Button
                      variant="contained"
                      size="large"
                      type="submit"
                      fullWidth
                    >
                      Donate
                    </Button>
                  </Grid>
                  {errorsDoante.amount && (
                    <Grid item xs={12}>
                      <Alert severity="error">
                        This field is required and must be 0 to{" "}
                        {Moralis.Units.FromWei(tokenBalances)!}{" "}
                      </Alert>
                    </Grid>
                  )}
                </Grid>
              </form>
            </CardActions>
          </Card>
        </Stack>
      </Container>
    </>
  );
}

export default Faucet;
