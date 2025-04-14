import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startBtn = document.querySelector('button');
const dateTimepiker = document.querySelector('#datetime-picker');

let userSelectedDate = null;
let timerInterval = null;

startBtn.disabled = true;
startBtn.style.cursor = 'not-allowed';

flatpickr(dateTimepiker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    if (selectedDate <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
        timeout: 3000,
      });
      startBtn.disabled = true;
      startBtn.style.cursor = 'not-allowed';
      userSelectedDate = null;
    } else {
      userSelectedDate = selectedDate;
      startBtn.disabled = false;
      startBtn.style.cursor = 'pointer';
    }
  },
});

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  return {
    days: Math.floor(ms / day),
    hours: Math.floor((ms % day) / hour),
    minutes: Math.floor(((ms % day) % hour) / minute),
    seconds: Math.floor((((ms % day) % hour) % minute) / second),
  };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimerDisplay({ days, hours, minutes, seconds }) {
  document.querySelector('[data-days]').textContent = addLeadingZero(days);
  document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
  document.querySelector('[data-minutes]').textContent =
    addLeadingZero(minutes);
  document.querySelector('[data-seconds]').textContent =
    addLeadingZero(seconds);
}

function startTimer(targetDate) {
  timerInterval = setInterval(() => {
    const now = new Date();
    const timeRemaining = targetDate - now;

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });

      dateTimepiker.disabled = false;
      dateTimepiker.style.cursor = 'pointer';
      startBtn.disabled = true;
      startBtn.style.cursor = 'not-allowed';
    } else {
      const time = convertMs(timeRemaining);
      updateTimerDisplay(time);
    }
  }, 1000);
}

startBtn.addEventListener('click', () => {
  if (userSelectedDate) {
    startBtn.disabled = true;
    startBtn.style.cursor = 'not-allowed';
    dateTimepiker.disabled = true;
    dateTimepiker.style.cursor = 'not-allowed';

    startTimer(userSelectedDate);
  }
});