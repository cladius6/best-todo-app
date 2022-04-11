import { ITasksList, ITodo, TasksType, StatusType } from '../Interfaces/ITodo';
import type { NextPage } from 'next';
import { ChangeEvent, useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

class TodoApi {
  static async getTodos() {
    const response = await fetch('http://localhost:3000/todo');
    const data = await response.json();
    return [data, response.status];
  }

  static async getTodoById(id: number) {
    const response = await fetch(`http://localhost:3000/todo/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    });
    const data = await response.json();

    return [data, response.status];
  }

  static async createNewTodo(todoTitle: string): Promise<any> {
    fetch('http://localhost:3000/todo', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: new URLSearchParams({ title: todoTitle }).toString(),
    }).then((response) => {
      return response.status;
    });
  }

  static async editTodo(todo: ITodo): Promise<any> {
    fetch('http://localhost:3000/todo', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    }).then((response) => {
      return response.status;
    });
  }

  static async deleteTodo(id: number): Promise<any> {
    fetch(`http://localhost:3000/todo/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    }).then((response) => {
      return response.status;
    });
  }
}

const Home: NextPage = () => {
  const [tasksList, setTasksList] = useState<ITasksList | null>(null);
  const [tasksTypeToDisplay, setTasksTypeToDisplay] = useState<TasksType>(
    TasksType.All
  );
  const [enteredTitleNewTask, setEnteredTitleNewTask] = useState<string>('');
  const [enteredTitleEditedTask, setEnteredTitleEditedTask] = useState<
    string | null
  >(null);
  const [editedTask, setEditedTask] = useState<ITodo | null>(null);
  const [_todoApiResponse, setTodoApiResponse] = useState<number | null>(null);

  useEffect(() => {
    TodoApi.getTodos().then((data) => {
      setTasksList(data[0]);
      setTodoApiResponse(data[1]);
    });
  }, []);

  const titleChangeNewTaskHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setEnteredTitleNewTask(event.target.value);
  };

  const titleChangeEditedTaskHandler = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setEnteredTitleEditedTask(event.target.value);
  };

  const submitNewTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // ! dumb implementation, remove setTimeout and keep render after data fetch, I don't know how to do it
    TodoApi.createNewTodo(enteredTitleNewTask).then(() => {
      setTimeout(() => {
        TodoApi.getTodos().then((data) => {
          setTasksList(data[0]);
          setTodoApiResponse(data[1]);
        });
      }, 100);
    });

    setEnteredTitleNewTask('');
  };

  const editTaskInTasksList = (
    editedTaskList: ITasksList,
    replacedTask: ITodo
  ) => {
    return editedTaskList.map((task) => {
      return task.id === replacedTask.id ? replacedTask : task;
    });
  };

  const deleteTaskInTasksList = (
    editedTaskList: ITasksList,
    deletedTask: ITodo
  ) => {
    return editedTaskList.filter(
      (Task: { id: number }) => Task.id !== deletedTask.id
    );
  };

  return (
    <div
      className="h-screen flex flex-col 
                    items-center justify-center"
    >
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
        <h1 className="text-3xl font-bold mb-6 m-auto">BEST TODO APP</h1>

        <form id="formAddTask" onSubmit={submitNewTask} className="flex mb-4">
          <div className="">
            <label
              htmlFor="newTask"
              className="block text-gray-700 text-sm font-bold mb-2"
            ></label>
          </div>

          <div className="flex justify-between w-80">
            <input
              id="newTask"
              type="text"
              required
              value={enteredTitleNewTask}
              onChange={titleChangeNewTaskHandler}
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
      disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
      invalid:border-pink-500 invalid:text-pink-600
      focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
            />

            <button
              id="buttonSubmitNewTask"
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              ADD
            </button>
          </div>
        </form>

        <ul id="tasksList">
          {tasksList &&
            tasksList.map((task, index) => {
              if (
                tasksTypeToDisplay === TasksType.Completed &&
                task.status === StatusType.Active
              )
                return;
              if (
                tasksTypeToDisplay === TasksType.Uncompleted &&
                task.status === StatusType.Completed
              )
                return;
              return editedTask?.id !== task.id ? (
                <div
                  className={`task task--${task.id} mb-3`}
                  key={`task task--${task.id}`}
                >
                  <li
                    className={`task_name task_name--${task.id} mb-3 text-xl ${
                      task.status === StatusType.Completed
                        ? 'task_name--completed'
                        : 'task_name--uncompleted'
                    }`}
                  >
                    {task.title}
                  </li>
                  <div
                    className={`task_control-panel task_control-panel--${task.id} flex justify-between text-xs`}
                  >
                    <button
                      id="buttonTaskToggleDone"
                      className="text-gray-400 hover:text-green-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => {
                        setTasksList(
                          editTaskInTasksList(tasksList, {
                            ...tasksList[index],
                            status:
                              tasksList[index].status === StatusType.Active
                                ? StatusType.Completed
                                : StatusType.Active,
                          })
                        );
                        TodoApi.editTodo({
                          ...tasksList[index],
                          status:
                            tasksList[index].status === StatusType.Active
                              ? StatusType.Completed
                              : StatusType.Active,
                        });
                      }}
                    >
                      done
                    </button>

                    <button
                      id="buttonTaskEdit"
                      className=" hover:text-orange-700 text-gray-400 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => {
                        if (editedTask !== null) return;
                        setEditedTask(tasksList[index]);
                      }}
                    >
                      edit
                    </button>

                    <button
                      id="buttonTaskDelete"
                      className="text-gray-400 hover:text-red-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => {
                        setTasksList(
                          deleteTaskInTasksList(tasksList, tasksList[index])
                        );
                        TodoApi.deleteTodo(tasksList[index].id);
                      }}
                    >
                      delete
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  key={`form-change-title--task-${task.id}`}
                  className={`form-change-title form-change-title--task-${task.id}`}
                  onSubmit={() => {
                    setTasksList(
                      editTaskInTasksList(tasksList, {
                        ...editedTask,
                        title:
                          enteredTitleEditedTask !== null
                            ? enteredTitleEditedTask
                            : editedTask.title,
                      })
                    );
                    if (enteredTitleEditedTask !== editedTask.title) {
                      TodoApi.editTodo({
                        ...editedTask,
                        title: enteredTitleEditedTask,
                      });
                    }

                    setEditedTask(null);
                    setEnteredTitleEditedTask(null);
                  }}
                >
                  <div className="flex">
                    <label
                      htmlFor="editedTask"
                      className={styles.label}
                    ></label>

                    <input
                      id="editedTask"
                      type="text"
                      required
                      value={
                        enteredTitleEditedTask !== null
                          ? enteredTitleEditedTask
                          : task.title
                      }
                      onChange={titleChangeEditedTaskHandler}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
      disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
      invalid:border-pink-500 invalid:text-pink-600
      focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                    />

                    <button
                      id="buttonEditedTaskSave"
                      type="submit"
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      save
                    </button>
                  </div>
                </form>
              );
            })}
        </ul>
        <div className="flex justify-between">
          <button
            id="buttonTypeDisplayAll"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => {
              setTasksTypeToDisplay(TasksType.All);
            }}
          >
            ALL
          </button>

          <button
            id="buttonTypeDisplayTodo"
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => {
              setTasksTypeToDisplay(TasksType.Uncompleted);
            }}
          >
            TODO
          </button>

          <button
            id="buttonTypeDisplayDone"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => {
              setTasksTypeToDisplay(TasksType.Completed);
            }}
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
