export function ZK(props) {
  return (
    <div>
      Generating groth16 ZK-SNARK proof...
      {props.isVerifyingZKProof && <>Verifying proof</>}
      {props.isValidZKProof !== undefined && props.isValidZKProof}
    </div>
  )
}
