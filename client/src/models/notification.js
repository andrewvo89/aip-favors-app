import axios, { config } from '../utils/axios';
export default class Notification {
	constructor({ notificationId, createdAt, link, title }) {
		this.notificationId = notificationId;
		this.createdAt = createdAt;
		this.link = link;
		this.title = title;
	}

	async delete() {
		await axios.delete(`/notification/delete/${this.notificationId}`, config);
	}

	static async deleteAll() {
		await axios.delete('/notification/deleteAll', config);
	}

	static async getAll() {
		const result = await axios.post('/notification/get-all', null, config);
		const notifications = result.data.notifications.map(
			(notification) => new Notification({ ...notification })
		);
		return notifications;
	}
}
