// Import
const bitcore = require('bitcore-lib');
const ethers = require('ethers');
const crypto = require('crypto');
const solanaWeb3 =  require("@solana/web3.js");
const os = require('os');
const fs = require('fs');
const bs58 = require('bs58');

// Initialize vars
const chains = ['btc', 'eth', 'sol'];
var blockchain = 'btc'; // Default to Bitcoin
var vanityString = '';
var iter = 0; // Number of iterations completed
var lastFound = 0; // Last found address' iteration
var pk; // Private key object
var tick = (new Date()).getTime(), newTick, time; // Variables to measure time

// Get values from command line arguments
process.argv.forEach(element => {
    var [key, value] = element.split('=');
    if(key == 'a' || key == 'address') vanityString = value;
    else if(key == 'b' || key == 'blockchain') blockchain = value.toLowerCase();
});

// Functions
const isBase58 = (string) => /^[A-HJ-NP-Za-km-z1-9]*$/.test(string); // Check if a string only uses Base58 characters
const isHEX = (string) => /^(0x)?[A-Fa-f1-9]*$/.test(string); // Check if a string only uses HEX characters
const formatNumber = (value) => value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'); // Add thousand separators to number

// Validate command line arguments
if(!vanityString.length){
    console.log('\nUsage: node ./vanity-address.js a="DesiredAddressInBase58Format" [b=btc|eth|sol]\n');
    return 0;
}else if(!chains.includes(blockchain)){
    console.log('\nERROR: Currently we only support the following blockchain options: ' + chains.toString() + '. You entered: ' + blockchain + '\n');
    return 0;
}else if(blockchain == 'eth' && !isHEX(vanityString)){
    console.log('\nERROR: Invalid vanity string. The vanity string can only contain hexadecimal characters (A to F and 0 to 9).\n');
    return 0;
}else if(!isBase58(vanityString)){
    console.log('\nERROR: Invalid vanity string. The vanity string can only contain Base58 characters.\nRead more at https://en.bitcoinwiki.org/wiki/Base58\n');
    return 0;
}

if(blockchain == 'btc' && vanityString.charAt(0) != '1'){
    // Make sure Bitcoin addresses start with a 1
    vanityString = '1' + vanityString;
}else if(blockchain == 'eth'){
    // Normalize ETH input
    vanityString = vanityString.toLowerCase();
    if(!vanityString.startsWith('0x')) vanityString = '0x' + vanityString;
}

// Set high priority execution
os.setPriority(os.constants.priority.PRIORITY_HIGHEST);

// Verify to user what we're searching for
console.log('\nSearching for ' + blockchain.toUpperCase() + ' addresses that start with ' + vanityString + '...\n');

// Main loop
do {
    // Generate random key pair
    switch (blockchain) {
        case 'btc':
            pk = new bitcore.PrivateKey();
            pub = pk.toAddress().toString() + ' (P2PKH)';
            priv = pk.toWIF() + ' (WIF)';
            break;
        case 'eth':
            priv = "0x" + crypto.randomBytes(32).toString('hex');
            pub = (new ethers.Wallet(priv)).address.toLowerCase();
            break;
        case 'sol':
            pk = solanaWeb3.Keypair.generate();
            pub = pk.publicKey.toString();
            priv = '[' + pk.secretKey + ']';
            break;
    }

    // Check public key
    if(pub.startsWith(vanityString)){
        // Found one!
        var content = 'Priv: ' + priv + '\nPub: ' + pub + '\nFound in ' + formatNumber(iter - lastFound) + ' iterations.\n';
        lastFound = iter;
        // Write to file (append, if exists so we can see if random fails)
        fs.appendFileSync(pub + '.' + blockchain, content + '-------------------------------\n\n', err => {
            if (err) {
                console.error(err);
                return;
            }
        });
        // Output result
        console.log('\n' + content);
    }else if(++iter % 10000 == 0) {
        // Display progress after every 10,000 addresses
        newTick = (new Date()).getTime();
        [time, tick] = [newTick - tick, newTick];
        console.log(formatNumber(iter) + ' ' + Math.floor(time / 100) / 10 + 's');
    }
} while (true);
