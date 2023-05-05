$(document).ready(function() {
    $('#check-btn').click(function() {
        let abstract = $('#input-abstract').val();

        if (!abstract.trim()) {
            error("Ievadiet anotāciju!")
        }
        else {
            $('.error').text('')

            $.ajax({
                url: 'https://f8bf-87-110-68-15.ngrok-free.app/',
                method: 'POST',
                data: abstract,
                beforeSend: function() {
                    $('#check-btn, #input-abstract').prop('disabled', true).css('opacity', 0.4);
                },
                success: function(response) {
                    response = JSON.parse(response)
                    console.log(response)
                    removeElementsWithClass('sentence')
                    let average = 0

                    for(let i = 0; i < response[0].length; i++) {
                        addSentence(i + 1, response[0][i], response[1][i])
                        average += parseFloat(response[1][i])
                    }

                    average = (average/response[0].length).toFixed(1)
                    $('#average-percentage').text(average + '%').css('color', getColorScale(average))
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    if (textStatus === 'error' && jqXHR.status === 0) {
                        error('Serveris ir bezsaistē.', true);
                    } else {
                        error('Nezināma kļūda.', true);
                    }
                },
                complete: function() {
                    $('#check-btn, #input-abstract').prop('disabled', false).css('opacity', 1);;
                }
            });
        }
    });

    function error(text, contact = false) {
        let errorContainer = $('.error')

        if (contact) {
            text = text + " Sazinieties ar lapas īpašnieku mariscinis@gmail.com"
        }

        errorContainer.text(text)
        errorContainer.fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    }

    function removeElementsWithClass(name) {
        var elements = document.getElementsByClassName(name);

        while (elements.length > 0) {
          elements[0].remove();
        }
    }

    function addSentence(index, sentence, percentage) {
        // Create a new row element with the Bootstrap class
        var row = $('<div class="row pt-2 sentence"></div>');

        // Create the first column with the index
        var indexCol = $('<div class="col-md-1 text-center">' + index + '</div>');

        // Create the second column with the sentence
        var sentenceCol = $('<div class="col-md-11" title="' + percentage + '%">' + sentence + '</div>');
        sentenceCol.css('color', getColorScale(percentage))

        // Add both columns to the row
        row.append(indexCol);
        row.append(sentenceCol);

        $('#sentences').append(row)
    }

    function getColorScale(percentage) {
        const colorStops = [
            { percent: 0, color: '#1ba21b' },
            { percent: 20, color: '#7FFF00' },
            { percent: 50, color: '#FFFF00' },
            { percent: 80, color: '#FF7F00' },
            { percent: 100, color: '#FF0000' }
        ];

        let color;
        for (let i = 1; i < colorStops.length; i++) {
            if (percentage <= colorStops[i].percent) {
                const prevStop = colorStops[i - 1];
                const nextStop = colorStops[i];
                const percentInRange = (percentage - prevStop.percent) / (nextStop.percent - prevStop.percent);
                const red = Math.floor(parseInt(prevStop.color.slice(1,3), 16) * (1 - percentInRange) + parseInt(nextStop.color.slice(1,3), 16) * percentInRange);
                const green = Math.floor(parseInt(prevStop.color.slice(3,5), 16) * (1 - percentInRange) + parseInt(nextStop.color.slice(3,5), 16) * percentInRange);
                const blue = Math.floor(parseInt(prevStop.color.slice(5,7), 16) * (1 - percentInRange) + parseInt(nextStop.color.slice(5,7), 16) * percentInRange);
                color = `rgb(${red}, ${green}, ${blue})`;
                break;
            }
        }

        return color;
    }

    var container = $('#color-scale')
    var width = container.width()

    function createColorScale() {
        for (var i = 0; i <= 100; i++) {
            var color = getColorScale(i);
            var el = $('<div class="scale-color">').css('background-color', color).css('width', container.width()/102);
            container.append(el);
        }
    }

    createColorScale()

    $(window).on('resize', function() {
        if(container.width() !== width) {
            width = container.width()
            removeElementsWithClass('scale-color')
            createColorScale()
        }
    });
});