const express = require('express')
const fs = require('fs')
const snarkjs = require('snarkjs')

const app = express()
app.use(express.json())

app.post('/prove', function (request, response) {
  const inputSignals = request.body

  snarkjs.groth16
    .fullProve(inputSignals, __dirname + '/../snark-dat/loan_js/loan.wasm', __dirname + '/../snark-dat/loan_0000.zkey')
    .then(result => response.send(result))
})

app.post('/verify', function (request, response) {
  const { proof, publicSignals } = request.body

  const vKey = JSON.parse(fs.readFileSync(__dirname + '/../snark-dat/verification_key.json'))

  snarkjs.groth16
    .verify(vKey, publicSignals, proof)
    .then(result => response.send({ valid: result }))
})

const server = app.listen(8081, function () {
  const { address: host, port } = server.address()
  console.log('groth16 ZK-SNARK prover listening at http://%s:%s', host, port)
})
