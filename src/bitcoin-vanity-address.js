// Import
const bitcore = require('bitcore-lib');
const os = require('os');

// Setup vars
var itr = 0; // Number of iterations completed
var pk; // Private key object
var tick = (new Date()).getTime(), newTick, time; // Variables to measure time
const vanityString = process.argv[process.argv.length - 1]; // Passed in vanity string

// Functions
const isBase58 = (string) => /^[A-HJ-NP-Za-km-z1-9]*$/.test(string); // Check if a string only uses Base58 characters
const formatNumber = (value) => value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'); // Add thousand separators to number

// Check for the correct number of command line argument
if(vanityString == '-h' || vanityString == '--help'){
    console.log('\nUsage: node ./bitcoin-vanity-address.js "DesiredStringBase58"\n');
    return 0;
}

// Make sure the passed in vanity string only uses Base58 characters
if (!isBase58(vanityString)){
    console.log('\nERROR: Invalid vanity string. The vanity string needs to use only Base58 characters.\nRead more at https://en.bitcoinwiki.org/wiki/Base58\n');
    return 0;
}

// Set high priority execution
os.setPriority(os.constants.priority.PRIORITY_HIGHEST);

console.log('\nSearching for 1' + vanityString + '...');

// Main loop
do {
    // Generate random private key
    pk = new bitcore.PrivateKey();

    // Check public key
    if(pk.toAddress().toString().startsWith('1' + vanityString)){
        // Found one! Out put keys
        console.log('\nPriv: ' + pk.toWIF());
        console.log('Pub: ' + pk.toAddress().toString());
        console.log('Found in ' + formatNumber(itr) + ' iterations.\n');
        break;
    }else{
        // Output progress after every 10,000 tries
        if(++itr % 10000 == 0) {
            newTick = (new Date()).getTime();
            time = newTick - tick;
            tick = newTick;
            console.log(formatNumber(itr) + ' ' + Math.floor(time / 100) / 10 + 's');
        }
    }
} while (true);
