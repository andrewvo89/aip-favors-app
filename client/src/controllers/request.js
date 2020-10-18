import Message from '../models/message';
import Request from '../models/request';
import {
	CREATE,
	DELETE,
	DIALOG,
	SET_ERROR,
	SET_MESSAGE,
	UPDATE
} from '../utils/constants';
import { getErrorMessage } from '../utils/error-handler';

export const getRequests = (filter) => {
	return async (dispatch, _getState) => {
		try {
			let transformedFilter = {};
			if (filter) {
				transformedFilter = filter;
			}
			const requests = await Request.get(transformedFilter);
			return requests;
		} catch (error) {
			const errorMessage = getErrorMessage(error);
			dispatch({
				type: SET_ERROR,
				error: errorMessage
			});
			return false;
		}
	};
};

export const addRequest = (values) => {
	return async (dispatch, _getState) => {
		try {
			await Request.create(values);
			dispatch({
				type: SET_MESSAGE,
				message: new Message({
					title: 'Request Successful',
					text: `Your request for "${values.task.trim()}" has been added successfully`,
					feedback: DIALOG
				})
			});
			return true;
		} catch (error) {
			const errorMessage = getErrorMessage(error);
			dispatch({
				type: SET_ERROR,
				error: errorMessage
			});
			return false;
		}
	};
};

export const addReward = (request, values) => {
	return async (dispatch, _getState) => {
		try {
			await request.addReward(values);
			return true;
		} catch (error) {
			const errorMessage = getErrorMessage(error);
			dispatch({
				type: SET_ERROR,
				error: errorMessage
			});
			return false;
		}
	};
};

export const deleteReward = (request, reward) => {
	return async (dispatch, _getState) => {
		try {
			await request.deleteReward(reward);
			return true;
		} catch (error) {
			const errorMessage = getErrorMessage(error);
			dispatch({
				type: SET_ERROR,
				error: errorMessage
			});
			return false;
		}
	};
};

export const udpateRewardQuantity = (request, reward, quantity) => {
	return async (dispatch, _getState) => {
		try {
			await request.udpateRewardQuantity(reward, quantity);
			return true;
		} catch (error) {
			const errorMessage = getErrorMessage(error);
			dispatch({
				type: SET_ERROR,
				error: errorMessage
			});
			return false;
		}
	};
};

export const handleSocketUpdate = (socketData, requests) => {
	let newRequests = [...requests];
	const newRequest = new Request({ ...socketData.request });
	if (socketData.action === CREATE) {
		newRequests.unshift(newRequest);
	} else if (socketData.action === UPDATE) {
		const index = requests.findIndex(
			(request) => request.requestId === newRequest.requestId
		);
		newRequests.splice(index, 1, newRequest);
	} else if (socketData.action === DELETE) {
		const index = requests.findIndex(
			(request) => request.requestId === newRequest.requestId
		);
		newRequests.splice(index, 1);
	}
	return newRequests;
};

export const getSearchResults = (searchParams, requests) => {
	return requests.filter((request) => {
		//Text search filter
		const textMatch = request.task
			.trim()
			.toLowerCase()
			.includes(searchParams.text.trim().toLowerCase());
		//Get a unique list of all request rewards
		const extractedRewards = [];
		request.rewards.forEach((reward) =>
			extractedRewards.push(reward.favourType.favourTypeId)
		);
		const requestRewards = [...new Set(extractedRewards)];
		//Rewards filter
		const rewardMatch = searchParams.rewards.some((searchParamReward) =>
			requestRewards.includes(searchParamReward)
		);
		return textMatch && rewardMatch;
	});
};

export const complete = (request, file) => {
	return async (dispatch, _getState) => {
		try {
			await request.complete(file);
			return true;
		} catch (error) {
			const errorMessage = getErrorMessage(error);
			dispatch({
				type: SET_ERROR,
				error: errorMessage
			});
		}
	};
};
