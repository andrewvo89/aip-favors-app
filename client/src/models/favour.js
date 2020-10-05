import axios from '../utils/axios';
const config = { withCredentials: true };

export default class Favour {
	constructor(favour) {
		this.favourId = favour._id;
		this.fromUser = favour.fromUser;
		this.forUser = favour.forUser;
		this.act = favour.act;
		this.repaid = favour.repaid;
		this.proof = favour.proof;
		this.createdAt = favour.createdAt;
		this.updatedAt = favour.updatedAt;
	}

	static async create(data) {
		const result = await axios.post('/favours/create', data, config);

		const favour = new Favour(result.data);
		return favour;
	}

	static async getAllFavours() {
		const result = await axios.get('/favours/view/all', config);

		const favours = result.data.map(
			(favour) => new Favour(favour)
		);

		return favours;
	}

	static async getFavour(favourId) {
		const result = await axios.get(`/favours/view/${favourId}`, config);

		const favour = new Favour(result.data);
		return favour;
	}

	static async getLeaderboard() {
		const result = await axios.get('/favours/get-leaderboard', config);

		return result.data;
	}
}
