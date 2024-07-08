import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MicNoneIcon from "@mui/icons-material/MicNone";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CallIcon from "@mui/icons-material/Call";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Avatar from "@mui/material/Avatar";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";

import { styled } from "@mui/material/styles";
import "./chat.css";

function stringToColor(string) {
  console.log("string", string);
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

const toShortFormat = (date) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const tokens = date.split("/");

  const day = tokens[0];

  const monthIndex = Number.parseInt(tokens[1]) - 1;
  const monthName = monthNames[monthIndex];

  return `${day} ${monthName}`;
};

const CustomAppBar = styled(AppBar)(({ theme }) => {
  return {
    background: "#232b36",
    ".MuiToolbar-root": {},
  };
});

function Chat() {
  const [params] = useSearchParams();
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [isGroupChat, setIsGroupChat] = useState(false);
  const chatScrollTimeout = useRef();

  const [isDateVisible, setIsDateVisible] = useState(false);
  const [pillDate, setPillDate] = useState("");

  const nav = useNavigate();
  const listRef = useRef(null);

  const id = params.get("id");

  const onChatScroll = () => {
    setIsDateVisible(true);
    if (chatScrollTimeout.current) {
      clearTimeout(chatScrollTimeout.current);
    }
    let index = 0;
    for (const el of listRef.current.children) {
      var rect = el.getBoundingClientRect();
      index++;

      const within =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth);

      if (within) break;
    }
    const dates = data
      .filter((_, i) => i <= index)
      .filter((t) => t.type === "date");
    if (dates.length > 0) {
      setPillDate(dates[0].date);
    }
    chatScrollTimeout.current = setTimeout(() => {
      setIsDateVisible(false);
    }, 500);
  };

  useEffect(() => {
    const message = async () => {
      const url = `https://devapi.beyondchats.com/api/get_chat_messages?chat_id=${id}`;
      const request = await fetch(url);
      const response = await request.json();

      const chats = response.data;
      const chatsWithType = chats
        .filter((t) => t.sender.name !== null)
        .map((aChat) => ({
          ...aChat,
          type: "message",
        }));

      let previousDate = null;
      const chatsWithDate = chatsWithType.reduceRight(
        (chatsSoFar, currentChat, index) => {
          const localDate = new Date(
            currentChat.created_at
          ).toLocaleDateString();
          if (previousDate == null) {
            previousDate = localDate;
            chatsSoFar.push(currentChat);

            return chatsSoFar;
          }
          if (previousDate === localDate) {
            chatsSoFar.push(currentChat);

            return chatsSoFar;
          }
          chatsSoFar.push({ type: "date", date: previousDate });
          chatsSoFar.push(currentChat);

          previousDate = localDate;
          return chatsSoFar;
        },
        []
      );
      if (previousDate != null) {
        chatsWithDate.push({ type: "date", date: previousDate });
      }
      setData(chatsWithDate.reverse());

      const senders = response.data.filter((v, i) => v.sender_id !== 1);
      const uniueSenders = new Set(senders.map((s) => s.sender.id));
      if (uniueSenders.size === 1) {
        setName(senders[0].sender.name);
      } else {
        setName("Group Chat");
        setIsGroupChat(true);
      }
    };

    message();
  }, []);

  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView();
  }, [data]);

  const backToHomePage = () => {
    nav("/");
  };
  return (
    <div className="container">
      <Box sx={{ flexGrow: 1 }}>
        <CustomAppBar className="app-bar" position="static">
          <Toolbar className="toolbar">
            <IconButton
              className="back-arrow"
              edge="start"
              color="inherit"
              sx={{ mr: 2 }}
              onClick={() => backToHomePage()}
            >
              <ArrowBackIcon />
            </IconButton>
            <Avatar className="name-in-chat-header">HS</Avatar>
            <div className="chat-section-name-time">
              <div className="header-chat-name">{name}</div>
              {!isGroupChat && (
                <div className="header-chat-time">Last seen at 10:45</div>
              )}
            </div>

            <IconButton
              size="large"
              edge="start"
              color="inherit"
              sx={{ mr: 2 }}
            >
              <CallIcon />
            </IconButton>

            <IconButton size="large" edge="start" color="inherit">
              <MoreVertIcon />
            </IconButton>
          </Toolbar>
        </CustomAppBar>
      </Box>
      <div className="chat-bg"></div>
      {isDateVisible && (
        <div className="date-pill-container">
          <div className="date-pill">{toShortFormat(pillDate)}</div>
        </div>
      )}
      <div ref={listRef} className="chat-section" onScroll={onChatScroll}>
        {data.map((v, i) => {
          if (v.type === "message") {
            return (
              <div
                className={`msg bubble ${v.sender.id === 1 ? "right" : "left"}`}
              >
                {isGroupChat && v.sender.id !== 1 && (
                  <div
                    className="sender"
                    style={{ color: stringToColor(v.sender.name) }}
                  >
                    {v.sender.name}
                  </div>
                )}
                {v.message}
              </div>
            );
          }
          if (v.type === "date") {
            return (
              <div className="date-container">
                <div className="date">{toShortFormat(v.date)}</div>
              </div>
            );
          }
          return undefined;
        })}
      </div>
      <div className="chat-input-section">
        <Paper
          component="form"
          className="chat-input-bottom"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconButton sx={{ p: "10px" }}>
            <SentimentSatisfiedAltOutlinedIcon className="text-color" />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Message"
            className="text-color"
          />
          <IconButton type="button" sx={{ p: "10px" }}>
            <AttachFileIcon className="file-icon" />
          </IconButton>
          <IconButton color="primary" aria-label="directions">
            <MicNoneIcon className="text-color" />
          </IconButton>
        </Paper>
      </div>
    </div>
  );
}

export default Chat;
