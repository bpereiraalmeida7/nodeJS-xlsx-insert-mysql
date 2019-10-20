

const express = require('express')

const app = express()

app.listen(3001, function() {
    console.log('server running on port 3001')
})

//Módulo dotenv (variaveis do sistema)
require('dotenv').config({path: '../.env'})
//Modulo para monitorar a pasta com arquivo de books
const fs = require('fs') 

const xlsx = require('node-xlsx')

//Configuração do banco e do knex 
const knex = require('./db') 

//Caminho do arquivo xlsx
const filePath = `${__dirname}/books.xlsx` 

//Função para retornar apenas valores existentes do .map
const identity = idusers => idusers

//Olhando alteração na planilha
fs.watchFile(filePath, function() {
  console.log(`Books alterado em ${new Date()}`)
  
  //Lendo a planilha
  const plan = xlsx.parse(filePath)

  const finalData = plan[0].data
    .map(([ idusers, title, author , lancamento]) => {
        return { idusers, title, author , lancamento }
    })
    .filter(identity)
    
  // inserindo os dados da planilha na tabela books
  knex('books').insert(finalData)
    .then(function(msg) {
      console.log('Operation Successful Completed')
    })
    .catch(function(error) {
      console.log(error)
    })

  console.log('End of fs.watch() wait for callback from batchInsert')

})