"use strict"

const logoutButton = new LogoutButton();
const ratesBoard = new RatesBoard();
const moneyManager = new MoneyManager();
const favoritesWidget = new FavoritesWidget();

updateExchangeRate();
let timer = setInterval(updateExchangeRate, 60000);

logoutButton.action = () => ApiConnector.logout(response => {
	if (response.success) {
		location.reload();
	}
});

ApiConnector.current(response => {
	if (response.success) {
		ProfileWidget.showProfile(response.data);
	}
});

function updateExchangeRate() {
	ApiConnector.getStocks(response => {
		if (response.success) {
			ratesBoard.clearTable();
			ratesBoard.fillTable(response.data);
		}
	});
}

moneyManager.addMoneyCallback = (data) => ApiConnector.addMoney(data, response => {

	if (response.success) {
		ProfileWidget.showProfile(response.data);
		moneyManager.setMessage(response.success, 'Пополнение прошло успешно');
	} else {
		moneyManager.setMessage(response.success, response.error);
	}
});

moneyManager.conversionMoneyCallback = (data) => ApiConnector.convertMoney(data, response => {
	if (response.success) {
		ProfileWidget.showProfile(response.data);
		moneyManager.setMessage(response.success, 'Конвертация прошла успешно');
	} else {
		moneyManager.setMessage(response.success, response.error);
	}
});

moneyManager.sendMoneyCallback = (data) => ApiConnector.transferMoney(data, response => {
	if (response.success) {
		ProfileWidget.showProfile(response.data);
		moneyManager.setMessage(response.success, 'Перевод денег прошел успешно');
	} else {
		moneyManager.setMessage(response.success, response.error);
	}
});

ApiConnector.getFavorites((response) => {
	if (response.success) {
		favoritesWidget.clearTable();
		favoritesWidget.fillTable(response.data);
		moneyManager.updateUsersList(response.data);
	}
});

favoritesWidget.addUserCallback = (data) => ApiConnector.addUserToFavorites(data, response => {
	if (response.success) {
		favoritesWidget.clearTable();
		favoritesWidget.fillTable(response.data);
		moneyManager.updateUsersList(response.data);
		favoritesWidget.setMessage(response.success, 'Пользователь успешно добавлен');
	} else {
		favoritesWidget.setMessage(response.success, response.error);
	}
});

favoritesWidget.removeUserCallback = (data) => ApiConnector.removeUserFromFavorites(data, response => {
	if (response.success) {
		favoritesWidget.clearTable();
		favoritesWidget.fillTable(response.data);
		moneyManager.updateUsersList(response.data);
		favoritesWidget.setMessage(response.success, 'Пользователь успешно удален ');
	} else {
		favoritesWidget.setMessage(response.success, response.error);
	}
});