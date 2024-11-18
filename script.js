const openPopupBtn = document.getElementById('openPopup');
const popup = document.getElementById('popup');
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const messageArea = document.getElementById('messageArea');
const closePopupBtn = document.getElementById('closePopup');

// Загружаем данные из LocalStorage
const storedData = localStorage.getItem('formData');
if (storedData) {
  const data = JSON.parse(storedData);
  document.getElementById('name').value = data.name || '';
  document.getElementById('email').value = data.email || '';
  document.getElementById('phone').value = data.phone || '';
  document.getElementById('organization').value = data.organization || '';
  document.getElementById('message').value = data.message || '';
}

// Открыть попап
openPopupBtn.addEventListener('click', () => {
  popup.style.display = 'flex';
  history.pushState({}, '', '#contact'); // Изменить URL
});

// Закрыть попап
closePopupBtn.addEventListener('click', () => {
  popup.style.display = 'none';
  history.pushState({}, '', '#'); // Вернуть URL
});

// Закрыть попап при нажатии "Назад"
window.addEventListener('popstate', () => {
  popup.style.display = 'none';
});

// Отправка формы
contactForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // Проверка согласия с политикой
  const agreementCheckbox = document.getElementById('agreement');
  if (!agreementCheckbox.checked) {
    messageArea.textContent = 'Пожалуйста, согласитесь с политикой обработки персональных данных.';
    return;
  }

  // Отключение кнопки отправки
  submitBtn.disabled = true;
  messageArea.textContent = 'Отправка...';

  // Создание объекта с данными формы
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    organization: document.getElementById('organization').value,
    message: document.getElementById('message').value,
  };

  // Метод XHR
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://formcarry.com/s/IOgVrbdO5s8', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      messageArea.textContent = 'Ошибка при отправке формы. Пожалуйста, попробуйте ещё раз.';
      contactForm.reset();
      localStorage.setItem('formData', JSON.stringify(formData));
    } else {
      messageArea.textContent = 'Форма успешно отправлена!';
    }
    submitBtn.disabled = false;
  };
  xhr.onerror = function () {
    messageArea.textContent = 'Форма успешно отправлена!';
    submitBtn.disabled = false;
  };
  xhr.send(JSON.stringify(formData));
});
