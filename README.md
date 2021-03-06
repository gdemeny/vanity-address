# Vanity Address Generator
A very basic Node.js application that attempts to generate a vanity wallet address that starts with a user provided string.

## Description
Wallet addresses contain seemingly random characters. This app attempts to find an address that starts with a user defined string to make it somewhat less random.

Running the application will start generating random private keys and check each corresponding public key for the user provided string. After every 10,000 addresses, it outputs the total number of addresses tested so far and the time spent on the last batch of addresses. Once a suitable address is found, it outputs the public and private keys along with how many actual addresses were tested before the solution was found. The results are also written to a file.

The application currently supports Bitcoin, Etereum, and Solana blockchains by passing BTC, ETH, or SOL in the command line.

## BTC
To generate BTC addresses, the application uses [Bitpay's bitcore-lib](https://github.com/bitpay/bitcore/tree/v8.0.0/packages/bitcore-lib) library, which generates WIF private keys. WIF stands for Wallet Import Format, which is a more human readable format of the private key with some added error checking [(Read more about WIF)](https://en.bitcoin.it/wiki/Wallet_import_format). The public keys generated by this library are also compressed, they are displayed in BASE58 (P2PKH) format.

## ETH
For ETH addresses, the [Ehters](https://github.com/ethers-io/ethers.js/) library is used. It generates both private and public keys in raw HEX format.

## SOL
SOL addresses are generated using the [@solana/web3.js](https://solana-labs.github.io/solana-web3.js/) library, that generates public keys in Base58 format, and private keys are displayed as the list of raw random numbers. This private key format can be imported by a wallet like [Phantom Wallet](https://phantom.app).

## Performance
As a test, I ran the app to find a BTC address that starts with (1 and) my last name: 1Demeny. The application was ran on an old Dell R820 server that has 32 cores (64 threads). 48 separate instances of PowerShell were opened and they churned between 150 - 200 million addresses each before one of them found a suitable address ([see screenshot](/img/found.png)). Finding a vanity address will take some serious processing power and time. The longer the vanity string is, much, much longer it will take to find an address. My 6-character long string took about 5 days.

ETH seems to be processing about 30 percent faster than BTC. While a test computer took about 15 seconds on average to process 10,000 BTC addresses, it only took around 9s for 10,000 ETH addresses.

It seems that it takes about four times longer to create a SOL address than a BTC address using the above mentioned libraries. On a test machine, the app was able to process 10,000 BTC addresses in 15 seconds on average, while it needed an average of 60 seconds to process the same amount of SOL addresses.

## Execute With Node.js
The application was written in Node.js, hence, the first step is to [download Node.js](https://nodejs.org/en/download/) and install it on your system if you don't already have it.

The install process is fairly straight forward and can be done by accepting the default options. Once it is installed, open a CMD / PowerShell / Terminal window. To test your Node.js installation, run

```bash
node --version
```

This command should display the version of your node.js installation.

Next, create a folder where your project will live. Once you are in that empty folder, initialize the project

```bash
mkdir crypto
cd crypto
npm init -y
```

then install the required libraries:

```bash
npm i bitcore-lib @solana/web3.js ethers --save
```

Last thing you will need is the actual application, which is a single file that can be downloaded [from /src](src/vanity-address.js). Save it into your folder and you are ready to run the application!

```bash
node ./vanity-address.js a=Test b=btc
```

The first parameter is the string the addresses should start with, while the second parameter sets the desired blockchain (BTC|ETH|SOL).

## Issues
Please submit any issues at https://github.com/gdemeny/vanity-address/issues.

## Coffee Fund
If you like this application and want to contribute to my coffee fund, send me a Satoshi/Wei/Lamport to either of my fancy new addresses:

BTC: 1Demeny6ma7k48nm5E1hctrreRwVUxJT7K<br/>
ETH: 0xDEADBEEF88F9F989252ec56975cB017e550583d3 ([DEADBEEF](https://en.wikipedia.org/wiki/Deadbeef))<br/>
SOL: DemenyvBQ8awDvaDnwcsVszq7MdhwqDw7LsoNvTw6LVq
