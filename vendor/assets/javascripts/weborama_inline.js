var playerWeborama = function(aWindow) 
{
  var sender = this;
  this.ownerWindow = aWindow;
  this.converts = {};
  this.flagConvert = false;
  this.httpRequest = { 'busy' : false, 'queue' : new Array()};
  
  sender.checkQueue = function()
  {
    if (!sender.httpRequest.busy) 
    {
      if (sender.httpRequest.queue.length > 0)
      {
        var queueItem = sender.httpRequest.queue.shift();
        sender.httpRequest.busy = true;
        sender.proxy.loadURL(queueItem.url, queueItem.parameters, queueItem.dummy, queueItem.method);
      }
    }
  }
  
  sender.load = function()
  {
    var fp = false;
    
    var fpIe = true;
    if (window.ActiveXObject)
    {
      try 
      {
        var a = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.' + sender.flashVersion);
      }      
      catch(e) 
      {
        fpIe = false;
      }
    }
    
    if (window.ActiveXObject && fpIe)
    {
      fp = true;
    }
    
    if (window.navigator.mimeTypes['application/x-shockwave-flash'] && window.navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin)
    {
      var d = window.navigator.plugins['Shockwave Flash'].description;
      d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
      d = parseInt(d.replace(/^(.*)\..*$/, "$1"), 10);
      if ( d >= sender.flashVersion)
      {
        fp = true;
      }
    }
    
    if (fp)
    {
      var playerContainer = document.createElement('div');
      playerContainer.style.cssText = 'z-index:10000; width: 2px; height: 1px; position: fixed; font-size: 1px;';
      if (document.body.filters)
      {
        if (typeof XMLHTTPRequest == 'undefined')
        {
          playerContainer.style.position = 'absolute'; //for IE 6
        }
      }
      
      playerContainer.innerHTML = sender.createSWFPlayer('weboramaInlinePlayer') + sender.createSWFProxy('weboramaInlineProxy');
      if (document.body.firstChild)
      {
        document.body.insertBefore(playerContainer, document.body.firstChild);
      }
      else
      {
        document.body.appendChild(playerContainer);
      }
      
      sender.getFlashObject = function(flashName)
      {
        if(typeof(sender.ownerWindow[flashName]) == 'undefined')
        {
          return sender.ownerWindow.document[flashName];
        }
        else
        {
          return sender.ownerWindow[flashName];
        }
      }   
      
      sender.player = sender.getFlashObject('weboramaInlinePlayer');
      sender.proxy = sender.getFlashObject('weboramaInlineProxy');
          
      var buf = document.createElement('div');
      buf.style.position = 'absolute';
      buf.style.width = '100px';
      buf.style.fontSize = '1px';  
      buf.style.height = '3px';
      buf.style.display = 'none';
      buf.style.zIndex = '999';
      
      sender.buf = buf;
      document.body.insertBefore(buf, document.body.firstChild);
      
      if (typeof document.evaluate == 'undefined') 
      { 
        sender.iterator(document.body, sender.searchTagIE);
        sender.changeTagSongIE();
      }
      else
      {  
        var tagsSong = document.evaluate("//song", document, null, XPathResult.ANY_TYPE, null); 
        var tagSong = tagsSong.iterateNext(); 
        var tempTagSong = new Array();
        while (tagSong)
        {
          tempTagSong.push(tagSong);
          tagSong = tagsSong.iterateNext();
        }
        for (var i = 0; i < tempTagSong.length; ++i)
        {
          var linkColor = this.getElementColor(tempTagSong[i]);
          var element = sender.newSpan(tempTagSong[i].innerHTML, tempTagSong[i].id, linkColor);
          tempTagSong[i].parentNode.insertBefore(element.span, tempTagSong[i]);
          tempTagSong[i].parentNode.removeChild(tempTagSong[i]);
          sender.tagSongsArray.push({id: tempTagSong[i].id, text: tempTagSong[i].innerHTML, span: element.span, link: element.link, img: element.img, textNode: element.textNode, tag: 'song', color: linkColor, progress: element.progress, progressBack: element.progressBack});
          sender.addEvent(element.img, 'click', sender.createPlaySong(sender.tagSongsArray.length-1));
          delete tempTagSong[i];
        }

        var tempWeboramaLink = new Array(); 
        
        var weboramaLinks = document.evaluate("//a[substring(attribute::href, 1, 56) = 'http://www.weborama.ru/#/modules/music/song/view.php?id=']", document, null, XPathResult.ANY_TYPE, null);
        var weboramaLink = weboramaLinks.iterateNext();
        while (weboramaLink)
        { 
          tempWeboramaLink.push(weboramaLink);
          weboramaLink = weboramaLinks.iterateNext();
        }
        weboramaLinks = null;
        
        weboramaLinks = document.evaluate("//a[substring(attribute::href, 1, 54) = 'http://www.weborama.ru/modules/music/song/view.php?id=']", document, null, XPathResult.ANY_TYPE, null);
        weboramaLink = weboramaLinks.iterateNext();
        while (weboramaLink)
        { 
          tempWeboramaLink.push(weboramaLink);
          weboramaLink = weboramaLinks.iterateNext();
        }  
        weboramaLinks = null;
        
        weboramaLinks = document.evaluate("//a[contains(attribute::href, 'weborama.ru/#/music/')]", document, null, XPathResult.ANY_TYPE, null);
        weboramaLink = weboramaLinks.iterateNext();
        sender.flagConvert = false;
        sender.converts = {};
         
        while (weboramaLink) 
        {
          tempWeboramaLink.push(weboramaLink);
          weboramaLink = weboramaLinks.iterateNext();
        }
        
              
        for (var i = 0; i < tempWeboramaLink.length; ++i)
        {
          var add = false;
          var match = tempWeboramaLink[i].href.match(/http:\/\/www.weborama.ru.*modules\/music\/song\/view.php\?id=([a-f0-9]{32})/i);
          var id = null;
          if (match)
          {
            id = match[1];
            add = true;
          }
          else
          {
            var id = null, text = '';
            var flagId = sender.idRegExp.test(tempWeboramaLink[i].href);
            var flagText = sender.textRegExp.test(tempWeboramaLink[i].href);
            sender.flagConvert = (sender.flagConvert || flagText);
          
            if (flagId)
            {
              var match = tempWeboramaLink[i].href.match(sender.idRegExp);
            }
            else
            {
              var match = tempWeboramaLink[i].href.match(sender.textRegExp);
            }

            if (match)
            {
            
              if (flagId)
              {
                id = match[1];
                add = true;
              }
              else
              {
                sender.converts[sender.tagSongsArray.length] = match[1];
                add = true;
              } 
            }
          
          }
          if (add)
          {
            var linkColor = sender.getElementColor(tempWeboramaLink[i]);
            var element = sender.newSpan(tempWeboramaLink[i].innerHTML, id, linkColor, tempWeboramaLink[i]);
            tempWeboramaLink[i].parentNode.insertBefore(element.span, tempWeboramaLink[i]);
            tempWeboramaLink[i].parentNode.removeChild(tempWeboramaLink[i]);
            sender.tagSongsArray.push({id: id, text: tempWeboramaLink[i].innerHTML,  span: element.span, link: element.link, img: element.img, textNode: element.textNode, tag: 'a', color: linkColor, progress: element.progress, progressBack: element.progressBack});
            sender.addEvent(element.img, 'click', sender.createPlaySong(sender.tagSongsArray.length-1));
            delete tempWeboramaLink[i];
          }
        }
      }
      
      playerWeborama.prototype.refresh = function()
      { 
        for (var ii = 0; ii < sender.tagSongsArray.length; ++ii) 
        {
          sender.tagSongsArray[ii].progressBack.style.top = sender.getElementTop(sender.tagSongsArray[ii].link) + sender.tagSongsArray[ii].link.offsetHeight  + 'px';
          sender.tagSongsArray[ii].progressBack.style.left = sender.getElementLeft(sender.tagSongsArray[ii].link) + 'px';
          sender.tagSongsArray[ii].progressBack.style.width = sender.tagSongsArray[ii].link.offsetWidth + 'px';
          

          sender.tagSongsArray[ii].progress.style.top = sender.getElementTop(sender.tagSongsArray[ii].link) + sender.tagSongsArray[ii].link.offsetHeight + 'px';
          sender.tagSongsArray[ii].progress.style.left = sender.getElementLeft(sender.tagSongsArray[ii].link) + 'px';    
        }

        if (sender.lastIndex != null)
        {
          sender.buf.style.top = sender.getElementTop(sender.tagSongsArray[sender.lastIndex].link) + sender.tagSongsArray[sender.lastIndex].link.offsetHeight  + 'px';
          sender.buf.style.left = sender.getElementLeft(sender.tagSongsArray[sender.lastIndex].link) + 'px';
          sender.buf.style.width = sender.tagSongsArray[sender.lastIndex].link.offsetWidth + 'px';
        }
      }
      
      sender.ownerWindow.setInterval(sender.refresh, 2000);
      sender.addEvent(sender.ownerWindow, 'size', sender.refresh);    
    }
  }
  
   sender.convertRewrites = function(converts)
  {
    var convertsStrings = new Array();
    for (i in converts)
    {
      //if (parseInt(i) > 0)
      convertsStrings.push(i + '=' + converts[i]);
    }
    convertsStrings = convertsStrings.join(',');
    sender.httpRequest.queue.push({'url' : sender.rewritesConverterURL, 'parameters' : {'rewrites' : convertsStrings}, 'dummy' : null, 'method' : 'GET' });
  }
  
  sender.convertRewritesHandler = function(event)
  {
    event = eval('(' + event['data'] + ')');
    
    var i;
    for (i in event)
    {
      sender.songIdentifiers[i] = event[i];
    }
  }            
  
  sender.searchTagIE = function(node)
  {
    if (node.tagName == '/song' || node.tagName == '/Song' || node.tagName == '/SONG')
    {  
      sender.TempTagIE.push(node);
    }
    if (node.tagName == 'a' || node.tagName == 'A')
    {
      var match = node.href.match(/http:\/\/www.weborama.ru.*modules\/music\/song\/view.php\?id=([a-f0-9]{32})/i);
      if (match)
      { 
        sender.TempTagIE.push(node);
      }
      else
      {
        var flagId = sender.idRegExp.test(node.href);
        var flagText = sender.textRegExp.test(node.href);
        if (flagId || flagText)
        {
          sender.TempTagIE.push(node);
        }
      }    
    }
  }
  
}    

