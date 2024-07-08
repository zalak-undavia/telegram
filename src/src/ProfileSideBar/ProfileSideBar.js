import "./ProfileSideBar.css";

import Avatar from "@mui/material/Avatar";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// icons
import LightModeIcon from "@mui/icons-material/LightMode";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import CallIcon from "@mui/icons-material/Call";
import RadarIcon from "@mui/icons-material/Radar";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import AddIcon from "@mui/icons-material/Add";

import { styled } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";

const CustomAccordion = styled(Accordion)(({ theme }) => {
  return {
    boxShadow: "none", // this styles directly apply to accordion
    background: "#233040",
    color: "white",
    ".MuiSvgIcon-root": {
      color: "white",
    },
    ".MuiAccordionDetails-root": {
      marginLeft: "14px",
      display: "flex",
      alignItems: "center",
    },
  };
});

function ProfileSideBar({ isSidebarBeingClosed, isSidebarOpen, onClose }) {
  const timeoutRef = useRef();
  const [backdrop, setBackdrop] = useState(false);
  useEffect(() => {
    if (isSidebarOpen && !backdrop) {
      timeoutRef.current = setTimeout(() => {
        setBackdrop(true);
      }, 400);
    }
  }, [isSidebarOpen]);

  const handleClose = () => {
    setBackdrop(false);
    onClose && onClose();
  };

  return (
    <div
      className={
        isSidebarBeingClosed
          ? "sidebar-container--absolute closing"
          : isSidebarOpen
          ? "sidebar-container--absolute visible"
          : "sidebar-container--absolute closed"
      }
    >
      <div className="sidebar">
        <div className="sidebar-top">
          <Avatar
            className="avtar-icon-telegram"
            alt="Remy Sharp"
            src="/broken-image.jpg"
          >
            BC
          </Avatar>
          <div>
            <LightModeIcon className="light-mode-icon" />
          </div>
        </div>
        <div className="side-bar-accordion">
          <CustomAccordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              Beyond Chats
            </AccordionSummary>

            <AccordionDetails>
              <AddIcon />
              <span className="add-account">Add Account</span>
            </AccordionDetails>
          </CustomAccordion>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-section profile">
            <div className="side-bar-icon">
              <AccountCircleIcon />
            </div>
            <div className="side-bar-name">My Profile</div>
          </div>

          <div className="sidebar-section">
            <div className="side-bar-icon">
              <PeopleIcon />
            </div>
            <div className="side-bar-name ">New Group</div>
          </div>

          <div className="sidebar-section">
            <div className="side-bar-icon">
              <PersonIcon />
            </div>
            <div className="side-bar-name">Contacts</div>
          </div>

          <div className="sidebar-section">
            <div className="side-bar-icon">
              <CallIcon />
            </div>
            <div className="side-bar-name">Calls</div>
          </div>

          <div className="sidebar-section">
            <div className="side-bar-icon">
              <RadarIcon />
            </div>
            <div className="side-bar-name">People Nearby</div>
          </div>

          <div className="sidebar-section">
            <div className="side-bar-icon">
              <BookmarkBorderIcon />
            </div>
            <div className="side-bar-name">Saved Messages</div>
          </div>

          <div className="sidebar-section profile">
            <div className="side-bar-icon">
              <SettingsIcon />
            </div>
            <div className="side-bar-name">Settings</div>
          </div>

          <div className="sidebar-section">
            <div className="side-bar-icon">
              <PersonAddIcon />
            </div>
            <div className="side-bar-name">Invite Friends</div>
          </div>

          <div className="sidebar-section">
            <div className="side-bar-icon">
              <HelpOutlineIcon />
            </div>
            <div className="side-bar-name">Telegram Features</div>
          </div>
        </div>
      </div>
      {backdrop && <div className="backdrop" onClick={handleClose}></div>}
    </div>
  );
}

export default ProfileSideBar;
