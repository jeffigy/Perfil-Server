const userRoutes = require('express').Router()
const usersController = require('../controllers/usersController')

userRoutes.route('/').get(usersController.getAllUsers)

module.exports = userRoutes