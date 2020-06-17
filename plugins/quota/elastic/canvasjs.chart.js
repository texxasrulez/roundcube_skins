function drawDiskQuota() {

    var decimalPoint = '.';

    var isCommaAsDecimalPoint = function(str) {
        var matches = str.match(/,/g);

        return matches ? matches.length === 1 : false;
    };

    var getInnerNumberStringById = function(eleId) {
        var text = document.getElementById(eleId).innerHTML;

        // some country use comma as the decimal point
        if (isCommaAsDecimalPoint(text)) {
            decimalPoint = ',';
            text = text.replace(',', '.');
        } else {
            text = text.replace(/,/g, '');
        }

        return text;
    };

    var quotaUsedPercents = getInnerNumberStringById('quotaUsedPercents');
    var quotaFreePercents = getInnerNumberStringById('quotaFreePercents');
    var labelUsedSpace = getInnerNumberStringById('labelUsedSpace');
    var labelFreeSpace = getInnerNumberStringById('labelFreeSpace');

    var chart = new CanvasJS.Chart('chartContainer', {
        animationEnabled: true,
        title: {
            text: plugin_quota_chartTitle
        },
        data: [{
            type: 'pie',
            startAngle: 275,
            yValueFormatString: decimalPoint === '.' ? '##0.00"%"' : '##0,00"%"',
            indexLabel: '{label} {y}',
            dataPoints: [
                {y: quotaUsedPercents, label: labelUsedSpace, color: 'rgb(3,71,91)'},
                {y: quotaFreePercents, label: labelFreeSpace, color: 'rgb(199,227,239)'}
            ]
        }]
    });

    chart.render();

}
