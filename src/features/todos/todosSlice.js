import { client } from "../../api/client";
import { createSelector } from "reselect";
import { StatusFilters } from "../filters/filtersSlice";

var initialState = {};

// Use the initialState as a default value
export default function todosReducer(state = initialState, action) {
  // The reducer normally looks at the action type field to decide what happens
  switch (action.type) {
    // Do something here based on the different types of actions
    case "todos/todoAdded": {
      return [...state, action.payload];
    }
    case "todos/todoToggled": {
      return state.map((todo) => {
        if (todo.id !== action.payload) {
          return todo;
        }

        return {
          ...todo,
          completed: !todo.completed
        };
      });
    }
    case "todos/todosLoaded": {
      // Replace the existing state entirely by returning the new value
      return action.payload;
    }
    default:
      // If this reducer doesn't recognize the action type, or doesn't
      // care about this specific action, return the existing state unchanged
      return state;
  }
}
//Action creator
export const todosLoaded = (todos) => {
  return {
    type: "todos/todosLoaded",
    payload: todos
  };
};
// Thunk function written as arrow function
export const fetchTodos = () => async (dispatch) => {
  const response = await client.get("/fakeApi/todos");
  dispatch(todosLoaded(response.todos));
};
//Action creator
export const todoAdded = (todo) => {
  return {
    type: "todos/todoAdded",
    payload: todo
  };
};
// Write a synchronous outer function that receives the `text` parameter:
export function saveNewTodo(text) {
  // And then creates and returns the async thunk function:
  return async function saveNewTodoThunk(dispatch, getState) {
    // ✅ Now we can use the text value and send it to the server
    const initialTodo = { text };
    const response = await client.post("/fakeApi/todos", { todo: initialTodo });
    dispatch(todoAdded(response.todo));
  };
}
//selector function
export const selectTodos = (state) => state.todos;

export const selectTodoById = (state, todoId) => {
  return selectTodos(state).find((todo) => todo.id === todoId);
};
export const selectTodoIds = createSelector(
  // First, pass one or more "input selector" functions:
  (state) => state.todos,
  // Then, an "output selector" that receives all the input results as arguments
  // and returns a final result value
  (todos) => todos.map((todo) => todo.id)
);
export const selectFilteredTodos = createSelector(
  // First input selector: all todos
  selectTodos,
  // Second input selector: all filter values
  (state) => state.filters,
  // Output selector: receives both values
  (todos, filters) => {
    const { status, colors } = filters;
    const showAllCompletions = status === StatusFilters.All;
    if (showAllCompletions && colors.length === 0) {
      return todos;
    }

    const completedStatus = status === StatusFilters.Completed;
    // Return either active or completed todos based on filter
    return todos.filter((todo) => {
      const statusMatches =
        showAllCompletions || todo.completed === completedStatus;
      const colorMatches = colors.length === 0 || colors.includes(todo.color);
      return statusMatches && colorMatches;
    });
  }
);
export const selectFilteredTodoIds = createSelector(
  // Pass our other memoized selector as an input
  selectFilteredTodos,
  // And derive data in the output selector
  (filteredTodos) => filteredTodos.map((todo) => todo.id)
);
