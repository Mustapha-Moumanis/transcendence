import {
	displayFieldError,
	displaySuccess,
	displayError,
	authActions,
	login
} from '../../utils/auth.js'

function numbersInputsEffect(inputs) {

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
		});
	});

	// function removeFieldError(input) {
	// 	if (input.classList.contains("has-error")) {
	// 		input.classList.remove("has-error");
	// 		input.removeChild(input.children[1]);
	// 	}
	// }
	// var twoFactorAuthForm = document.querySelector("#conferm-2fa-code");
	
	// inputs.forEach(input => {
	// 	input.addEventListener("focus", () => {
	// 		removeFieldError(twoFactorAuthForm);
	// 	});
	// })
}

function handleConfirmTwoFactorFormSubmission(userData, inputs) {
	
	document.getElementById('Two_Factor_confirm').addEventListener('submit', function(e) {
		e.preventDefault();
		const key = [...inputs].map(input => input.value).join('');
		const data = { key: key };

		const accessToken = userData.access;
		fetch('api/2fa/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${accessToken}`
			},
			body: JSON.stringify(data)
		})
		.then(response => {
			if (!response.ok) {
				return response.json().then(errorData => {
					console.log(errorData);
					if (errorData.key)
						throw new Error("key :" + errorData.key[0]);
					else if (errorData.message)
						throw new Error("message :" + errorData.message);
					throw new Error('Handled HTTP error');
				});
			}
			return response.json();
		})
		.then(data => {
			displaySuccess('Login successful!');
			login(JSON.stringify(userData));
			setTimeout(() => { window.location.hash = '#home' }, 1000);
		})
		.catch(error => {
			displayError(error.message);
		});
	});
}

export function TwoFactorAuthConfirmActions(userData) {
	const inputs = document.querySelectorAll(".numbers-field > input");
	const username = document.querySelector(".username");
	username.innerHTML = userData.user.username + " ";
	
	numbersInputsEffect(inputs);
	handleConfirmTwoFactorFormSubmission(userData, inputs);
}