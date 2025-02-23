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

  return {
    state,
    updateProp,
  };
};

export default Logic;
