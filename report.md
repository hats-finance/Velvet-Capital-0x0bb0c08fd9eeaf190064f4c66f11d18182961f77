# **Velvet Capital Audit Competition on Hats.finance** 


## Introduction to Hats.finance


Hats.finance builds autonomous security infrastructure for integration with major DeFi protocols to secure users' assets. 
It aims to be the decentralized choice for Web3 security, offering proactive security mechanisms like decentralized audit competitions and bug bounties. 
The protocol facilitates audit competitions to quickly secure smart contracts by having auditors compete, thereby reducing auditing costs and accelerating submissions. 
This aligns with their mission of fostering a robust, secure, and scalable Web3 ecosystem through decentralized security solutions​.

## About Hats Audit Competition


Hats Audit Competitions offer a unique and decentralized approach to enhancing the security of web3 projects. Leveraging the large collective expertise of hundreds of skilled auditors, these competitions foster a proactive bug hunting environment to fortify projects before their launch. Unlike traditional security assessments, Hats Audit Competitions operate on a time-based and results-driven model, ensuring that only successful auditors are rewarded for their contributions. This pay-for-results ethos not only allocates budgets more efficiently by paying exclusively for identified vulnerabilities but also retains funds if no issues are discovered. With a streamlined evaluation process, Hats prioritizes quality over quantity by rewarding the first submitter of a vulnerability, thus eliminating duplicate efforts and attracting top talent in web3 auditing. The process embodies Hats Finance's commitment to reducing fees, maintaining project control, and promoting high-quality security assessments, setting a new standard for decentralized security in the web3 space​​.

## Velvet Capital Overview

Intent Operating System streamlining portfolio management and make DeFi social

## Competition Details


- Type: A public audit competition hosted by Velvet Capital
- Duration: 2 weeks
- Maximum Reward: $69,870.71
- Submissions: 113
- Total Payout: $40,427.19 distributed among 16 participants.

## Scope of Audit

No scope available.

## High severity issues


- **Exploit to Drain Tokens via Improper Validation in DepositBatch Function**

  A vulnerability has been identified in the DepositBatch, WithdrawBatch, and EnsoHandlers contracts which enables attackers to drain these contracts' approvers' token balances due to improper input validation in the DepositBatch.multiTokenSwapAndTransfer() function. This issue arises from the integration with Enso's SafeEnsoShortcuts, which allows delegate calls to any input contracts. 

The exploit works as follows: a user approves the DepositBatch contract to spend their USDT tokens and an attacker then calls the multiTokenSwapAndTransfer() function with malicious calldata. This calldata exploits the delegate call to SafeEnsoShortcuts, allowing the attacker to transfer USDT tokens from the user's balance to the attacker's wallet.

To address the issue, it is recommended to add a whitelisting mechanism for the target contracts and function selectors. One user fabricated the calldata manually for the Proof of Concept (PoC) and suggested generating it based on test environment addresses for clarity. Consequently, a revised PoC was provided, showing successful token draining in the test environment.

