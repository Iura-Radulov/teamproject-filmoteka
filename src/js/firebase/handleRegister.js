import refs from "./refs";
// import Firebase from './firebase'

refs.registerFormSignUp.addEventListener('submit', handleRegister);



import { createAccount } from "./firebase";

function handleRegister() {
   createAccount();
    resetForm();
    hideFormLoginRegister()
}
    
export function resetForm() {
   refs.txtEmailLogin.value = '';
   refs.txtPasswordLogin.value = '';
   refs.txtEmailRegister.value = '';
   refs.txtPasswordRegister.value = '';
};
export function showFormLoginRegister() {
   refs.formLogin.style.display = 'flex';
   window.addEventListener('keydown', hideFormLoginRegisterByKey);
};
export function hideFormLoginRegisterByKey(e) {
   if (e.key === 'Escape') {
      hideFormLoginRegister();
      window.removeEventListener('keydown', hideFormLoginRegisterByKey);
   }
};
export function hideFormLoginRegister() {
   refs.formLogin.style.display = 'none';
};

// showFormLoginRegister()
hideFormLoginRegister()