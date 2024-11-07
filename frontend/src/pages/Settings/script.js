import { attachInputFocusListeners, getUserData, logout, verifyToken } from '../../utils/js/auth.js'
import { displayFieldError, showAlert} from '../../utils/js/auth.js'
import { logoutFetch } from '../../utils/js/utils.js';

export const countries = [
	{ "text": "Afghanistan", "value": "AF"},
	{ "text": "Albania", "value": "AL" },
	{ "text": "Algeria", "value": "DZ" },
	{ "text": "American Samoa", "value": "AS" },
	{ "text": "Andorra", "value": "AD" },
	{ "text": "Angola", "value": "AO" },
	{ "text": "Anguilla", "value": "AI" },
	{ "text": "Antarctica", "value": "AQ" },
	{ "text": "Argentina", "value": "AR" },
	{ "text": "Armenia", "value": "AM" },
	{ "text": "Aruba", "value": "AW" },
	{ "text": "Australia", "value": "AU" },
	{ "text": "Austria", "value": "AT" },
	{ "text": "Azerbaijan", "value": "AZ" },
	{ "text": "Bahamas", "value": "BS" },
	{ "text": "Bahrain", "value": "BH" },
	{ "text": "Bangladesh", "value": "BD" },
	{ "text": "Barbados", "value": "BB" },
	{ "text": "Belarus", "value": "BY" },
	{ "text": "Belgium", "value": "BE" },
	{ "text": "Belize", "value": "BZ" },
	{ "text": "Benin", "value": "BJ" },
	{ "text": "Bermuda", "value": "BM" },
	{ "text": "Bhutan", "value": "BT" },
	{ "text": "Bolivia", "value": "BO" },
	{ "text": "Bosnia and Herzegovina", "value": "BA" },
	{ "text": "Botswana", "value": "BW" },
	{ "text": "Brazil", "value": "BR" },
	{ "text": "Brunei Darussalam", "value": "BN" },
	{ "text": "Bulgaria", "value": "BG" },
	{ "text": "Burkina Faso", "value": "BF" },
	{ "text": "Burundi", "value": "BI" },
	{ "text": "Cambodia", "value": "KH" },
	{ "text": "Cameroon", "value": "CM" },
	{ "text": "Canada", "value": "CA" },
	{ "text": "Cape Verde", "value": "CV" },
	{ "text": "Chad", "value": "TD" },
	{ "text": "Chile", "value": "CL" },
	{ "text": "China", "value": "CN" },
	{ "text": "Colombia", "value": "CO" },
	{ "text": "Comoros", "value": "KM" },
	{ "text": "Congo", "value": "CG" },
	{ "text": "Congo", "value": "CD" },
	{ "text": "Costa Rica", "value": "CR" },
	{ "text": "Cote D'Ivoire", "value": "CI" },
	{ "text": "Croatia", "value": "HR" },
	{ "text": "Cuba", "value": "CU" },
	{ "text": "Cyprus", "value": "CY" },
	{ "text": "Czech Republic", "value": "CZ" },
	{ "text": "Denmark", "value": "DK" },
	{ "text": "Djibouti", "value": "DJ" },
	{ "text": "Dominica", "value": "DM" },
	{ "text": "Dominican Republic", "value": "DO" },
	{ "text": "Ecuador", "value": "EC" },
	{ "text": "Egypt", "value": "EG" },
	{ "text": "El Salvador", "value": "SV" },
	{ "text": "Equatorial Guinea", "value": "GQ" },
	{ "text": "Eritrea", "value": "ER" },
	{ "text": "Estonia", "value": "EE" },
	{ "text": "Ethiopia", "value": "ET" },
	{ "text": "Fiji", "value": "FJ" },
	{ "text": "Finland", "value": "FI" },
	{ "text": "France", "value": "FR" },
	{ "text": "French Guiana", "value": "GF" },
	{ "text": "Gabon", "value": "GA" },
	{ "text": "Gambia", "value": "GM" },
	{ "text": "Georgia", "value": "GE" },
	{ "text": "Germany", "value": "DE" },
	{ "text": "Ghana", "value": "GH" },
	{ "text": "Gibraltar", "value": "GI" },
	{ "text": "Greece", "value": "GR" },
	{ "text": "Greenland", "value": "GL" },
	{ "text": "Grenada", "value": "GD" },
	{ "text": "Guadeloupe", "value": "GP" },
	{ "text": "Guam", "value": "GU" },
	{ "text": "Guatemala", "value": "GT" },
	{ "text": "Guernsey", "value": "GG" },
	{ "text": "Guinea", "value": "GN" },
	{ "text": "Guinea-Bissau", "value": "GW" },
	{ "text": "Guyana", "value": "GY" },
	{ "text": "Haiti", "value": "HT" },
	{ "text": "Honduras", "value": "HN" },
	{ "text": "Hong Kong", "value": "HK" },
	{ "text": "Hungary", "value": "HU" },
	{ "text": "Iceland", "value": "IS" },
	{ "text": "India", "value": "IN" },
	{ "text": "Indonesia", "value": "ID" },
	{ "text": "Iran", "value": "IR" },
	{ "text": "Iraq", "value": "IQ" },
	{ "text": "Ireland", "value": "IE" },
	{ "text": "Isle of Man", "value": "IM" },
	{ "text": "Italy", "value": "IT" },
	{ "text": "Jamaica", "value": "JM" },
	{ "text": "Japan", "value": "JP" },
	{ "text": "Jersey", "value": "JE" },
	{ "text": "Jordan", "value": "JO" },
	{ "text": "Kazakhstan", "value": "KZ" },
	{ "text": "Kenya", "value": "KE" },
	{ "text": "Kiribati", "value": "KI" },
	{ "text": "Korea, Democratic People'S Republic of", "value": "KP" },
	{ "text": "Korea, Republic of", "value": "KR" },
	{ "text": "Kuwait", "value": "KW" },
	{ "text": "Kyrgyzstan", "value": "KG" },
	{ "text": "Latvia", "value": "LV" },
	{ "text": "Lebanon", "value": "LB" },
	{ "text": "Lesotho", "value": "LS" },
	{ "text": "Liberia", "value": "LR" },
	{ "text": "Libyan Arab Jamahiriya", "value": "LY" },
	{ "text": "Liechtenstein", "value": "LI" },
	{ "text": "Lithuania", "value": "LT" },
	{ "text": "Luxembourg", "value": "LU" },
	{ "text": "Macao", "value": "MO" },
	{ "text": "Macedonia, The Former Yugoslav Republic of", "value": "MK" },
	{ "text": "Madagascar", "value": "MG" },
	{ "text": "Malawi", "value": "MW" },
	{ "text": "Malaysia", "value": "MY" },
	{ "text": "Maldives", "value": "MV" },
	{ "text": "Mali", "value": "ML" },
	{ "text": "Malta", "value": "MT" },
	{ "text": "Martinique", "value": "MQ" },
	{ "text": "Mauritania", "value": "MR" },
	{ "text": "Mauritius", "value": "MU" },
	{ "text": "Mayotte", "value": "YT" },
	{ "text": "Mexico", "value": "MX" },
	{ "text": "Micronesia, Federated States of", "value": "FM" },
	{ "text": "Moldova, Republic of", "value": "MD" },
	{ "text": "Monaco", "value": "MC" },
	{ "text": "Mongolia", "value": "MN" },
	{ "text": "Montserrat", "value": "MS" },
	{ "text": "Morocco", "value": "MA" },
	{ "text": "Mozambique", "value": "MZ" },
	{ "text": "Myanmar", "value": "MM" },
	{ "text": "Namibia", "value": "NA" },
	{ "text": "Nauru", "value": "NR" },
	{ "text": "Nepal", "value": "NP" },
	{ "text": "Netherlands", "value": "NL" },
	{ "text": "Netherlands Antilles", "value": "AN" },
	{ "text": "New Caledonia", "value": "NC" },
	{ "text": "New Zealand", "value": "NZ" },
	{ "text": "Nicaragua", "value": "NI" },
	{ "text": "Niger", "value": "NE" },
	{ "text": "Nigeria", "value": "NG" },
	{ "text": "Niue", "value": "NU" },
	{ "text": "Norway", "value": "NO" },
	{ "text": "Oman", "value": "OM" },
	{ "text": "Pakistan", "value": "PK" },
	{ "text": "Palau", "value": "PW" },
	{ "text": "Palestinian", "value": "PS" },
	{ "text": "Panama", "value": "PA" },
	{ "text": "Papua New Guinea", "value": "PG" },
	{ "text": "Paraguay", "value": "PY" },
	{ "text": "Peru", "value": "PE" },
	{ "text": "Philippines", "value": "PH" },
	{ "text": "Pitcairn", "value": "PN" },
	{ "text": "Poland", "value": "PL" },
	{ "text": "Portugal", "value": "PT" },
	{ "text": "Puerto Rico", "value": "PR" },
	{ "text": "Qatar", "value": "QA" },
	{ "text": "Reunion", "value": "RE" },
	{ "text": "Romania", "value": "RO" },
	{ "text": "Saint Helena", "value": "SH" },
	{ "text": "Saint Kitts and Nevis", "value": "KN" },
	{ "text": "Saint Lucia", "value": "LC" },
	{ "text": "Samoa", "value": "WS" },
	{ "text": "San Marino", "value": "SM" },
	{ "text": "Saudi Arabia", "value": "SA" },
	{ "text": "Senegal", "value": "SN" },
	{ "text": "Seychelles", "value": "SC" },
	{ "text": "Sierra Leone", "value": "SL" },
	{ "text": "Singapore", "value": "SG" },
	{ "text": "Slovakia", "value": "SK" },
	{ "text": "Slovenia", "value": "SI" },
	{ "text": "Solomon Islands", "value": "SB" },
	{ "text": "Somalia", "value": "SO" },
	{ "text": "South Africa", "value": "ZA" },
	{ "text": "Spain", "value": "ES" },
	{ "text": "Sri Lanka", "value": "LK" },
	{ "text": "Sudan", "value": "SD" },
	{ "text": "Suriname", "value": "SR" },
	{ "text": "Swaziland", "value": "SZ" },
	{ "text": "Sweden", "value": "SE" },
	{ "text": "Switzerland", "value": "CH" },
	{ "text": "Tajikistan", "value": "TJ" },
	{ "text": "Thailand", "value": "TH" },
	{ "text": "Timor-Leste", "value": "TL" },
	{ "text": "Togo", "value": "TG" },
	{ "text": "Tokelau", "value": "TK" },
	{ "text": "Tonga", "value": "TO" },
	{ "text": "Tunisia", "value": "TN" },
	{ "text": "Turkey", "value": "TR" },
	{ "text": "Turkmenistan", "value": "TM" },
	{ "text": "Tuvalu", "value": "TV" },
	{ "text": "Uganda", "value": "UG" },
	{ "text": "Ukraine", "value": "UA" },
	{ "text": "United Arab Emirates", "value": "AE" },
	{ "text": "United Kingdom", "value": "GB" },
	{ "text": "United States", "value": "US" },
	{ "text": "Uruguay", "value": "UY" },
	{ "text": "Uzbekistan", "value": "UZ" },
	{ "text": "Vanuatu", "value": "VU" },
	{ "text": "Venezuela", "value": "VE" },
	{ "text": "Viet Nam", "value": "VN" },
	{ "text": "Yemen", "value": "YE" },
	{ "text": "Zambia", "value": "ZM" },
	{ "text": "Zimbabwe", "value": "ZW" }
];

