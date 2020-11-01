import axios from '../utils/axios';
const config = { withCredentials: true };

export default class FavourType {
	constructor({ favourTypeId, name }) {
		this.favourTypeId = favourTypeId;
		this.name = name;
	}
	//Get all favour types from the back end
	static async getAll() {
		const result = await axios.get('/favour-types/get-all', config);
		const favourTypes = result.data.favourTypes;
		return favourTypes.map((favourType) => new FavourType({ ...favourType }));
	}
}
