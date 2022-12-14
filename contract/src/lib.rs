/*
 * Example smart contract written in RUST
 *
 * Learn more about writing NEAR smart contracts with Rust:
 * https://near-docs.io/develop/Contract
 *
 */
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::{env, near_bindgen, AccountId};

mod verifier;
mod views;
pub use crate::verifier::{get_prepared_verifying_key, parse_verification_key, verify_proof};

// Verification key for verifying Groth16 zk-SNARK proofs on Near VM.
//
// The key must be in JSON format exported by snarkjs like this:
// {
//    "protocol": "groth16",
//    "curve": "bn128",
//    "nPublic": 1,
//    "vk_beta_2": [...],
//    "vk_gamma_2": [...],
//    "vk_delta_2": [...],
//    "vk_alphabet_12": [...],
//    "IC": []
// }
//
// Make sure the verification key has been generated before compiling the
// Rust contracts. It must be generated only once per circuit. The
// include_str!() macro ensures that the verification key is statically part
// of the Rust program.
static VERIFICATION_KEY: &'static str = include_str!("../../snark-dat/verification_key.json");

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    // A map containing statuses of all loans processed by the contract.
    //
    // Absence of an AccountId indicates that the user hasn't submitted
    // a loan application.
    //
    // If an AccountId is found in the map, the corresponding value indicates
    // the status of the loan application.
    pub loan_status: UnorderedMap<AccountId, bool>,
}

// Define the default, which automatically initializes the contract
impl Default for Contract {
    fn default() -> Self {
        Self {
            loan_status: UnorderedMap::new(b"d"),
        }
    }
}

// Implement the contract structure
#[near_bindgen]
impl Contract {
    // Public method - returns the loan status saved, defaulting to false
    pub fn get_status(&self) -> Option<bool> {
        let caller: AccountId = env::predecessor_account_id();
        let status = self.get_loan_status_for_account(caller);
        return match status {
            Some(loan_status) => Some(loan_status.approved),
            None => None,
        };
    }

    // Public method - verify a groth16 ZK-SNARK proof and approve/reject
    // loan based on the verification result.
    pub fn verify(&mut self, proof_str: String, public_inputs_str: String) {
        let caller: AccountId = env::predecessor_account_id();
        let vkey = parse_verification_key(VERIFICATION_KEY.to_string());

        let status = match vkey {
            Ok(key_json) => {
                let prepared_vkey = get_prepared_verifying_key(key_json);
                match verify_proof(
                    prepared_vkey,
                    proof_str,
                    public_inputs_str,
                ) {
                    Ok(result) => Some(result),
                    Err(_) => None,
                }
            }
            Err(_) => None,
        };

        match status {
            Some(approved) => {
                if approved {
                    self.approve(caller);
                } else {
                    self.reject(caller);
                }
            }
            None => (),
        }
    }

    // Public method - approves loan for the AccountId and updates the
    // loan status.
    fn approve(&mut self, account_id: AccountId) {
        self.loan_status.insert(&account_id, &true);
    }

    // Public method - rejects loan for the AccountId and updates the
    // loan status.
    pub fn reject(&mut self, account_id: AccountId) {
        self.loan_status.remove(&account_id);
        self.loan_status.insert(&account_id, &false);
    }

    // Public method - evict AccountId from loan DB regardless of status.
    pub fn evict(&mut self, account_id: AccountId) {
        self.loan_status.remove(&account_id);
    }
}

/*
 * The rest of this file holds the inline tests for the code above
 * Learn more about Rust tests: https://doc.rust-lang.org/book/ch11-01-writing-tests.html
 */
