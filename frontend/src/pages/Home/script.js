import { logout, mainActions } from '../../utils/auth.js'
import { displayFieldError, displaySuccess, displayError, authActions } from '../../utils/auth.js'
import { getCookie } from '../../utils/utils.js'


export function homeActions() {
	mainActions();
	// handleLogoutBtn();
	// twoFactorAuth();
}