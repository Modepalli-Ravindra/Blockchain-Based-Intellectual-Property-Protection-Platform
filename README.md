# Blockchain-Based-Intellectual-Property-Protection-Platform



![GitHub license](https://img.shields.io/badge/license-MIT-green)  
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)  
![Tech](https://img.shields.io/badge/Blockchain-Ethereum-blue)  
![Backend](https://img.shields.io/badge/Backend-Django-purple)  
![SmartContracts](https://img.shields.io/badge/SmartContracts-Solidity-orange)



## 📌 Overview
This project is a **Blockchain-Based Intellectual Property (IP) Protection Platform** that leverages **Ethereum smart contracts** and a **Django backend** to register, verify, and protect intellectual property rights.  
The system ensures **immutability, transparency, and security** for creators by storing ownership records on the blockchain.



## 🛠️ Tech Stack
- **Blockchain**: Ethereum, Solidity (`IP.sol`)
- **Smart Contract Framework**: Truffle
- **Backend**: Python, Django
- **Database**: SQLite (default for Django, can be switched to PostgreSQL/MySQL)
- **Frontend**: Django Templates / APIs (can be extended)
- **Tools**: Web3.js, Ganache


## 📂 Project Structure
Blockchain-Based-Intellectual-Property-Protection-Platform-main/
│── IP.sol # Solidity smart contract
│── README.md # Documentation
│── instructions.txt # Setup instructions (raw notes)
│
├── IPProtection/ # Django backend
│ ├── manage.py
│ ├── Protection/
│ │ ├── settings.py # Django settings
│ │ ├── urls.py # App routes
│ │ └── wsgi.py
│ └── ProtectionApp/
│ ├── models.py # Database models
│ ├── views.py # Core business logic
│ ├── urls.py
│ └── admin.py
│
└── hello-eth/ # Ethereum/Truffle environment
├── contracts/ # Solidity contracts
├── migrations/ # Migration scripts
├── test/ # Smart contract tests
└── node_modules/ # Dependencies


## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

git clone https://github.com/your-username/Blockchain-IP-Protection.git
cd Blockchain-IP-Protection
2️⃣ Smart Contract Setup
Install Truffle & Ganache:

npm install -g truffle
Navigate to hello-eth/ and compile contracts:

truffle compile
truffle migrate
truffle test
3️⃣ Backend (Django)
Navigate to IPProtection/:

cd IPProtection
Create virtual environment & install requirements:
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows
pip install -r requirements.txt
Run migrations:

python manage.py migrate
Start server:
python manage.py runserver
🚀 Features
✅ Register Intellectual Property on Blockchain

✅ Immutable proof of ownership

✅ Secure verification of IP rights

✅ Django interface for managing submissions

✅ Ethereum smart contracts for tamper-proof storage

📜 Smart Contract (IP.sol)
The Solidity contract defines:

RegisterIP → To register a new intellectual property with metadata

VerifyOwner → To check ownership of a registered asset

Events → For logging transactions

🔮 Future Improvements
Add frontend UI with React + Web3.js

Implement user authentication with JWT

Integrate IPFS for file storage

Deploy on Ethereum testnet/mainnet

🤝 Contributing
Fork this repo

Create a new branch (feature-new)

Commit changes

Push to branch

Create a Pull Request






