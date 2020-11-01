import axios, { config } from '../utils/axios';
export default class Notification {
	constructor({ notificationId, createdAt, link, title }) {
		this.notificationId = notificationId;
		this.createdAt = createdAt;
		this.link = link;
		this.title = title;
	}
	//API Call to delete a notification
	async delete() {
		await axios.delete(`/notification/delete/${this.notificationId}`, config);
	}
	//API Call to delete all notifications
	static async deleteAll() {
		await axios.delete('/notification/deleteAll', config);
	}
	//API Call to get all notificaitons
	static async getAll() {
		const result = await axios.post('/notification/get-all', null, config);
		const notifications = result.data.notifications.map(
			(notification) => new Notification({ ...notification })
		);
		return notifications;
	}
}
