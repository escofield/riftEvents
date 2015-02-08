# CoffeeScript   
Number.prototype.toHHMMSS = ->
    seconds = Math.floor(this)
    hours = Math.floor(seconds / 3600)
    seconds -= hours*3600;
    minutes = Math.floor(seconds / 60);
    seconds -= minutes*60;

    if (hours   < 10) 
        hours   = "0" + hours
    if (minutes < 10)
        minutes = "0"  +minutes
    if (seconds < 10)
        seconds = "0" + seconds
    
    hours+':'+minutes+':'+seconds;

class @RiftEvents
    shards = [
                { name:"Seastone", id:1701 },
                { name:"Greybriar", id:1702 },
                { name:"Deepwood", id:1704 },
                { name:"Wolfsbane", id:1706 },
                { name:"Faeblight", id:1707 },
                { name:"Laethys", id:1708 },
                { name:"Hailol", id:1721}
            ]
                
    constructor: ->
        @Fetch()

    AddEvent:(event, time, shard) -> 
        id = "#{shard}_#{event.zoneId}"
        if $("##{id}")?
            $("##{id} > li.time").text((time - event.started).toHHMMSS)
        else
            li = $('<li>')
            li.attr('id',id)
            ul = $('<ul>')            
            $.data(ul,'time',event.started)
            $.data(ul,'zoneId',event.zoneId)
            ul.append ($('<li>').addClass("zone").text(event.zone))
            ul.append ($('<li>').addClass("shard").text(shard))
            ul.append ($('<li>').addClass("name").text(event.name))
            ul.append ($('<li>').addClass("time").text((time - event.started).toHHMMSS))
            li.append ul
            $('#zoneEvents').append(ul).sort (a,b) ->
                $.data(a,'time') - $.data(b,'time')
    
    RemoveEvent: (event, shard) ->
    
    
    Fetch: ->
        $.ajax
            url: "http://chat-us.riftgame.com:8080/chatservice/time"
            dataType: "json"

            always: (time, status, jqXHR) ->
                $.each shards, (index, value) ->
                    $.ajax
                        url: "http://chat-us.riftgame.com:8080/chatservice/zoneevent/list?shardId=#{value.id}"
                        dataType: "json"
                        fail: (jqXHR, status, error) ->
                        done: (chatService, status, jqXHR) ->      
                            if chatService.status == "success" 
                                @AddEvent event, time, value.id for event in chatService.data when event.name?

                                
$ ->
    window.events = new RiftEvents                                