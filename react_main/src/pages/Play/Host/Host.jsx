import React, { useState } from "react";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
import {
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Box,
  Paper,
} from "@mui/material";

import HostMafia from "./HostMafia";
import HostSplitDecision from "./HostSplitDecision";
import HostResistance from "./HostResistance";
import HostGhost from "./HostGhost";
import HostJotto from "./HostJotto";
import HostAcrotopia from "./HostAcrotopia";
import HostSecretDictator from "./HostSecretDictator";
import HostWackyWords from "./HostWackyWords";
import HostLiarsDice from "./HostLiarsDice";

import { GameTypes } from "../../../Constants";

const gamesIcons = {
  Mafia: "/images/game_icons/Mafia.png",
  "Split Decision": "/images/game_icons/SplitDecision.png",
  Resistance: "/images/game_icons/Resistance.png",
  Ghost: "/images/game_icons/Ghost.png",
  Jotto: "/images/game_icons/Jotto.png",
  Acrotopia: "/images/game_icons/Acrotopia.png",
  "Secret Dictator": "/images/game_icons/SecretDictator.png",
  "Wacky Words": "/images/game_icons/WackyWords.png",
  "Liars Dice": "/images/game_icons/LiarsDice.png",
};

export default function Host(props) {
  const defaultGameType = "Mafia";
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [gameType, setGameType] = useState(
    params.get("game") || localStorage.getItem("gameType") || defaultGameType
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleListItemClick = (newValue) => {
    setGameType(newValue);
    localStorage.setItem("gameType", newValue);
    setDrawerOpen(false);
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer(true)}
        sx={{
          position: "fixed",
          top: "50%",
          left: 0,
          zIndex: 1201,
          visibility: drawerOpen ? "hidden" : "visible",
        }}
      >
        ☰
      </IconButton>
      <Paper
        onClick={toggleDrawer(true)}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100%",
          width: "10px",
          backgroundColor: "transparent",
          zIndex: 1200,
          cursor: "pointer",
        }}
      />
      <SwipeableDrawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" },
        }}
      >
        <List>
          {GameTypes.map((game) => (
            <ListItem
              button
              key={game}
              selected={gameType === game}
              onClick={() => handleListItemClick(game)}
            >
              <ListItemIcon>
                <img src={gamesIcons[game]} alt={game} width="24" height="24" />
              </ListItemIcon>
              <ListItemText primary={game} />
            </ListItem>
          ))}
        </List>
      </SwipeableDrawer>
      <Box>
        <Switch>
          <Route
            exact
            path="/play/host"
            render={() => {
              switch (gameType) {
                case "Mafia":
                  return <HostMafia />;
                case "Split Decision":
                  return <HostSplitDecision />;
                case "Resistance":
                  return <HostResistance />;
                case "Ghost":
                  return <HostGhost />;
                case "Jotto":
                  return <HostJotto />;
                case "Acrotopia":
                  return <HostAcrotopia />;
                case "Secret Dictator":
                  return <HostSecretDictator />;
                case "Wacky Words":
                  return <HostWackyWords />;
                case "Liars Dice":
                  return <HostLiarsDice />;
                default:
                  setGameType(defaultGameType);
                  return <></>;
              }
            }}
          />
          <Route render={() => <Redirect to="/play" />} />
        </Switch>
      </Box>
    </>
  );
}
