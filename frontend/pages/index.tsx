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
  const [hightestId, setHightestId] = useState<number>(0);
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

  const addTask = (
    newTaskTitle: string,
    isCompleted: StatusType = StatusType.Active
  ) => {
    let newId = hightestId + 1;

    if (tasksList !== null && tasksList.length > 0) {
      setTasksList([
        ...tasksList,
        {
          id: newId,
          title: newTaskTitle,
          status: isCompleted,
        },
      ]);
    } else {
      setTasksList([
        {
          id: newId,
          title: newTaskTitle,
          status: isCompleted,
        },
      ]);
    }
    setHightestId((previousHightestId) => previousHightestId + 1);
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
    <div className={styles.container}>
      <h1>BEST TODO APP</h1>

      <form id="formAddTask" onSubmit={submitNewTask}>
        <div className={styles.control}>
          <label htmlFor="newTask" className={styles.label}>
            add task
          </label>

          <input
            id="newTask"
            type="text"
            required
            value={enteredTitleNewTask}
            onChange={titleChangeNewTaskHandler}
            className={`${styles.input} form-control`}
          />
        </div>
        <div className="">
          <button
            id="buttonSubmitNewTask"
            type="submit"
            className={`button button_task button_task--add`}
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
              <li
                className={`task task--${task.id}`}
                key={`task task--${task.id}`}
              >
                <div
                  className={`task_name task_name--${task.id} ${
                    task.status === StatusType.Completed
                      ? 'task_name--completed'
                      : 'task_name--uncompleted'
                  }`}
                >
                  {task.title}
                </div>
                <div
                  className={`task_control-panel task_control-panel--${task.id}`}
                >
                  <button
                    id="buttonTaskToggleDone"
                    className={`button button_task button_task--done`}
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
                    className={`button button_task button_task--edit`}
                    onClick={() => {
                      if (editedTask !== null) return;
                      setEditedTask(tasksList[index]);
                    }}
                  >
                    edit
                  </button>

                  <button
                    id="buttonTaskDelete"
                    className={`button button_task button_task--delete`}
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
              </li>
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
                <div className={styles.control}>
                  <label htmlFor="editedTask" className={styles.label}>
                    edit:
                  </label>

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
                    className={`form-change-title_control`}
                  />
                </div>

                <button
                  id="buttonEditedTaskSave"
                  type="submit"
                  className={`button button_task button_task--edit`}
                >
                  save
                </button>
              </form>
            );
          })}
      </ul>

      <button
        id="buttonTypeDisplayAll"
        className={`button button_type-display button_type-display--all`}
        onClick={() => {
          setTasksTypeToDisplay(TasksType.All);
        }}
      >
        ALL
      </button>

      <button
        id="buttonTypeDisplayTodo"
        className={`button button_type-display button_type-display--todo`}
        onClick={() => {
          setTasksTypeToDisplay(TasksType.Uncompleted);
        }}
      >
        TODO
      </button>

      <button
        id="buttonTypeDisplayDone"
        className={`button button_type-display button_type-display--done`}
        onClick={() => {
          setTasksTypeToDisplay(TasksType.Completed);
        }}
      >
        DONE
      </button>
    </div>
  );
};

export default Home;
