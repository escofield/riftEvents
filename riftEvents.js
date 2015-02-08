(function() {

  Number.prototype.toHHMMSS = function() {
    var hours, minutes, seconds;
    seconds = Math.floor(this);
    hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
  };

  this.RiftEvents = (function() {
    var shards;

    shards = [
      {
        name: "Seastone",
        id: 1701
      }, {
        name: "Greybriar",
        id: 1702
      }, {
        name: "Deepwood",
        id: 1704
      }, {
        name: "Wolfsbane",
        id: 1706
      }, {
        name: "Faeblight",
        id: 1707
      }, {
        name: "Laethys",
        id: 1708
      }, {
        name: "Hailol",
        id: 1721
      }
    ];

    function RiftEvents() {
      this.Fetch();
    }

    RiftEvents.prototype.AddEvent = function(event, time, shard) {
      var id, li, ul;
      id = "" + shard + "_" + event.zoneId;
      if ($("#" + id) != null) {
        return $("#" + id + " > li.time").text((time - event.started).toHHMMSS);
      } else {
        li = $('<li>');
        li.attr('id', id);
        ul = $('<ul>');
        $.data(ul, 'time', event.started);
        $.data(ul, 'zoneId', event.zoneId);
        ul.append($('<li>').addClass("zone").text(event.zone));
        ul.append($('<li>').addClass("shard").text(shard));
        ul.append($('<li>').addClass("name").text(event.name));
        ul.append($('<li>').addClass("time").text((time - event.started).toHHMMSS));
        li.append(ul);
        return $('#zoneEvents').append(ul).sort(function(a, b) {
          return $.data(a, 'time') - $.data(b, 'time');
        });
      }
    };

    RiftEvents.prototype.RemoveEvent = function(event, shard) {};

    RiftEvents.prototype.Fetch = function() {
      return $.ajax({
        url: "http://chat-us.riftgame.com:8080/chatservice/time",
        dataType: "json",
        always: function(time, status, jqXHR) {
          return $.each(shards, function(index, value) {
            return $.ajax({
              url: "http://chat-us.riftgame.com:8080/chatservice/zoneevent/list?shardId=" + value.id,
              dataType: "json",
              fail: function(jqXHR, status, error) {},
              done: function(chatService, status, jqXHR) {
                var event, _i, _len, _ref, _results;
                if (chatService.status === "success") {
                  _ref = chatService.data;
                  _results = [];
                  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    event = _ref[_i];
                    if (event.name != null) {
                      _results.push(this.AddEvent(event, time, value.id));
                    }
                  }
                  return _results;
                }
              }
            });
          });
        }
      });
    };

    return RiftEvents;

  })();

  $(function() {
    return window.events = new RiftEvents;
  });

}).call(this);
