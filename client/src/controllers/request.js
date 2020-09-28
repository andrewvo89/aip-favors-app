import ErrorMessage from '../models/error-message';
import Message from '../models/message';
import Request from '../models/request';
import {
	CREATE,
	DIALOG,
	NETWORK_ERROR,
	SET_ERROR,
	SET_MESSAGE,
	UPDATE
} from '../utils/constants';
import { get503Error } from '../utils/error-handler';

const getErrorMessage = (error) => {
	if (error.message === NETWORK_ERROR) {
		return get503Error();
	} else {
		return new ErrorMessage({
			status: error.response.status,
			statusText: error.response.statusText,
			message: error.response.data.message,
			feedback: error.response.data.feedback
		});
	}
};

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
					text: `Your request for "${values.act.trim()}" has been added successfully`,
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

export const deleteReward = (request, selectedReward) => {
	return async (dispatch, _getState) => {
		try {
			const { rewardIndex, favourTypeIndex } = selectedReward;
			await request.deleteReward(rewardIndex, favourTypeIndex);
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

export const udpateRewardQuantity = (
	request,
	quantity,
	rewardIndex,
	favourTypeIndex
) => {
	return async (dispatch, _getState) => {
		try {
			await request.udpateRewardQuantity(
				quantity,
				rewardIndex,
				favourTypeIndex
			);
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
	switch (socketData.action) {
		case CREATE:
			newRequests.unshift(newRequest);
			break;
		case UPDATE:
			var index = requests.findIndex(
				(request) => request.requestId === newRequest.requestId
			);
			newRequests.splice(index, 1, newRequest);
			break;
		default:
			break;
	}
	return newRequests.filter((request) => request.closed === false);
};

export const getSearchResults = (searchParams, requests) => {
	return requests.filter((request) => {
		const textMatch = request.act
			.trim()
			.toLowerCase()
			.includes(searchParams.text.trim().toLowerCase());
		const requestRewards = [];
		request.rewards.forEach((reward) =>
			reward.favourTypes.forEach((favourType) =>
				requestRewards.push(favourType.favourType.trim().toLowerCase())
			)
		);
		const rewardMatch = requestRewards.some((requestReward) =>
			searchParams.rewards
				.map((reward) => reward.trim().toLowerCase())
				.includes(requestReward)
		);
		return textMatch && rewardMatch;
	});
};
