import { styled } from "@mui/material/styles";
import { useState, useEffect } from "react";

// header
import * as React from "react";

import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

// tab-bar
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

// icons
import SearchIcon from "@mui/icons-material/Search";
import DoneAllIcon from "@mui/icons-material/DoneAll";

import "./ChatList.css";
import { useNavigate } from "react-router-dom";
import ProfileSideBar from "../ProfileSideBar/ProfileSideBar";

const CustomAppBar = styled(AppBar)(({ theme }) => {
  return {
    background: "#232b36",
  };
});

const CustomTabs = styled(Tabs)(({ theme }) => {
  return {
    background: "#232b36",
    ".MuiButtonBase-root ": {
      color: "white",
      textTransform: "none",
      fontSize: "16px",
    },
    ".Mui-selected": {
      color: "#65B2EC",
    },
  };
});

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: getInitials(name),
  };
}

const getInitials = (name) => {
  return name
    .split(" ")
    .filter((_, i) => i < 2)
    .map((t) => t[0])
    .map((t) => t.toUpperCase())
    .join("");
};

const getDayOfWeek = (date) => {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const myDate = new Date(date);

  const dayOfWeek = weekdays[myDate.getDay()];
  return dayOfWeek;
};

function ChatList() {
  const [value, setValue] = useState(0);
  const [chats, setChats] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const [personalChats, setPersonalChats] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarBeingClosed, setSidebarBeingClosed] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const makeAPICall = async () => {
      const url = "https://devapi.beyondchats.com/api/get_all_chats?page=1";
      const responseRaw = await fetch(url);
      const response = await responseRaw.json();
      const chats = response.data.data.filter((aChat) => !!aChat.creator.name);
      const allChats = chats
        .map((aChat) => aChat.id)
        .map(
          (aChatId) =>
            `https://devapi.beyondchats.com/api/get_chat_messages?chat_id=${aChatId}`
        )
        .map((aURL) => fetch(aURL));

      const rawResponses = await Promise.all(allChats);
      const jsonResponsePromises = rawResponses.map((aResponse) =>
        aResponse.json()
      );
      const responses = await Promise.all(jsonResponsePromises);

      const lastMessages = responses
        .map((aResponse) => aResponse.data)
        .map((chats) => chats[chats.length - 1]);

      const isGroupChats = responses
        .map((aResponse) => aResponse.data)
        .map((x) => Array.from(new Set(x.map((t) => t.sender_id))))
        .map((x) => x.length > 2);

      let groupIndex = 1;

      const groupChatNames = isGroupChats.map((t) =>
        t ? `Group Chat ${groupIndex++}` : undefined
      );

      const patchedChats = chats.map((aChat, index) => ({
        ...aChat,
        lastMessage: lastMessages[index],
        isGroupChat: isGroupChats[index],
        groupName: groupChatNames[index],
      }));

      const groupChats = patchedChats.filter((t) => t.isGroupChat);
      const personalChats = patchedChats.filter((t) => !t.isGroupChat);

      setChats(patchedChats);
      setGroupChats(groupChats);
      setPersonalChats(personalChats);
    };

    makeAPICall();
  }, []);

  const onChatClick = (id) => {
    navigate(`/chat?id=${id}`);
  };

  const onSidebarClick = () => {
    setIsSidebarOpen((t) => !t);
  };

  const onSidebarClose = () => {
    setSidebarBeingClosed(true);
    setTimeout(() => {
      setIsSidebarOpen(false);
      setSidebarBeingClosed(false);
    }, 500);
  };

  return (
    <div className="container">
      <ProfileSideBar
        onClose={onSidebarClose}
        isSidebarBeingClosed={isSidebarBeingClosed}
        isSidebarOpen={isSidebarOpen}
      />
      {/*  top header bar */}
      <div
        className={
          isSidebarBeingClosed
            ? "chat-list-container--sidebar-closing"
            : isSidebarOpen
            ? "chat-list-container--sidebar-visible"
            : ""
        }
      >
        <div className="header">
          <Box sx={{ flexGrow: 1 }}>
            <CustomAppBar position="static">
              <Toolbar>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={onSidebarClick}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Telegram
                </Typography>

                <IconButton>
                  <SearchIcon className="search" />
                </IconButton>
              </Toolbar>
            </CustomAppBar>
          </Box>
        </div>
        {/* tab bar */}
        <div className="tab-bar">
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <CustomTabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              className="tabs-container"
            >
              <Tab className="tab-name" label={`All (${chats.length})`} />
              <Tab
                className="tab-name"
                label={`Personal (${personalChats.length})`}
              />
              <Tab
                className="tab-name"
                label={`Groups (${groupChats.length})`}
              />
            </CustomTabs>
          </Box>
          <div>
            {(value === 0
              ? chats
              : value === 1
              ? personalChats
              : groupChats
            ).map((aChat) => {
              return (
                <div
                  className="single-chat"
                  onClick={
                    isSidebarOpen ? undefined : () => onChatClick(aChat.id)
                  }
                >
                  <Avatar
                    {...stringAvatar(
                      aChat.isGroupChat ? aChat.groupName : aChat.creator.name
                    )}
                  />
                  <div className="name-msg-section">
                    <div className="name">
                      {aChat.isGroupChat ? aChat.groupName : aChat.creator.name}
                    </div>
                    <div className="last-message">
                      {aChat.lastMessage.message}
                    </div>
                  </div>
                  <div className="single-chat-info">
                    {aChat.lastMessage.sender_id === 1 && (
                      <DoneAllIcon
                        sx={{ fontSize: 16 }}
                        className="done-all-icon"
                      />
                    )}

                    <div className="has-seen-icon-date">
                      <div className="message-time">
                        {getDayOfWeek(aChat.updated_at)}
                      </div>
                      <div class="fill"></div>
                      <span className="unread-message-count">14</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatList;
