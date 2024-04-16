const { ethers } = require('ethers');
const axios = require('axios');
const cheerio = require('cheerio')
const { Worker, isMainThread, workerData } = require('worker_threads');
const { Web3 } = require('Web3');

const web3 = new Web3('https://ethereum-rpc.publicnode.com');


const TELEGRAM_BOT_TOKEN = "6601744224:AAH9El9DnjcUf9zIhqr99jOEHvlxgaD0nJE";
const TELEGRAM_CHAT_ID = "5581608237";
const THREAD_COUNT = 70;
const ADDRESS_COUNT = 1000000000000000;

async function fetchBalance(addr) {
  try {
    var balance = await web3.eth.getBalance(addr);
    balance = web3.utils.fromWei(balance, "ether");
    return balance;
  } catch (error) {
    console.error(error.toString());
    return null;
  }
}



async function sendTelegramMessage(botToken, chatId, message) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const params = {
    'chat_id': chatId,
    'text': message,
  };
  const response = await axios.get(url, { params });
  console.log(response.data);
  return response.data;
}

async function processAddress(startIndex, mnemonic, passphrase) {
  try {
    for (let index = startIndex; index < ADDRESS_COUNT; index += THREAD_COUNT) {
      const wallet = ethers.Wallet.createRandom();
      const address = wallet.address;
      const privateKey = wallet.privateKey;

      const addrBalance = await fetchBalance(address);

      console.log(
        `(${index}) Address: ${address} Private Key: ${privateKey} Balance: ${addrBalance}`
      );

      if (addrBalance !== null && addrBalance > 0) {
        const currentTime = new Date().toLocaleString();
        const formattedAmount = new Intl.NumberFormat().format(index + 1);
        const message = `Дядя @lurkees есть #деньгиии!!!!\nВремя: ${currentTime}\nВсего сгенерировано адресов: ${formattedAmount}\n\nAddress: ${address}\nPrivate Key: ${privateKey}\nBalance: ${addrBalance}\n`;

        await sendTelegramMessage(TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, message);

        const outputData = `(${index}) Address: ${address} Private Key: ${privateKey} Balance: ${addrBalance}\n`;
        // Add output data to a file or other places as needed
      }

      if ((index + 1) % 100000 === 0) {
        const currentTime = new Date().toLocaleString();
        const formattedAmount = new Intl.NumberFormat().format(index + 1);
        const message = `Достигнут новый этап!\nВремя: ${currentTime}\nВсего сгенерировано адресов: ${formattedAmount}`;
        await sendTelegramMessage(TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, message);
      }
    }
  } catch (error) {
    console.error(error.toString());
  }
}

if (isMainThread) {
  // Main thread
  const workers = [];

  for (let i = 0; i < THREAD_COUNT; i++) {
    const worker = new Worker(__filename, {
      workerData: { startIndex: i, mnemonic: null, passphrase: null },
    });

    worker.on('error', (err) => {
      console.error(err);
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
      }
    });

    workers.push(worker);
  }
} else {
  // Worker thread
  processAddress(workerData.startIndex, workerData.mnemonic, workerData.passphrase);
}
