Feature: Creating NFT

  Scenario: Mint an NFT
	Given User has created collateral
	When User connects with his wallet
	* Wallet is shown as connected with address and network displayed
	* User clicks continue
	* User picks a minting standard
	* User clicks continue
	* User uploads an image for minting
	* User clicks continue
	* User sets NFT asset name/NFT name
	* User clicks continue
	* Mint summary is shown
	* User clicks mint NFT and signs transaction
	Then Window pops up with successful mint and output data
	* User checks box that he saved his collection ID and closes popup
	* User is redirected to the Collection data screen
	* User has the new NFT in his wallet
	
  Scenario: Create NFT collection with mint end date
	Given User is connected with wallet
	* Create a new NFT collection choice is picked
	* Set mint end date is ON and sets a date
	When User clicks continue
	* User uploads his image for minting
	* User clicks continue
	* User sets names
	* User clicks continue
	Then User clicks mint NFT
	* User signs transaction a wallet
	* Window pops up with successful mint
	* User checks box that he saved his collection ID
	* User is redirected to Collection data screen
	* User is able to mint more NFTs to his collection till the date set by user
	* User has new NFT in his wallet

  Scenario: Create collection with multiple NFTs
	Given User is connected with wallet
	* Create a new NFT collection choice is picked
	When User clicks continue
	* User uploads multiple images for minting
	* User clicks continue
	* User sets names
	* User clicks continue
	When User clicks mint NFT
	* User signs transaction a wallet
	* Window pops up with successful mint
	* User checks box that he saved his collection ID
	* User is redirected to Collection data screen
	* User has new NFTs in his wallet

  Scenario: Mint additional NFTs to an existing collection
	Given User is connected with wallet
	* Mint additional NFTs to an existing collection choice is picked
	* User fills collection ID
	When User clicks continue
	* User uploads his image for minting
	* User clicks continue
	* User sets names
	* User clicks continue
	When User clicks mint NFT
	* User signs transaction a wallet
	* Window pops up with successful mint
	* User checks box that he saved his collection ID
	* User is redirected to Collection data screen
	* His NFT is part of the collection
	* User has new NFT in his wallet

  Scenario: Delete collection
	Given User is beyond uploading an image
	When User deletes collection
	Then Delete NFT collection window pops up
	* User clicks delete
	* Collection is deleted
	* User is redirected to Collection data screen
