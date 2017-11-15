var leagueTable = (function() {

    var $target = $('.league-table');
    var $tableTemplate = $('#league-table-template');
    
    function render(data) {
        var src = $tableTemplate.html();
        var template = Handlebars.compile(src);

        $target.html(template(data));
    };

    return {
        render: render
    };

})();
