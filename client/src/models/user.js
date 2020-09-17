import axios from '../utils/axios';
import Compressor from 'compressorjs';
const config = { withCredentials: true };
export default class User {
	constructor({
		userId,
		email,
		firstName,
		lastName,
		profilePicture,
		settings
	}) {
		this.userId = userId;
		this.email = email;
		this.firstName = firstName;
		this.lastName = lastName;
		this.profilePicture = profilePicture;
		this.settings = settings;
	}

	async save() {
		const data = {
			userId: this.userId,
			email: this.email,
			firstName: this.firstName,
			lastName: this.lastName,
			profilePicture: this.profilePicture,
			settings: this.settings
		};
		await axios.patch('/user/update', data, config);
	}

	async savePassword(values) {
		const data = {
			userId: this.userId,
			currentPassword: values.currentPassword,
			password: values.password,
			passwordConfirm: values.passwordConfirm
		};
		await axios.patch('/user/update-password', data, config);
	}

	async uploadProfilePicture(file) {
		const reizedFile = await new Promise((resolve, reject) => {
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
		data.append('userId', this.userId);
		data.append('file', reizedFile);
		const result = await axios.patch('/user/upload-picture', data, config);
		console.log('result', result);
		this.profilePicture = result.data.profilePicture;
	}

	async removePicture() {
		await axios.delete('/user/remove-picture', config);
		this.profilePicture = '';
	}

	async logout() {
		const data = {
			userId: this.userId
		};
		await axios.post('/auth/logout', data, config);
	}

	static async get(filters) {
		const data = { ...filters };
		const result = await axios.get('/user/get-users', data, config);
		const users = [];
		for (const user of result.users) {
			users.push(new User({ ...user }));
		}
		return users;
	}

	static async verifyAuth() {
		const result = await axios.post('/auth/verify', null, config);
		return result;
	}

	static async signup(email, password, passwordConfirm, firstName, lastName) {
		const data = {
			email: email.trim().toLowerCase(),
			password: password,
			passwordConfirm: passwordConfirm,
			firstName: firstName.trim(),
			lastName: lastName.trim()
		};
		await axios.put('/auth/signup', data);
		const result = await axios.post('/auth/login', data, config);
		return result;
	}

	static async login(email, password) {
		const data = {
			email: email.trim().toLowerCase(),
			password: password
		};
		const result = await axios.post('/auth/login', data, config);
		return result;
	}
}
