import { Worker, NEAR, NearAccount } from 'near-workspaces'
import anyTest, { TestFn } from 'ava'

const test = anyTest as TestFn<{
  worker: Worker
  accounts: Record<string, NearAccount>
}>

test.beforeEach(async t => {
  // Init the worker and start a Sandbox server
  const worker = await Worker.init()

  // Deploy contract
  const root = worker.rootAccount
  const contract = await root.createSubAccount('test-account')
  // Get wasm file path from package.json test script in folder above
  await contract.deploy(process.argv[2])

  const alice = await root.createSubAccount('alice', {
    initialBalance: NEAR.parse('30 N').toJSON()
  })

  // Save state for test runs, it is unique for each test
  t.context.worker = worker
  t.context.accounts = { root, contract, alice }
})

test.afterEach(async t => {
  // Stop Sandbox server
  await t.context.worker.tearDown().catch(error => {
    console.log('Failed to stop the Sandbox:', error)
  })
})

test('returns the default loan status', async t => {
  const { contract, alice } = t.context.accounts
  const status: boolean | null = await contract.view('get_loan_status_for_account', {
    account_id: alice.accountId
  })
  t.is(status, null)
})
