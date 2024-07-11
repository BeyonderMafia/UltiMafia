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

import LearnMafia from "./LearnMafia";
import LearnSplitDecision from "./LearnSplitDecision";
import LearnResistance from "./LearnResistance";
import LearnOneNight from "./LearnOneNight";
import LearnGhost from "./LearnGhost";
import LearnJotto from "./LearnJotto";
import LearnAcrotopia from "./LearnAcrotopia";
import LearnSecretDictator from "./LearnSecretDictator";
import LearnWackyWords from "./LearnWackyWords";
import LearnLiarsDice from "./LearnLiarsDice";

import { GameTypes } from "../../Constants";

const gamesIcons = {
  Mafia: "/images/gamesMafia.png",
  "Split Decision": "/images/gamesSplitDecision.png",
  Resistance: "/images/gamesResistance.png",
  "One Night": "/images/gamesOneNight.png",
  Ghost: "/images/gamesGhost.png",
  Jotto: "/images/gamesJotto.png",
  Acrotopia: "/images/gamesAcrotopia.png",
  "Secret Dictator": "/images/gamesSecretDictator.png",
  "Wacky Words": "/images/gamesWackyWords.png",
  "Liars Dice": "/images/gamesLiarsDice.png",
};

export default function Games(props) {
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
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
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
            path="/learn/games"
            render={() => {
              switch (gameType) {
                case "Mafia":
                  return <LearnMafia />;
                case "Split Decision":
                  return <LearnSplitDecision />;
                case "Resistance":
                  return <LearnResistance />;
                case "One Night":
                  return <LearnOneNight />;
                case "Ghost":
                  return <LearnGhost />;
                case "Jotto":
                  return <LearnJotto />;
                case "Acrotopia":
                  return <LearnAcrotopia />;
                case "Secret Dictator":
                  return <LearnSecretDictator />;
                case "Wacky Words":
                  return <LearnWackyWords />;
                case "Liars Dice":
                  return <LearnLiarsDice />;
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
