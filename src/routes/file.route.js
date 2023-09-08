const express = require('express');
const router = express.Router();
const { fileCtrl } = require('../controllers');
const { isAuth } = require('../middleware/auth');
const { uploadMultipleFiles } = require("../middleware/upload");


/**
 * @swagger
 *  /api/files/upload:
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
router.post("/upload", isAuth, uploadMultipleFiles("files"), fileCtrl.uploadFile);

/**
 * @swagger
 *  /api/files/download:
 *      post:
 *          summary: User uploads a file to send
 *          tags:
 *              - Files
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: string
 *                                  required: true
 *                              path:
 *                                  type: string
 *                                  required: true
 *                              password:
 *                                  type: string
 *                                  required: true
 *                          example:
 *                              id: ""
 *                              path: ""
 *                              password: ""
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
router.post("/download", fileCtrl.downloadFile);


module.exports = router;