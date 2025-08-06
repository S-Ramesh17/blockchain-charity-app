# 🎗️ Blockchain Charity App

A decentralized crowdfunding platform empowering verified charities to launch campaigns, receive secure crypto donations, and reward donors using NFTs and ERC-20 tokens. Built with Ethereum smart contracts, IPFS, and The Graph for complete transparency and traceability.

---

## 🚀 Features

- 🏛️ Launch and manage verified charity campaigns
- 🤝 Accept donations in crypto (ERC-20)
- 🧧 Reward donors with NFTs
- 🧠 Track campaign milestones
- 🔎 Query campaign and donation data via The Graph
- 👨‍💻 Admin dashboard to verify campaigns and detect fraud

---

## 🧠 Smart Contract Overview

| Contract             | Purpose                                    |
|----------------------|--------------------------------------------|
| `CharityPlatform`    | Core logic for campaign creation, donation |
| `CharityNFT`         | Mint NFTs as donor rewards                 |
| `DonationToken`      | ERC-20 tokens to reward donors             |

> Interfaces ensure modularity and upgradeability.

---

## 💻 Frontend (Next.js)

- Modular components (`auth`, `campaign`, `donation`, `nft`, `admin`)
- Campaign creation & detail pages
- Admin dashboard with fraud detection
- Wallet integration (MetaMask / WalletConnect)

---

## ⚡ Technologies Used

| Layer          | Stack                                   |
|----------------|-----------------------------------------|
| Smart Contracts| Solidity, Hardhat                      |
| Frontend       | React, Next.js, Tailwind CSS            |
| Blockchain     | Ethereum / Polygon                      |
| IPFS           | For storing media files                 |
| Indexing       | The Graph                               |
| Web3           | ethers.js, Web3Context, WalletConnect   |

---

## 🛠️ Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/blockchain-charity-app.git
cd blockchain-charity-app
