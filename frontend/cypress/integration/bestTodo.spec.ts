import React from 'react';
import { IApi } from '../../Interfaces/IApi';

describe('Best Todo App', () => {
  beforeEach(() => {
    websiteIsOpened();
  });

  it('shows website title', () => {
    displaysWebsiteTitle('BEST TODO APP');
  });

  it('add new task form is not submitted empty', () => {
    // if the browser tries to submit the form
    // we should fail the test
    cy.get('#formAddTask').invoke(
      'submit',
      (e: React.FormEvent<HTMLFormElement>) => {
        // do not actually submit the form
        e.preventDefault();
        // fail this test
        throw new Error('submitting!!!');
      }
    );

    cy.get('#formAddTask').within(() => {
      submitNewTask();
    });
  });

  it('add new task ', () => {
    typeNewTaskTitle('new task');
    submitNewTask();

    cy.get('#tasksList').contains('new task');
  });

  it('new added task is uncompleted ', () => {
    const newTask = 'new task';
    typeNewTaskTitle(newTask);
    submitNewTask();

    cy.get('.task_name--uncompleted').contains(newTask);

    cy.get('.task_name--uncompleted').should(
      'have.css',
      'color',
      'rgb(255, 0, 0)'
    );
  });

  it('new added task has red color', () => {
    const newTask = 'new task';
    typeNewTaskTitle(newTask);
    submitNewTask();

    cy.get('.task_name--uncompleted').should(
      'have.css',
      'color',
      'rgb(255, 0, 0)'
    );
  });
});

function websiteIsOpened() {
  cy.visit('/');
}

function displaysWebsiteTitle(value: string) {
  cy.get('h1').contains(value);
}

function clickInputAddTask() {
  cy.get('input[id="newTask"]').click();
}

function submitNewTask() {
  cy.get('button[id="buttonSubmitNewTask"]').click();
}

function typeNewTaskTitle(value: string) {
  cy.get('input[id="newTask"]').type(value);
}

function displayNewTask() {
  cy.get('.task_name');
}
