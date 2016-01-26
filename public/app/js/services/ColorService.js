


MetronicApp.factory('optionService', function($http,settings) {
    // supported languages
    var colorService = this;

    this.colors = [
        'white',
        'default',
        'dark',
        'blue',
        'blue-madison',
        'blue-chambray',
        'blue-ebonyclay',
        'blue-hoki',
        'blue-steel',
        'blue-soft',
        'blue-dark',
        'blue-sharp',
        'green',
        'green-meadow',
        'green-seagreen',
        'green-turquoise',
        'green-haze',
        'green-jungle',
        'green-soft',
        'green-dark',
        'green-sharp',
        'grey',
        'grey-steel',
        'grey-cararra',
        'grey-gallery',
        'grey-cascade',
        'grey-silver',
        'grey-salsa',
        'grey-salt',
        'grey-mint',
        'red',
        'red-pink',
        'red-sunglo',
        'red-intense',
        'red-thunderbird',
        'red-flamingo',
        'red-soft',
        'red-haze',
        'red-mint',
        'yellow',
        'yellow-gold',
        'yellow-casablanca',
        'yellow-crusta',
        'yellow-lemon',
        'yellow-saffron',
        'yellow-soft',
        'yellow-haze',
        'yellow-mint',
        'purple',
        'purple-plum',
        'purple-medium',
        'purple-studio',
        'purple-wisteria',
        'purple-seance',
        'purple-intense',
        'purple-sharp',
        'purple-soft'
    ]
    
    this.randomColor = function(){
        return colorService.colors[parseInt(''+Math.random() * colorService.colors.length) % colorService.colors.length];  
    };

    this.icons = [
        'gratipay',
        'hacker-news',
        'houzz',
        'html5',
        'instagram',
        'internet-explorer',
        'ioxhost',
        'joomla',
        'jsfiddle',
        'lastfm',
        'lastfm-square',
        'leanpub',
        'linkedin',
        'linkedin-square',
        'linux',
        'maxcdn',
        'meanpath',
        'medium',
        'mixcloud',
        'modx',
        'odnoklassniki',
        'odnoklassniki-square',
        'opencart',
        'openid',
        'opera',
        'optin-monster',
        'pagelines',
        'paypal',
        'pied-piper',
        'pied-piper-alt',
        'pinterest',
        'pinterest-p'
    ];
    this.randomIcon = function(){
        return colorService.icons[parseInt(''+Math.random() * colorService.icons.length) % colorService.icons.length];  
    };

    return colorService;
});