function setCountries(actualCountry){
    const selectCountry = document.querySelector("#country");
    for(const country of countries){
        const obt = document.createElement("option");
        obt.setAttribute("value", country.value);
        obt.innerHTML = country.text;
        if (actualCountry === country.value)
            obt.setAttribute("selected", "");
        selectCountry.append(obt);
    }
}

function close2fa() {
	document.querySelector(".close2fa").addEventListener("click", () => {
		document.querySelector(".active2fa").classList.add("d-none");
	})
}

function generateQrCode() {

	const qrCodeContainer = document.getElementById("qr-code");
	if (qrCodeContainer.querySelector("img")) return;
	var qrcodePromise = new Promise(function(resolve, reject){
		fetch('api/2fa/generate_qr_code/', {
			method: 'GET',
		})
		.then(response => {
			if (!response.ok) {
				if (response.status === 401) {
					logoutFetch()
					.catch(() => {});
					reject("User is not authenticated");
				}
				return response.json().then(errorData => {
					if (errorData.non_field_errors)
						reject(errorData.non_field_errors[0]);
					reject('Failed to generate QR code');
				})
			}
			resolve(response.blob());
		})
	})
	
	qrcodePromise
	.then(svgData => {
		let img = document.createElement("img");
		img.src = URL.createObjectURL(svgData);
		img.alt = "QR Code";
		qrCodeContainer.append(img);
	})
	.catch(error => {
		showAlert('error', error);
	});
}

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

	function removeFieldError(input) {
		if (input.classList.contains("has-error")) {
			input.classList.remove("has-error");
			input.removeChild(input.children[1]);
		}
	}
	var twoFactorAuthForm = document.querySelector("#conferm-2fa-code");
	
	inputs.forEach(input => {
		input.addEventListener("focus", () => {
			removeFieldError(twoFactorAuthForm);
		});
	})
}

