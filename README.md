<h1>Ethereum address generator and cheker</h1>
<p>This script generates Ethereum addresses, checks their balances, and sends notifications to a Telegram channel for non-zero balances. It utilizes Node.js, ethers, axios, and cheerio.</p>
<h2>Performance</h2>
<p>A server with a configuration of 4 CPUs and 8 RAM generates 3-4 thousand addresses per minute</p>
<h2>Installation</h2>
<p>Make sure you have Node.js installed. If not, you can install it using the following commands:</p>
<pre>
<code>
sudo apt install curl
curl -s https://deb.nodesource.com/setup_18.x | sudo bash
sudo apt-get install -y nodejs
</code>
</pre>
<p>Verify the Node.js installation:</p>
<pre>
<code>
node -v
</code>
</pre>
<p>Clone the repository and install the required dependencies:</p>
<pre>
<code>
git clone https://github.com/Hlebaster/eth_gen_js.git
cd eth_gen_js/
npm install ethers axios cheerio
</code>
</pre>
<p>Be sure to change the following settings:</p>
<pre>
<code>
nano index.js

const TELEGRAM_BOT_TOKEN = "YOU_BOT_TOKEN";
const TELEGRAM_CHAT_ID = "YOU_TG_ID";
const THREAD_COUNT = 100;
const ADDRESS_COUNT = 1000000000000000;

if ((index + 1) % 1000 === 0)
Instead of the value 1000 (line 60 in the code), set a threshold that will send a notification 
to telegram about how many wallets have been generated
</code>
</pre>
<h2>Usage</h2>
<p>To start the script, use the following command:</p>
<pre>
<code>
node index.js
</code>
</pre>
<h2>Telegram Configuration</h2>
<p>To receive Telegram notifications, provide your Telegram bot token and chat ID in the <code>TELEGRAM_BOT_TOKEN</code> and <code>TELEGRAM_CHAT_ID</code> variables in the <code>index.js</code> file.</p>
