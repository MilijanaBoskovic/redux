import React from "react";
import { useSelector, shallowEqual } from "react-redux";
import { selectTodoIds } from "./todosSlice";

import TodoListItem from "./TodoListItem";

//Without using selector function
///////
// const selectTodoIds = (state) => state.todos.map((todo) => todo.id);

// const TodoList = () => {
//   const todoIds = useSelector(selectTodoIds, shallowEqual);

//   const renderedListItems = todoIds.map((todoId) => {
//     return <TodoListItem key={todoId} id={todoId} />;
//   });

//   return <ul className="todo-list">{renderedListItems}</ul>;
// };

// export default TodoList;
//////////
//With usage of selector function
/////////////
//Memoized selectors are only helpful when you
//actually derive additional values from the original data.
// If you are only looking up and returning an existing value,
// you can keep the selector as a plain function.
const TodoList = () => {
  const todoIds = useSelector(selectTodoIds);

  const renderedListItems = todoIds.map((todoId) => {
    return <TodoListItem key={todoId} id={todoId} />;
  });

  return <ul className="todo-list">{renderedListItems}</ul>;
};
export default TodoList;
