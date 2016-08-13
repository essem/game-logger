'use strict';

const route = require('koa-route');
const parse = require('co-body');

let dbTodoNextId = 3;
const dbTodo = [
  { id: 0, text: 'hello', completed: true },
  { id: 1, text: 'world', completed: false },
];

function init(app) {
  app.use(route.get('/api/todos', function* listTodo() {
    this.body = JSON.stringify(dbTodo);
  }));

  app.use(route.post('/api/todos', function* createTodo() {
    const body = yield parse.json(this);

    const newTodo = {
      id: dbTodoNextId,
      text: body.text,
      completed: false,
    };
    dbTodo.push(newTodo);
    ++dbTodoNextId;

    this.body = JSON.stringify(newTodo);
  }));

  app.use(route.put('/api/todos/:id/toggle', function* toggleTodo(idStr) {
    const id = parseInt(idStr, 10);
    const todo = dbTodo.find(t => t.id === id);
    todo.completed = !todo.completed;

    this.res.statusCode = 200;
  }));
}

module.exports = init;
