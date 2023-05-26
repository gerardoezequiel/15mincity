export function createPoiChart() {
  const chart = anychart.polar();

  // setup chart appearance settings
  chart.startAngle(-27);
  chart.innerRadius("10%");

  // setup chart scales settings
  chart.yScale().minimum(0).maximum(100);
  chart.yScale().ticks().interval(20);
  chart.xScale("ordinal");
  chart.xScale().names("Category");
  chart.sortPointsByX(true);

  // setup chart interactivity and tooltip settings
  chart.interactivity().hoverMode("single");
  chart.tooltip().displayMode("union");
  chart.tooltip().titleFormat("{%Category}");

  // setup chart axes and grid settings
  chart.yAxis().labels().format("{%Value}%");
  chart.yAxis().ticks().stroke("#ffffff");
  chart.yAxis().minorTicks().stroke("#ffffff");
  chart
    .xAxis()
    .labels()
    .padding(7)
    .fontSize(16)
    .fontWeight("bold")
    .hAlign("center")
    .wordWrap("normal")
    .textOverflow("...");
  chart.xAxis().fill("#E0E0E0").stroke("none");
  chart.xAxis().ticks().length("50%").stroke("rgba(89, 161, 79, 0.05)");

  // setup chart legend settings
  var legend = chart.legend();
  legend.enabled(true);
  legend.positionMode("outside");
  legend.itemsLayout("vertical");
  legend.position("bottom");
  legend.align("left");
  legend.margin().top(-30);
  legend.itemsSpacing(5);

  // create polygon series
  var dataSet5min = anychart.data.set([
    { Category: "Mobility", percentage: 57.692307692307686 },
    { Category: "Commerce", percentage: 7.6923076923076925 },
    { Category: "Healthcare", percentage: 0 },
    { Category: "Education", percentage: 34.61538461538461 },
    { Category: "Entertainment", percentage: 0 },
  ]);

  var dataSet10min = anychart.data.set([
    { Category: "Mobility", percentage: 62.28070175438597 },
    { Category: "Commerce", percentage: 14.912280701754385 },
    { Category: "Healthcare", percentage: 2.631578947368421 },
    { Category: "Education", percentage: 16.666666666666664 },
    { Category: "Entertainment", percentage: 3.508771929824561 },
  ]);

  var dataSet15min = anychart.data.set([
    { Category: "Mobility", percentage: 61.15702479338842 },
    { Category: "Commerce", percentage: 20.24793388429752 },
    { Category: "Healthcare", percentage: 4.545454545454546 },
    { Category: "Education", percentage: 10.330578512396695 },
    { Category: "Entertainment", percentage: 3.71900826446281 },
  ]);

  var polygonSeries5min = chart.polygon(
    dataSet5min.mapAs({ x: "Category", value: "percentage" })
  );
  polygonSeries5min.name("5min");
  polygonSeries5min.fill("rgba(89, 161, 79, 0.05)");
  polygonSeries5min.color("rgba(89, 161, 79, 0.8)");
  polygonSeries5min.zIndex(31);
  polygonSeries5min
    .labels()
    .enabled(false)
    .fontColor("#000")
    .fontSize(8)
    .fontWeight("bold")
    .format("{%Value}%")
    .textOverflow("...");
  polygonSeries5min
    .legendItem()
    .iconFill("rgba(89, 161, 79, 0.8)")
    .iconType("line")
    .iconStroke("6 rgba(89, 161, 79, 0.8)");

  var polygonSeries10min = chart.polygon(
    dataSet10min.mapAs({ x: "Category", value: "percentage" })
  );
  polygonSeries10min.name("10min");
  polygonSeries10min.fill("rgba(242, 142, 43, 0.05)");
  polygonSeries10min.color("rgba(242, 142, 43, 0.8)");
  polygonSeries10min.zIndex(31);
  polygonSeries10min
    .labels()
    .enabled(false)
    .fontColor("#000")
    .fontSize(8)
    .fontWeight("light")
    .format("{%Value}%")
    .textOverflow("...");
  polygonSeries10min
    .legendItem()
    .iconFill("rgba(242, 142, 43, 0.8)")
    .iconType("line")
    .iconStroke("6 rgba(242, 142, 43, 0.8)");

  var polygonSeries15min = chart.polygon(
    dataSet15min.mapAs({ x: "Category", value: "percentage" })
  );
  polygonSeries15min.name("15min");
  polygonSeries15min.fill("rgba(225, 87, 89, 0.05)");
  polygonSeries15min.color("rgba(225, 87, 89, 0.8)");
  polygonSeries15min.zIndex(31);
  polygonSeries15min
    .labels()
    .enabled(false)
    .fontColor("#000")
    .fontSize(8)
    .fontWeight("bold")
    .format("{%Value}%")
    .textOverflow("...");
  polygonSeries15min
    .legendItem()
    .iconFill("rgba(225, 87, 89, 0.8)")
    .iconType("line")
    .iconStroke("6 rgba(225, 87, 89, 0.8)");

  return chart;
}
