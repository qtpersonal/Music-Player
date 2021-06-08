$(function()
{
    var playerTrack = $("#player-track");
	var bgArtwork = $('#bg-artwork');
	var bgArtworkUrl;
	var albumName = $('#album-name');
	var trackName = $('#track-name');
	var albumArt = $('#album-art'),
	    bgLayer = $('#bg-layer'),
		sArea = $('#s-area'),
		seekBar = $('#seek-bar'),
		trackTime = $('#track-time'),
		insTime = $('#ins-time'),
		sHover = $('#s-hover'),
		playPauseButton = $("#play-pause-button"),
		i = playPauseButton.find('i'),
		tProgress = $('#current-time'),
		tTime = $('#track-length'),
		seekT, seekLoc, seekBarPos, cM, ctMinutes, ctSeconds, curMinutes, curSeconds, durMinutes, durSeconds, playProgress, bTime, nTime = 0,
		buffInterval = null, tFlag = false;
	
	var playPreviousTrackButton = $('#play-previous'), playNextTrackButton = $('#play-next'), currIndex = -1;
	
	var songs = [{
		artist: "Yoko Shimomura",
		name: "Valse Di Fantastica",
		url: "Musics/1.Valse Di Fantastica - Yoko Shimomura.mp3",
		picture: "https://raw.githubusercontent.com/qtpersonal/Music-Player/master/Background/1.gif"
	}, {
   		artist: "Little End",
   		name: "Forever Away",
    		url: "Musics/2.Forever Away - Little End.mp3",
    		picture: "https://raw.githubusercontent.com/qtpersonal/Music-Player/master/Background/2.gif"
	}, {
		artist: "GTech",
   		name: "Hoàng Gia Minh Vệ",
    		url: "Musics/3.Hoàng Gia Minh Vệ - GTech.mp3",
    		picture: "https://raw.githubusercontent.com/qtpersonal/Music-Player/master/Background/3.gif"
	}, {
		artist: "Sam",
   		name: "Sea of Stars",
    		url: "Musics/4.Sea of Stars - Sam.mp3",
    		picture: "https://raw.githubusercontent.com/qtpersonal/Music-Player/master/Background/4.gif"
	}, {
		artist: "Cuirong Li",
   		name: "The Beautiful Summer",
    		url: "Musics/5.The Beautiful Summer - Cuirong Li.mp3",
    		picture: "https://raw.githubusercontent.com/qtpersonal/Music-Player/master/Background/5.gif"
	}, {
		artist: "Trương Như Anh",
   		name: "Khép Lại Quá Khứ",
    		url: "Musics/6.Khép Lại Quá Khứ - Trương Như Anh.mp3",
    		picture: "https://raw.githubusercontent.com/qtpersonal/Music-Player/master/Background/6.gif"
	}, {	
		artist: "David Yen",
   		name: "Who's the Equal of My Life",
    		url: "Musics/7.Who's the Equal of My Life - David Yen.mp3",
    		picture: "https://raw.githubusercontent.com/qtpersonal/Music-Player/master/Background/7.gif"
	}, {
		artist: "Hòa Tấu",
   		name: "Tóc Tựa Tuyết",
    		url: "Musics/8.Tóc Tựa Tuyết - Hòa Tấu Sáo Bầu.mp3",
    		picture: "https://raw.githubusercontent.com/qtpersonal/Music-Player/master/Background/8.gif"
	}, {
		artist: " ",
   		name: "Instrumental",
    		url: "Musics/9.mp3",
    		picture: "https://raw.githubusercontent.com/qtpersonal/Music-Player/master/Background/8.gif"
	}, {
		artist: "Epic Music World",
   		name: "Hear It, See It And Feel It",
    		url: "Musics/10.Hear It, See It And Feel It - Epic Music World.mp3",
    		picture: "https://raw.githubusercontent.com/qtpersonal/Music-Player/master/Background/10.gif"
	}];
	
	function shuffle(a) {
		var j, x, i;
		for (i = a.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			x = a[i];
			a[i] = a[j];
			a[j] = x;
		}
		return a;
	}
	songs = shuffle(songs);

    function playPause()
    {
        setTimeout(function()
        {
            if(audio.paused)
            {
                playerTrack.addClass('active');
                albumArt.addClass('active');
                checkBuffering();
                i.attr('class','fas fa-pause');
                audio.play();
            }
            else
            {
                playerTrack.removeClass('active');
                albumArt.removeClass('active');
                clearInterval(buffInterval);
                albumArt.removeClass('buffering');
                i.attr('class','fas fa-play');
                audio.pause();
            }
        },300);
    }

    	
	function showHover(event)
	{
		seekBarPos = sArea.offset(); 
		seekT = event.clientX - seekBarPos.left;
		seekLoc = audio.duration * (seekT / sArea.outerWidth());
		
		sHover.width(seekT);
		
		cM = seekLoc / 60;
		
		ctMinutes = Math.floor(cM);
		ctSeconds = Math.floor(seekLoc - ctMinutes * 60);
		
		if( (ctMinutes < 0) || (ctSeconds < 0) )
			return;
		
        if( (ctMinutes < 0) || (ctSeconds < 0) )
			return;
		
		if(ctMinutes < 10)
			ctMinutes = '0'+ctMinutes;
		if(ctSeconds < 10)
			ctSeconds = '0'+ctSeconds;
        
        if( isNaN(ctMinutes) || isNaN(ctSeconds) )
            insTime.text('--:--');
        else
		    insTime.text(ctMinutes+':'+ctSeconds);
            
		insTime.css({'left':seekT,'margin-left':'-21px'}).fadeIn(0);
		
	}

    function hideHover()
	{
        sHover.width(0);
        insTime.text('00:00').css({'left':'0px','margin-left':'0px'}).fadeOut(0);		
    }
    
    function playFromClickedPos()
    {
        audio.currentTime = seekLoc;
		seekBar.width(seekT);
		hideHover();
    }

    function updateCurrTime()
	{
        nTime = new Date();
        nTime = nTime.getTime();

        if( !tFlag )
        {
            tFlag = true;
            trackTime.addClass('active');
        }

		curMinutes = Math.floor(audio.currentTime / 60);
		curSeconds = Math.floor(audio.currentTime - curMinutes * 60);
		
		durMinutes = Math.floor(audio.duration / 60);
		durSeconds = Math.floor(audio.duration - durMinutes * 60);
		
		playProgress = (audio.currentTime / audio.duration) * 100;
		
		if(curMinutes < 10)
			curMinutes = '0'+curMinutes;
		if(curSeconds < 10)
			curSeconds = '0'+curSeconds;
		
		if(durMinutes < 10)
			durMinutes = '0'+durMinutes;
		if(durSeconds < 10)
			durSeconds = '0'+durSeconds;
        
        if( isNaN(curMinutes) || isNaN(curSeconds) )
            tProgress.text('00:00');
        else
		    tProgress.text(curMinutes+':'+curSeconds);
        
        if( isNaN(durMinutes) || isNaN(durSeconds) )
            tTime.text('00:00');
        else
		    tTime.text(durMinutes+':'+durSeconds);
        
        if( isNaN(curMinutes) || isNaN(curSeconds) || isNaN(durMinutes) || isNaN(durSeconds) )
            trackTime.removeClass('active');
        else
            trackTime.addClass('active');

        
		seekBar.width(playProgress+'%');
		
		if( playProgress == 100 )
		{
			i.attr('class','fa fa-play');
			seekBar.width(0);
            tProgress.text('00:00');
            albumArt.removeClass('buffering').removeClass('active');
            clearInterval(buffInterval);
			selectTrack(1);
		}
    }
    
    function checkBuffering()
    {
        clearInterval(buffInterval);
        buffInterval = setInterval(function()
        { 
            if( (nTime == 0) || (bTime - nTime) > 1000  )
                albumArt.addClass('buffering');
            else
                albumArt.removeClass('buffering');

            bTime = new Date();
            bTime = bTime.getTime();

        },100);
    }

    function selectTrack(flag)
    {
        if( flag == 0 || flag == 1 )
            ++currIndex;
        else
            --currIndex;

        if( (currIndex > -1) && (currIndex < songs.length) )
        {
            if( flag == 0 )
                i.attr('class','fa fa-play');
            else
            {
                albumArt.removeClass('buffering');
                i.attr('class','fa fa-pause');
            }

            seekBar.width(0);
            trackTime.removeClass('active');
            tProgress.text('00:00');
            tTime.text('00:00');
			
			currAlbum = songs[currIndex].name;
            currTrackName = songs[currIndex].artist;
            currArtwork = songs[currIndex].picture;

            audio.src = songs[currIndex].url;
            
            nTime = 0;
            bTime = new Date();
            bTime = bTime.getTime();

            if(flag != 0)
            {
                audio.play();
                playerTrack.addClass('active');
                albumArt.addClass('active');
            
                clearInterval(buffInterval);
                checkBuffering();
            }

            albumName.text(currAlbum);
            trackName.text(currTrackName);
	    bgLayer.find('img').attr('src', currArtwork);
            $('#bg-layer img').prop('src', bgArtworkUrl);
            albumArt.find('img').attr('src', currArtwork);
            $('#album-art img').prop('src', bgArtworkUrl);
        }
        else
        {
            if( flag == 0 || flag == 1 )
                --currIndex;
            else
                ++currIndex;
        }
    }

    function initPlayer()
	{	
        audio = new Audio();

		selectTrack(0);
		
		audio.loop = false;
		
		playPauseButton.on('click',playPause);
		
		sArea.mousemove(function(event){ showHover(event); });
		
        sArea.mouseout(hideHover);
        
        sArea.on('click',playFromClickedPos);
		
        $(audio).on('timeupdate',updateCurrTime);

        playPreviousTrackButton.on('click',function(){ selectTrack(-1);} );
        playNextTrackButton.on('click',function(){ selectTrack(1);});
	}
    
	initPlayer();
});
