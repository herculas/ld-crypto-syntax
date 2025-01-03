import type { DIDURL } from "../did/keywords.ts"
import type { NodeObject } from "./node.ts"
import type { OneOrMany } from "./base.ts"
import type { Type } from "./keywords.ts"
import type { URL } from "./document.ts"

/**
 * A data integrity proof provides information about the proof mechanism, parameters required to verify that proof, and
 * the proof value itself.
 *
 * @see https://www.w3.org/TR/vc-data-model-2.0/#securing-mechanisms
 * @see https://www.w3.org/TR/vc-data-integrity/#proofs
 */
export interface Proof extends NodeObject {
  /**
   * The identifier of the proof.
   *
   * The value of this property MUST be a URL such as UUID as a URN.
   */
  id?: URL

  /**
   * The specific type of the proof. The type of the proof is used to determine what other fields are required to
   * secure and verify the proof.
   *
   * The value of this property MUST be specified as a string that maps to a URL.
   */
  type: Type

  /**
   * The reason the proof was created. The proof purpose acts as a safeguard to prevent the proof from being misused by
   * being applied to a purpose other than the one that was intended.
   *
   * For example, without this value, the creator of a proof could be tricked into using cryptographic material
   * typically used to create a Verifiable Credential (assertionMethod) during a login process (authentication) which
   * would then result in the creation of a verifiable credential they never meant to create instead of the intended
   * action, which was to merely log in to a website.
   *
   * The value of this property MUST be a string that maps to a URL.
   */
  proofPurpose: string

  /**
   * A verification method is the means and information needed to verify a proof. When verification method is present,
   * its value points to the actual location of the data; that is, the `verificationMethod` references, via a URL, the
   * location of the public key that can be used to verify the proof.
   *
   * The value of this property MUST be a string that maps to a URL.
   */
  verificationMethod?: DIDURL

  /**
   * An identifier for the cryptographic suite that can be used to verify the proof.
   *
   * If the proof `type` is `DataIntegrityProof`, `cryptosuite` MUST be specified; otherwise, ``cryptosuite` MAY be
   * specified. If specified, the value MUST be a string.
   */
  cryptosuite?: string

  /**
   * The date and time the proof was created.
   *
   * The value of this property MUST be a `dateTimeStamp` string, either in Universal Coordinated Time (UTC), denoted
   * by a `Z` at the end of the value, or with a time zone offset relative to UTC.
   *
   * @see https://www.w3.org/TR/xmlschema11-2/#dateTimeStamp
   */
  created?: string

  /**
   * The date and time the proof expires.
   *
   * The value of this property MUST be a `dateTimeStamp` string, either in Universal Coordinated Time (UTC), denoted
   * by a `Z` at the end of the value, or with a time zone offset relative to UTC.
   *
   * @see https://www.w3.org/TR/xmlschema11-2/#dateTimeStamp
   */
  expires?: string

  /**
   * One or more security domains in which the proof is meant to be used.
   *
   * The value of this property MUST be either a string, or an unordered set of strings.
   */
  domain?: OneOrMany<string>

  /**
   * The challenge used to mitigate replay attacks. This value is used for a particular domain and window of time.
   *
   * This property SHOULD be included in a proof if a `domain` is specified. The value of this property MUST be a
   * string.
   */
  challenge?: string

  /**
   * The proof value expresses base-encoded binary data necessary to verify the digital proof using the verification
   * method specified in the proof.
   *
   * This value MUST use a header and encoding as defined in the Multibase specification.
   *
   * @see https://www.w3.org/TR/controller-document/#multibase-0
   */
  proofValue?: string

  /**
   * Each value identifies another data integrity proof, all of which MUST also verify for the current proof to be
   * considered verified.
   *
   * The value of this property MUST be a string or an unordered list of strings.
   */
  previousProof?: OneOrMany<string>

  /**
   * A random value used to ensure that the proof is unique. One use of this field is to increase privacy by decreasing
   * linkability that is the result of deterministic generated signatures.
   *
   * The value of this property MUST be a string.
   */
  nonce?: string
}
