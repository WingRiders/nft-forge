Feature: Creating NFT

  Scenario: Create NFT collection
	Given User is connected with wallet
	* Create a new NFT collection choice is picked
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
	* User has new NFT in his wallet
	
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
