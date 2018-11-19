const input = document.querySelector('#city');
const cityTemplate = document.querySelector('template').content;
const container = document.querySelector('#cities');

window.startData; // исходные

function renderCity (city) { // принимает объект
	const cityElem = cityTemplate.cloneNode(true).querySelector('.cities__item');
	switch(city.type) {
		case 'error':
			cityElem.textContent = city.message;
			break;
		case 'load':
			cityElem.textContent = 'Загрузка...';
			cityElem.classList.add('loader');
			break;
		default:
			cityElem.textContent = city.City;
			cityElem.classList.add('city-data');
	}
	return cityElem;
}

function renderData (data) { // принимает массив объектов
	const fragment = document.createDocumentFragment();
	if (document.querySelector('.cities__list')) { // если список есть на странице, то удаляем его
		document.querySelector('.cities__list').remove(); 
	}
	const list = cityTemplate.cloneNode(true).querySelector('.cities__list');
	data.forEach(elem => {
		fragment.appendChild(renderCity(elem));
	})
	list.appendChild(fragment);
	container.appendChild(list);
	if (list.firstChild.classList.contains('city-data')) { // если в элементе данные города, то подсвечиваем первый
		list.firstChild.classList.add('cities__item--active');
	}
	list.addEventListener('click', onCityClick);  // выбор данных
	list.addEventListener('mouseover', onCityMouseover); // убираем подсветку первого элемента при наведении на список 

}

function onCityMouseover (e) {
	if (e.target.classList.contains('city-data')) {
		e.currentTarget.firstChild.classList.remove('cities__item--active');
	}
}

function onCityClick (e) {
	if (e.target.classList.contains('city-data')) {
		input.value = e.target.textContent;
	}
}

input.addEventListener('focus', (e) => { // отрисовка данных при фокусе
	let callData = new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest(); // получение
		xhr.open('GET', '../kladr.json');
		xhr.addEventListener('progress', (e) => {
			const load = [
				{
					'type': 'load'
				}
			]
			renderData(load);
		})
		xhr.addEventListener('load', () => {
			resolve(JSON.parse(xhr.responseText));
		})
		xhr.send();
	})
	callData.then(data => {
		window.startData = data.slice();
		renderData(data);
	})
})

input.addEventListener('blur', (e) => { // удаление данных при расфокусировке
	const list = document.querySelector('.cities__list');
	setTimeout(function () {
		if (list) {
			list.remove();
		}
	}, 100);

})

function filter (e) {
	let start = window.startData.slice();
	let filteredData = start.filter(elem => {
		return elem.City.toLowerCase().includes(e.target.value.toLowerCase()); 
	})
	if (filteredData.length === 0) { // если нет соответствий - показываем ошибку
		const error = [
			{
				'type': 'error',
				'message': 'Не найдено'
			}
		];
		renderData(error);
	} else {
		renderData(filteredData);
	}
}

input.addEventListener('keyup', filter); // фильтрация