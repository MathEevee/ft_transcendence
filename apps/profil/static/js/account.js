import { link } from "/static/js/chatbox.js";

function loadAccount() {
	const profil = document.getElementById('account');
	const stat = document.getElementById('stats');
	const account = document.createElement('div');
	const accountstat = document.createElement('div');
	account.classList.add('account');
	account.innerHTML = `
		<h1>Account</h1>
		<div class="account-info">
			<p>Username: ${window.localStorage.getItem('username')}</p>
			<p>Email: ${window.localStorage.getItem('email')}</p>
		</div>
	`;
	accountstat.classList.add('account-stat');
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
}

export { loadAccount };