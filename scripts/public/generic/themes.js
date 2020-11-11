(function(window) {
    var themeKeyword = 'PreferredTheme'
    var theme = localStorage.getItem(themeKeyword);

    if (theme != undefined)
    {
        if (theme == 'dark' || theme == 'light') {
            SetTheme(theme);
        } else {
            SetTheme('dark');
        }
    }
    else
    {
        SetTheme('dark');
    }

    function SetTheme(newTheme) {
        theme = newTheme;

        var themeClass = 'theme-' + newTheme;
        localStorage.setItem(themeKeyword, newTheme);

        $('html').removeClass('theme-dark');
        $('html').removeClass('theme-light');
        $('html').addClass(themeClass);

        $('#theme').attr('href', '/styles/bootstrap-' + newTheme + '.css');
    }

    window.ToggleTheme = function() {
        console.log(theme);

        var toggled = false;
        if (theme == 'dark' && !toggled)
        {
            toggled = true;
            SetTheme('light');
        }
        else if(!toggled)
        {
            toggled = true;
            SetTheme('dark');
        }
    }
})(window);