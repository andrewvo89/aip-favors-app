export default class Notification {
	constructor({ createdBy, link, recipient, title }) {
		this.createdBy = createdBy;
		this.link = link;
		this.recipient = recipient;
		this.title = title;
	}
}