playerWeborama.prototype.changeTagSongIE = function()
{
  for (var ii in this.TempTagIE)
  {
    var node = this.TempTagIE[ii];
    if (node.tagName == 'a' || node.tagName == 'A')
    {
      var add = false;
      var match = node.href.match(/http:\/\/www.weborama.ru.*modules\/music\/song\/view.php\?id=([a-f0-9]{32})/i);
      var id = null;
      if (match)
      {
        id = match[1];
        add = true;
      }
      else
      {
        var id = null, text = '';
        var flagId = this.idRegExp.test(node.href);
        var flagText = this.textRegExp.test(node.href);
        this.flagConvert = (this.flagConvert || flagText);
      
        if (flagId)
        {
          var match = node.href.match(this.idRegExp);
        }
        else
        {
          var match = node.href.match(this.textRegExp);
        }

        if (match)
        {
        
          if (flagId)
          {
            id = match[1];
            add = true;
          }
          else
          {
            this.converts[this.tagSongsArray.length] = match[1];
            add = true;
          } 
        }
      
      }
      if (add)
      {
        var id = match[1];
        var linkColor = this.getElementColor(node);
        var element = this.newSpan(node.innerHTML, id, linkColor, node);
        node.parentNode.insertBefore(element.span, node);
        node.parentNode.removeChild(node);
        this.tagSongsArray.push({id: id, text: node.innerHTML,  span: element.span, link: element.link, img: element.img, textNode: element.textNode, tag: 'a', color: linkColor, progress: element.progress, progressBack: element.progressBack});
        this.addEvent(element.img, 'click', this.createPlaySong(this.tagSongsArray.length-1));
        delete node;      
      }
    }  
  }
}        