#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::test_utils::VMContextBuilder;
    use near_sdk::testing_env;
    #[test]
    fn get_default_loan_status() {
        let contract = Contract::default();
        set_context("some_user");

        let status = contract.get_loan_status_for_account("some_user".parse().unwrap());
        assert_eq!(status.is_none(), true);
    }

    #[test]
    fn approve_unapproved_account() {
        let mut contract = Contract::default();
        let account_id: AccountId = "some_user".parse().unwrap();

        let status = contract.get_loan_status_for_account(account_id.clone());
        assert_eq!(status.is_none(), true);

        contract.approve(account_id.clone());
        let status = contract.get_loan_status_for_account(account_id);
        assert_eq!(status.unwrap().approved, true);
    }

    #[test]
    fn approve_approved_account() {
        let mut contract = Contract::default();
        let account_id: AccountId = "some_user".parse().unwrap();

        contract.approve(account_id.clone());
        contract.approve(account_id.clone());

        let status = contract.get_loan_status_for_account(account_id);
        assert_eq!(status.unwrap().approved, true);
    }

    #[test]
    fn approve_rejected_account() {
        let mut contract = Contract::default();
        let account_id: AccountId = "some_user".parse().unwrap();

        let status = contract.get_loan_status_for_account(account_id.clone());
        assert_eq!(status.is_none(), true);

        contract.reject(account_id.clone());
        let status = contract.get_loan_status_for_account(account_id.clone());
        assert_eq!(status.unwrap().approved, false);

        contract.approve(account_id.clone());
        let status = contract.get_loan_status_for_account(account_id);
        assert_eq!(status.unwrap().approved, true);
    }

    #[test]
    fn reject_unapproved_account() {
        let mut contract = Contract::default();
        let account_id: AccountId = "some_user".parse().unwrap();

        let status = contract.get_loan_status_for_account(account_id.clone());
        assert_eq!(status.is_none(), true);

        contract.reject(account_id.clone());
        let status = contract.get_loan_status_for_account(account_id);
        assert_eq!(status.unwrap().approved, false);
    }

    #[test]
    fn reject_approved_account() {
        let mut contract = Contract::default();
        let account_id: AccountId = "some_user".parse().unwrap();

        contract.approve(account_id.clone());
        let status = contract.get_loan_status_for_account(account_id.clone());
        assert_eq!(status.unwrap().approved, true);

        contract.reject(account_id.clone());
        let status = contract.get_loan_status_for_account(account_id);
        assert_eq!(status.unwrap().approved, false);
    }

    #[test]
    fn reject_rejected_account() {
        let mut contract = Contract::default();
        let account_id: AccountId = "some_user".parse().unwrap();

        let status = contract.get_loan_status_for_account(account_id.clone());
        assert_eq!(status.is_none(), true);

        contract.reject(account_id.clone());
        let status = contract.get_loan_status_for_account(account_id.clone());
        assert_eq!(status.unwrap().approved, false);

        contract.reject(account_id.clone());
        let status = contract.get_loan_status_for_account(account_id);
        assert_eq!(status.unwrap().approved, false);
    }

    #[test]
    fn evict_unapproved_account() {
        let mut contract = Contract::default();
        let account_id: AccountId = "some_user".parse().unwrap();

        let status = contract.get_loan_status_for_account(account_id.clone());
        assert_eq!(status.is_none(), true);

        contract.evict(account_id.clone());
        let status = contract.get_loan_status_for_account(account_id);
        assert_eq!(status.is_none(), true);
    }

    #[test]
    fn evict_approved_account() {
        let mut contract = Contract::default();
        let account_id: AccountId = "some_user".parse().unwrap();

        contract.approve(account_id.clone());
        let status = contract.get_loan_status_for_account(account_id.clone());
        assert_eq!(status.unwrap().approved, true);

        contract.evict(account_id.clone());
        let status = contract.get_loan_status_for_account(account_id);
        assert_eq!(status.is_none(), true);
    }

    #[test]
    fn evict_rejected_account() {
        let mut contract = Contract::default();
        let account_id: AccountId = "some_user".parse().unwrap();

        let status = contract.get_loan_status_for_account(account_id.clone());
        assert_eq!(status.is_none(), true);

        contract.reject(account_id.clone());
        let status = contract.get_loan_status_for_account(account_id.clone());
        assert_eq!(status.unwrap().approved, false);

        contract.evict(account_id.clone());
        let status = contract.get_loan_status_for_account(account_id);
        assert_eq!(status.is_none(), true);
    }

    #[test]
    fn dump_all_loans() {
        let mut contract = Contract::default();
        let account_id_1: AccountId = "user_1".parse().unwrap();
        let account_id_2: AccountId = "user_2".parse().unwrap();
        let account_id_3: AccountId = "user_3".parse().unwrap();

        contract.reject(account_id_1);
        contract.approve(account_id_2);
        contract.evict(account_id_3);

        let loans = contract.get_loans();
        assert_eq!(loans.len(), 2);
        assert_eq!(loans[0].account_id.as_str(), "user_1");
        assert_eq!(loans[0].approved, false);
        assert_eq!(loans[1].account_id.as_str(), "user_2");
        assert_eq!(loans[1].approved, true);
    }

    // Auxiliary fn: create a mock context
    fn set_context(predecessor: &str) {
        let mut builder = VMContextBuilder::new();
        builder.predecessor_account_id(predecessor.parse().unwrap());
        testing_env!(builder.build());
    }
}
