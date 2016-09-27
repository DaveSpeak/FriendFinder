// ===============================================================================
// DATA
// Below data will hold all of the reserved tables.
// Initially we just set it equal to a "dummy" customer.
// But you could have it be an empty array as well.
// ===============================================================================


var friendArray = [
	{
		name: 'Dan Rather',
		picture: 'https://en.wikipedia.org/wiki/Dan_Rather#/media/File:Dan_Rather_Peabody.jpg',
		answers:[1,2,3]
	}
];

// Note how we export the array. This makes it accessible to other files using require.
module.exports = friendArray;
