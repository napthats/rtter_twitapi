/**
 * Created by JetBrains WebStorm.
 * User: user
 * Date: 11/12/11
 * Time: 14:33
 * To change this template use File | Settings | File Templates.
 */

$(document).ready(function(){

var myrts;
var my;
var phases = [];
var api = new TwitAPI();

var next_phases = function(){
    var next = phases.shift();
    if(next){next()};
};

$('#get_tl').click(function(){
    phases = [
        function(){api.call('get', 'statuses/retweeted_by_me', function(statuses){next_phases();})},
        function(){api.call('get', 'statuses/home_timeline', function(statuses){next_phases();})}
    ];
    next_phases();
});

$('#get_tl2').click(function(){
    api.call('get', '1/statuses/retweets/146147591187476480', function(statuses){myrts = statuses; next_phases();});
    api.call('get', '1/statuses/retweeted_by_me', function(statuses){my = statuses; next_phases();});
});

$('#analyze_rt').click(function() {
    api.call('get', '1/statuses/retweeted_by_me', function(statuses) {
        var retweetedByMe = [];
        var followersIDs = [];
        var friendsIDs = [];
        var myID;

        if(!statuses) {alert('no retweets'); return;}

        myID = statuses[0]['user']['id'];

        statuses.forEach(function(retweet, index, array) {
            var retweetID = retweet['retweeted_status']['id_str'];
            if(retweetID !== '146147591187476480') {return}
            phases.push(function() {
                api.call('get', '1/statuses/retweets/' + retweetID, function(statuses){
                    retweetedByMe.push(statuses);
                    next_phases();
                });
            });
        });

        phases.push(function() {
            api.call('get', '1/followers/ids', function(statuses){
                followersIDs = statuses['ids'];
                next_phases();
            });
        });

        phases.push(function() {
            api.call('get', '1/friends/ids', function(statuses){
                followersIDs = statuses['ids'];
                next_phases();
            });
        });

        phases.push(function() {
            execRts(retweetedByMe, followersIDs, friendsIDs, myID);
        });

        next_phases();
    });
});

function execRts(retweetedByMe, followersIDs, friendsIDs, myID) {
    //$("#contents").text(OtherUtils.dumpJson(retweetedByMe, {indent:true}));
    $("#contents_my").text(OtherUtils.dumpJson(AnalyzeRT.analyzeRT(retweetedByMe, followersIDs, friendsIDs, myID), {indent:true}));
}


$('#alert').click(function(){
    //test
    var lists = [1,2,3];
    lists.forEach(function(a,b,c){alert(a);});
    //end test
    $("#contents").text(OtherUtils.dumpJson(myrts, {indent:true}));
    $("#contents_my").text(OtherUtils.dumpJson(my, {indent:true}));
    alert(OtherUtils.dumpJson(myrts, {indent:true}));
    alert(OtherUtils.dumpJson(my, {indent:true}));
});

});
