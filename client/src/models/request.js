import axios from '../utils/axios';
const config = { withCredentials: true };
export default class Request {
	constructor({
		requestId,
		createdBy,
		createdAt,
		act,
		rewards,
		closed,
		proof
	}) {
		this.requestId = requestId;
		this.createdBy = createdBy;
		this.createdAt = createdAt;
		this.act = act;
		this.rewards = rewards;
		this.closed = closed;
		this.proof = proof;
	}

	async save() {
		if (this.requestId) {
			//If requestId exists, update existing entry in database
			// const data = {
			// 	requestId: this.requestId,
			// 	rewards: this.rewards,
			// 	closed: this.closed
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

	async deleteReward(rewardIndex, favourTypeIndex) {
		const data = {
			requestId: this.requestId,
			rewardIndex: rewardIndex,
			favourTypeIndex: favourTypeIndex
		};
		await axios.patch('/request/delete-reward', data, config);
	}

	async udpateRewardQuantity(quantity, rewardIndex, favourTypeIndex) {
		const data = {
			requestId: this.requestId,
			quantity: quantity,
			rewardIndex: rewardIndex,
			favourTypeIndex: favourTypeIndex
		};
		await axios.patch('/request/udpate-reward-quantity', data, config);
	}

	static async create(values) {
		const data = {
			act: values.act,
			favourType: values.favourType,
			quantity: values.quantity
		};
		await axios.post('/request/create', data, config);
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
