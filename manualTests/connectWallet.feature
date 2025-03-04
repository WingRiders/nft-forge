Feature: Connect wallet

  Scenario: Connect wallet
	Given user has wallet extension
    When User pick a wallet to connect
	Then Wallet window pops up
	* User is able to connect
	* User sees his address and network
	* User can set a collateral

  Scenario: Disconnect wallet
	Given User is connected with wallet
	* User is in connect wallet screen
	When User clicks disconnect
	Then User is disconnected
	* User can again choose a wallet to connect