function handle2faAction(inputs, btn) {
	var verify2faKey = document.getElementById("verify2faKey");

	function handleClick() {
		document.querySelector(".active2fa").classList.remove("d-none");
	}

	function active2fa(key) {
		return new Promise(function(resolve, reject){
			const data = { key };
			
			fetch('api/2fa/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data)
			})
			.then(response => {
				if (!response.ok) {
					if (response.status === 401) {
						logoutFetch()
						.catch(() => {});
						reject("User is not authenticated");
					}
					return response.json()
					.then(errorData => {
						const numbersFields = document.querySelector('.numbers-field');
						if (errorData.key) displayFieldError(numbersFields.parentElement, errorData.key);
						else if (errorData.message) displayFieldError(numbersFields.parentElement, errorData.message);
						reject('Failed to active 2fa');
					});
				}
				resolve();
			})
		})
	}

	function handleVerify2faKeyClick() {
		const key = [...inputs].map(input => input.value).join('');
		if (key == "") {
			const numbersFields = document.querySelector('.numbers-field');
			displayFieldError(numbersFields.parentElement, "This field may not be blank.");
		}
		else {
			active2fa(key)
			.then(() => {
				showAlert('success', '2FA Enabled');
				mode2faDisactive(btn);
				btn.removeEventListener('click', handleClick);
				verify2faKey.removeEventListener('click', handleVerify2faKeyClick);
				document.querySelector(".active2fa").classList.add("d-none");
			})
			.catch(error => showAlert('error', error));
			// inputs.forEach((input, index) => {
			// 	input.value = "";
			// 	if (index == 0) input.focus();
			// 	else input.disabled = true;
			// });
		}
	}

	verify2faKey.addEventListener('click', handleVerify2faKeyClick);
	btn.addEventListener('click', handleClick);
}

