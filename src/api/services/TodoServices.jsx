import { $axios } from "../axios";

export const getTodos = (payload, onSuccess, onError, onFinally) => {
    console.log("payload: ", payload);
  $axios
    .get(`/todo/${payload.doctorId}/todos`)
    .then((response) => {
      onSuccess(response);
    })
    .catch((error) => {
      onError(error);
    })
    .finally(() => {
      onFinally();
    });
};

export const createTodos = (payload, onSuccess, onError, onFinally) => {
    console.log("payload: ", payload);
  $axios
    .post(`/todo/${payload.doctorId}/todos`,{
        title: payload.title,
        description: payload.description
    })
    .then((response) => {
      onSuccess(response);
    })
    .catch((error) => {
      onError(error);
    })
    .finally(() => {
      onFinally();
    });
};

export const updateTodos = (payload, onSuccess, onError, onFinally) => {
    console.log("payload: ", payload);
  $axios
    .put(`/todo/${payload.doctorId}/todos/${payload.todoId}`,{
        title: payload.title,
        description: payload.description,
        completed: payload.completed
    })
    .then((response) => {
      onSuccess(response);
    })
    .catch((error) => {
      onError(error);
    })
    .finally(() => {
      onFinally();
    });
};

export const deleteTodos = (payload, onSuccess, onError, onFinally) => {
    console.log("payload: ", payload);
  $axios
    .delete(`/todo/${payload.doctorId}/todos/${payload.todoId}`)
    .then((response) => {
      onSuccess(response);
    })
    .catch((error) => {
      onError(error);
    })
    .finally(() => {
      onFinally();
    });
};

