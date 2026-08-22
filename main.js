(function() {
    var tableRotated = "<table id=\"table-rotated\"><thead><tr scope=\"row\"><th scope=\"col\">Column 1</th><th scope=\"col\">Column 2</th></tr></thead><tbody><tr><td>Data 1</td><td>Data 2</td></tr></tbody></table>";
    
    function renderMain() {
        var container = document.createElement('div');
        container.innerHTML = '<main>' + tableRotated + '</main>';
        return container.innerHTML;
    }
    
    function init() {
        var mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = '<main>' + tableRotated + '</main>';
        }
    }
    
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { renderMain: renderMain, init: init };
    }
    
    if (typeof window !== 'undefined') {
        window.renderMain = renderMain;
        window.init = init;
    }
})();