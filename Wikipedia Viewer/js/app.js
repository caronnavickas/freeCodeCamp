var SEARCH_TERM_ID = '#searchTerm';

function randomSearch() {
    window.open('https://en.wikipedia.org/wiki/Special:Random', '_blank');
}

function showSearchButton() {
    $('#search').removeClass('hide');
}

function hideSpinner() {
    $('#spinner').addClass('hide');
}

function showClearButton() {
    $('#clear').removeClass('hide');
}

function hideClearButton() {
    $('#clear').addClass('hide');
}

function clearSearch() {
    $(SEARCH_TERM_ID).val('');
    $('#output').html('');
}

function truncate(string, maxAllowed) {
    var ellipsis = '&#x02026;';
    var newString = string.trim();

    if (newString.length > maxAllowed) {
        newString = `${newString.substr(0, maxAllowed - 3).trim()}${ellipsis}`;
    }

    return newString;
}

function generateColumn(cardContent, cardLink, cardTitle, i) {
    var truncatedCardContent = truncate(cardContent, 120);
    var defaultImage = 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Hourglass_%28PSF%29.png';

    // attribution
    //  <a title="By Pearson Scott Foresman [Public domain], via Wikimedia Commons" href="https://commons.wikimedia.org/wiki/File:Hourglass_(PSF).png"><img width="512" alt="Hourglass (PSF)" src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Hourglass_%28PSF%29.png/512px-Hourglass_%28PSF%29.png"></a>

    var outputColumn = `
    <div class="col s12 m4">
        <div class="card">
            <div class="card-image">
                <a href="${cardLink}" target="_blank" alt=${cardTitle.toLowerCase()}>
                    <img id='image${i}' class="centered-and-cropped" src="${defaultImage}">
                </a>
                <span class="card-title">${cardTitle}</span>
            </div>
            <div class="card-content">
                <p>${truncatedCardContent}</p>
            </div>
            <div class="card-action">
                <a href="${cardLink}" target="_blank">Link To Article</a>
            </div>
        </div>
    </div>
`;

    return outputColumn;
}

function IsValidSearch(s) {
    var isValid = true;

    if (s === '') {
        isValid = false;
    }

    return isValid;
}

function onKeyUp(e) {
    if (e.which == 13) {
        e.preventDefault();
        doSearch();
    }
}

function outputCards(cards) {
    $('#output').append(`
        <div class="row">
            ${cards}
        </div>
    `);
}

function outputData(data, length) {
    var complete = false;
    var c = 0; // number of cards
    var card = '';
    var cards = '';
    var t = 3; // columns
    var l = length;
    var m = l % t; // m = modulo

    for (var i = 0; i < l; i++) { // i is index of data[]
        var cardContent = data[2][i];
        var cardLink = data[3][i];
        var cardTitle = data[1][i];

        card = `${generateColumn(cardContent, cardLink, cardTitle, i)}`;
        cards = `${cards}${card}`;
        c++;

        if (i < (l - m)) {
            if (c === t) {
                outputCards(cards);
                cards = '';
                c = 0;
            }
        } else {
            if (c === m) {
                outputCards(cards);
            }
        }
    }

    if (i === l) {
        complete = true;
    }

    return complete;
}

function outputThumbnails(url) {
    $.ajax({
        url: url,
        method: 'GET',
        dataType: 'jsonp',
        success: function (data) {
            for (var i = 0; i < data.query.pages.length; i++) {
                if (data.query.pages[i].hasOwnProperty('thumbnail')) {
                    $('#image' + (data.query.pages[i].index - 1)).attr('src', data.query.pages[i].thumbnail.source);
                } else {
                    $('#image' + (data.query.pages[i].index - 1)).attr('src', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Oldpapertexture02.jpg/128px-Oldpapertexture02.jpg');

                    // attribution
                    // <a title="By Smartscrutiny [CC BY-SA 4.0 
                    //     (https://creativecommons.org/licenses/by-sa/4.0
                    //    )], from Wikimedia Commons" href="https://commons.wikimedia.org/wiki/File:Oldpapertexture02.jpg"><img width="128" alt="Oldpapertexture02" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Oldpapertexture02.jpg/128px-Oldpapertexture02.jpg"></a>
                }
            }
        },
        error: function () {
            console.log('Unable to retrieve thumbnails.');
        }
    })
}

function doSearch() {
    var searchTerm = $(SEARCH_TERM_ID).val();
    var isValidSearch = IsValidSearch(searchTerm);

    if (isValidSearch) {
        // Control UI
        $('#search').addClass('hide');
        $('#spinner').removeClass('hide');
        $('#output').html(''); // clear content from earlier searches
        showClearButton();

        // Do Work
        var encodedSearchTerm = encodeURIComponent(searchTerm);
        var limit = 21;
        var paramsGeneral = [
            'action=opensearch',
            '&',
            'format=json',
            '&',
            `limit=${limit}
            &callback=?`
        ];
        var paramsDetail = [
            'action=query',
            '&',
            'format=json',
            '&',
            'prop=pageimages',
            '%7C',
            'pageterms',
            '&',
            'generator=prefixsearch',
            '&',
            'redirects=1',
            '&',
            'formatversion=2',
            '&',
            'piprop=thumbnail',
            '&',
            'pithumbsize=250',
            '&',
            `pilimit=${limit}`,
            '&',
            'wbptterms=description',
            '&',
            `gpslimit=${limit}`
        ];

        var searchGeneral = 'search=';
        var searchDetail = 'gpssearch=';

        var sUrl = 'https://en.wikipedia.org/w/api.php';
        var buildApiGeneral = `${sUrl}?${paramsGeneral.join('')}&${searchGeneral}${encodedSearchTerm}`;
        var buildApiDetail = `${sUrl}?${paramsDetail.join('')}&${searchDetail}${encodedSearchTerm}`;

        $.ajax({
            type: 'GET',
            url: buildApiGeneral,
            async: false,
            dataType: 'jsonp',
            contentType: 'application/javascript',
            success: function (data) {
                $('#output').html(''); // clears out contents from earlier searched

                var l = data[1].length;
                var hasDataCompleted = false;

                if (l > 0) {
                    $('#output').append("<h5>Click to open in Wikipedia:</h5>");
                    hasDataCompleted = outputData(data, l);
                    if (hasDataCompleted) {
                        outputThumbnails(buildApiDetail);
                    }
                } else {
                    $('#output').append('<p class="red-text text-darken-4">No data was returned from your search criteria. Please try again.</p>');
                }

                // Control UI
                hideSpinner();
            },
            error: function (err) {
                console.error('Error: ', err);
                // Control UI
                hideSpinner();
            }
        });
    } else {
        $('#output').html(''); // clears out contents from earlier searched
        $('#output').append('<p class="red-text text-darken-4">Enter a search term.</p>');
    }
}

$(document).ready(function () {
    $(`${SEARCH_TERM_ID}, #search`).keyup(function (event) {
        if (event.which == 13) {
            doSearch();
        }
    });

    $('#search').click(function () {
        doSearch();
    });

    $('#clear').click(function () {
        clearSearch();
        hideClearButton();
        showSearchButton();
    });

    $('#random').click(function () {
        randomSearch();
    });
});