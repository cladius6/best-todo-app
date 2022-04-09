import { ITasksList, ITodo, TasksType } from '../Interfaces/ITodo';
import { IApi, IGetTasksListResponse } from './../Interfaces/IApi';
import type { NextPage } from 'next';
import { ChangeEvent, useState } from 'react';
import styles from '../styles/Home.module.css';

const exampleResponse: IGetTasksListResponse = {
  tasksList: [
    {
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      status: false,
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'Description 2',
      status: false,
    },
    {
      id: 3,
      title: 'Task 3',
      description: 'Description 3',
      status: false,
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

  const addTask = (newTaskTitle: string, isCompleted: boolean = false) => {
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

      <form onSubmit={submitNewTask}>
        <div className={styles.control}>
          <label htmlFor="newTask" className={styles.label}>
            add task
          </label>

          <input
            id="newTask"
            type="title"
            required
            value={enteredTitleNewTask}
            onChange={titleChangeNewTaskHandler}
            className={`${styles.input} form-control`}
          />
        </div>
        <div className="">
          <button id="submit-new-task" type="submit" className={styles.button}>
            ADD
          </button>
        </div>
      </form>

      <ul>
        {tasksList &&
          tasksList.map((task, index) => {
            if (
              tasksTypeToDisplay === TasksType.Completed &&
              task.status === false
            )
              return;
            if (
              tasksTypeToDisplay === TasksType.Uncompleted &&
              task.status === true
            )
              return;
            return editedTask?.id !== task.id ? (
              <li key={`task task--${task.id}`}>
                <div
                  className={`task_name task_name--${task.id} ${
                    task.status
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
                    className={`task_button task_button--done`}
                    onClick={() => {
                      setTasksList(
                        editTaskInTasksList(tasksList, {
                          ...tasksList[index],
                          status: !tasksList[index].status,
                        })
                      );
                    }}
                  >
                    done
                  </button>

                  <button
                    className={`task_button task_button--edit`}
                    onClick={() => {
                      if (editedTask !== null) return;
                      setEditedTask(tasksList[index]);
                    }}
                  >
                    edit
                  </button>

                  <button
                    className={`task_button task_button--delete`}
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
                  id="submit-form"
                  type="submit"
                  className={styles.button}
                >
                  save
                </button>
              </form>
            );
          })}
      </ul>

      <button
        onClick={() => {
          setTasksTypeToDisplay(TasksType.All);
        }}
      >
        ALL
      </button>
      <button
        onClick={() => {
          setTasksTypeToDisplay(TasksType.Uncompleted);
        }}
      >
        TODO
      </button>
      <button
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
