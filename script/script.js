///// Переменыне
const popupImg = document.querySelector('.popup-img');
const popupNewCard = document.querySelector('.popup-card');
const placesList = document.querySelector('.places-list');
const buttonAddPlace = document.querySelector('.user-info__button');
const editButton = document.querySelector('.user-edit__button');
const popupClose = document.querySelectorAll('.popup__close');
const formNewCard = document.forms.new;
const UserEdit = document.forms.edit;
const buttonFormNewCard = document.querySelector('.popup__button-new-card');
const buttonFormEdit = document.querySelector('.popup__button-save');
const popupEditUser = document.querySelector('.popup-user');

////////////////////////////validation////////////////////////////////
////TextErrorMessage
const errorMessage = {
    wrongLength: "Должно быть от 2 до 30 символов",
    empty: "Это обязательное поле",
    notURL: "Здесь должна быть ссылка"
}

////Валидирую и кастомизирую ошибки валидации
function isValidate(input) {

    input.setCustomValidity('');
    if (input.validity.tooShort === true || input.validity.tooLong === true) {
        input.setCustomValidity(errorMessage.wrongLength);
        return false;
    }

    if (input.validity.valueMissing === true) {
        input.setCustomValidity(errorMessage.empty);
        return false;
    }

    if (input.validity.typeMismatch === true) {
        input.setCustomValidity(errorMessage.notURL);
        return false;
    }

    return input.checkValidity();
}

///Добавляю в span ошибку
function addErrorMessage(input) {
    const errorElem = input.nextElementSibling;
    errorElem.textContent = input.validationMessage;
}

///Внедряю кастомные сообщения об ошибке
function isFieldValid(input) {
    const valid = isValidate(input);
    addErrorMessage(input);
    return valid;
}

////Проверка формы на валидность
function isFormValid(form) {
    const inputs = Array.from(form.elements);
    let validFormat = true;
    inputs.forEach(function (input) {
        if (input.type !== 'submit') {
            if (!isFieldValid(input)) validFormat = false;
        }
    });
    return validFormat;
}

////Отправка формы
function sendForm(event) {
    event.preventDefault();
    const currentForm = event.target;
    const isValid = isFormValid(currentForm);
    // console.log(currentForm.getAttribute('name'));
    if (currentForm.getAttribute('name') === 'edit' && isValid === true) {
        editUserInfo();
        event.target.reset();
        deactivationButton();
    } if (currentForm.getAttribute('name') === 'new' && isValid === true) {
        renderSinglForm();
        event.target.reset();
        deactivationButton();
    }
}

///Проверка для импута
function handelValidation(event) {
    const someInput = event.target;
    // console.log(someInput.validity);
    isFieldValid(someInput);///Вывод сообщения об ошибке валидации поля input
    const buttonForm = event.currentTarget.querySelector('.button');
    // console.log(buttonForm);
    const inputs = [...event.currentTarget.elements];
    // console.log(inputs);
    if (inputs.every(isValidate)) {
        buttonActivation(buttonForm, true);
    } else {
        buttonActivation(buttonForm, false);
    }
}

////Активация кнопки
function buttonActivation(button, value) {
    if (value) {
        button.classList.add('popup__button_is-active');
        // button.removeAttribute('disabled', true);
    } else {
        button.classList.remove('popup__button_is-active');
        // button.setAttribute('disabled', false);
    }
};

////Функция изменения/редактирования имени
function editUserInfo() {
    const headerUserName = document.querySelector('.user-info__name');
    const headerUserOccupation = document.querySelector('.user-info__job');
    const myName = document.querySelector('.popup__input_type_name');
    const myOccupation = document.querySelector('.popup__input_type_occupation');
    headerUserName.textContent = myName.value;
    headerUserOccupation.textContent = myOccupation.value;
    showPopup(popupEditUser);
    clearInput();
}

///render empty card
const createCardElement = function () {
    const markup =
        `<div class="place-card">
            <a href="#" class="place-card__img-link"><div class="place-card__image" style="">
                <button class="place-card__delete-icon"></button>
            </div></a>
            <div class="place-card__description">
                <h3 class="place-card__name"></h3>
                <button class="place-card__like-icon"></button>
            </div>
        </div>`;

    const newElement = document.createElement('div');
    newElement.insertAdjacentHTML('afterbegin', markup);
    return newElement.firstElementChild;
}

