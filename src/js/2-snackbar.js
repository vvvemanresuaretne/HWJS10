import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const delayInput = document.querySelector('input[name="delay"]');
const stateRadios = document.querySelectorAll('input[name="state"]');

function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}

form.addEventListener('submit', event => {
  event.preventDefault();

  const delay = parseInt(delayInput.value);
  const state = [...stateRadios].find(radio => radio.checked)?.value;

  if (state && delay >= 0) {
    createPromise(delay, state)
      .then(delay => {
        iziToast.success({
          title: 'Success',
          message: `✅ Fulfilled promise in ${delay}ms`,
          position: 'topRight',
          timeout: 3000,
        });
      })
      .catch(delay => {
        iziToast.error({
          title: 'Error',
          message: `❌ Rejected promise in ${delay}ms`,
          position: 'topRight',
          timeout: 3000,
        });
      });
  } else {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a valid delay and select a state.',
      position: 'topRight',
      timeout: 3000,
    });
  }
});
