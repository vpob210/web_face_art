document.addEventListener("DOMContentLoaded", function () {
    const submitButton = document.getElementById('submitButton');
    const endpoint = window.API_CONFIG.endpoint + "/submit";

    // Функция для сбора всех выбранных моделей и их id
    function collectSelectedModelIds() {
        const selectedIds = [];
        const modelCheckboxes = document.querySelectorAll('.model-checkbox:checked');
        
        // Собираем все id выбранных моделей
        modelCheckboxes.forEach(checkbox => {
            const id = checkbox.parentElement.querySelector('.model-id').value; // Извлекаем id
            selectedIds.push(id);
        });

        return { ids: selectedIds }; // Формируем объект с массивом id
    }

    // Функция для отправки данных на сервер
    function sendDataToServer(data) {
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json()) // Разбираем JSON-ответ
        .then(result => {
            console.log('Ответ от сервера:', JSON.stringify(result, null, 2)); // Автоформатирование ответа в консоли
            alert('Данные успешно отправлены!');
        })
        .catch(error => {
            console.error('Ошибка при отправке данных:', error);
            alert('Произошла ошибка при отправке данных.');
        });
    }

    // Обработчик нажатия на кнопку "Отправить"
    submitButton.addEventListener('click', function () {
        const selectedData = collectSelectedModelIds();
        
        if (selectedData.ids.length > 0) { // Проверка на наличие выбранных моделей
            console.log('Отправляем данные на сервер:', JSON.stringify(selectedData, null, 2));
            sendDataToServer(selectedData); // Отправляем данные
        } else {
            alert('Нет выбранных моделей для отправки.');
        }
    });
});
