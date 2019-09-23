var youtube = (function(){
    players = new Array();

    function onYouTubeIframeAPIReady() {
        var temp = $("iframe.yt_players");
        for (var i = 0; i < temp.length; i++) {
            var t = new YT.Player($(temp[i]).attr('id'), {
                events: {
                    'onStateChange': onPlayerStateChange
                }
            });
            players.push(t);
        }

    }
    onYouTubeIframeAPIReady();


    function onPlayerStateChange(event) {

        if (event.data == YT.PlayerState.PLAYING) {
            var temp = event.target.a.src;
            var tempPlayers = $("iframe.yt_players");
            for (var i = 0; i < players.length; i++) {
                if (players[i].a.src != temp) players[i].stopVideo();

            }
        }
    }
});

export { nodes, edges, container, data, options, network };