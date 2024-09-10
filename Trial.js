const readline = require("readline");

let sum = 0;

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const processInput = (input) => {
	const regex = /debited by (\d+)/i;
	const match = input.match(regex);

	if (match) {
		const numberToAdd = parseInt(match[1], 10);
		sum += numberToAdd;
		console.log(`Sum updated: ${sum}`);
	} else {
		console.log(`No valid 'add' command found. Current sum: ${sum}`);
	}
};

console.log("This is trial of finance app");
console.log('Enter sentences to add to the sum. Type "exit" to quit.');

rl.on("line", (input) => {
	if (input.toLowerCase() === "exit") {
		console.log(`Final sum: ${sum}`);
		rl.close();
	} else {
		processInput(input);
	}
});
