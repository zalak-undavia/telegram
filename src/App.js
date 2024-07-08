import { Routes, Route } from "react-router-dom";
import ChatList from "./src/ChatList/ChatList";
import Chat from "./src/Chat/Chat";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<ChatList />}></Route>
        <Route path="/chat" element={<Chat />}></Route>
      </Routes>
    </div>
  );
}

export default App;
