import Compressor from 'compressorjs';
import axios from '../utils/axios';
const config = { withCredentials: true };
export default class Request {
	constructor({
		requestId,
		createdBy,
		createdAt,
		task,
		rewards,
		completed,
		completedBy,
		proof
	}) {
		this.requestId = requestId;
		this.createdBy = createdBy;
		this.createdAt = createdAt;
		this.task = task;
		this.rewards = rewards;
		this.completed = completed;
		this.completedBy = completedBy;
		this.proof = proof;
	}
	//API Call to save a new request
	async save() {
		if (!this.requestId) {
			//If no requestId, create a new Request in the database
			const data = {
				task: this.task,
				rewards: this.rewards
			};
			await axios.post('/request/create', data, config);
		}
	}
	//API Call to add a reward to a new request
	async addReward(values) {
		const data = {
			requestId: this.requestId,
			favourType: values.favourType,
			quantity: values.quantity
		};
		await axios.patch('/request/add-reward', data, config);
	}
	//API Call delete a reward from a request
	async deleteReward(reward) {
		const data = {
			requestId: this.requestId,
			fromUserId: reward.fromUser.userId,
			favourTypeId: reward.favourType.favourTypeId
		};
		await axios.patch('/request/delete-reward', data, config);
	}
	//API Call update reward quantity on request
	async udpateRewardQuantity(reward, quantity) {
		const data = {
			requestId: this.requestId,
			fromUserId: reward.fromUser.userId,
			favourTypeId: reward.favourType.favourTypeId,
			quantity: quantity
		};
		await axios.patch('/request/udpate-reward-quantity', data, config);
	}
	//API Call to compelte a request
	async complete(file) {
		const resizedFile = await new Promise((resolve, reject) => {
			//Use compressor to resize an image client side before uploading to save bandwidth adn time
			return new Compressor(file, {
				width: 400,
				success: (result) => {
					resolve(
						new File([result], file.name, {
							type: file.type,
							lastModified: file.lastModified
						})
					);
				},
				error: (error) => reject(error)
			});
		});
		//Need to send mixed data (image and json), so need to use FormData()
		const data = new FormData();
		data.append('requestId', this.requestId);
		data.append('file', resizedFile);
		const result = await axios.patch('/request/complete', data, config);
		return result;
	}
	//API Call to create a new request
	static async create(values) {
		const data = {
			task: values.task,
			favourType: values.favourType,
			quantity: values.quantity
		};
		await axios.post('/request/create', data, config);
	}
	//API Call to get a request and add a filter if required
	static async get(filter) {
		const data = { filter };
		const result = await axios.post('/request/get-requests', data, config);
		const requests = result.data.requests.map(
			(request) => new Request({ ...request })
		);
		return requests;
	}
}