function mode2faActive(btn) {
	const inputs = document.querySelectorAll(".numbers-field > input");

	generateQrCode();
	numbersInputsEffect(inputs);
	handle2faAction(inputs, btn);
}

function mode2faDisactive(btn) {
	document.querySelector(".active2faIcon").innerHTML = `
		<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 15.75C12.7279 15.75 15.75 12.7279 15.75 9C15.75 5.27208 12.7279 2.25 9 2.25C5.27208 2.25 2.25 5.27208 2.25 9C2.25 12.7279 5.27208 15.75 9 15.75ZM12.7682 7.39018C13.1218 6.96591 13.0645 6.33534 12.6402 5.98178C12.2159 5.62821 11.5853 5.68554 11.2318 6.10982L8.88382 8.92736C8.53711 9.34342 8.34219 9.57377 8.18658 9.71531L8.18063 9.72069L8.17422 9.71587C8.00643 9.589 7.79146 9.37725 7.4085 8.99428L6.70711 8.29289C6.31658 7.90237 5.68342 7.90237 5.29289 8.29289C4.90237 8.68342 4.90237 9.31658 5.29289 9.70711L5.99428 10.4085L6.03511 10.4493C6.3616 10.776 6.6757 11.0902 6.96794 11.3111C7.2953 11.5587 7.72402 11.7915 8.27343 11.7665C8.82284 11.7416 9.22872 11.471 9.53233 11.1948C9.80337 10.9483 10.0877 10.6069 10.3833 10.2521L10.3833 10.2521L10.4203 10.2077L12.7682 7.39018Z" fill="#96C346"/></svg>
	`;

	btn.classList.add("activeBtn");
	btn.innerHTML = "Disable 2FA";

	function disactive2fa() {
		return new Promise(function(resolve, reject){
			const data = { is2faActive: false };
			
			fetch('api/user/', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data)
			})
			.then(response => {
				if (!response.ok) {
					if (response.status === 401) {
						logoutFetch()
						.catch(() => {});
						reject("User is not authenticated");
					}
					return response.json()
					.then(errorData => {
						if (errorData.is2faActive[0])
							reject(errorData.is2faActive[0]);
						else if (errorData.code)
							reject(errorData.code);
						reject('You can not disacive 2fa');
					});
				}
				resolve();
			})
		})
		
	}

	function handleClick() {
		disactive2fa()
		.then(() => {
			document.querySelector(".active2faIcon").innerHTML = "";
			btn.classList.remove("activeBtn");
			btn.innerHTML = "Enable 2FA";
			mode2faActive(btn);
			showAlert('success', '2FA Disabled');
			btn.removeEventListener('click', handleClick);
		})
		.catch((error) => {
			showAlert('error', error);
		});
	}

	btn.addEventListener('click', handleClick);
}

