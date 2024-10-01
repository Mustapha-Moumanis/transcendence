export function passResetActions(email) {
	const inputs = document.querySelectorAll(".numbers-field > input");
	const button = document.querySelector(".btn-main");
	const pass = document.querySelector("#password");
	const re_pass = document.querySelector("#re-password");
	const emailElem = document.querySelector(".email");

	window.addEventListener("load", () => inputs[0].focus());
	button.setAttribute("disabled", "disabled");
	emailElem.innerHTML = email

	const checkFields = () => {
		const allFieldsFilled = [...inputs].every(input => input.value !== "") && pass.value !== "" && re_pass.value !== "" && email.value !== "";

		if (allFieldsFilled) {
			button.classList.add("active");
			button.removeAttribute("disabled");
		} else {
			button.classList.remove("active");
			button.setAttribute("disabled", "disabled");
		}
	};

	pass.addEventListener("input", checkFields);
	re_pass.addEventListener("input", checkFields);

	inputs[0].addEventListener("paste", function(event) {
		event.preventDefault();

		const pastedValue = (event.clipboardData || window.clipboardData).getData(
			"text"
		);
		const numbersLength = inputs.length;

		for (let i = 0; i < numbersLength; i++) {
			if (i < pastedValue.length) {
				inputs[i].value = pastedValue[i];
				inputs[i].removeAttribute("disabled");
				inputs[i].focus;
			} else {
				inputs[i].value = "";
				inputs[i].focus;
			}
		}
	});

	inputs.forEach((input, index1) => {
		input.addEventListener("keyup", (e) => {
			const currentInput = input;
			const nextInput = input.nextElementSibling;
			const prevInput = input.previousElementSibling;

			if (currentInput.value.length > 1) {
				currentInput.value = "";
				return;
			}

			if (nextInput && nextInput.hasAttribute("disabled") && currentInput.value !== "") {
				nextInput.removeAttribute("disabled");
				nextInput.focus();
			}

			if (e.key === "Backspace") {
				inputs.forEach((input, index2) => {
					if (index1 <= index2 && prevInput) {
						input.setAttribute("disabled", true);
						input.value = "";
						prevInput.focus();
					}
				});
			}
			checkFields();
		});
	});
}