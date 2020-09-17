import axios from '../utils/axios';
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

	async logout() {
		const data = {
			userId: this.userId
		};
		await axios.post('/auth/logout', data, config);
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