playerWeborama.prototype.getElementTop = function(element) 
{
  var top = element.offsetTop;
  while (element = element.offsetParent) 
  {
    top += element.offsetTop;
  }
  return top;  
}

playerWeborama.prototype.getElementLeft = function(element) 
{
  var left = element.offsetLeft;
  while (element = element.offsetParent) 
  {
    left += element.offsetLeft;
  }
  return left;
}

playerWeborama.prototype.addEvent = function(component, eventName, handler) 
{
  if (component && eventName && handler)
  { 
    if (typeof component.attachEvent == 'object')
    {
      return component.attachEvent('on' + eventName, handler);
    } 
    else if (typeof component.addEventListener == 'function')
    {
      return component.addEventListener(eventName, handler, false);
    }
  }
}

playerWeborama.prototype.iterator = function(startElement, handler)
{
  if (startElement)
  {
    var childNodes = startElement.childNodes;
    for (var i = 0; i < childNodes.length; ++i)
    {
      this.iterator(childNodes[i], handler);
      handler(childNodes[i]);
    }
  }
}

playerWeborama.prototype.createSWFPlayer = function(id)
{
  var result =  '<object id="' + id + '" name="' + id + '" style="z-index: 0; width: 1px; height: 1px;" type="application/x-shockwave-flash" data="' + this.swfPlayer + '"><param name="wmode" value="transparent"/><param name="allowFullScreen" value="true"/><param name="allowScriptAccess" value="always"/><param name="movie" value="' + this.swfPlayer + '"/><param name="menu" value="false" /><param name="quality" value="high" /><param name="codebase" value="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" /><param name="flashvars" value="debug=0&amp;playFile=playFile&amp;pause=pause&amp;stop=stopFile&amp;getProgress=getProgress&amp;getBuffering=getBuffering&amp;setVolume=setVolume&amp;progressTimer=200&amp;getState=getState&amp;onStateChange=onStateChange&amp;onReady=onFlashReady&amp;onOpen=onOpen&amp;onProgress=window.' + this.objName + '.onProgress&amp;onBuffering=window.' + this.objName + '.onBuffering&amp;onComplete=window.' + this.objName + '.onComplete&amp;onFileError=onFileError&amp;onInitError=onInitError&amp;onId3=onId3" /></object>';
  return result;
} 

