import { logout, mainActions } from '../../utils/js/auth.js'
import { displayFieldError, displaySuccess, displayError, authActions } from '../../utils/js/auth.js'
import { getCookie } from '../../utils/js/utils.js'


export function homeActions() {
	mainActions();
	// handleLogoutBtn();
	// twoFactorAuth();
}