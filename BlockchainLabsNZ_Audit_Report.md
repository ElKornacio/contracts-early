# LAToken Audit Report

## Preamble
This audit report was undertaken by BlockchainLabs.nz for the purpose of providing feedback to LAToken. It has subsequently been shared publicly without any express or implied warranty.

Solidity contracts were sourced from the public Github repo [ElKornacio/contracts-early](https://github.com/ElKornacio/contracts-early) prior to commit [199e6a8ce4662f4e3a66e7b689876baea42e665a](https://github.com/ElKornacio/contracts-early/tree/199e6a8ce4662f4e3a66e7b689876baea42e665a) - we would encourage all community members and token holders to make their own assessment of the contracts.

## Scope
All Solidity code contained in [/contracts](https://github.com/LAToken/smart-contract/tree/master/contracts) was considered in scope along with the tests contained in [/test](https://github.com/LAToken/smart-contract/tree/master/test) as a basis for static and dynamic analysis.

## Focus Areas
The audit report is focused on the following key areas - though this is not an exhaustive list.
### Correctness
- No correctness defects uncovered during static analysis?
- No implemented contract violations uncovered during execution?
- No other generic incorrect behaviour detected during execution?
- Adherence to adopted standards such as ERC20?
### Testability
- Test coverage across all functions and events?
- Test cases for both expected behaviour and failure modes?
- Settings for easy testing of a range of parameters?
- No reliance on nested callback functions or console logs?
- Avoidance of test scenarios calling other test scenarios?
### Security
- No presence of known security weaknesses?
- No funds at risk of malicious attempts to withdraw/transfer?
- No funds at risk of control fraud?
- Prevention of Integer Overflow or Underflow?
### Best Practice
- Explicit labeling for the visibility of functions and state variables?
- Proper management of gas limits and nested execution?
- Latest version of the Solidity compiler?

## Classification
### Defect Severity
- Minor - A defect that does not have a material impact on the contract execution and is likely to be subjective.
- Moderate - A defect that could impact the desired outcome of the contract execution in a specific scenario.
- Major - A defect that impacts the desired outcome of the contract execution or introduces a weakness that may be exploited.
- Critical - A defect that presents a significant security vulnerability or failure of the contract across a range of scenarios.

## Findings
### Minor
- **Throw is deprecated, favour the use of require and assert** -  Similar to how `founder` is set to `msg.sender` on `LATToken` creation, `minter` should be set to `msg.sender` ... [View on GitHub](https://github.com/BlockchainLabsNZ/LAToken-Contracts-Audit/issues/10)
  - [x] Fixed [2a85d4b5](https://github.com/ElKornacio/contracts-early/commit/2a85d4b5f63c078dfdaefe6f11a025fe77fb91bb)
- **currentDay offset by 1** - See line [#113](https://github.com/ElKornacio/contracts-early/blob/master/contracts/LATokenMinter.sol#L113]) ... [View on GitHub](https://github.com/BlockchainLabsNZ/LAToken-Contracts-Audit/issues/20)
  - [x] Fixed [d22c25e8](https://github.com/ElKornacio/contracts-early/commit/d22c25e8f4bb91d48630772d5d948a9fba0d9252)
- **Using SafeMathLib instead of SafeMath** -  Facilitates the use of the latest versions of the function and upgrading in case another version is released ... [View on GitHub](https://github.com/BlockchainLabsNZ/LAToken-Contracts-Audit/issues/8)
  - [x] Fixed [2a85d4b5](https://github.com/ElKornacio/contracts-early/commit/2a85d4b5f63c078dfdaefe6f11a025fe77fb91bb)
- **No Pragma specified for LAToken** - ... [View on GitHub](https://github.com/BlockchainLabsNZ/LAToken-Contracts-Audit/issues/4)
  - [x] Fixed [2a85d4b5](https://github.com/ElKornacio/contracts-early/commit/2a85d4b5f63c078dfdaefe6f11a025fe77fb91bb)  
- **Comment needs fixing for accuracy** -  See line [#136](https://github.com/ElKornacio/contracts-early/blob/master/contracts/LATokenMinter.sol#L136]) ... [View on GitHub](https://github.com/BlockchainLabsNZ/LAToken-Contracts-Audit/issues/31)
  - [x] Fixed [000ba0ad](https://github.com/ElKornacio/contracts-early/commit/000ba0addc6360d5ad6c2bc26e50e0c497e1a1a1)
- **Add check in harvest method before issuing tokens** -  Recommended to add another check in `harvest` method `require(wasNotHarvested >0)` BEFORE token.issueTokens ... [View on GitHub](https://github.com/BlockchainLabsNZ/LAToken-Contracts-Audit/issues/24)
  - [x] Fixed [000ba0ad](https://github.com/ElKornacio/contracts-early/commit/000ba0addc6360d5ad6c2bc26e50e0c497e1a1a1)
- **Tidy code** -  In `ExchangeContract`: ``` prevCourse = _prevCourse; nextCourse = _nextCourse; ``` can be replaced by `changeCourse(_prevCourse, _nextCourse);` ... [View on GitHub](https://github.com/BlockchainLabsNZ/LAToken-https://github.com/BlockchainLabsNZ/LAToken-Contracts-Audit/issues/19Contracts-Audit/issues/27)
  - [x] Fixed [76a7a05f](https://github.com/BlockchainLabsNZ/LAToken-Contracts-Audit/pull/41/commits/76a7a05fb47d5e716aeb65c55242150a973f14f3)
- **Token and address stored as globals** -  Rather than storing the address and token as globals ... [View on GitHub](https://github.com/BlockchainLabsNZ/LAToken-Contracts-Audit/issues/26)
  - [x] Fixed [76a7a05f](https://github.com/BlockchainLabsNZ/LAToken-Contracts-Audit/pull/41/commits/76a7a05fb47d5e716aeb65c55242150a973f14f3)
- **Remove comment in Non-English and add ENG comments in ExchangeContract.sol** -  [#L46](https://github.com/ElKornacio/contracts-early/blob/master/contracts/ExchangeContract.sol#L46]) ... [View on GitHub](https://github.com/BlockchainLabsNZ/LAToken-Contracts-Audit/issues/25)
  - [x] Fixed [76a7a05f](https://github.com/BlockchainLabsNZ/LAToken-Contracts-Audit/pull/41/commits/76a7a05fb47d5e716aeb65c55242150a973f14f3)
- **Add README.md outlining contract deployment instructions** -  Recommended to add documentation similar to the examples below to increase transparency: ... [View on GitHub](https://github.com/BlockchainLabsNZ/LAToken-Contracts-Audit/issues/13)
  - [x] Fixed [76a7a05f](https://github.com/BlockchainLabsNZ/LAToken-Contracts-Audit/pull/41/commits/76a7a05fb47d5e716aeb65c55242150a973f14f3)
- **Minter should default to founder on LATToken creation** -  Similar to how `founder` is set to `msg.sender` on `LATToken` creation, `minter` should be set to `msg.sender` ... [View on GitHub](https://github.com/BlockchainLabsNZ/LAToken-Contracts-Audit/issues/19)
    - [x] [Fixed](https://github.com/BlockchainLabsNZ/LAToken-Contracts-Audit/issues/19)

### Moderate
- **SafeMath should be used for all mathematical operations** -  Please SafeMath should be used: - [LATokenMinter.sol #113](https://github.com/ElKornacio/contracts-early/blob/199e6a8ce4662f4e3a66e7b689876baea42e665a/LATokenMinter.sol#L113) ... [View on GitHub](https://github.com/BlockchainLabsNZ/LAToken-Contracts-Audit/issues/2)
  - [x] Fixed [2a85d4b5](https://github.com/ElKornacio/contracts-early/commit/2a85d4b5f63c078dfdaefe6f11a025fe77fb91bb)
- **Unable to harvest/exchange unless minter is set to the LATokenMinter contract** - The minter contract address needs to be set as the `minter` to `harvest` or `exchange` but needs to be set to a user's address to burn ... [View on GitHub](https://github.com/BlockchainLabsNZ/LAToken-Contracts-Audit/issues/34)
  - [x] Fixed [7fb14b32](https://github.com/BlockchainLabsNZ/LAToken-Contracts-Audit/commit/7fb14b3222aab60e37a6e6fa10b3ef6dca7c2c42)  
- **Add check for if teamPoolForFrozenTokens has been set** -  There is no check if `teamPoolForFrozenTokens` has been set resulting in dangerously being able to mint these tokens into nowhere ... [View on GitHub](https://github.com/BlockchainLabsNZ/LAToken-Contracts-Audit/issues/22)
  - [x] Fixed [000ba0ad](https://github.com/ElKornacio/contracts-early/commit/000ba0addc6360d5ad6c2bc26e50e0c497e1a1a1)

### Major
- None found
### Critical
- None found

## Addendum
Upon finalization of the contracts to be used by LAToken, the developers have diligently enumerated all the functions of the contracts in [Functionalities.md](https://github.com/LAToken/smart-contract/blob/master/Functionalities.md).

We have reviewed this document to ensure that there are no ommisions and that the developers' comments are a fair summary of each function.

## Conclusion
Overall we have been satisfied with the resulting contracts following the audit feedback period. We took part in creating a test suite using the Truffle Framework to fully satisfy coverage in all areas.

The developers have followed common best practices and demonstrated an awareness for the need of adding clarity to certain aspects in their contracts to avoid confusion and improve transparency.
