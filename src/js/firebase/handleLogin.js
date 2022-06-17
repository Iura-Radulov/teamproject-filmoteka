import refs from "./refs";
import { hideOverlay, loginEmailPassword, monitorAuthState } from './firebase';
import {resetForm, hideFormLoginRegister, showFormLoginRegister, hideFormLogin} from './handleRegister';


export function hideLoginError() {
   refs.divLoginError.style.display = 'none';
   refs.lblLoginErrorMessage.innerHTML = '';
};

export function showLoginError (error) {
   refs.divLoginError.style.display = 'block';
   
   if (error.code == 'auth/wrong-password') {
      refs.lblLoginErrorMessage.innerHTML = `Wrong password. Try again.`;
   } else {
      refs.lblLoginErrorMessage.innerHTML = `Error: ${error.message}`;
   }
};

export function showFormLogin() {
   refs.signInContainer.style.display = 'flex';    
}


export function hideFormRegister() {
    refs.signUpContainer.style.display = 'none';   
}

export function onBtnSignIn() {
    showFormLoginRegister();
   hideFormRegister();
   hideOverlay();
    showFormLogin();
}

refs.signInBtn.addEventListener('click', onBtnSignIn);
refs.signInLogin.addEventListener('click', onBtnSignIn);
refs.signInButtonClose.addEventListener('click', () => {
   hideFormLoginRegister();
   hideFormLogin();
   monitorAuthState()
})