playerWeborama.prototype.createSWFProxy = function(id)
{
  var result =  '<object id="' + id + '" name="' + id + '" style="z-index: 0; width: 1px; height: 1px;" type="application/x-shockwave-flash" data="' + this.swfProxy + '"><param name="wmode" value="transparent"/><param name="allowFullScreen" value="true"/><param name="allowScriptAccess" value="always"/><param name="movie" value="' + this.swfProxy + '"/><param name="menu" value="false" /><param name="quality" value="high" /><param name="codebase" value="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" /><param name="flashvars" value="debug=1&load=loadURL&getBytesLoaded=getBytesLoaded&getBytesTotal=getBytesTotal&getState=getState&onStateChange=onStateChange&onReady=window.' + this.objName + '.getAudioId&onProgress=onProgress&onComplete=window.' + this.objName + '.onCompleteRequest&onError=onError&onInitError=onInitError" /></object>';
  return result;
} 

playerWeborama.prototype.getAudioId = function()
{
  setInterval(this.checkQueue, 200);
  
  if (this.flagConvert)
  {
    this.convertRewrites(this.converts);
  }
  if (this.tagSongsArray.length > 0)
  {
    for (var i = 0; i < this.tagSongsArray.length; ++i )
    {
      if (this.tagSongsArray[i].songInfo == null && this.tagSongsArray[i].id.test(/^[0-9a-f]$/))
      {
        this.httpRequest.queue.push({'url' : this.songInfoURL, 'parameters' : {id : this.tagSongsArray[i].id, type : 'audio', act : 'new'}, dummy : null, method : 'GET' });
      }
    }
  }
}

playerWeborama.prototype.newSpan = function(text, id, color, element)
{
    if (color == null)
  {
    color = {r: 0, g: 0, b: 0};
  }
  var span = document.createElement('span');
  span.style.whiteSpace = 'nowrap';
  //span.style.position = 'relative';
  
  var img = document.createElement('span');
  img.innerHTML = '&nbsp;';
  img.style.paddingRight = '11px';
  img.style.background = "url('" + this.playButton + "') no-repeat 5px 5px";
  img.style.cursor = 'pointer';
  
  /*var img = document.createElement('img');
  img.src = this.playButton;// + "?r=" + color.r + "&g=" + color.g + "&b=" + color.b ;
  img.style.cursor = 'pointer';
  //img.style.position = 'absolute';
  img.style.top = '1px';
  img.style.left = '0px';
  //img.style.margin = '4px';
  img.style.padding = '4px';
  img.alt = '>';*/
  
  var link = null;
  var textNode = null;
  
  link = element.cloneNode(true);
  textNode = link.firstChild;    
  
  var space = document.createTextNode(' ');
  
  //span.appendChild(whiteSpace);
  span.appendChild(img);
  //span.appendChild(space);  
  span.appendChild(link);
  
  var progressBack = document.createElement('div');
  progressBack.style.position = 'absolute';
  progressBack.style.width = '0px';
  progressBack.style.fontSize = '1px';  
  progressBack.style.height = '3px';
  progressBack.style.borderTop = '1px solid green';
  progressBack.style.display = 'none';
  progressBack.style.zIndex = this.zIndex++;

  var progress = document.createElement('div');
  progress.style.position = 'absolute';
  progress.style.width = '0px';
  progress.style.fontSize = '1px';
  progress.style.height = '3px';
  progress.style.borderTop = '1px solid red';
  progress.style.display = 'none';
  progress.style.zIndex = this.zIndex++;

  var buffering = document.createElement('div');
  progress.style.position = 'absolute';
  progress.style.width = '0px';
  progress.style.fontSize = '1px';
  progress.style.height = '3px';
  progress.style.display = 'none';
  progress.style.zIndex = this.zIndex++;
  
  document.body.insertBefore(progress, document.body.firstChild);
  
  document.body.insertBefore(progressBack, document.body.firstChild);
  
  document.body.insertBefore(buffering, document.body.firstChild);
    
  return {span: span, link: link, img: img, textNode: textNode, progress: progress, progressBack: progressBack, buffering: buffering};
}

