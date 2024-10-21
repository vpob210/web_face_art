document.addEventListener("DOMContentLoaded", function () {
    const endpoint = window.API_CONFIG.endpoint + "/data";
    const treeContainer = document.getElementById('jsonTree');
    const loaderElement = document.getElementById('loader');
    loaderElement.style.display = 'block'; // Показать индикатор загрузки

    fetch(endpoint)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка сети');
            }
            return response.json(); // Парсим ответ в JSON
        })
        .then(data => {
            loaderElement.style.display = 'none'; // Скрываем индикатор загрузки
            createTree(treeContainer, data); // Передаем полученные данные в дерево
        })
        .catch(error => {
            loaderElement.style.display = 'none';
            console.error('Ошибка при получении данных:', error);
        });

    // Функция для создания дерева
    function createTree(element, data) {
        const ul = document.createElement('ul');
        ul.classList.add('json-tree');

        // Обрабатываем только валидные данные с типом
        if (data && data.Type) {
            const li = document.createElement('li');
            li.classList.add('node');

            // Если это rs-server, отображаем его Name
            if (data.Type === 'rs-server') {
                li.textContent = data.Name;

                // Добавляем кнопку для раскрытия/свертывания дочерних элементов
                const expandButton = createExpandButton(li, data.Children);
                li.prepend(expandButton);

                // Рекурсивно создаем дочерние элементы, но они будут свернуты
                if (data.Children) {
                    const childUl = document.createElement('ul');
                    childUl.classList.add('json-tree');
                    data.Children.forEach(child => createTree(childUl, child));
                    childUl.style.display = 'none'; // Скрываем дочерние элементы
                    li.appendChild(childUl);
                }
            }

            // Если это rs-folder, показываем Name с чекбоксом
            else if (data.Type === 'rs-folder') {
                li.textContent = data.Name;
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.classList.add('folder-checkbox');
                li.prepend(checkbox);

                // Добавляем обработчик для чекбокса родительского элемента
                checkbox.addEventListener('change', function () {
                    const childCheckboxes = li.querySelectorAll('.folder-checkbox, .model-checkbox');
                    childCheckboxes.forEach(childCheckbox => {
                        childCheckbox.checked = checkbox.checked; // Устанавливаем состояние чекбоксов дочерних элементов
                    });
                });

                // Добавляем кнопку для раскрытия/свертывания дочерних элементов
                const expandButton = createExpandButton(li, data.Children);
                li.prepend(expandButton);

                // Рекурсивно создаем дочерние элементы, но они будут свернуты
                if (data.Children) {
                    const childUl = document.createElement('ul');
                    childUl.classList.add('json-tree');
                    data.Children.forEach(child => createTree(childUl, child));
                    childUl.style.display = 'none'; // Скрываем дочерние элементы
                    li.appendChild(childUl);
                }
            }

            // Если это rs-model, показываем Name с чекбоксом и скрытым id
            else if (data.Type === 'rs-model') {
                li.textContent = data.Name;
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.classList.add('model-checkbox');
                li.prepend(checkbox);

                // Скрытый элемент для id
                const hiddenId = document.createElement('input');
                hiddenId.type = 'hidden';
                hiddenId.value = data.Id; // Используем id вместо ServerPath
                hiddenId.classList.add('model-id');
                li.appendChild(hiddenId);
            }

            ul.appendChild(li);
        }

        element.appendChild(ul);
    }

    // Функция для создания кнопки раскрытия
    function createExpandButton(li, children) {
        const expandButton = document.createElement('button');
        expandButton.textContent = '+'; // Символ для раскрытия
        expandButton.classList.add('expand-button');

        expandButton.addEventListener('click', function () {
            const childUl = li.querySelector('ul');
            const isExpanded = childUl.style.display === 'block';
            childUl.style.display = isExpanded ? 'none' : 'block';
            expandButton.textContent = isExpanded ? '+' : '-'; // Изменяем текст кнопки
        });

        return expandButton;
    }

    // Функция для сбора всех выбранных моделей и их id
    function collectSelectedModelIds() {
        const selectedIds = [];
        const modelCheckboxes = document.querySelectorAll('.model-checkbox:checked');
        modelCheckboxes.forEach(checkbox => {
            const id = checkbox.parentElement.querySelector('.model-id').value; // Извлекаем id
            selectedIds.push(id);
        });
        return { ids: selectedIds }; // Формируем объект с массивом id
    }

    // // Отправка данных на сервер
    // document.getElementById('submitButton').addEventListener('click', function () {
    //     const dataToSend = collectSelectedModelIds();
    //     const endpointSubmit = window.API_CONFIG.endpoint + "/submit"; // Эндпоинт для отправки данных

    //     fetch(endpointSubmit, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(dataToSend)
    //     })
    //     .then(response => response.json())
    //     .then(result => {
    //         console.log('Результат отправки:', JSON.stringify(result, null, 2)); // Автоформатирование JSON в консоли
    //     })
    //     .catch(error => {
    //         console.error('Ошибка при отправке данных:', error);
    //     });
    // });
});
