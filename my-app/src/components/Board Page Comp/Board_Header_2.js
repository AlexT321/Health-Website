/* eslint-disable react/jsx-pascal-case */
import { useContext, useRef, useEffect, useState } from "react";
import { User_Context } from "C:/Users/alexi/Downloads/VsCode Projects/Wubo (Health Website)/Health-Website/my-app/src/App";

const Board_Header_2 = ({
  Set_Side_Menu_Visibility,
  move_content_to_right,
  set_move_content_to_right,
}) => {
  const User = useContext(User_Context);

  //Name of board
  const ref = useRef(null);
  const board_name = useRef(null);

  //favorite button
  const [is_active, set_is_active] = useState("rgba(255, 255, 255, 1)");
  const [run_once, set_run_once] = useState(true);

  //side menu button
  const open_side_menu = () => {
    Set_Side_Menu_Visibility("visible");
    set_move_content_to_right("28vh");
  };

  //Name of board
  const update_name = async (name) => {
    try {
      const result = await fetch(
        "http://localhost:5000/Health-Website/update_board_name",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(name),
        }
      );
      // eslint-disable-next-line no-unused-vars
      const data = result.json();
    } catch (err) {
      console.log(err);
    }
  };
  const change_board_name = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (board_name.current.innerText !== User.single_board_info[0].name) {
        const update_name_of_board = {
          id: { user_id: User.user_id, "boards.board_id": User.single_board_info[0].board_id},
          name: { $set: { "boards.$.name": board_name.current.innerText } },
        };
        update_name(update_name_of_board);
        for (let i = 0; i < User.multiple_board_info.length; i++) {
          if (
            User.single_board_info[0].board_id ===
            User.multiple_board_info[i].board_id
          ) {
            User.multiple_board_info[i].name = board_name.current.innerText;
          }
        }
        User.set_single_board_info([
          {
            ...User.single_board_info[0],
            name: board_name.current.innerText,
          },
        ]);
        board_name.current.blur();
      }
    }
  };

  //favorite button
  const update_favorite = async (board_info) => {
    try {
      const result = await fetch(
        "http://localhost:5000/Health-Website/update_favorite_state",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(board_info),
        }
      );
      // eslint-disable-next-line no-unused-vars
      const data = result.json();
    } catch (err) {
      console.log(err);
    }
  };
  const onClick = () => {
    set_run_once(false)
    if (is_active === "rgba(255, 255, 255, 1)") {
      update_favorite({
        id: { user_id: User.user_id, "boards.board_id": User.single_board_info[0].board_id},
        favorite: { $set: { "boards.$.favorite": true } },
      });
    } else {
      update_favorite({
        id: { user_id: User.user_id, "boards.board_id": User.single_board_info[0].board_id},
        favorite: { $set: { "boards.$.favorite": false } },
      });
    }
    set_is_active(
      is_active === "rgba(255, 196, 0, 1)"
        ? "rgba(255, 255, 255, 1)"
        : "rgba(255, 196, 0, 1)"
    );
    for (let i = 0; i < User.multiple_board_info.length; i++) {
      if (
        User.single_board_info[0].board_id ===
        User.multiple_board_info[i].board_id
      ) {
        User.multiple_board_info[i].favorite = User.multiple_board_info[
          i
        ].favorite
          ? false
          : true;
      }
    }
    User.set_single_board_info([
      {
        ...User.single_board_info[0],
        favorite: !User.single_board_info[0].favorite,
      },
    ]);
    User.multiple_board_info.sort((a, b) => {
      if (a.favorite && !b.favorite) {
        return -1;
      } else if (!a.favorite && b.favorite) {
        return 1;
      } else {
        return 0;
      }
    });
  };

 //name of board
  const handleClickOutside = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      if (User.single_board_info.length > 0) {
        if (
          board_name.current.innerText !== User.single_board_info[0].name
        ) {
          board_name.current.innerText = User.single_board_info[0].name;
        }
      }
    }
  };
  document.addEventListener("click", handleClickOutside);

  useEffect(() => {
    //favorite button
    console.log(User.single_board_info)
    if (User.single_board_info.length > 0 && run_once === true) {
      if (User.single_board_info[0].favorite) {
        set_is_active("rgba(255, 196, 0, 1)");
      } else {
        set_is_active("rgba(255, 255, 255, 1)");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [User.single_board_info]);
  if (
    User.multiple_board_info.length === 0 ||
    User.single_board_info.length === 0
  ) {
    return <div id="name-of-board">Loading...</div>;
  }

  return (
    <div id="header-2" style={{ left: move_content_to_right }}>
      <button
        className={"btn btn--secondary--solid btn--small"}
        id="side-menu-button"
        onClick={open_side_menu}
      >
        -
      </button>
      <div id="name-of-board" ref={ref}>
        <span
          ref={board_name}
          id="span-of-name-of-board"
          contentEditable="true"
          suppressContentEditableWarning={true}
          onKeyDown={change_board_name}
          spellCheck={false}
        >
          {User.single_board_info[0].name}
        </span>
      </div>
      <button
        className={"btn btn--secondary--solid btn--small"}
        id="favorite-button"
        onClick={onClick}
        style={{ color: is_active }}
      >
        F
      </button>
    </div>
  );
};

export default Board_Header_2;