function twoFactorAuth() {
	close2fa();

	getUserData()
	.then(userData => {
		var btn = document.querySelector("#enable2fa");
		userData.is2faActive ? mode2faDisactive(btn) : mode2faActive(btn);
	})
	.catch(error => {
		showAlert('error', error);
	});
}

function addListenerSettings(){
	const settingsChoice = document.querySelector(".setting-chooses");
	const settingsForms = document.querySelector(".setting-form");
	
	function removeActiveClass() {
		Array.from(settingsChoice.children).forEach(
			choice => choice.classList.remove('setting-active')
		);
		Array.from(settingsForms.children).forEach(
			form => form.classList.remove('z-1000')
		);
	}
	
	
	for (let i = 0; i < settingsChoice.children.length - 1; i++) {
		const element = settingsChoice.children[i];
		const form = settingsForms.children[i];

		element.addEventListener('click', () => {
			removeActiveClass()
			element.classList.add("setting-active");
			form.classList.add("z-1000");
		})
	}
}

function gamesettings() {
	const optionsContent = document.querySelectorAll('.options-content');
	const gameElementExplanations = [
		`
			<h4 class="mb-3">Camera position</h4>
			<p>
				<b>Default: </b>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos debitis quis enim corporis assumenda pariatur autem numquam unde iste maiores.<br>
				<b>Horizontal: </b>Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt, facere dolorem. Quaerat?<br>
				<b>Vertical: </b>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, maxime.<br>
			</p>
		`,
		`
			<h4 class="mb-3">Field of view</h4>
			<p>
				<b>Narrow: </b>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos debitis quis enim corporis assumenda pariatur autem numquam unde iste maiores.<br>
				<b>Normal: </b>Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt, facere dolorem. Quaerat?<br>
				<b>Wide: </b>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, maxime.<br>
			</p>
		`,
		`
			<h4 class="mb-3">Ball speed</h4>
			<p>
				<b>Slow: </b>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos debitis quis enim corporis assumenda pariatur autem numquam unde iste maiores.<br>
				<b>Medium: </b>Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt, facere dolorem. Quaerat?<br>
				<b>Fast: </b>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, maxime.<br>
			</p>
		`,
		`
			<h4 class="mb-3">Tournament player number</h4>
			<p>
				<b>4 : </b>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos debitis quis enim corporis assumenda pariatur autem numquam unde iste maiores.<br>
				<b>8 : </b>Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt, facere dolorem. Quaerat?<br>
			</p>
		`,
	];

	function setActiveOptions(options, spans, optionsScroll) {
		options.forEach((option, index) => {
			if (option.classList.contains('active')) {
				const optionWidth = option.offsetWidth;
				optionsScroll.scrollTo({ left: optionWidth * index });
				spans[index].classList.add('active');
			}
		});
	}

	function removeOptionActiveClass(spans, options) {
		spans.forEach(span => span.classList.remove('active'));
		options.forEach(option => option.classList.remove('active'));
	}

	function updateGameExplanation(index) {
		document.querySelector(".game-setting-explantation").innerHTML = gameElementExplanations[index];
	}

	optionsContent.forEach((element, index) => {
		const spans = element.querySelectorAll('.option-active span');
		const options = element.querySelectorAll('.options-scroll .option');
		const optionsScroll = element.querySelector('.options-scroll');

		setActiveOptions(options, spans, optionsScroll);

		spans.forEach((span, index) => {
			span.addEventListener('click', () => { 
				if (span.classList.contains('active')) return;
				const optionWidth = options[0].offsetWidth;
				optionsScroll.scrollTo({
					left: optionWidth * index,
					behavior: 'smooth'
				});
	
				removeOptionActiveClass(spans, options);
				span.classList.add('active');
			});
		});

		
		element.parentElement.addEventListener('click', function() {
			if (this.classList.contains('active')) return;

			const gameElements = document.querySelector(".game-elements");
			Array.from(gameElements.children).forEach(gameElement => 
				gameElement.firstElementChild.classList.remove('active')
			);
			updateGameExplanation(index);
			this.classList.add('active');
		});
	});
}

