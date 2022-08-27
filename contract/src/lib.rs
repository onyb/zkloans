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
pub use crate::verifier::verify_proof;

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

    // Public method - approves loan for the AccountId and updates the
    // loan status.
    pub fn approve(&mut self) {
        let caller: AccountId = env::predecessor_account_id();
        self.loan_status.insert(&caller, &true);
    }

    // Public method - rejects loan for the AccountId and updates the
    // loan status.
    pub fn reject(&mut self) {
        let caller: AccountId = env::predecessor_account_id();
        self.loan_status.remove(&caller);
        self.loan_status.insert(&caller, &false);
    }

    // Public method - evict AccountId from loan DB regardless of status.
    pub fn evict(&mut self) {
        let caller: AccountId = env::predecessor_account_id();
        self.loan_status.remove(&caller);
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
        set_context("some_user");

        let status = contract.get_loan_status_for_account("some_user".parse().unwrap());
        assert_eq!(status.is_none(), true);

        contract.approve();
        let status = contract.get_loan_status_for_account("some_user".parse().unwrap());
        assert_eq!(status.unwrap().approved, true);
    }

    #[test]
    fn approve_approved_account() {
        let mut contract = Contract::default();
        set_context("some_user");

        contract.approve();
        contract.approve();

        let status = contract.get_loan_status_for_account("some_user".parse().unwrap());
        assert_eq!(status.unwrap().approved, true);
    }

    #[test]
    fn approve_rejected_account() {
        let mut contract = Contract::default();
        set_context("some_user");

        let status = contract.get_loan_status_for_account("some_user".parse().unwrap());
        assert_eq!(status.is_none(), true);

        contract.reject();
        let status = contract.get_loan_status_for_account("some_user".parse().unwrap());
        assert_eq!(status.unwrap().approved, false);

        contract.approve();
        let status = contract.get_loan_status_for_account("some_user".parse().unwrap());
        assert_eq!(status.unwrap().approved, true);
    }

    #[test]
    fn reject_unapproved_account() {
        let mut contract = Contract::default();
        set_context("some_user");

        let status = contract.get_loan_status_for_account("some_user".parse().unwrap());
        assert_eq!(status.is_none(), true);

        contract.reject();
        let status = contract.get_loan_status_for_account("some_user".parse().unwrap());
        assert_eq!(status.unwrap().approved, false);
    }

    #[test]
    fn reject_approved_account() {
        let mut contract = Contract::default();
        set_context("some_user");

        contract.approve();
        let status = contract.get_loan_status_for_account("some_user".parse().unwrap());
        assert_eq!(status.unwrap().approved, true);

        contract.reject();
        let status = contract.get_loan_status_for_account("some_user".parse().unwrap());
        assert_eq!(status.unwrap().approved, false);
    }

    #[test]
    fn reject_rejected_account() {
        let mut contract = Contract::default();
        set_context("some_user");

        let status = contract.get_loan_status_for_account("some_user".parse().unwrap());
        assert_eq!(status.is_none(), true);

        contract.reject();
        let status = contract.get_loan_status_for_account("some_user".parse().unwrap());
        assert_eq!(status.unwrap().approved, false);

        contract.reject();
        let status = contract.get_loan_status_for_account("some_user".parse().unwrap());
        assert_eq!(status.unwrap().approved, false);
    }

    ////////
    #[test]
    fn evict_unapproved_account() {
        let mut contract = Contract::default();
        set_context("some_user");

        let status = contract.get_loan_status_for_account("some_user".parse().unwrap());
        assert_eq!(status.is_none(), true);

        contract.evict();
        let status = contract.get_loan_status_for_account("some_user".parse().unwrap());
        assert_eq!(status.is_none(), true);
    }

    #[test]
    fn evict_approved_account() {
        let mut contract = Contract::default();
        set_context("some_user");

        contract.approve();
        let status = contract.get_loan_status_for_account("some_user".parse().unwrap());
        assert_eq!(status.unwrap().approved, true);

        contract.evict();
        let status = contract.get_loan_status_for_account("some_user".parse().unwrap());
        assert_eq!(status.is_none(), true);
    }

    #[test]
    fn evict_rejected_account() {
        let mut contract = Contract::default();
        set_context("some_user");

        let status = contract.get_loan_status_for_account("some_user".parse().unwrap());
        assert_eq!(status.is_none(), true);

        contract.reject();
        let status = contract.get_loan_status_for_account("some_user".parse().unwrap());
        assert_eq!(status.unwrap().approved, false);

        contract.evict();
        let status = contract.get_loan_status_for_account("some_user".parse().unwrap());
        assert_eq!(status.is_none(), true);
    }

    #[test]
    fn dump_all_loans() {
        let mut contract = Contract::default();

        set_context("user_1");
        contract.reject();

        set_context("user_2");
        contract.approve();

        set_context("user_3");
        contract.evict();

        let loans = contract.get_loans();
        assert_eq!(loans.len(), 2);
        assert_eq!(loans[0].account_id.as_str(), "user_1");
        assert_eq!(loans[0].approved, false);
        assert_eq!(loans[1].account_id.as_str(), "user_2");
        assert_eq!(loans[1].approved, true);
    }

    #[test]
    fn foo() {
        assert_eq!(LONG_STRING, "");
    }

    // Auxiliary fn: create a mock context
    fn set_context(predecessor: &str) {
        let mut builder = VMContextBuilder::new();
        builder.predecessor_account_id(predecessor.parse().unwrap());
        testing_env!(builder.build());
    }
}
