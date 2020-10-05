export default class Notification {
	constructor({ notificationId, createdBy, link, recipient, title }) {
		this.notificationId = notificationId;
		this.createdBy = createdBy;
		this.link = link;
		this.recipient = recipient;
		this.title = title;
	}
}
