# Project Name

## Description
* This is a __Text Quest Module__ for `Monna Histea Engine 2`

## Notes
* Allows to add Quest-like passages
* Great for creating Quest based stories or dialogs
* Works like a terminal.
* Just type something and take the text response. As in old 90s

## Setup
* Add to `modules.txt`
```
https://github.com/AldieNightStar/MH-Quest
```


## Usage
```ts
// Print quest to the Span
// Inside provide handler function
// Function should accept:
//   a    - Argument object
//   send - Function to send text response back: (string) => void
const quest = new MonnaQuest.Quest((a, send) => {
	// a.command - Command itself
	// a.args    - List of args that player had entered, divided by a space
	// a.raw     - All the string
	// a.rawArgs - All the string without the command name
	//
	// send      - Function that prints response from this handler
	if (a.command === "go") {
		this.state += 1;
		send("You going further");
	} else if (a.command === "check") {
		send("Right now you are " + this.state + " far from home");
	} else {
		send("No such command. Try: go | check");
	}
});

// Then print it
s.print(quest)
```