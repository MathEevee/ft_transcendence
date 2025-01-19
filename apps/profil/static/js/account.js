import { link } from "/static/js/chatbox.js";
import { changePage } from "/static/js/index.js"

function loadAccount() {
	const profil = document.getElementById('account');
	const stat = document.getElementById('stats');
	const account = document.createElement('div');
	const accountstat = document.createElement('div');
	account.classList.add('account');
	let link_name = window.location.toString();
	var paths = link_name.split('/');
	var user = paths[paths.length - 2];
	console.log(user);
	account.innerHTML = `
		<h1>Account</h1>
		<div class="account-info">
			<p>Username: ${user}</p>
			<p class="account-info-email">Email: loading...</p>
		</div>
	`;
	accountstat.classList.add('account-stat');
	// console.log("username", fetch('/authe/api/me/'));
	accountstat.innerHTML = `
		<h1>Stat</h1>
		<div class="account-info">
			<p>Play: ${window.localStorage.getItem('play')}</p>
			<p>Win: ${window.localStorage.getItem('win')}</p>
			<p>Loss: ${window.localStorage.getItem('loss')}</p>
		</div>
	`;
	profil.appendChild(account);
	stat.appendChild(accountstat);
	fetch("/authe/api/users/" + user)
	.then(resp => resp.json())
	.then(resp => {
		if (resp.error)
			changePage('/', true) //todo "/404" make page 404.html
		else {
			account.getElementsByClassName('account-info-email')[0].textContent = "Email: " + resp.email
		}
	})
}

export { loadAccount };