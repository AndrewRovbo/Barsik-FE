
import { NavLink } from "react-router-dom";
import "../../styles/ChatPage.scss";

const ChatNavMenue = () => {
    return (
     <aside className="right-menu">
        <NavLink to="/" end>HOME</NavLink>
         <NavLink to="/" end>PROFILE</NavLink>
      </aside>    
  );
};

export default ChatNavMenue;
