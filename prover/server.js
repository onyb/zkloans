const express = require('express')
const cors = require('cors')
const fs = require('fs')
const snarkjs = require('snarkjs')

const app = express()
app.use(express.json())
app.use(cors())

app.post('/prove', function (request, response) {
  const inputSignals = request.body

  console.log('-> generate groth16 proof <-')
  console.log('input signals: ', inputSignals)

  fs.writeFileSync(__dirname + '/../snark-dat/input.json', JSON.stringify(inputSignals), {
    encoding: 'utf8'
  })

  snarkjs.groth16
    .prove(__dirname + '/../snark-dat/loan.zkey', __dirname + '/../snark-dat/witness.wtns')
    .then(result => response.send(result))
})

app.post('/verify', function (request, response) {
  const { proof, publicSignals } = request.body

  console.log('-> verify groth16 proof <-')
  console.log('proof: ', proof)
  console.log('public signals: ', publicSignals)

  const vKey = JSON.parse(
    fs.readFileSync(__dirname + '/../snark-dat/verification_key.json', { encoding: 'utf8' })
  )
  console.log('Successfully loaded verification key')

  snarkjs.groth16
    .verify(vKey, publicSignals || [], proof)
    .then(result => response.send({ valid: result }))
})

const server = app.listen(8081, function () {
  const { address: host, port } = server.address()
  console.log('groth16 ZK-SNARK prover listening at http://%s:%s', host, port)
})
