import { reducer } from "../../reducers/reducer";
import { useReducer } from "react";
import { INITIAL_STATE } from "./constant";
import ACTION_TYPES from "../../reducers/actionTypes";

const Logic = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const updateProp = (prop, value) => {
    dispatch({
      payload: [
        {
          type: ACTION_TYPES.UPDATE_PROP,
          prop: prop,
          value: value,
        },
      ],
    });
  };

  const addMessage = (message) => {
    const timestamp = new Date().toLocaleTimeString(); // Get current time
    dispatch({
      payload: [
        {
          type: ACTION_TYPES.UPDATE_PROP,
          prop: "messages",
          value: [...state.messages, { text: message, timestamp }],
        },
      ],
    });
    updateProp("currentMessage", "");
  };

  const setCurrentMessage = (message) => {
    updateProp("currentMessage", message);
  };

  const handleMessageChange = (e) => {
    setCurrentMessage(e.target.value); // Update current message state
  };

  const handleSendMessage = () => {
    if (state.currentMessage.trim()) {
      addMessage(state.currentMessage); // Add the message to the state
    }
  };

  return {
    state,
    updateProp,
    addMessage,
    setCurrentMessage,
    handleSendMessage,
    handleMessageChange,
  };
};

export default Logic;
