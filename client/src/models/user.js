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
	//API Call to save profile of a user
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
	//API Call to save password of a user
	async savePassword(values) {
		const data = {
			userId: this.userId,
			currentPassword: values.currentPassword,
			password: values.password,
			passwordConfirm: values.passwordConfirm
		};
		await axios.patch('/user/update-password', data, config);
	}
	//API Call to upload profile picture
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
		this.profilePicture = result.data.profilePicture;
	}
	//API Call to remove profile picture
	async removePicture() {
		await axios.delete('/user/remove-picture', config);
		this.profilePicture = '';
	}
	//API Call to log out and clear cookies
	async logout() {
		const data = {
			userId: this.userId
		};
		await axios.post('/auth/logout', data, config);
	}
	//API Call to get a user based on a specific filter
	static async get(filter) {
		const data = { filter };
		const result = await axios.post('/user/get-users', data, config);
		const users = result.data.users.map((user) => new User({ ...user }));
		return users;
	}
	//API Call to verify token from with the backend
	static async verifyAuth() {
		const result = await axios.post('/auth/verify', null, config);
		return result;
	}
	//API Call to sign up a new user
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
	//API Call to login an existing user
	static async login(email, password) {
		const data = {
			email: email.trim().toLowerCase(),
			password: password
		};
		const result = await axios.post('/auth/login', data, config);
		return result;
	}
}
