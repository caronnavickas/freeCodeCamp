var SEARCH_TERM_ID = '#searchTerm';

function enableSearchButton() {
    $('#search').removeClass('disabled');
    $('#spinner').addClass('hide');
}

function generateColumn(cardContent, cardLink, cardTitle, i) {
    var outputColumn = `
    <div class="col s12 m4">
        <div class="card">
            <div class="card-image">
                <a href="${cardLink}" target="_blank" alt=${cardTitle.toLowerCase()}><img id='image${i}' src=""></a>
                <span class="card-title">${cardTitle}</span>
            </div>
            <div class="card-content">
                <p>${cardContent}</p>
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

function doSearch() {
    var searchTerm = $(SEARCH_TERM_ID).val();
    var isValidSearch = IsValidSearch(searchTerm);

    if (isValidSearch) {
        // Control UI
        $('#search').addClass('disabled');
        $('#spinner').removeClass('hide');
        $("#output").html(""); // clear content from earlier searches

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
                console.log('do we have data? ', data);
                $("#output").html(""); // clears out contents from earlier searched
                $("#output").append("<h5>Click to open in Wikipedia:</h5>")

                var c = 0;
                var cards = '';
                var card = '';
                for (var i = 0; i < data[1].length; i++) {
                    var cardContent = data[2][i];
                    var cardLink = data[3][i];
                    var cardTitle = data[1][i];

                    card = `${generateColumn(cardContent, cardLink, cardTitle, i)}`;
                    cards = `${cards}${card}`;
                    c++;

                    if (c === 3) {
                        $('#output').append(
                            `<div class="row">
                                ${cards}
                            </div>`
                        );
                        cards = '';
                        c = 0;
                    }
                }

                $.ajax({
                    url: buildApiDetail,
                    method: "GET",
                    dataType: "jsonp",
                    success: function (data) {
                        for (var i = 0; i < data.query.pages.length; i++) {
                            if (data.query.pages[i].hasOwnProperty("thumbnail")) {
                                //     $("#image" + (data.query.pages[i].index - 1)).html(`src='${data.query.pages[i].thumbnail.source}' class='responsive-img valign'>`);
                                $("#image" + (data.query.pages[i].index - 1)).attr('src', data.query.pages[i].thumbnail.source);
                            } else {
                                // $("#image" + (data.query.pages[i].index - 1)).html("<img src='https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Article_icon_cropped.svg/512px-Article_icon_cropped.svg.png' class='responsive-img valign articleIcon'>");
                                $("#image" + (data.query.pages[i].index - 1)).attr('src', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Article_icon_cropped.svg/512px-Article_icon_cropped.svg.png');
                            }
                        }
                    },
                    error: function () {
                        console.log("second call unsuccessful");
                    }
                })

                // Control UI
                enableSearchButton();
            },
            error: function (err) {
                console.error("error: ", err);
                enableSearchButton();
            }
        });
    } else {
        // TODO: what to do if the search term is invalid
    }
}

$(document).ready(function () {
    // TODO: make sure search works on pressing ENTER key (use key up (not keypress or key down))
    $(SEARCH_TERM_ID).on('keyup', function (e) {
        onKeyUp(e);
    });

    $('#search').click(function () {
        doSearch();
    });

});