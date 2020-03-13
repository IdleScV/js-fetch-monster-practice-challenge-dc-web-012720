document.addEventListener('DOMContentLoaded', pageSetup);

function pageSetup() {
	console.log('Connected!');
	buttonSetup();
	getMonsters('none');
}

function buttonSetup() {
	const back = document.querySelector('#back');
	back.addEventListener('click', () => {
		changePage('back');
	});

	const forward = document.querySelector('#forward');
	forward.addEventListener('click', () => {
		changePage('forward');
	});

	const newMonster = document.querySelector('#new');
	newMonster.addEventListener('click', triggerNew);
}

function clearDOM() {
	let container = document.querySelector('#monster-container');
	container.innerHTML = '';
}

function getPageNumber() {
	let page = document.querySelector('#monster-container').className;
	return page;
}

function changePage(direction) {
	let page = parseInt(getPageNumber());
	switch (direction) {
		case 'none':
			page = 1;
			break;
		case 'forward':
			// console.log('Going Forwards');
			page = page + 1;
			break;
		case 'back':
			// console.log('Going Backwards');
			if (page > 1) {
				page = page - 1;
			} else {
				alert("Can't go further back");
				return;
			}
			break;
	}
	clearDOM();
	document.querySelector('#monster-container').className = page;
	getMonsters();
}

function getMonsters() {
	console.log('Getting Monsters');
	fetch(`http://localhost:3000/monsters/?_limit=50&_page=${getPageNumber()}`)
		.then((response) => response.json())
		.then((monsterArray) => monsterArray.forEach((x) => processMonster(x)));
}

function processMonster(monster) {
	let container = document.querySelector('#monster-container');
	let card = document.createElement('div');
	card.classList.add('monster');
	card.id = monster.name;

	let name = document.createElement('h3');
	name.innerText = monster.name;
	name.id = 'name';

	let age = document.createElement('h5');
	age.innerText = `${parseInt(monster.age)} Years Old`;
	age.id = 'age';

	let description = document.createElement('p');
	description.innerText = monster.description;
	description.id = 'description';

	card.append(name, description, age);

	container.append(card);
}

function triggerNew() {
	let form = document.querySelector('.new-monster');
	// debugger;
	if (form.style.display === '') {
		form.style.display = 'inline';
	} else {
		form.style.display = '';
	}
	const formBtn = document.querySelector('.new-monster');
	formBtn.addEventListener('submit', newMonster);
}

function newMonster(e) {
	e.preventDefault();

	let form = e.currentTarget;
	let payload = JSON.stringify({
		name: form.name.value,
		description: form.description.value,
		age: form.age.value
	});

	fetch(`http://localhost:3000/monsters`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: payload
	})
		.then((res) => res.json())
		.then((monster) => processMonster(monster));

	e.currentTarget.reset();
}
