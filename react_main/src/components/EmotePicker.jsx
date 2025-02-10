import React, { useLayoutEffect, useRef, useState, useContext } from "react";
import { EmoteKeys, emotify } from "./Emotes";
import { useOnOutsideClick } from "./Basic";
import { Button, Tooltip } from "@mui/material";
import { UserContext } from "../Contexts";

const happy = `/images/emotes/happy.webp`;

export default function EmotePicker(props) {
  const [isPanelVisible, setPanelVisible] = useState(false);
  const panelRef = useRef();
  const containerRef = useRef();
  const user = useContext(UserContext);

  useOnOutsideClick([panelRef, containerRef], () => setPanelVisible(false));

  useLayoutEffect(() => {
    if (!isPanelVisible) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const menuRect = panelRef.current.getBoundingClientRect();

    let panelLeft = containerRect.left;
    let menuTop = containerRect.top + containerRect.height + 1 + window.scrollY;

    if (menuTop + menuRect.height - window.scrollY > window.innerHeight)
      menuTop = containerRect.top - menuRect.height - 2;

    panelRef.current.style.left = panelLeft + "px";
    panelRef.current.style.top = menuTop + "px";
    panelRef.current.style.visibility = "visible";
  });

  const customEmotesMap = Object.keys(user.settings.customEmotes || {});
  const customEmotes = (
    <>
      {customEmotesMap.map(customEmote => (
        <div
          className="emote"
          key={customEmote}
          onClick={(e) => selectEmote(e, customEmote)}
        >
          {emotify(customEmote, user.settings.customEmotes)}
        </div>
      ))}
    </>
  );

  const emotes = (
    <>
      {EmoteKeys.map((emote) => (
        <div
          className="emote"
          key={emote}
          onClick={(e) => selectEmote(e, emote)}
        >
          {emotify(emote)}
        </div>
      ))}
    </>
  );

  function selectEmote(e, emote) {
    props.onEmoteSelected(emote);
    if (!e.shiftKey) {
      setPanelVisible(false);
    }
  }

  function togglePanel() {
    setPanelVisible(!isPanelVisible);
  }

  return (
    <div ref={containerRef} className={`dropdown ${props.className || ""}`}>
      <Tooltip title="Emotes!" placement="top">
        <Button className="dropdown-control" onClick={togglePanel}>
          &#8205;
          <img src={happy} />
          &#8205;
        </Button>
      </Tooltip>
      {isPanelVisible && (
        <div className="dropdown-menu emote-picker-panel" ref={panelRef}>
          <div className="emote-picker-wrapper">
            {customEmotes}
            {emotes}
          </div>
        </div>
      )}
    </div>
  );
}
