// This is the default database
var friendData = require('../data/friend-data.js');


// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {
	// route to get info from /friends db
	app.get('/api/friends', function (req, res) {
		res.json(friendData);
	});
	// routing to post data to /friends db
	app.post('/api/friends', function (req, res) {
		friendData.push(req.body);
		res.json(true);
	});
};
