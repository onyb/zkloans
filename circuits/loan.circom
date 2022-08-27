pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/comparators.circom";

template Loan() {
    signal input a;
    signal input b;

    component gteY = GreaterEqThan(32);
    gteY.in[0] <== a;
    gteY.in[1] <== b;
    gteY.out === 1;
}

component main = Loan();
