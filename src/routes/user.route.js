const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
const { isAuth } = require('../middleware/auth');
const { uploadMultipleFiles } = require("../middleware/upload");


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

/**
 * @swagger
 *  /api/file/upload:
 *      post:
 *          summary: User uploads a file to send
 *          tags:
 *              - Files
 *          security:
 *              - bearerAuth: []
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              recipient:
 *                                  type: string
 *                                  required: true
 *                              message:
 *                                  type: string
 *                                  required: false
 *                              password:
 *                                  type: string
 *                                  required: false
 *                              files:
 *                                  type: array
 *                                  items:
 *                                      type: string
 *                                      format: binary
 *                                      required: true
 *                          example:
 *                              recipient: "john@email.com"
 *                              message: "Your message goes here"
 *                              password: "Test_1234"
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
router.post("/file/upload", isAuth, uploadMultipleFiles("files"), userCtrl.uploadFile);


module.exports = router;