import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Moralis from "moralis";
import { useMoralis } from "react-moralis";
import TOKEN_ABI from "../abi/token_abi.json";
import { useNavigate, Link } from "react-router-dom";
import { routeProps } from "../interface/token";

function MyAppbar() {
  const navigate = useNavigate();
  const { authenticate, isAuthenticated, user, logout } = useMoralis();
  const appTitle = "TJK NFT";
  const pages: routeProps[] = [
    { label: "Market", route: "/market" },
    { label: "Collections", route: "/collections" },
    { label: "Faucet", route: "/faucet" },
  ];
  const settings = ["Profile", "Account", "Dashboard", "Logout"];
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (selected: string) => {
    console.log(
      "🚀 ~ file: App.tsx ~ line 77 ~ handleCloseUserMenu ~ selected",
      selected
    );
    switch (selected) {
      case "Profile":
        // code block
        break;
      case "Account":
        // code block
        break;
      case "Dashboard":
        // code block
        break;
      case "Logout":
        logOut();
        break;
      default:
      // code block
    }
    setAnchorElUser(null);
  };

  const login = async () => {
    if (!isAuthenticated) {
      const user = await authenticate({
        signingMessage: "Log in using Moralis",
      });
      if (user) {
        console.log("logged in user:", user);
        console.log(user!.get("ethAddress"));
      }
      // .then(function (user) {
      //   console.log("logged in user:", user);
      //   console.log(user!.get("ethAddress"));
      // })
      // .catch(function (error) {
      //   console.log(error);
      // });
      // Get a (ethers.js) web3Provider
      const web3Provider = await Moralis.enableWeb3();
      const signer = web3Provider.getSigner();
      const ethers = Moralis.web3Library;
      const tjkTokenAddress = "0x2904c76f66b57A77FaA446533428B66a431c6b67";
      const tjkTokenAbi = TOKEN_ABI;
      // const tjkTokenContract = new ethers.Contract(
      //   tjkTokenAddress,
      //   tjkTokenAbi,
      //   web3Provider
      // );
      const tjkTokenContractWithSigner = new ethers.Contract(
        tjkTokenAddress,
        tjkTokenAbi,
        signer
      );
      const name = await tjkTokenContractWithSigner.name();
      console.log(name);
      // const mint = await tjkTokenContractWithSigner.mint(
      //   user?.get("ethAddress"),
      //   Moralis.Units.ETH(1)
      // );
      // console.log(mint);
      console.log(user?.get("ethAddress"));
      console.log(Moralis.Units.ETH(1));
    }
  };

  const logOut = async () => {
    await logout();
    navigate("/");
    console.log("logged out");
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
          >
            {appTitle}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {isAuthenticated &&
                pages.map((page) => (
                  <MenuItem key={page.route} onClick={handleCloseNavMenu}>
                    <Link to={page.route}>
                      <Typography textAlign="center">{page.label}</Typography>
                    </Link>
                  </MenuItem>
                ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            {appTitle}
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {isAuthenticated &&
              pages.map((page) => (
                <Link to={page.route}>
                  <Button
                    key={page.route}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {page.label}
                  </Button>
                </Link>
              ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated ? (
              <>
                {user?.get("ethAddress").substring(0, 5) +
                  "..." +
                  user?.get("ethAddress").slice(-4)}
                <Tooltip title="Open settings">
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={() => handleCloseUserMenu(setting)}
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Button onClick={login} color="inherit">
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default MyAppbar;
