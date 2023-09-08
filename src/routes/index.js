const express = require('express');
const router = express.Router();
const userRoute = require('./user.route');
const fileRoute = require('./file.route');


const defaultRoutes = [
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/files',
    route: fileRoute,
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;