The vulnerability was acknowledged, leading to updates in the code to resolve the issue. The changes have been committed and can be reviewed in the specified repository link.


  **Link**: [Issue #78](https://github.com/hats-finance/Velvet-Capital-0x0bb0c08fd9eeaf190064f4c66f11d18182961f77/issues/78)

## Medium severity issues


- **Unprotected ERC20 Permit Functionality Can Lead to Transaction Reversion**

  The `VaultManager.sol` contract includes functions that allow users to grant ERC20 permits to others for depositing and transferring tokens. The permit functionality is vulnerable to front-running attacks that can lead to denial of service (DoS) during deposits. While the `permit` function confirms the signature matches the owner, it doesn't verify who executes the permit. An attacker can exploit this by front-running a transaction and using the permit signature, causing the initial transaction to fail when it attempts to use the already consumed permit.

In a practical scenario, Alice grants Bob permissions to deposit tokens via multiple batched permits. When Bob tries to execute these permits, an attacker could intercept the signature details from the mempool and use the permit before Bob, resulting in Bob's transaction failing and wasting gas.

A recommended fix is to wrap every `permit` call in a try/catch block, ensuring the call-chain doesn't revert but continues using the granted allowance accordingly. Further detailed advice and an example can be found in the linked article.


  **Link**: [Issue #5](https://github.com/hats-finance/Velvet-Capital-0x0bb0c08fd9eeaf190064f4c66f11d18182961f77/issues/5)


- **Cannot Reset Watermark to Zero on First Deposit as Intended**

  During the first deposit, the protocol intends to reset the watermark to 0. However, current logic prevents this if the watermark is already greater than 0. The `_updateHighWaterMark` function only updates the watermark if the new value is greater than the current one. This oversight means the watermark cannot be reset to 0 as intended. The protocol should be modified to ensure that the high watermark is set to 0 during the first deposit. The proposed revision involves modifying the function to directly set the `highWatermark` to the current price, regardless of its value. The changes have been implemented and pushed to the repository.


  **Link**: [Issue #45](https://github.com/hats-finance/Velvet-Capital-0x0bb0c08fd9eeaf190064f4c66f11d18182961f77/issues/45)


- **Potential Inaccurate Fee Accrual and Minting Due to Parameter Adjustments by Admin**

  Portfolios are linked to a fee module that charges and mints fees based on configurations and token supply. These parameters, which can be updated by the ProtocolOwner, determine the fee amount. Changes to parameters without minting previously accrued fees may result in incorrect fees being minted over time. The `_chargeFees()` function triggers fee calculation and minting upon deposits and withdrawals. However, if no activity occurs, fees accrue until the next deposit or withdrawal. If admin changes basis points before minting these accrued fees, the protocol may charge inaccurately. To rectify, the recommendation is to invoke `feeModule._chargeProtocolAndManagementFees()` before updating fee parameters. The issue has been resolved with the updates available in the given commit link.


  **Link**: [Issue #47](https://github.com/hats-finance/Velvet-Capital-0x0bb0c08fd9eeaf190064f4c66f11d18182961f77/issues/47)


- **Rebalancing Contract's Strict Dust Check Causes DoS Vulnerability in updateWeights Function**

  The `updateWeights` function in the Rebalancing contract updates asset weights by pulling funds from the vault to a swap handler. However, the process of verifying token balances is overly strict because it requires swapping exact token amounts, leaving no room for small leftover amounts (dust), which can cause the operation to revert unexpectedly. Additionally, if a swap handler is pre-funded with a small token amount, the swap might not use all tokens, resulting in leftover tokens and causing repeated denial of service (DOS) when updating weights. The suggested fix includes adjusting how funds are handled and transferred, ensuring any leftover tokens in the `EnsoHandler` are moved back to the vault to prevent DOS attacks.


  **Link**: [Issue #61](https://github.com/hats-finance/Velvet-Capital-0x0bb0c08fd9eeaf190064f4c66f11d18182961f77/issues/61)

## Low severity issues


- **USDT Approval Issue in multiTokenSwapAndTransfer Function for Mainnet Deployment**

  The `multiTokenSwapAndTransfer` function in `DepositBatch` has an issue with the plain `Approve` ERC20 function when dealing with USDT on Mainnet. USDT's `approve()` function fails if the current approval isn't set to zero. This issue isn't present on BSC and Arbitrum, but could affect multi-chain deployments. Setting the allowance to zero before re-approval is recommended for mitigation.


  **Link**: [Issue #3](https://github.com/hats-finance/Velvet-Capital-0x0bb0c08fd9eeaf190064f4c66f11d18182961f77/issues/3)


- **VaultManager Does Not Properly Enforce Minimum Mint Amount Before Fees**

  VaultManager's `_minMintAmount` enforcement is flawed. When users deposit, the minimum mint amount is checked before fees are applied, potentially resulting in users receiving fewer tokens than specified. This breaks a key invariant. A proof of concept was requested, and the issue has been resolved and updated in the code repository.


  **Link**: [Issue #31](https://github.com/hats-finance/Velvet-Capital-0x0bb0c08fd9eeaf190064f4c66f11d18182961f77/issues/31)


- **TokenWhitelistManagement lacks remove operation, potential issues in init function**

  In the `TokenWhitelistManagement` contract, there is a discrepancy where the add operation for token whitelisting is implemented during initialization, but the remove operation is absent. The existence of the `TokensRemovedFromWhitelist` event suggests a plan to include token removal. The recommended action is either to ensure the whitelisting is properly initialized when enabled or to implement the remove operation as intended.


  **Link**: [Issue #33](https://github.com/hats-finance/Velvet-Capital-0x0bb0c08fd9eeaf190064f4c66f11d18182961f77/issues/33)


- **`claimRemovedTokens` Function Reverts on Single Transfer Failure, Causing Token Loss**

  The `claimRemovedTokens` function allows users to claim their share of removed tokens. However, if any token transfer fails, the entire function reverts, preventing the user from claiming any tokens. This can lead to inefficiencies, denial of service, and potential financial loss if the user cannot reclaim valuable tokens.


  **Link**: [Issue #60](https://github.com/hats-finance/Velvet-Capital-0x0bb0c08fd9eeaf190064f4c66f11d18182961f77/issues/60)


- **Issues with Rebasing Tokens in `removePortfolioToken` and Claim Function**

  Rebasing tokens, whose balances change over time, present challenges when removed from a portfolio. Upon removal, the recorded balance may differ from the balance during a claim. Tokens with increasing rebase can accumulate, while decreasing rebase affects last users who may fail to claim their due amount. Mitigation involves using current balances during claims.


  **Link**: [Issue #74](https://github.com/hats-finance/Velvet-Capital-0x0bb0c08fd9eeaf190064f4c66f11d18182961f77/issues/74)


- **Potential Out-of-Gas Error When Passive Users Claim Removed Tokens After a Large Snapshot ID Gap**

  A potential out-of-gas issue arises in scenarios with a large gap between `lastClaimedUserId` and `_currentSnapshotId`. A 1 wei token transfer to a passive user can trigger `attemptClaim` repeatedly, leading to extensive looping and gas consumption. Suggested mitigation involves limiting iterations per transaction or enabling batch claims.


  **Link**: [Issue #75](https://github.com/hats-finance/Velvet-Capital-0x0bb0c08fd9eeaf190064f4c66f11d18182961f77/issues/75)


- **Issues with Pausing Mechanism: Unrestricted Token Transfers and Removals**

  During a protocol's pause state, deposits and withdrawals are restricted, but token transfers via `transfer()` and token removals in asset management are not. This oversight undermines the purpose of pausing mechanisms designed to mitigate exploit impact and security issues. Recommendations include adding checks to enforce pause restrictions in both transfer and token removal functions.


  **Link**: [Issue #102](https://github.com/hats-finance/Velvet-Capital-0x0bb0c08fd9eeaf190064f4c66f11d18182961f77/issues/102)

## Minor severity issues


- **Problem with Indexed Keyword in Solidity Events Causing Inaccurate Emissions**

  When the `indexed` keyword is used for dynamic arrays or strings in events, it returns a hash instead of the actual variable data. This affects the Rebalancing contract's `UpdatedTokens` event, causing front-end applications to receive a 32-byte hash rather than the expected data. Modifying the event definition to remove `indexed` resolves this issue. 

Similar problems exist in several other events, including `TokenWhitelisted`, `TokensRemovedFromWhitelist`, `UserWhitelisted`, `UserRemovedFromWhitelist`, `TokensEnabled`, and `TokensDisabled`. The resolved changes have been pushed to the repository.


  **Link**: [Issue #25](https://github.com/hats-finance/Velvet-Capital-0x0bb0c08fd9eeaf190064f4c66f11d18182961f77/issues/25)


- **Potential Overinflation in Portfolio Share Minting with Specific Tokens**

  Tokens with a special condition, like cUSDCv3, can cause accounting issues when transferring `amount == type(uint256).max`. This condition can be exploited by malicious managers. Deposits may overinflate portfolio shares due to discrepancies between specified amounts and actual transfers. To mitigate, disallow `type(uint256).max` as a valid deposit amount.


  **Link**: [Issue #66](https://github.com/hats-finance/Velvet-Capital-0x0bb0c08fd9eeaf190064f4c66f11d18182961f77/issues/66)


- **Wrong Event Emitted for upgradeTokenExclusionManager Function in PortfolioFactory Contract**

  The `upgradeTokenExclusionManager()` function in the `PortfolioFactory` contract emits the wrong event, causing event-listening programs to mistakenly interpret a portfolio upgrade instead of an upgrade to the token exclusion manager. The suggested fix includes defining a specific event for upgrading the token exclusion manager and correcting the function's natspec description.


  **Link**: [Issue #77](https://github.com/hats-finance/Velvet-Capital-0x0bb0c08fd9eeaf190064f4c66f11d18182961f77/issues/77)


- **Ownership Transfer Does Not Update Portfolio Information in getPortfolioList Function**

  The `PortfolioInfolList` contains a list of `PortfoliolInfo` structs detailing various addresses including the owner. When ownership of a portfolio is transferred, the `PortfolioInfolList` is not updated accordingly. This results in outdated information being returned by `getPortfolioList`. The issue is resolved with an override of `transferOwnership` to update the list.


  **Link**: [Issue #83](https://github.com/hats-finance/Velvet-Capital-0x0bb0c08fd9eeaf190064f4c66f11d18182961f77/issues/83)



## Conclusion

The Velvet Capital Audit Competition on Hats.finance showcased a decentralized and competitive approach to enhancing security in web3 projects. By leveraging a large pool of skilled auditors, the competition aimed to identify and address vulnerabilities efficiently. Over two weeks, 113 submissions were made, with a total payout of $40,427.19 distributed among 16 participants. Among the identified issues, one high-severity vulnerability enabled token draining via improper validation in the DepositBatch contract. Medium-severity issues included potential transaction reversion due to unprotected ERC20 permits and inaccurate fee calculation due to parameter adjustments. Additionally, low-severity issues such as the inability to reset the watermark to zero and USDT approval issues were noted. Minor issues involved Solidity event indexing inaccuracies and potential overinflation in portfolio share minting. The audit competition successfully identified and resolved several critical vulnerabilities, reinforcing Hats.finance's commitment to fostering robust and secure DeFi protocols through decentralized audit solutions.

## Disclaimer


This report does not assert that the audited contracts are completely secure. Continuous review and comprehensive testing are advised before deploying critical smart contracts.


The Velvet Capital audit competition illustrates the collaborative effort in identifying and rectifying potential vulnerabilities, enhancing the overall security and functionality of the platform.


Hats.finance does not provide any guarantee or warranty regarding the security of this project. Smart contract software should be used at the sole risk and responsibility of users.

