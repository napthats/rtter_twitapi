/**
 * Created by JetBrains WebStorm.
 * User: user
 * Date: 11/12/12
 * Time: 19:35
 * To change this template use File | Settings | File Templates.
 */

var AnalyzeRT = {};

/**
 * Analyze rts for a target tweet and return followers or followees ID for authorized user who retweet it
 * param IDs must not contain same IDs
 * @param retweetUserIDs array of user ID that retweets target tweet sorted by tweet ID (time)
 * @param myID user ID of authorized user
 * @param followeerIDs array of followers or followees ID for the authorized user
 * @return pair of two arrays (followers or followees ID retweet a target tweet before/after the authorized user)
 */
AnalyzeRT.getFolloweerRT = function(retweetUserIDs, myID, followeerIDs, tweetID, retweet_count) {
    var beforeIDs = [];
    var afterIDs = [];
    var myTweetPassed = false;

    var len = retweetUserIDs.length;
    for(var i = 0; i < len; i++) {
        var userID = retweetUserIDs[i];
        if(userID === myID) {
            myTweetPassed = true;
        }
        else if (followeerIDs.indexOf(userID) !== -1) {
            if(!myTweetPassed) {
                beforeIDs.push(userID);
            }
            else {
                afterIDs.push(userID);
            }
        }
    }

    return [tweetID, retweet_count, beforeIDs, afterIDs];
};

/**
 *
 * @param retweetedByMe list of retweets_list of targetTweet. list and retweets_list cannot be empty
 * @param followersIds
 * @param friendsIds
 * @return arrays of [tweetID, retweet_count, beforeIDs, afterIDs]
 */
AnalyzeRT.analyzeRT = function(retweetedByMe, followersIds, friendsIds, myID){
    var followeerIDs = [];
    var result = [];

    if(!retweetedByMe) {return [];}
    if(!retweetedByMe[0]) {return [];}

    followeerIDs = followersIds.concat(friendsIds);

    retweetedByMe.forEach(function(retweets, index, array) {
        var retweetUserIDs = [];
        var tweetID;
        var retweet_count;

        tweetID = retweets[0]['retweeted_status']['id_str'];
        retweet_count = retweets[0]['retweet_count'];

        retweets.forEach(function(retweet, index, array) {
            retweetUserIDs.unshift(retweet["user"]["id"]);
        });

        result.push(AnalyzeRT.getFolloweerRT(retweetUserIDs, myID, followeerIDs, tweetID, retweet_count));
    });

    return result;
};