////// создание одной карточки
const renderSinglCard = function (title, img) {
    const newCard = createCardElement();
    newCard.querySelector('.place-card__name').textContent = title;
    newCard.querySelector('.place-card__image').style = `background-image: url(${img})`;
    const delButton = newCard.querySelector('.place-card__delete-icon');
    const like = newCard.querySelector('.place-card__like-icon');
    like.addEventListener('click', liker);
    delButton.addEventListener('click', byeByeCard);
    return newCard;
};

//// открытие окна с картинкой
placesList.addEventListener('click', function (event) {
    event.preventDefault();
    if (event.target.classList.contains('place-card__image')) {
        let popImg = document.querySelector('.popup__picture');
        let link = (event.target.style.backgroundImage.split('')).slice(5, -2).join('');
        popImg.setAttribute('src', link);
        showPopup(popupImg);
    }
});

///Удаление карточки
function byeByeCard(event) {
    const placeCard = event.currentTarget.closest('.place-card');
    placesList.removeChild(placeCard);
}

///Лайкер
function liker(event) {
    if (event.target.classList.contains('place-card__like-icon')) {
        event.target.classList.toggle('place-card__like-icon_liked')
    }
}

///render cards
const renderAllArr = function (arr) {
    arr.forEach(function (card) {
        placesList.appendChild(renderSinglCard(card.name, card.link));
    });
}

renderAllArr(initialCards);

////функция для создания новой карточки
const renderSinglForm = function () {
    /* Можно лучше:
    Код добавления карточки в контейнер дублируется в двух местах, лучше всего вынести в отдеьную функцию
    и переиспользовать
    */
    const nameNewPlace = document.querySelector('.popup__input_type_place');
    const imgNewPlace = document.querySelector('.popup__input_type_link-url');
    placesList.appendChild(renderSinglCard(nameNewPlace.value, imgNewPlace.value));
    showPopup(popupNewCard);
    clearInput();
}

///функция для открытия попапа
function showPopup(popup) {
    popup.classList.toggle('popup_is-opened');
};

///Удаление ошибок из span
function clearErrors() {
    const errors = document.querySelectorAll('.popup__error-message');
    errors.forEach((elem) => {
        elem.textContent = '';
    })
}

///Удаление данных ввода в input
function clearInput() {
    const inputs = document.querySelectorAll('.popup__input');
    inputs.forEach((i) => i.value = '');
};

///Деактивация кнопок
function deactivationButton() {
    const buttons = document.querySelectorAll('.popup__button');
    buttons.forEach((i) => {
        i.classList.remove('popup__button_is-active');

    })
}

//Слушатели формы редактирования профиля
UserEdit.addEventListener('submit', sendForm);
UserEdit.addEventListener('input', handelValidation);
///Слушатели формы добавления карточки
formNewCard.addEventListener('submit', sendForm);
formNewCard.addEventListener('input', handelValidation);
///Слушатель открытия попапа редактирования профиля
///стиль для шрифта
buttonFormEdit.style.fontSize = '18px';
editButton.addEventListener('click', function () {
    showPopup(popupEditUser)
});
///Слушатель открытия попапа с добавление новой карточки
buttonAddPlace.addEventListener('click', function () {
    showPopup(popupNewCard)
});
///Закрытие попапа
popupClose.forEach(function (item) {
    item.addEventListener('click', function (event) {
        // console.log(event.currentTarget)
        const parent = event.currentTarget.closest('.popup');
        parent.classList.remove('popup_is-opened');
        clearInput();
        clearErrors();
        deactivationButton();
    })
});

/* REVIEW:

Доброго времени суток! В целом у Вас получилась отличная, аккуратная работа, весь функционал реализован и работает
как указано в задании, здорово, что в коде используются интерполяци строк из ES6.
Код логично организован, в большинстве своем переменные и функции имеют понятные и описательные названия. Отлично,
что Вы реализовали изменение состояния кнопки при отсутствии введенных данных, так держать!

Критических замечаний по работе нет, работа принята.
Однако, рекомендую обратить внимание на комментарии из "можно лучше".

Спасибо за усилия и старания, удачи в следующем спринте и успехов в дальнейшем обучении.
Желаю Вам хорошего и продуктивного дня!
*/
