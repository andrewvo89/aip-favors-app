import axios from '../utils/axios';
import Compressor from 'compressorjs';
const config = { withCredentials: true };

export default class Favour {
	constructor(favour) {
		this.favourId = favour._id;
		this.fromUser = {
			userId: favour.fromUser._id,
			...favour.fromUser
		};
		this.forUser = {
			userId: favour.forUser._id,
			...favour.forUser
		};
		this.proof = favour.proof;
		this.repaid = favour.repaid;
		this.repaidProof = favour.repaidProof;
		this.createdAt = favour.createdAt;
		this.updatedAt = favour.updatedAt;
		this.favourType = favour.favourType;
		this.quantity = favour.quantity;
		this.requestTask = favour.requestTask;
		// remove unnecessary _id property
		delete this.fromUser._id;
		delete this.forUser._id;
	}
	//API call to create favour
	static async create(data) {
		const result = await axios.post('/favours/create', data, config);
		const favour = new Favour(result.data);
		return favour;
	}
	//API call to get all favours
	static async getAllFavours() {
		const result = await axios.get('/favours/view/all', config);
		const favours = result.data.map((favour) => new Favour(favour));
		return favours;
	}
	//API Call to get a single favour
	static async getFavour(favourId) {
		const result = await axios.get(`/favours/view/${favourId}`, config);
		const favour = new Favour(result.data);
		return favour;
	}
	//API Call to repay a favour
	static async repay(data) {
		const result = await axios.patch('/favours/repay', data, config);
		const favour = new Favour(result.data);
		return favour;
	}
	//API Call to get the initial leaderboard
	static async getLeaderboard() {
		const result = await axios.get('/favours/get-leaderboard', config);
		return result.data;
	}
	//API Call to upload proof image
	static async uploadImage({ file, userId }) {
		const resizedFile = await new Promise((resolve, reject) => {
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
		const data = new FormData();
		data.append('userId', userId);
		data.append('file', resizedFile);
		// upload image and return resulting image url
		const result = await axios.post('/favours/upload-image', data, config);
		return result.data;
	}
}
