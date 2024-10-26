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

// Función para escribir tareas en el archivo JSON
const writeTasks = (tasks) => {
  try {
    fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error('Error writing tasks file:', error);
  }
};


let tasks = readTasks();
let idCounter = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;

// Comando para agregar una nueva tarea
yargs.command({
  command: 'add',
  describe: 'Add a new task',
  builder: {
    task: {
      describe: 'Task to be added',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    tasks.push({ id: idCounter++, task: argv.task, status: 'todo' });
    writeTasks(tasks);
    console.log(`Task added successfully (ID: ${idCounter - 1})`);
  },
});

// Comando para actualizar una tarea
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

// Comando para eliminar una tarea
yargs.command({
  command: 'delete',
  describe: 'Delete a task',
  builder: {
    id: {
      describe: 'ID of the task',
      demandOption: true,
      type: 'number',
    },
  },
  handler(argv) {
    tasks = tasks.filter(t => t.id !== argv.id);
    writeTasks(tasks);
    console.log(`Task deleted successfully (ID: ${argv.id})`);
  },
});

// Comando para marcar una tarea como en progreso
yargs.command({
  command: 'mark-in-progress',
  describe: 'Mark a task as in progress',
  builder: {
    id: {
      describe: 'ID of the task',
      demandOption: true,
      type: 'number',
    },
  },
  handler(argv) {
    const taskToUpdate = tasks.find(t => t.id === argv.id);
    if (taskToUpdate) {
      taskToUpdate.status = 'in-progress';
      writeTasks(tasks);
      console.log(`Task marked as in progress (ID: ${argv.id})`);
    } else {
      console.log(`Task with ID ${argv.id} not found.`);
    }
  },
});

// Comando para marcar una tarea como completada
yargs.command({
  command: 'mark-done',
  describe: 'Mark a task as done',
  builder: {
    id: {
      describe: 'ID of the task',
      demandOption: true,
      type: 'number',
    },
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

// Comando para listar todas las tareas
yargs.command({
  command: 'list-all',
  describe: 'List all tasks',
  handler() {
    console.log(tasks);
  },
});

// Comando para listar tareas por estado
yargs.command({
  command: 'list',
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

// Inicializa Yargs
yargs.parse();