function setDataSetting(userData){

    setCountries(userData.country_select);
    const userImage = document.querySelector(".user-picture");
    userImage.innerHTML = `<img class="avatar" src="${userData.avatar}" alt="${userData.username}">
                            <h5>${userData.username}</h5>`;
    const inputSettings = document.querySelector(".user-info");
    inputSettings.querySelector("#first-name").setAttribute("value", userData.first_name);
    inputSettings.querySelector("#last-name").setAttribute("value", userData.last_name);
    inputSettings.querySelector("#date-of-birth").setAttribute("value", userData.date_of_birth);
}

function changPassword(){
    const old_password = document.querySelector("#old_password");
    const new_password1 = document.querySelector("#new_password1");
    const new_password2 = document.querySelector("#new_password2");
    
    document.querySelector("#save_set_pass").addEventListener('click', () =>{

        if (old_password.value === "")
            displayFieldError(old_password.parentElement, 'This field may not be blank.');
        if (new_password1.value === "")
            displayFieldError(new_password1.parentElement, 'This field may not be blank.');
        if (new_password2.value === "")
            displayFieldError(new_password2.parentElement, 'This field may not be blank.');

        let data = {
            "old_password": old_password.value,
            "new_password1": new_password1.value,
            "new_password2": new_password2.value
        }

        fetch('api/password/change/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    if (errorData.old_password) displayFieldError(old_password.parentElement, errorData.old_password[0]);
                    if (errorData.new_password1) displayFieldError(new_password1.parentElement, errorData.new_password1[0]);
                    if (errorData.new_password2) displayFieldError(new_password2.parentElement, errorData.new_password2[0]);
                    throw new Error("Faild To change password");
                });
            }
            return response.json();
        })
        .then(data => {
            showAlert('success', 'Password changed successful!');
            old_password.value = "";
            new_password1.value = "";
            new_password2.value = "";
        })
        .catch(error => {
            showAlert('error', error);
        });
    })
}

function postData(userData){

    var dataImage = null;

    const uploadimage = document.querySelector(".upload-pic");
    uploadimage.querySelector("button").addEventListener('click', () => {
        uploadimage.querySelector("#my_image").click();
    })

    uploadimage.querySelector("#my_image").addEventListener('change', function(){
        if (this.files && this.files[0])
            dataImage = this.files[0];
    });

    document.querySelector("#save-changes").addEventListener('click', () => {

        const firstName = document.querySelector("#first-name");
        const lastName = document.querySelector("#last-name");
        const country = document.querySelector("#country");
        const dateOfBirth = document.querySelector("#date-of-birth");

        if (firstName.value === "")
            displayFieldError(firstName.parentElement, 'This field may not be blank.');
        if (lastName.value === "")
            displayFieldError(lastName.parentElement, 'This field may not be blank.');

        let data = new FormData();
        if (dataImage && dataImage !== userData.avatar) data.append("avatar", dataImage);
        if (firstName.value !== userData.first_name) data.append("first_name", firstName.value);
        if (lastName.value !== userData.last_name) data.append("last_name", lastName.value);
        if (country.value !== userData.country_select) data.append("country_select", country.value);
        if (dateOfBirth.value !== userData.date_of_birth) data.append("date_of_birth", dateOfBirth.value);

        if ([...data.entries()].length > 0) {
            fetch('api/user/', {
                method: 'PUT',
                body: data
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        if (errorData.first_name) displayFieldError(firstName.parentElement, errorData.first_name[0]);
                        if (errorData.last_name) displayFieldError(lastName.parentElement, errorData.last_name[0]);
                        if (errorData.avatar) {
							dataImage = null;
							throw new Error(errorData.avatar[0]);
						}
                        throw new Error(errorData.detail);
                    });
                }
                return response.json();
            })
            .then(data => {
                showAlert('success', 'Data saved successful!');
                setDataSetting(data);
                // localStorage.setItem('userData', JSON.stringify(data));
                userData = data;
            })
            .catch(error => {
                showAlert('error', error);
            });
        }
        else
            showAlert('error', "No changes to update.");
    });
}

export function settingsActions() {
    var userData = JSON.parse(localStorage.getItem('userData'));
    setDataSetting(userData);
    postData(userData);
    changPassword();
    addListenerSettings();
    twoFactorAuth();
    attachInputFocusListeners();
    gamesettings();
}