use near_sdk::serde::Serialize;

use crate::*;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct LoanStatus {
    pub account_id: AccountId,
    pub approved: bool,
}

#[near_bindgen]
impl Contract {
    // Public - get loan status by account ID
    pub fn get_loan_status_for_account(&self, account_id: AccountId) -> Option<LoanStatus> {
        match self.loan_status.get(&account_id) {
            Some(status) => Some(LoanStatus {
                account_id: account_id.clone(),
                approved: status,
            }),
            None => None,
        }
    }

    // Public - dump of all loan statuses
    pub fn get_loans(&self) -> Vec<LoanStatus> {
        self.loan_status
            .keys()
            .map(|account| self.get_loan_status_for_account(account))
            .flatten()
            .collect()
    }
}