playerWeborama.prototype.createPlaySong = function(index)
{              
  var sender = this;
  function playSong()
  {
    if (sender.tagSongsArray[index].id != '') // непомню зачем проверка, может можно убрать
    {
      if ( (sender.lastIndex != index) && (sender.lastIndex != null) )
      {
        sender.player.stopFile();
        if (sender.tagSongsArray[sender.lastIndex].position)
        {
          //sender.tagSongsArray[sender.lastIndex].img.src = sender.emptyPlayButton;// + "?r=" + sender.tagSongsArray[sender.lastIndex].color.r + "&g=" + sender.tagSongsArray[sender.lastIndex].color.g + "&b=" + sender.tagSongsArray[sender.lastIndex].color.b;
          sender.tagSongsArray[sender.lastIndex].img.style.backgroundImage = "url('" + sender.emptyPlayButton + "')";
          sender.tagSongsArray[sender.lastIndex].img.style.backgroundPosition = '5px 5px';
        }
        else
        {
          sender.tagSongsArray[sender.lastIndex].progress.style.display = 'none';
          sender.tagSongsArray[sender.lastIndex].progressBack.style.display = 'none';
          //sender.tagSongsArray[sender.lastIndex].img.src = sender.playButton;// + "?r=" + sender.tagSongsArray[sender.lastIndex].color.r + "&g=" + sender.tagSongsArray[sender.lastIndex].color.g + "&b=" + sender.tagSongsArray[sender.lastIndex].color.b;
          sender.tagSongsArray[sender.lastIndex].img.style.backgroundImage = "url('" + sender.playButton + "')"; 
          sender.tagSongsArray[sender.lastIndex].img.style.backgroundPosition = '5px 5px'; 
        }

        sender.lastIndex = index;
      }
      
      if (sender.lastIndex == null)
      {
        sender.lastIndex = index; 
      }
  
      switch (sender.player.getState())
      {
        case 0:                                                                            
          sender.tagSongsArray[index].decorationStyle = sender.tagSongsArray[index].link.style.textDecoration;
          sender.tagSongsArray[index].link.style.textDecoration = 'none';
          
          //sender.tagSongsArray[index].img.src = sender.pauseButton;// + "?r=" + sender.tagSongsArray[index].color.r + "&g=" + sender.tagSongsArray[index].color.g + "&b=" + sender.tagSongsArray[index].color.b;
          sender.tagSongsArray[index].img.style.backgroundImage = "url('" + sender.pauseButton + "')"; 
          sender.tagSongsArray[index].img.style.backgroundPosition = '0px 1px'; 
          
          sender.tagSongsArray[index].progressBack.style.top = sender.getElementTop(sender.tagSongsArray[index].link) + sender.tagSongsArray[index].link.offsetHeight  + 'px';
          sender.tagSongsArray[index].progressBack.style.left = sender.getElementLeft(sender.tagSongsArray[index].link) + 'px';
          sender.tagSongsArray[index].progressBack.style.width = sender.tagSongsArray[index].link.offsetWidth + 'px';
          sender.tagSongsArray[index].progressBack.style.display = 'block';
          
          sender.tagSongsArray[index].progress.style.top = sender.getElementTop(sender.tagSongsArray[index].link) + sender.tagSongsArray[index].link.offsetHeight + 'px';
          sender.tagSongsArray[index].progress.style.left = sender.getElementLeft(sender.tagSongsArray[index].link) + 'px';
          sender.tagSongsArray[index].progress.style.width = '0';
          sender.tagSongsArray[index].progress.style.display = 'block';
          
          //var additionalColor = sender.getAdditionalColor(sender.tagSongsArray[sender.lastIndex].color);
          var additionalColor = {r: Math.round((sender.tagSongsArray[sender.lastIndex].color.r + sender.getElementBackgroundColor(sender.tagSongsArray[sender.lastIndex].link).r)/2),
                                 g: Math.round((sender.tagSongsArray[sender.lastIndex].color.g + sender.getElementBackgroundColor(sender.tagSongsArray[sender.lastIndex].link).g)/2),
                                 b: Math.round((sender.tagSongsArray[sender.lastIndex].color.b + sender.getElementBackgroundColor(sender.tagSongsArray[sender.lastIndex].link).b)/2)};          

          sender.tagSongsArray[sender.lastIndex].progressBack.style.borderTopColor = 'rgb(' + additionalColor.r + ', ' + additionalColor.g + ', ' + additionalColor.b + ')';
          sender.tagSongsArray[sender.lastIndex].progress.style.borderTopColor = 'rgb(' + sender.tagSongsArray[sender.lastIndex].color.r + ', ' + sender.tagSongsArray[sender.lastIndex].color.g + ', ' + sender.tagSongsArray[sender.lastIndex].color.b + ')';
          
          sender.buf.style.top = sender.getElementTop(sender.tagSongsArray[index].link) + sender.tagSongsArray[index].link.offsetHeight  + 'px';
          sender.buf.style.left = sender.getElementLeft(sender.tagSongsArray[index].link) + 'px';
          sender.buf.style.width = sender.tagSongsArray[index].link.offsetWidth + 'px';
          sender.buf.style.backgroundImage = 'url("' + sender.wave + "?r=" + sender.tagSongsArray[sender.lastIndex].color.r + "&g=" + sender.tagSongsArray[sender.lastIndex].color.g + "&b=" + sender.tagSongsArray[sender.lastIndex].color.b + '")';
  
          var file = sender.tagSongsArray[index].id;

          if (sender.tagSongsArray[index].position)
          {
            sender.player.playFile(sender.tagSongsArray[index].songInfo.location, sender.tagSongsArray[index].position);
          }
          else
          {
            sender.player.playFile(sender.tagSongsArray[index].songInfo.location); 
          }
        break;  
        case 1:
          sender.player.pause();
          //sender.tagSongsArray[index].img.src = sender.emptyPlayButton;// + "?r=" + sender.tagSongsArray[index].color.r + "&g=" + sender.tagSongsArray[index].color.g + "&b=" + sender.tagSongsArray[index].color.b;
          sender.tagSongsArray[index].img.style.backgroundImage = "url('" + sender.emptyPlayButton + "')";
          sender.tagSongsArray[index].img.style.backgroundPosition = '5px 5px';
        break;
        case 2:
          sender.player.pause();
          //sender.tagSongsArray[index].img.src = sender.emptyPlayButton;// + "?r=" + sender.tagSongsArray[index].color.r + "&g=" + sender.tagSongsArray[index].color.g + "&b=" + sender.tagSongsArray[index].color.b;
          sender.tagSongsArray[index].img.style.backgroundImage = "url('" + sender.emptyPlayButton + "')";
          sender.tagSongsArray[index].img.style.backgroundPosition = '5px 5px';
        break;
        case 3:          
          sender.player.pause();
          //sender.tagSongsArray[index].img.src = sender.emptyPlayButton;// + "?r=" + sender.tagSongsArray[index].color.r + "&g=" + sender.tagSongsArray[index].color.g + "&b=" + sender.tagSongsArray[index].color.b;
          sender.tagSongsArray[index].img.style.backgroundImage = "url('" + sender.emptyPlayButton + "')";
          sender.tagSongsArray[index].img.style.backgroundPosition = '5px 5px';
        break;
        case 4:
          sender.player.playFile();
          //sender.tagSongsArray[index].img.src = sender.pauseButton;// + "?r=" + sender.tagSongsArray[index].color.r + "&g=" + sender.tagSongsArray[index].color.g + "&b=" + sender.tagSongsArray[index].color.b;
          sender.tagSongsArray[index].img.style.backgroundImage = "url('" + sender.pauseButton + "')"; 
          sender.tagSongsArray[index].img.style.backgroundPosition = '0px 1px'; 
        break;
      }
    }
  } 
  return playSong;
}

