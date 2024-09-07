namespace MonnaQuest {
	
	const MAX_LAST_COMMAND_LEN = 10;
	export type QuestFunc = (a: QuestArgument, respond: (s: string) => void) => Void

	/**
	 * Quest object that can be printed
	 */
	export class Quest implements el.Element {
		// Last entered commands
		private lastCommands: string[] = [];
		private lastCommandCursor = 0;

		// Last responses
		private lastResponses: string[] = [];

		// Settings
		/**
		 * Maximum response lines
		 */
		public maxLines = 15;

		constructor(private quest: QuestFunc) { }

		/**
		 * Rendering method
		 * @param s Span to print to
		 */
		render(s: el.Span): Void {
			const responsesSpan = s.print(el.span(s => {
				this.lastResponses.forEach(resp => {
					s.println(resp);
				})
			}));

			this.inputElement(s, resp => {
				if (el.isReloadable(responsesSpan)) {
					responsesSpan.reload();
				}
			});
		}

		private inputElement(
			s: el.Span,
			onQuestResponse: (str: string) => void
		) {
			const input = el.of("input");
			input.style.width = "60%";

			const sendCommandFn = () => {
				if (!(input instanceof HTMLInputElement)) return;
				if (input.value.length < 1) return;
				this.sendCommand(input.value, onQuestResponse);
				this.appendLastCommand(input.value);
				input.value = "";
				input.focus();
			}

			const getLastCommand = (plus: number) => {
				if (!(input instanceof HTMLInputElement)) return;
				const s = this.getLastCommandByCursor(plus);
				input.value = s;
				input.focus();
			}

			// Print last button and input
			s.button("⬇️", () => getLastCommand(-1));
			s.button("⬆️", () => getLastCommand(1));
			s.print(input);

			// Make it focus after appearing
			Engine.Timer.single(1, () => input.focus());

			// When enter is pressed
			input.addEventListener("keydown", e => {
				if (e.key === "Enter") sendCommandFn();
				else if (e.key === "ArrowUp") getLastCommand(1);
				else if (e.key === "ArrowDown") getLastCommand(-1);
			});

			// Button to send manualy
			s.button("✅", sendCommandFn);
		}

		private async sendCommand(str: string, onResponse: (str: string) => void) {
			this.lastCommandCursor = 0;
			const arg = parseArgument(str);
			let respondOk = false;
			await this.quest(arg, response => {
				respondOk = true;
				this.appendLastResponse("[ " + str + " ]");
				this.appendLastResponse(response);
				onResponse(response);
			});
			if (!respondOk) {
				this.appendLastResponse("⛔[ " + str + " ]");
				onResponse("");
			}
			console.log("COMMAND", str);
			
			
		}

		private appendLastCommand(c: string) {
			const foundIndex = this.lastCommands.indexOf(c);

			// If last command is already in that list, then make it last
			if (foundIndex !== -1) {
				this.lastCommands.splice(foundIndex, 1);
				this.lastCommands.push(c);
				return;
			}

			// If last commands len is more than max, then remove the first one
			if (this.lastCommands.length >= MAX_LAST_COMMAND_LEN) {
				this.lastCommands.splice(0, 1);
			}

			// Add the command if everything is ok
			this.lastCommands.push(c);
		}

		private appendLastResponse(c: string) {
			if (this.lastResponses.length >= this.maxLines) {
				this.lastResponses.splice(0, 1);
			}
			this.lastResponses.push(c);
		}

		private getLastCommandByCursor(plus: number): string {
			const index = this.lastCommands.length - 1 - this.lastCommandCursor;
			const value = this.lastCommands[index];
			if (isNull(value)) return "";

			this.lastCommandCursor = (this.lastCommandCursor + plus) % this.lastCommands.length;

			if (this.lastCommandCursor < 0) {
				this.lastCommandCursor = this.lastCommands.length - 1;
			}

			return value;
		}
	}

	export class QuestArgument {
		constructor(
			public command: string,
			public args: string[],
			public raw: string,
		) { }
	}

	function parseArgument(str: string): QuestArgument {
		const args = Util.parseLine(str)
		const cmd = args.splice(0, 1)[0];
		return new QuestArgument(cmd, args, str);
	}
}