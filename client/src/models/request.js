import axios from '../utils/axios';
const config = { withCredentials: true };
export default class Request {
	constructor({ requestId, createdBy, createdAt, act, rewards, complete }) {
		this.requestId = requestId;
		this.createdBy = createdBy;
		this.createdAt = createdAt;
		this.act = act;
		this.rewards = rewards;
		this.complete = complete;
	}

	async save() {
		if (this.requestId) {
			//If requestId exists, update existing entry in database
			// const data = {
			// 	requestId: this.requestId,
			// 	rewards: this.rewards,
			// 	complete: this.complete
			// };
			// await axios.patch('/request/update', data, config);
		} else {
			//If no requestId, create a new Request in the database
			const data = {
				act: this.act,
				rewards: this.rewards
			};
			await axios.post('/request/create', data, config);
		}
	}

	async addReward(values) {
		const data = {
			requestId: this.requestId,
			favourType: values.favourType,
			quantity: values.quantity
		};
		await axios.patch('/request/add-reward', data, config);
	}

	static async get(filter) {
		const data = { filter };
		const result = await axios.post('/request/get-requests', data, config);
		const requests = result.data.requests.map(
			(request) => new Request({ ...request })
		);
		return requests;
	}
}