playerWeborama.prototype.getAdditionalColor = function(color)
{
  result = {r: 0, g: 0, b: 0};
  
  var d = 128;
  result.r = (color.r > 128) ? (color.r - d) : (color.r + d) ;
  result.g = (color.g > 128) ? (color.g - d) : (color.g + d) ;
  result.b = (color.b > 128) ? (color.b - d) : (color.b + d) ;
  
  return result;
}

playerWeborama.prototype.onProgress = function(filUrl, position)
{
  
  this.tagSongsArray[this.lastIndex].position = position;
           
  /*if (!this.tagSongsArray[this.lastIndex].songInfo.audio.duration)
  {
    var lengthArray = this.tagSongsArray[this.lastIndex].songInfo.audio.songLengthString.split(':');
    var length = 0;
    for (var i = 0; i < lengthArray.length; ++i)
    {
      length += Math.pow(60, lengthArray.length - 1 - i) * lengthArray[i] ;
    }
    this.tagSongsArray[this.lastIndex].songInfo.audio.songLength = length;
  }*/
    
  if (this.tagSongsArray[this.lastIndex].songInfo.duration != 0)
  {
    var width = Math.round(position/this.tagSongsArray[this.lastIndex].songInfo.duration*100);
    this.tagSongsArray[this.lastIndex].progress.style.width = Math.round( parseInt(this.tagSongsArray[this.lastIndex].progressBack.style.width) * width/100 ) + 'px';
    //this.tagSongsArray[this.lastIndex].progress.style.display = 'block';
  }
  else
  {
    this.tagSongsArray[this.lastIndex].progress.style.width = this.tagSongsArray[this.lastIndex].progressBack.style.width;
  }
}

playerWeborama.prototype.onBuffering = function(fileUrl, isBuffering)
{
  if (isBuffering)
  {
    this.tagSongsArray[this.lastIndex].progress.style.display = 'none';
    this.tagSongsArray[this.lastIndex].progressBack.style.display = 'none';
    this.buf.style.display = 'block';
  }
  else
  {
    this.tagSongsArray[this.lastIndex].progress.style.display = 'block';
    this.tagSongsArray[this.lastIndex].progressBack.style.display = 'block';
    this.buf.style.display = 'none'; 
  }
}

playerWeborama.prototype.onComplete = function()
{
  if (this.lastIndex != null)
  {
    this.tagSongsArray[this.lastIndex].progress.style.display = 'none';
    this.tagSongsArray[this.lastIndex].progressBack.style.display = 'none';
    this.tagSongsArray[this.lastIndex].position = null;
    //this.tagSongsArray[this.lastIndex].img.src = this.playButton;// + "?r=" + this.tagSongsArray[this.lastIndex].color.r + "&g=" + this.tagSongsArray[this.lastIndex].color.g + "&b=" + this.tagSongsArray[this.lastIndex].color.b;    
    //this.tagSongsArray[this.lastIndex].img.src = this.playButton;// + "?r=" + this.tagSongsArray[this.lastIndex].color.r + "&g=" + this.tagSongsArray[this.lastIndex].color.g + "&b=" + this.tagSongsArray[this.lastIndex].color.b;    
    this.tagSongsArray[this.lastIndex].img.style.backgroundImage = "url('" + sender.playButton + "')";
    this.tagSongsArray[this.lastIndex].img.style.backgroundPosition = '5px 5px';
    this.tagSongsArray[this.lastIndex].link.style.textDecoration  = this.tagSongsArray[this.lastIndex].decorationStyle;
  }
}

