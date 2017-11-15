var league = (function() {

    var competitionId = $('#competitionId').val();

    function init() {

        d3.json(`/league/${competitionId}/table`, (err, data) => {

            if (err) {
                console.error(err);
                return;
            }

            leagueTable.render(data);

        });
    }

    return {
        init: init
    };

})();

league.init();
