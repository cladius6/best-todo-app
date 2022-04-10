import { ITasksList, ITodo, TasksType, StatusType } from '../Interfaces/ITodo';
import { IApi, IGetTasksListResponse } from './../Interfaces/IApi';
import type { NextPage } from 'next';
import { ChangeEvent, useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

interface todoPutRequest {
  title: string;
}

const mockTodo: todoPutRequest = { title: 'Todo 1' };

class TodoApi {
  static async getTodos() {
    const response = await fetch('http://localhost:3000/todo');
    const data = await response.json();
    console.log('response', response.status);
    console.log('data', data);

    return data;
  }

  static async addNewTodo(todo: any): Promise<any> {
    fetch('http://localhost:3000/todo', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: new URLSearchParams(todo).toString(),
    }).then((res) => {
      console.log(res.status);
      return res;
    });
  }

  static async deleteTodo(id: number): Promise<any> {
    fetch(`http://localhost:3000/todo/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    }).then((res) => {
      console.log(res.status);
      return res;
    });
  }
}

const exampleResponse: IGetTasksListResponse = {
  tasksList: [
    {
      id: 1,
      title: 'Task 1',
      status: StatusType.Active,
    },
    {
      id: 2,
      title: 'Task 2',
      status: StatusType.Active,
    },
    {
      id: 3,
      title: 'Task 3',
      status: StatusType.Active,
    },
  ],
};

class DumpApi implements IApi {
  getTasksList(): Promise<IGetTasksListResponse> {
    return new Promise((resolve) =>
      setTimeout(() => resolve(exampleResponse), 1000)
    );
  }
}

const api = new DumpApi();

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

  useEffect(() => {
    TodoApi.addNewTodo(mockTodo);
    TodoApi.getTodos();
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
    addTask(enteredTitleNewTask);
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
