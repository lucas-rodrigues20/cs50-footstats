var league = (function() {

    var competitionId = $('#competitionId').val();

    var leagueInfo;
    var currRound;
    var $document = $(document);
    var $ctrlButtons = $('.ctrl-btns');
    var $currRound = $('#current-round');

    var $chart = $("svg");
    var aspect = $chart.width() / $chart.height();
    var chartContainer = $chart.parent();

    $(window).on("resize", function() {
        var targetWidth = chartContainer.width();
        $chart.attr("width", targetWidth);
        $chart.attr("height", Math.round(targetWidth / aspect));
    }).trigger("resize");


    $document.on('d3:draw-chart', (event, matchday) => {
    
        d3.json(`/league/${competitionId}/table?matchday=${matchday}`, (err, data) => {

            if (err) {
                console.error(err);
                return;
            }

            data.standing = data.standing.map((curr, index) => {
                curr.position = index + 1;
                return curr;
            });

            d3Draw.drawChart(data);
        });

    });

    $ctrlButtons.on('click', 'button[data-action]', event => {

        var $btn = $(event.currentTarget);

        if ($btn.data('action') === 'prev' && currRound > 1) {
            updateChart(--currRound);
            renderCtrlButtons();
            
            return;
        }

        if ($btn.data('action') === 'next' && currRound < leagueInfo.matchday) {
            updateChart(++currRound);
            renderCtrlButtons();
            
            return;
        }

    });

    function updateChart(matchday) {
        $document.trigger('d3:draw-chart', [matchday]);
    }

    function setLeagueInfo(data) {
        leagueInfo = data;
        currRound = leagueInfo.matchday;
        renderCtrlButtons();
    }

    function renderCtrlButtons() {
        $ctrlButtons.removeClass('hidden');
        $currRound.text(currRound);

        var $prev = $('button[data-action=prev]');
        var $next = $('button[data-action=next]');
        
        currRound > 1 ? $prev.removeClass('hidden') : $prev.addClass('hidden');
        currRound < leagueInfo.matchday ? $next.removeClass('hidden') : $next.addClass('hidden');

    }

    function init() {

        d3.json(`/league/${competitionId}/table`, (err, data) => {

            if (err) {
                console.error(err);
                return;
            }

            setLeagueInfo(data);
            leagueTable.render(data);
            d3Draw.drawChart(data);

        });
    }

    return {
        init: init
    };

})();

league.init();
