const express = require('express')
const router = express.Router()
const db = require('../db')
const utils = require('../utils')
const cryptoJs = require('crypto-js')

router.get('/profile/:id', (request, response) => {
  const { id } = request.params

  const query = `select id, firstName, lastName, isActive, email from user where id = ${id}`
  db.query(query, (error, users) => {
    if (error) {
      // when there is an error from MySQL side
      response.send(utils.createError(error))
    } else {
      // user with correct email and password does not exist
      if (users.length == 0) {
        response.send(utils.createError('invalid user name or password'))
      } else {
        response.send(utils.createResult(error, users[0]))
      }
    }
  })
})

router.get('/getallcustomers', (request, response) => {

  const query = `select * from customers`
  db.query(query, (error, users) => {
    if (error) {
      // when there is an error from MySQL side
      response.send(utils.createError(error))
    } else {
        response.send(utils.createResult(error, users))
    }
  })
})

router.post('/addcustomer', (request, response) => {
  const { name, firm_name, contact, address } = request.body


  const query = `insert into customers (name, firm_name, contact, address) 
        values ('${name}', '${firm_name}', '${contact}', '${address}')`

  db.query(query, (error, result) => {
    response.send(utils.createResult(error, result))
  })
})

router.post('/signin', (request, response) => {
  const { email, password } = request.body

  // encrypt the password
  const encryptedPassword = cryptoJs.MD5(password)

  const query = `select id, firstName, lastName, isActive, email from user where email = '${email}' and password = '${encryptedPassword}'`

  db.query(query, (error, users) => {
    if (error) {
      // when there is an error from MySQL side
      response.send(utils.createError(error))
    } else {
      // user with correct email and password does not exist
      if (users.length == 0) {
        response.send(utils.createError('invalid user name or password'))
      } else {
        response.send(utils.createResult(error, users[0]))
      }
    }
  })
})

router.delete('/:id', (request, response) => {
  const { id } = request.params

  const query = `delete from user where id = ${id}`
  db.query(query, (error, result) => {
    response.send(utils.createResult(error, result))
  })
})

module.exports = router
