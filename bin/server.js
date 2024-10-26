#!/usr/bin/env node
const fs = require('fs');
const yargs = require('yargs');
const path = require('path');
const tasksFile = path.join(__dirname, '../tasks.json');


const readTasks = () => {
  try {
    const data = fs.readFileSync(tasksFile, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.log('Error reading tasks file:', error);
    return [];
  }
};

const writeTasks = (tasks) => {
  try {
    fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error('Error writing tasks file:', error);
  }
};

let tasks = readTasks();
let idCounter = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;

yargs.command({
  command: 'add <task>',
  describe: 'Add a new task',
  builder: (yargs) => {
    return yargs.positional('task', {
      describe: 'Task to be added',
      type: 'string',
    });
  },
  handler(argv) {
    tasks.push({ id: idCounter++, task: argv.task, status: 'todo' });
    writeTasks(tasks);
    console.log(`Task added successfully (ID: ${idCounter - 1})`);
  },
});

yargs.command({
  command: 'update',
  describe: 'Update a task',
  builder: {
    id: {
      describe: 'ID of the task',
      demandOption: true,
      type: 'number',
    },
    task: {
      describe: 'Updated task description',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    const taskToUpdate = tasks.find(t => t.id === argv.id);
    if (taskToUpdate) {
      taskToUpdate.task = argv.task;
      writeTasks(tasks);
      console.log(`Task updated successfully (ID: ${argv.id})`);
    } else {
      console.log(`Task with ID ${argv.id} not found.`);
    }
  },
});

yargs.command({
  command: 'delete <id>',
  describe: 'Delete a task',
  builder: (yargs) => {
    return yargs.positional('id', {
      describe: 'ID of the task to delete',
      type: 'number',
    });
  },
  handler(argv) {
    // Filtramos la tarea y reasignamos IDs para que sean consecutivos
    const filteredTasks = tasks.filter(t => t.id !== argv.id)
      .map((task, index) => ({ ...task, id: index + 1 }));

    console.log('tasks', filteredTasks);
    writeTasks(filteredTasks);
    console.log(`Task deleted successfully (ID: ${argv.id})`);
  },
});


yargs.command({
  command: 'mark-in-progress <id>',
  describe: 'Mark a task as in progress',
   builder: (yargs) => {
    return yargs.positional('id', {
      describe: 'id to the task',
      type: 'number',
    });
  },
  handler(argv) {
    const taskToUpdate = tasks.find(t => t.id === argv.id);
    if (taskToUpdate) {
      taskToUpdate.status = 'in-progress';
      writeTasks(tasks);
      console.log(`Task marked as in progress (ID: ${argv.id})`);
    } else {
      console.log(`Task with ID ${argv} not found.`);
    }
  },
});

yargs.command({
  command: 'mark-done <id>',
  describe: 'Mark a task as done',
  builder: (yargs) =>{
    return yargs.positional('id',{
      describe: 'id to the task',
      type:'number'
    })
  },
  handler(argv) {
    const taskToUpdate = tasks.find(t => t.id === argv.id);
    if (taskToUpdate) {
      taskToUpdate.status = 'done';
      writeTasks(tasks);
      console.log(`Task marked as done (ID: ${argv.id})`);
    } else {
      console.log(`Task with ID ${argv.id} not found.`);
    }
  },
});

yargs.command({
  command: 'list',
  describe: 'List all tasks',
  handler() {
    console.log(tasks);
  },
});

yargs.command({
  command: 'list-status',
  describe: 'List tasks by status',
  builder: {
    status: {
      describe: 'Status of the tasks',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    const filteredTasks = tasks.filter(t => t.status === argv.status);
    console.log(filteredTasks);
  },
});

yargs.parse();
