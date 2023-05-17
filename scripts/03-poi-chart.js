
export function createPoiChart() {
  // Inject CSS
  const css = `
   html, body {
    width: 100vw; 
    height: 100vh; 
    margin: 0;
    padding: 0;
  }
  #container {
    width: 100%;
    height: 100%;
    margin: 0; 
    padding: 0; 
  }
  .anychart-credits { 
    display: none !important; 
  }
  `;
  
 
const style = document.createElement("style");
style.innerHTML = css;
document.head.appendChild(style);

const container = document.createElement("div");
container.id = "container";
container.style.width = "800px"; // Increase the width of the container
container.style.height = "800px"; // Increase the height of the container
document.body.appendChild(container);


  // Create chart
  const chart = anychart.polar();

  // Setup chart configuration
  chart.width("100%"); // Increase the width of the chart
  chart.height("100%"); // Increase the height of the chart
  chart.startAngle(-27);
  chart.innerRadius("10%");
  chart.yScale().minimum(0).maximum(10);
  chart.xScale("ordinal");
  chart.xScale().names("name");
  chart.sortPointsByX(true);
  chart.interactivity().hoverMode("single");
  chart.tooltip().displayMode("union");
  chart.tooltip().titleFormat("{%name}");
  chart.yAxis(false);
  chart
    .xAxis()
    .labels()
    .padding(7)
    .fontSize(10)
    .hAlign("center")
    .wordWrap("normal");
  chart.xAxis().fill("rgb(237, 236, 239)").stroke("none");
  chart.xAxis().ticks().length("100%");

  // Create polygon series
  const dataSet = anychart.data.set([
    { name: "Mobility", applicant: 5 },
    { name: "Commerce", applicant: 5 },
    { name: "Healthcare", applicant: 7 },
    { name: "Education", applicant: 7 },
    { name: "Entertainment", applicant: 10 },
  ]);
  const polygonSeries = chart.polygon(
    dataSet.mapAs({ x: "x", value: "applicant" })
  );
  polygonSeries.name("Applicant");
  polygonSeries.color("#CD4A2D");
  polygonSeries.fill("rgba(180, 180, 180, 0.3)");
  polygonSeries.zIndex(31);
  polygonSeries
    .labels()
    .enabled(true)
    .fontColor("#CD4A2D")
    .fontSize(11)
    .fontWeight("bold");
  polygonSeries
    .legendItem()
    .iconFill("#CD4A2D")
    .iconType("line")
    .iconStroke("6 #CD4A2D");
  // Create range column series
  const companySeries = chart.rangeColumn(
    dataSet.mapAs({ x: "x", high: "company_high", low: "company_low" })
  );
  companySeries.pointWidth("85%");
  companySeries.name("Company average");
  companySeries.color("#E2DFE0");

  // Set chart container id
  chart.container("container");

  // Make even/odd xAxis labels coloring
  chart.listen("chartDraw", function () {
    const stage = chart.container().getStage();
    stage.suspend();
    const count = chart.xAxis().labels().getLabelsCount();
    for (let i = 0; i < count; i++) {
      const color = i % 2 ? "#CD4A2D" : "#4C4C4C";
      const label = chart.xAxis().labels().getLabel(i);
      if (label) {
        label.fontColor(color);
        label.draw();
      }
    }
    stage.resume();
  });

  // Initiate chart drawing
  chart.draw();

  // Return the created chart instance
  return chart;
}
