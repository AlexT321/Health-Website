import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { User_Context } from "C:/Users/alexi/Downloads/VsCode Projects/Wubo (Health Website)/Health-Website/my-app/src/App";

const Menu_Boards = ({
  index,
  board_id,
  board_name,
  update_all_choosen_state,
  update_choosen_state,
  load_board_data,
}) => {
  const User = useContext(User_Context);


  const [hover_state, set_hover_state] = useState(false);
  const [delete_button_vis, set_delete_button_vis] = useState("none");

  const navigate = useNavigate();

  const remove_board = async (body) => {
    try {
      const result = await fetch(
        "http://localhost:5000/Health-Website/remove_board",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      // eslint-disable-next-line no-unused-vars
      const data = result.json();
    } catch (err) {
      console.log(err);
    }
  };

  const onClick = async () => {
    navigate(`/user/${board_name}`);
    const update_info = {
      id: { user_id: User.user_id, "boards.board_id": board_id },
      choosen: { $set: { "boards.$.choosen": true } },
    };
    const update_all_info = {
      id: {user_id: User.user_id},
      choosen: { $set: { "boards.$[].choosen": false } },
    };
    await update_all_choosen_state(update_all_info);
    await update_choosen_state(update_info);
    await load_board_data();
  };

  const toggleHover = () => {
    set_hover_state(hover_state ? false : true);
    set_delete_button_vis(hover_state ? "none" : "flex");
  };

  const delete_board = () => {
    const boards_info = {
      id: { user_id: User.user_id},
      board: { $pull: {boards: {board_id: board_id}} },
    }
    if (board_id !== undefined) {
      remove_board(boards_info);
    }

    User.set_multiple_board_info(User.multiple_board_info.filter((board,index) => board.board_id !== board_id));
  }
  return (
    <div
      id="side-menu-boards-container"
      onMouseEnter={toggleHover}
      onMouseLeave={toggleHover}
    >
      <div id="board-1" onClick={onClick}>
        {board_name}
      </div>
      <button
        id="delete-board-button"
        style={{ display: delete_button_vis }}
        onClick={delete_board}
      >
        T
      </button>
    </div>
  );
};

export default Menu_Boards;
