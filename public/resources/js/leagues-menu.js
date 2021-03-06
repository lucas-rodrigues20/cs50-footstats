var leaguesMenu = (function () {

    var $leagues = $('.leagues');
    var $competitionId = $('#competitionId');

    $leagues.on('change', redirect);
    $leagues.on('leagues:loaded', selectCurrentLeague);

    function selectCurrentLeague(event) {

        if ($competitionId.length > 0 && _isValidOption($competitionId.val()) > 0) {
                $leagues.val($competitionId.val());
        }

        function _isValidOption(id) {
            var option = $leagues.find(`option[value=${id}]`);
            return option.length > 0;
        }
    }


    function redirect(event) {

        var $this = $(this);
        var url = `${window.location.origin}/league/${$this.val()}`;

        $(location).attr('href', url);
    }

    function populateMenu(data) {

        data.forEach(league => {
            $leagues.append(`
                <option value="${league.id}">${league.caption}</option>
            `);
        });
    }

    function init() {

        $.getJSON('/leagues')
            .done(populateMenu)
            .fail(err => console.error(err))
            .always(() => $leagues.trigger('leagues:loaded'));
    }

    return {
        init: init
    };

})();

leaguesMenu.init();
