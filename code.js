async function runD3Async() {
    const heatData = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
        .then(res => res.json())
        .catch(err => console.log(err))

    const colorRange = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const colorRGB = [
        'rgb(49, 54, 149)',
        'rgb(69, 117, 180)',
        'rgb(116, 173, 209)',
        'rgb(171, 217, 233)',
        'rgb(224, 243, 248)',
        'rgb(255, 255, 191)',
        'rgb(254, 224, 144)',
        'rgb(253, 174, 97)',
        'rgb(244, 109, 67)',
        'rgb(215, 48, 39)',
        'rgb(165, 0, 38)',
    ]

    const svgWidth = 1450;
    const svgHeight = 620;
    const padding = 150;

    const svg = d3.select('#graph')
        .append('svg')
        .attr('id', 'heat-map')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .style('background-color', 'white')

    const monthsLabel = svg.append('g')
        .attr('transform', 'translate(100,100)')
        .text('Hello')

    const legendScale = d3.scaleOrdinal()
        .range([0, 30, 60, 90, 120, 150, 180, 210, 240, 270])

    const legendAxis = d3.axisBottom(legendScale).tickValues([2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8])

    const legend = svg.append('g')
        .attr('id', 'legend')
        .attr('x', padding)
        .attr('y', svgHeight + 75)
        .attr('width', 330)
        .attr('height', 20)
        .attr('transform', `translate(${padding}, ${svgHeight - 75})`)

    legend.selectAll('rect')
        .data(colorRange)
        .enter()
        .append('rect')
        .attr('width', 30)
        .attr('height', 20)
        .attr('x', (d, i) => {
            return i * 30;
        })
        .style('fill', (d) => {
            if (d > 0 && d <= colorRGB.length) {
                return colorRGB[d - 1];
            }
        })

    legend.append('g')
        .attr('transform', 'translate(30,20)')
        .call(legendAxis)

    const xScale = d3.scaleLinear()
        .domain([1753, 2016])
        .range([padding, svgWidth - 50])

    const months = ["January", 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const yScale = d3.scaleOrdinal()
        .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13])
        .range([50, 85, 120, 155, 190, 225, 260, 295, 330, 365, 400, 435, 470])

    svg.selectAll('rect')
        .data(heatData.monthlyVariance)
        .enter()
        .append('rect')
        .attr('height', 35)
        .attr('width', 5)
        .attr('class', 'cell')
        .attr('x', (d) => {
            return xScale(d.year);
        })
        .attr('y', (d) => {
            return yScale(d.month);
        })
        .attr('data-month', (d) => {
            return d.month - 1;
        })
        .attr('data-year', (d) => {
            return d.year;
        })
        .attr('data-temp', (d) => {
            return (8.66 + d.variance).toFixed(2);
        })
        .attr('data-diff-temp', (d) => {
            return d.variance;
        })
        .attr('fill', (d) => {
            const temp = 8.66 + d.variance;
            if (temp < 2.7) {
                return 'rgb(49, 54, 149)';
            }
            if (temp > 2.7 && temp <= 3.8) {
                return 'rgb(69, 117, 180)';
            }
            if (temp > 3.8 && temp <= 5) {
                return 'rgb(116, 173, 209)';
            }
            if (temp > 5 && temp <= 6.1) {
                return 'rgb(171, 217, 233)';
            }
            if (temp > 6.1 && temp <= 7.2) {
                return 'rgb(224, 243, 248)';
            }
            if (temp > 7.2 && temp <= 8.3) {
                return 'rgb(255, 255, 191)';
            }
            if (temp > 8.3 && temp <= 9.5) {
                return 'rgb(254, 224, 144)';
            }
            if (temp > 9.5 && temp <= 10.6) {
                return 'rgb(253, 174, 97)';
            }
            if (temp > 10.6 && temp <= 11.7) {
                return 'rgb(244, 109, 67)';
            }
            if (temp > 11.7 && temp <= 12.8) {
                return 'rgb(215, 48, 39)';
            }
            if (temp > 12.8) {
                return 'rgb(165, 0, 38)';
            }
        })
        .on('mouseover', (e, d) => {
            const tempData = d;

            const getMonth = (tempData) => {
                if (tempData.month >= 1 && tempData.month <= 12) {
                    return months[tempData.month - 1];
                }
            }
            const currentMonth = getMonth(tempData);

            d3.select('#tooltip')
                .attr('data-month', tempData.month - 1)
                .attr('data-year', tempData.year)
                .attr('data-temp', (8.66 + d.variance).toFixed(2))
                .attr('data-diff-temp', tempData.variance)
                .style('visibility', 'visible')
                .style('left', () => {
                    return e.pageX + 'px';
                })
                .style('top', () => {
                    return e.pageY + 'px';
                })

            d3.select('#tooltipyearmonth')
                .text(`${tempData.year} -${currentMonth}`)

            d3.select('#tooltiptemp')
                .text(`AVG ${(tempData.variance + 8.66).toFixed(2)}\xB0C`)

            d3.select('#tooltipdiff')
                .text(`VARIANCE ${tempData.variance}\xB0C`)
        })
        .on('mouseout', () => {
            d3.select('#tooltip')
                .style('visibility', 'hidden')
        })

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));

    svg.append('g')
        .attr('transform', `translate(0, ${svgHeight - padding})`)
        .attr('id', 'x-axis')
        .call(xAxis)


    const yAxis = d3.axisLeft(yScale)
        .tickValues(months)

    svg.append('g')
        .attr('transform', `translate(${padding}, 0)`)
        .attr('id', 'y-axis')
        .call(yAxis)

    const tooltip = d3.select('#graph')
        .append('div')
        .attr('id', 'tooltip')
        .attr('width', '150px')
        .attr('height', '120px')
        .style('opacity', .85)
        .style('visibility', 'hidden')
        .style('z-index', 1)
        .style('flex-direction', 'column')
        .style('align-items', 'center')
        .style('position', 'absolute')
        .style('border-radius', '5px')
        .style('padding', '5px')
        .style('text-align', 'center')
        .attr('class', 'car-tooltip')


    const tooltipYearMonth = d3.select('#tooltip')
        .append('div')
        .attr('id', 'tooltipyearmonth')
        .attr('width', '150px')
        .attr('height', '40px')

    const tooltipTemp = d3.select('#tooltip')
        .append('div')
        .attr('id', 'tooltiptemp')
        .attr('width', '150px')
        .attr('height', '40px')

    const tooltipDiff = d3.select('#tooltip')
        .append('div')
        .attr('id', 'tooltipdiff')
        .attr('width', '150px')
        .attr('height', '40px')

}
runD3Async();