playerWeborama.prototype.onCompleteRequest = function(url, data, loadTime)
{
  if (url.indexOf(this.songInfoURL) != -1)  
  {
    var songInfo = eval('(' + data + ')');
    if (songInfo.trackList.length > 0)
    {
      songInfo = songInfo.trackList[0];
      
      for (var i = 0; i < this.tagSongsArray.length; ++i)
      {
        if (this.tagSongsArray[i].id != null)
        {
          if (this.tagSongsArray[i].id == songInfo.identifier)
          {
            this.tagSongsArray[i].songInfo = songInfo;
            break;
          }
        }
      }
      
    }
  }
  else if (url.indexOf(this.rewritesConverterURL) != -1)
  {
    var songInfo = eval('(' + data + ')');
    for (var i in songInfo) 
    {
      this.tagSongsArray[i].id = songInfo[i]; 
      this.httpRequest.queue.push({'url' : this.songInfoURL, 'parameters' : {'id' : this.tagSongsArray[i].id, type : 'audio', act : 'new'}, dummy : null, method : 'GET' }); 
    }
  }
  this.httpRequest.busy = false;
}

playerWeborama.prototype.getElementColor = function(element)
{
  var result = {r: 0, g: 0, b: 0};
  var colorText = '';
 
  if (this.ownerWindow.getComputedStyle)
  {
    colorText = document.defaultView.getComputedStyle(element, null).getPropertyValue('color');
  }
  else
  {
    colorText = element.currentStyle.color;
  }
  
  if (this.test1 == 0)
  {
    //alert(colorText);
  }
  
  var match1 = colorText.match(/^[a-z]*$/i);
  if (match1)
  {
    var stdColors = new Array();
    stdColors['black'] = {r: 0, g: 0, b: 0};
    stdColors['green'] = {r: 0, g: 128, b: 0};
    stdColors['silver'] = {r: 192, g: 192, b: 192};
    stdColors['lime'] = {r: 0, g: 255, b: 0};
    stdColors['gray'] = {r: 128, g: 128, b: 128};
    stdColors['olive'] = {r: 128, g: 128, b: 0};
    stdColors['white'] = {r: 255, g: 255, b: 255};
    stdColors['yellow'] = {r: 255, g: 255, b: 0};
    stdColors['maroon'] = {r: 128, g: 0, b: 0};
    stdColors['navy'] = {r: 0, g: 0, b: 128};
    stdColors['red'] = {r: 255, g: 0, b: 0};
    stdColors['blue'] = {r: 0, g: 0, b: 255};
    stdColors['purple'] = {r: 128, g: 0, b: 128};
    stdColors['teal'] = {r: 0, g: 128, b: 128};
    stdColors['fuchsia'] = {r: 255, g: 0, b: 255};
    stdColors['aqua'] = {r:0 , g: 255, b: 255};
    
    result = stdColors[match1[0].toLowerCase()];
  }

  var match2 = colorText.match(/^rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)$/i);
  if (match2)
  {
    result.r = parseInt(match2[1], 10);
    result.g = parseInt(match2[2], 10);
    result.b = parseInt(match2[3], 10);
  }
  
  var match3= colorText.match(/^#([a-f0-9]{1,2})([a-f0-9]{1,2})([a-f0-9]{1,2})$/i);
  if (match3)
  {
    result.r = parseInt( (match3[1].length == 1) ? match3[1]+match3[1] : match3[1] , 16);
    result.g = parseInt( (match3[2].length == 1) ? match3[2]+match3[2] : match3[2] , 16);
    result.b = parseInt( (match3[3].length == 1) ? match3[3]+match3[3] : match3[3] , 16);      
  }
  
  if (this.test1 == 0)
  {
    //alert(result.r + ' ' + result.g + ' ' + result.b);
    this.test1 = 1;  
  }
  
  return result;
}   

