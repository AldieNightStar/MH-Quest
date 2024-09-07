// This is your first passage
Passage.of("Start", s => {
	let distance = 0;
    s.print(new MonnaQuest.Quest((q, send) => {
		if (q.command === "help") {
			send("Available commands: forward, back, info");
		} else if (q.command === "forward") {
			send("You gone forward");
			distance += 1;
		} else if (q.command === "back") {
			distance -= 1;
			if (distance < 0) distance = 0;
			send("You are gone back");
		} else if (q.command === "info") {
			send("The distance is " + distance);
		}
 	}));
});