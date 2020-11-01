const Favour = require('../models/favour');
const notificationController = require('../controllers/notification');

// Party detection detects whether there is a cycle/loop
// of users who owe eachother favours.
const partyNames = (users, currentUserId) => {
	const names = [];
	users.forEach((user, userId) => {
		if (userId != currentUserId) {
			names.push(`${user.firstName} ${user.lastName}`);
		}
	});
	return names.join(', ');
};

const hasLoop = (party) => {
	const partyArr = Array.from(party.values());
	const firstFavour = partyArr[0];
	const lastFavour = partyArr[partyArr.length - 1];
	return lastFavour.forUser.id == firstFavour.fromUser.id;
};

const detectParty = async (initiatorId) => {
	try {
		console.time('detectParty');
		const favourDocs = await Favour.find({ repaid: false })
			.select('_id fromUser forUser')
			.populate('fromUser forUser', '_id firstName lastName')
			.exec();
		const visited = new Set();
		const parties = [];
		favourDocs.forEach((doc) => {
			const party = new Map();
			const fromUsers = new Set();

			let currentFavour = doc;
			while (currentFavour != null && !party.has(currentFavour.id)) {
				party.set(currentFavour.id, currentFavour);
				fromUsers.add(currentFavour.fromUser.id);
				// Find next favour where the current forUser is the fromUser.
				currentFavour = favourDocs.find((favour) => {
					const fromUser = favour.fromUser.id;
					const userMatches = currentFavour.forUser.id == fromUser;

					return (
						userMatches && !fromUsers.has(fromUser) && !visited.has(favour.id)
					);
				});
			}

			// Party qualifies if:
			// - it has more than 2 favours.
			// - it doesn't contain a favour that is already in another party.
			// - the party's last user owes the party's first user a favour (has a loop).
			if (party.size > 2 && hasLoop(party)) {
				party.forEach((_, key) => visited.add(key)); // mark as visited
				parties.push(party);
			}
		});

		parties.forEach((party, i) => {
			console.log(`Party ${i}:`);
			const partyUsers = new Map();

			party.forEach((favour) => {
				console.log(favour.fromUser.firstName, '->', favour.forUser.firstName);

				partyUsers.set(favour.fromUser.id, favour.fromUser);
				partyUsers.set(favour.forUser.id, favour.forUser);
			});

			// Send a notification to each user in a party.
			partyUsers.forEach((_, userId) => {
				notificationController.create(
					initiatorId,
					'/favours/view/all',
					userId,
					`Party Detected! You're in a favour cycle with ${
						party.size - 1
					} other users: ${partyNames(
						partyUsers,
						userId
					)}. Why not have a party and settle all your favours!`
				);
			});
		});

		console.log('Parties:', parties.length);
		console.timeEnd('detectParty');
	} catch (error) {
		console.log('PARTY DETECTION:', error);
	}
};

module.exports = detectParty;
