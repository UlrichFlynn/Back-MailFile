const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
const { isAuth } = require('../middleware/auth');


/**
 * @swagger
 *  /api/auth/login:
 *      post:
 *          summary: User logs into the platform
 *          tags:
 *              - Auth
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                                  required: true
 *                              password:
 *                                  type: string
 *                                  required: true
 *                          example:
 *                              email: "john@email.com"
 *                              password: "Test_1234"
 *          responses:
 *              '200':
 *                description: >
 *                    Login successfull
 *              '400':
 *                description: >
 *                    Invalid email || Password does not match
 *              '404':
 *                description: >
 *                    No user found with this email
 *              '500':
 *                  description: >
 *                    Error generating token || Token not saved || Server Error
 *
 */
router.post("/auth/login", userCtrl.login);

/**
 * @swagger
 *  /api/auth/logout:
 *      post:
 *          summary: User logs out of the platform
 *          tags:
 *              - Auth
 *          responses:
 *              '200':
 *                description: >
 *                    Logout successfull
 *
 */
router.post("/auth/logout", userCtrl.logout);

/**
 * @swagger
 *  /api/users/create-account:
 *      post:
 *          summary: Creation of a user account
 *          tags:
 *              - Users
 *          security:
 *              - bearerAuth: []
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                                  required: true
 *                              role:
 *                                  type: string
 *                                  required: true
 *                          example:
 *                              email: "john@email.com"
 *                              role: "USER"
 *          responses:
 *              '201':
 *                description: >
 *                    Account successfully created
 *              '400':
 *                description: >
 *                    Invalid email ||
 *                    Invalid role ||
 *                    The email you entered is already taken
 *              '500':
 *                  description: >
 *                    Server Error || Account creation failure
 *
 */
router.post("/users/create-account", isAuth, userCtrl.createAccount);


module.exports = router;