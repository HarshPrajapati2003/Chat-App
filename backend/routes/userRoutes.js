const express = require('express')
const { registerUser, authUser, allUsers } = require('../controllers/userControllers')


const router = express.Router()

router.post('/', registerUser)
router.get("/", allUsers);
router.post('/login', authUser)

module.exports=router