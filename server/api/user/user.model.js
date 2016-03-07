var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// var CommentSchema = new Schema({
// 	score: Number,
// 	nsfw: Boolean,
// 	body: String,
// 	edited: Boolean,
// 	subreddit: String,
// 	created: Number,
// 	upvotes: Number
// });

var MonthSchema = new Schema({
	month: String,
	date: Number,
	year: Number,
	commentKarmaForMonth: Number,
	linkKarmaForMonth: Number,
	postsForMonth: Number
});

var DaySchema = new Schema({
	day: Number,
	postsForDay: Number,
	commentKarmaForDay: Number
});

var HourSchema = new Schema({
	hour: Number,
	postsForHour: Number,
	commentKarmaForHour: Number
});

var ComMetaSchema = new Schema({
	subreddit: String,
	link: String,
	linkType: Number,
	length: Number,
	gilded: Number,
	flaired: Number,
	hour: Number,
	day: Number,
	month: Number,
	year: Number,
});

var UserSchema = new Schema({
	username: {type: String, unique: true},
	topComment: {
		score: Number,
		subreddit: String,
		body: String,
		permalink: String
	},
	topSubmission: {
		score: Number,
		subreddit: String,
		title: String,
		permalink: String
	},
	karma: {
		totalCommentScore: Number,
		totalLinkScore: Number,
		commentScore: Number,
		linkScore: Number
	},
	creationTime: Number,
	totalComments: Number,
	totalEditedComments: Number,
	avgEditTime: Number,
	medEditTime: Number,
	avgCommentLength: Number,
	nsfwComments: Number,
	nsfwSubmissions: Number,
	veryNegativeAdjs: Number,
	negativeAdjs: Number,
	positiveAdjs: Number,
	veryPositiveAdjs: Number,
	vnPer: Number,
	nPer: Number,
	pPer: Number,
	vpPer: Number,
	vnEx: [{adjective: String}],
	nEx: [{adjective: String}],
	pEx: [{adjective: String}],
	vpEx: [{adjective: String}],
	controversialComments: Number,
	gildedComments: Number,
	totalGilds: Number,
	totalWords: Number,
	totalFlaired: Number,
	lastUpdated: Number,
	descriptions: [String],
	familyMembers: [String],
	region: String,
	dateData: [MonthSchema],
	day: [DaySchema],
	hour: [HourSchema],
	comMeta: [ComMetaSchema],
	availableFrom: Number,
	negativePercentage: Number,
	negativeExample: [{content: String, trigger: String}]
}, { collection: 'user'});

module.exports = mongoose.model('User', UserSchema);