playerWeborama.prototype.getElementBackgroundColor = function(element)
{
  var result = {r: 0, g: 0, b: 0};
  var colorText = '';

  if (window.getComputedStyle)
  {
    colorText = document.defaultView.getComputedStyle(element, null).backgroundColor;
    //while (((colorText == 'transparent') || ((colorText == 'rgba(0, 0, 0, 0)'))) && (element != null))
    while (((colorText == 'transparent') || ((colorText == 'rgba(0, 0, 0, 0)'))) && element !== null)
    {
      colorText = document.defaultView.getComputedStyle(element, null).backgroundColor;
      element = element.parentNode;
      
      if (element.tagName.toLowerCase() == 'html')
      {
        element = null;
        break;
      }
    }
    
    if (element == null)
    {
      colorText = 'white';
    }
  }
  else
  {
    colorText = element.currentStyle.backgroundColor;
    while ((colorText == 'transparent') && (element != null))
    {
      colorText = element.currentStyle.backgroundColor;
      element = element.parentNode;
    }
    
    if (element == null)
    {
      colorText = 'white';
    }
    
  }
  
  var match1 = colorText.match(/^[a-z]*$/i);
  if (match1)
  {
    var stdColors = new Array();
    stdColors['black'] = {r: 0, g: 0, b: 0};
    stdColors['green'] = {r: 0, g: 128, b: 0};
    stdColors['silver'] = {r: 192, g: 192, b: 192};
    stdColors['lime'] = {r: 0, g: 255, b: 0};
    stdColors['gray'] = {r: 128, g: 128, b: 128};
    stdColors['olive'] = {r: 128, g: 128, b: 0};
    stdColors['white'] = {r: 255, g: 255, b: 255};
    stdColors['yellow'] = {r: 255, g: 255, b: 0};
    stdColors['maroon'] = {r: 128, g: 0, b: 0};
    stdColors['navy'] = {r: 0, g: 0, b: 128};
    stdColors['red'] = {r: 255, g: 0, b: 0};
    stdColors['blue'] = {r: 0, g: 0, b: 255};
    stdColors['purple'] = {r: 128, g: 0, b: 128};
    stdColors['teal'] = {r: 0, g: 128, b: 128};
    stdColors['fuchsia'] = {r: 255, g: 0, b: 255};
    stdColors['aqua'] = {r:0 , g: 255, b: 255};
    
    result = stdColors[match1[0].toLowerCase()];
  }

  var match2 = colorText.match(/^rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)$/i);
  if (match2)
  {
    result.r = parseInt(match2[1], 10);
    result.g = parseInt(match2[2], 10);
    result.b = parseInt(match2[3], 10);
  }
  
  var match3= colorText.match(/^#([a-f0-9]{1,2})([a-f0-9]{1,2})([a-f0-9]{1,2})$/i);
  if (match3)
  {
    result.r = parseInt( (match3[1].length == 1) ? match3[1]+match3[1] : match3[1] , 16);
    result.g = parseInt( (match3[2].length == 1) ? match3[2]+match3[2] : match3[2] , 16);
    result.b = parseInt( (match3[3].length == 1) ? match3[3]+match3[3] : match3[3] , 16);      
  }
  

  return result;
}


playerWeborama.prototype.tagSongsArray = new Array();
playerWeborama.prototype.test1 = 0;
playerWeborama.prototype.test2 = 0;
playerWeborama.prototype.TempTagIE = new Array();
playerWeborama.prototype.player = null;
playerWeborama.prototype.proxy = null;
playerWeborama.prototype.lastIndex = null;
playerWeborama.prototype.lastRequestIndex = null;                  
playerWeborama.prototype.songSearchURL = 'http://www.weborama.ru/modules/player/rp_songSearchJson.php';
playerWeborama.prototype.songInfoURL = 'http://www.weborama.ru/modules/player/index_json.php';
playerWeborama.prototype.playButton = 'http://www.weborama.ru/images/global/inline/play.gif';
playerWeborama.prototype.emptyPlayButton = 'http://www.weborama.ru/images/global/inline/empty-play.gif';
playerWeborama.prototype.pauseButton = 'http://www.weborama.ru/images/global/inline/pause.gif';
playerWeborama.prototype.wave = 'http://www.weborama.ru/temp/tagSong/wave.php';
playerWeborama.prototype.swfPlayer = 'http://www.weborama.ru/flash/hidden-player.swf';
playerWeborama.prototype.swfProxy = 'http://www.weborama.ru/flash/hidden-proxy.swf';
playerWeborama.prototype.flashVersion = 9;
//playerWeborama.prototype.progressLineColor1 = '#0030d1';
//playerWeborama.prototype.progressLineColor2 = '#b3c2f0';
playerWeborama.prototype.objName = 'playerWeboramaObj';
playerWeborama.prototype.zIndex = 1000;

playerWeborama.prototype.idRegExp = new RegExp('weborama.ru.*music\\/\\d*\\/\\d*\\/([a-f0-9]{32})', 'i');
playerWeborama.prototype.textRegExp = new RegExp('weborama.ru.*music\\/([^\\/]+\\/[^\\/]+\\/[^\\/]+)\\/?', 'i');

playerWeborama.prototype.songIdentifiers = {};
playerWeborama.prototype.rewritesConverterURL = 'http://www.weborama.ru/modules/global/rp/convert_rewrite_song.php';

var aWindow = (typeof unsafeWindow != 'undefined') ? unsafeWindow : window;

if (!aWindow.hasWeboramaPlayer) 
{
  aWindow.playerWeboramaObj = new playerWeborama(aWindow);
  aWindow.playerWeboramaObj.addEvent(aWindow, 'load', aWindow.playerWeboramaObj.load);
  aWindow.hasWeboramaPlayer = true;
}