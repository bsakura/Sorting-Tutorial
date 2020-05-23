function reset() {
    unsortedArray = [...array];
    sortedArray = [];
    stop = false;

    d3.select("#counter").html(steps = 0)

    labels.attr("class", "")
        .transition().duration(20)
        .attr("transform", function (d, i) { return "translate(" + (x(i)) + ", 0)" })

    rects.attr("class", "")
        .transition().duration(20)
        .attr("transform", function (d, i) { return "translate(" + (x(i - 1)) + ", 0)" })
}

function bubbleSort() {
    var sortedCount = 0;

    function sortPass(i) {

        if (!unsortedArray.length || stop) return stop = false

        if (i <= unsortedArray.length) {
            if (unsortedArray[i] < unsortedArray[i - 1]) {

                d3.select("#rect" + unsortedArray[i]).attr("class", "testing")
                d3.select("#rect" + unsortedArray[i - 1]).attr("class", "testing")

                d3.timeout(function () {
                    d3.select("#rect" + unsortedArray[i]).attr("class", "")
                    d3.select("#rect" + unsortedArray[i - 1]).attr("class", "")
                }, durationTime);

                var temp = unsortedArray[i - 1];
                unsortedArray[i - 1] = unsortedArray[i];
                unsortedArray[i] = temp;

                slide(unsortedArray[i], i + sortedArray);
                slide(unsortedArray[i - 1], i - 1 + sortedArray);

                d3.select("#counter").html(++steps);

                d3.timeout(function () { return sortPass(++i) }, durationTime);

            } else if (i == unsortedArray.length) {

                for (n = i; n == unsortedArray[n - 1]; n--) {
                    d3.select("#text" + n).attr("class", "sorted")
                    unsortedArray.pop();
                }

                sortPass(++i);
            } else {
                sortPass(++i);
            }

        } else {
            bubbleSort();
        }
    }
    sortPass(1);
}

function mergeSort() {
    var mergeReps = (unsortedArray.length).toString(2).length + 1;
    var mergeArrays = [[...unsortedArray], []];

    for (i = 0; i < unsortedArray.length; i += 2) {
        mergeArrays[1].push(mergeTwo([unsortedArray[i]], [unsortedArray[i + 1]]))
    }
    for (n = 2; n < mergeReps; n++) {
        mergeArrays[n] = [];
        var unMerged = mergeArrays[n - 1];
        for (i = 0; i < unMerged.length; i += 2) {
            mergeArrays[n].push(mergeTwo(unMerged[i], unMerged[i + 1] ? unMerged[i + 1] : []))
        }
    }
    for (i = 1; i < mergeArrays.length; i++) {
        mergeArrays[i] = d3.merge(mergeArrays[i])
    }
    mergeMove(0);

    function mergeTwo(iArray, nArray) {
        var newArray = [];
        for (var i = 0, n = 0; i < iArray.length || n < nArray.length;) {
            if (iArray[i] < nArray[n]) {
                newArray.push(iArray[i++])
            } else if (iArray[i] > nArray[n]) {
                newArray.push(nArray[n++])
            } else if (!(iArray[i])) {
                newArray.push(nArray[n++])
            } else if (!(nArray[n])) {
                newArray.push(iArray[i++])
            }
        }
        return newArray;
    }

    function mergeMove(j) {

        var oldArray = mergeArrays[j],
            newArray = [...mergeArrays[j + 1]],
            sortedArray = [];

        moveStep(0);

        function moveStep(n) {
            if (stop) return stop = false;
            d3.selectAll("rect").attr("class", "")

            d3.select("#counter").html(++steps);
            d3.select("#rect" + newArray[n]).attr("class", "testing")

            sortedArray.push(newArray[n])
            oldArray.shift()

            rects.transition().duration(durationTime)
                .attr("transform", function (d) {
                    var xVal = sortedArray.indexOf(d) > -1 ? sortedArray.indexOf(d) : oldArray.indexOf(d) + sortedArray.length;
                    return "translate(" + x(xVal - 1) + ",0)"
                })

            labels
                .classed("sorted", function (d) {
                    return !mergeArrays[j + 2] && sortedArray.indexOf(d) == d - 1;
                })
                .transition().duration(durationTime)
                .attr("transform", function (d) {
                    var xVal = sortedArray.indexOf(d) > -1 ? sortedArray.indexOf(d) : oldArray.indexOf(d) + sortedArray.length;
                    return "translate(" + x(xVal) + ",0)"
                })

            d3.timeout(function () {
                if (oldArray.length > 0) {
                    moveStep(++n)
                } else if (mergeArrays[j + 2]) {
                    mergeMove(++j)
                } else {
                    rects.classed("testing", false)
                }
            }, durationTime);
        }
    }
}

function slide(d, i) {
    d3.select("#text" + d)
        .transition().duration(durationTime)
        .attr("transform", function (d) { return "translate(" + (x(i)) + ", 0)" })

    d3.select("#rect" + d)
        .transition().duration(durationTime)
        .attr("transform", function (d) { return "translate(" + (x(i - 1)) + ", 0)" })
}

function myFunction() {
    var myContent = document.getElementById("myContent");
    while (myContent.firstChild) {
        myContent.lastChild.remove();
    }

    num = Number(document.getElementById("n").value);
    el = document.getElementById("elm").value;
    elarray = el.split(",").map(v => Number(v));

    count = 1 + num;
    durationTime = 20000 / count;
    array = elarray;
    unsortedArray = [...array];
    sortedArray = [];
    stop = false;
    steps = 0;
    margin = { top: 40, right: 40, bottom: 180, left: 40 };
    width = 500 - margin.left - margin.right;
    height = 3000 - margin.top - margin.bottom;

    barWidth = width / count;

    x = d3.scaleLinear()
        .domain([0, count])
        .range([0, width]);

    svg = d3.select("#myContent").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    rects = svg.append("g")
        .attr("transform", "translate(" + barWidth + ",2)")
        .selectAll("rect")
        .data(unsortedArray)
        .enter().append("rect")

    labels = svg.selectAll("text")
        .data(unsortedArray)
        .enter().append("text")

    labels.attr("id", function (d) { return "text" + d })
        .attr("transform", function (d, i) { return "translate(" + x(i) + ",0)" })
        .html(function (d) { return d; })

    rects.attr("id", function (d) { return "rect" + d })
        .attr("transform", function (d, i) { return "translate(" + (x(i) - barWidth) + ",0)" })
        .attr("width", barWidth * .9)
        .attr("height", function (d) { return d * barWidth / 3 })

    reset();
}