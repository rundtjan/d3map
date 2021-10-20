var width = 1000;
var height = 600;
var rotation = 0;
var globe;
var worldPicture;
var dots;
var world;
var data;
var zoom = 1;
var upp = 0;
var colors = ["red", "blue", "yellow", "green"];

function leftClick() {
  d3.event.preventDefault();
  rotation = rotation + 20;
  if (rotation == 200) {
    rotation = -160;
  } else if (rotation == -200) {
    rotation = 160;
  }
  var elem = d3.select(this).attr("stroke", "black");
  setTimeout(function () {
    elem.attr("stroke", "none");
  }, 300);
  draw();
}

function rightClick() {
  d3.event.preventDefault();
  rotation = rotation - 20;
  if (rotation == 200) {
    rotation = -160;
  } else if (rotation == -200) {
    rotation = 160;
  }
  var elem = d3.select(this).attr("stroke", "black");
  setTimeout(function () {
    elem.attr("stroke", "none");
  }, 300);
  draw();
}

function plusClick() {
  d3.event.preventDefault();
  if (zoom > 2.08) {
    return;
  }
  zoom = zoom * 1.2;
  console.log(zoom);
  projection.scale(orgScale * zoom);
  var elem = d3.select(this).attr("stroke", "black");
  setTimeout(function () {
    elem.attr("stroke", "none");
  }, 300);
  draw();
}

function minusClick() {
  d3.event.preventDefault();
  if (zoom == 1) {
    return;
  }
  zoom = zoom / 1.2;
  projection.scale(orgScale * zoom);
  var elem = d3.select(this).attr("stroke", "black");
  setTimeout(function () {
    elem.attr("stroke", "none");
  }, 300);
  draw();
}

function upClick() {
  if ((upp > 150 && zoom < 1.45) || upp > 350 || (zoom == 1 && upp == 0)) {
    return;
  }
  d3.event.preventDefault();
  upp = upp + 50;
  svg.attr("transform", "translate(0," + upp + ")");
  var elem = d3.select(this).attr("stroke", "black");
  setTimeout(function () {
    elem.attr("stroke", "none");
  }, 300);
  draw();
}

function downClick() {
  if ((upp < -150 && zoom < 1.45) || upp < -350 || (zoom == 1 && upp == 0)) {
    return;
  }
  d3.event.preventDefault();
  upp = upp - 50;
  svg.attr("transform", "translate(0," + upp + ")");
  var elem = d3.select(this).attr("stroke", "black");
  setTimeout(function () {
    elem.attr("stroke", "none");
  }, 300);
  draw();
}

function handleMouseover(d, i) {
  d3.select(this).attr("opacity", 0.2).attr("stroke", "black");
  console.log(d.properties);

  $("#DivToShow")
    .css({ top: d3.event.y, left: d3.event.x + 20 })
    .fadeIn();

  $("#textDiv").html(
    /*"Fall: " + d.properties.fall + "<br/>*/ "Id: " +
      d.properties.id +
      "<br/>Mass: " +
      d.properties.mass +
      "<br/>Name: " +
      d.properties.name +
      "<br/>Recclass: " +
      d.properties.recclass +
      "<br/>Year: " +
      d.properties.year.split("-")[0]
  );
}

function handleMouseout(d, i) {
  d3.select(this).attr("opacity", 0.5).attr("stroke", "none");

  $("#DivToShow").delay(1000).fadeOut(300);
}

var arrows = d3
  .select("body")
  .append("svg")
  .attr("height", "30")
  .attr("width", "140")
  .attr("id", "arrows");

var svg = d3
  .select("body")
  .append("svg")
  .attr("id", "bigOne")
  .attr("width", width)
  .attr("height", height)
  .append("g");

var leftG = arrows.append("g").attr("transform", "translate(0,0)");

var upG = arrows.append("g").attr("transform", "translate(40,0)");

var downG = arrows.append("g").attr("transform", "translate(40,20)");

var rightG = arrows.append("g").attr("transform", "translate(80,20)");

svg.attr("transform", "translate(0," + upp + ")");

var lineGenerator = d3.line();

var arrowP = [
  [0, 10],
  [10, 0],
  [10, 5],
  [20, 5],
  [20, 15],
  [10, 15],
  [10, 20],
  [0, 10],
];

var plusP = [
  [5, 0],
  [15, 0],
  [15, 5],
  [20, 5],
  [20, 15],
  [15, 15],
  [15, 20],
  [5, 20],
  [5, 15],
  [0, 15],
  [0, 5],
  [5, 5],
  [5, 0],
];

var minusP = [
  [0, 5],
  [20, 5],
  [20, 15],
  [0, 15],
  [0, 5],
];

var pointData = lineGenerator(arrowP);
var plusData = lineGenerator(plusP);
var minusData = lineGenerator(minusP);

function arrow(x, rotate) {
  var element = x;
  console.log(x);
  return element
    .append("path")
    .attr("d", pointData)
    .attr("transform", "rotate(" + rotate + ")")
    .attr("fill", "#ffc966")
    .on("click", leftClick);
}

var left = arrow(leftG, 0).on("click", leftClick);

var right = arrow(rightG, 180).on("click", rightClick);

var up = arrow(upG, 90).on("click", upClick);

var down = arrow(downG, -90).on("click", downClick);

var plus = arrows
  .append("path")
  .attr("d", plusData)
  .attr("transform", "translate(80, 0)")
  .attr("fill", "#ffc966")
  .on("click", plusClick);

var minus = arrows
  .append("path")
  .attr("d", minusData)
  .attr("transform", "translate(105, 0)")
  .attr("fill", "#ffc966")
  .on("click", minusClick);

var projection = d3
  .geoOrthographic()
  .scale(width / 3.5)
  //.scale(100)
  .translate([width / 2, height / 2.2]);

var orgScale = projection.scale();

var path = d3.geoPath().projection(projection);

var r = d3.scaleLinear().range([1, 70]);

var r2 = d3.scaleThreshold().range([2, 5, 10, 15, 20, 30]);

var url = "https://enjalot.github.io/wwsd/data/world/world-110m.geojson";

var url2 =
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json";

d3.json(url, function (err, geojson) {
  world = geojson;

  d3.json(url2, function (err, geojson) {
    data = geojson.features.sort(function (a, b) {
      return +b.properties.mass - +a.properties.mass;
    });
    console.log(data);

    r.domain([
      d3.min(data, function (d) {
        return +d.properties.mass;
      }),
      d3.max(data, function (d) {
        return +d.properties.mass;
      }),
    ]);

    r2.domain([
      +data[100].properties.mass,
      +data[25].properties.mass,
      +data[15].properties.mass,
      +data[10].properties.mass,
      +data[3].properties.mass,
    ]);

    draw();
  });
});

function draw() {
  projection.rotate([rotation, 0, 0]);

  if (worldPicture) {
    worldPicture.remove();
    dots.remove();
    globe.remove();
  }

  globe = svg
    .append("circle")
    .attr("r", function () {
      return projection.scale();
    })
    .attr("cx", width / 2)
    .attr("cy", height / 2.2)
    .attr("fill", "#e5e5ff");

  worldPicture = svg
    .append("path")
    .attr("d", path(world))
    .attr("fill", "#ffc966")
    .attr("stroke", "#ffa500")
    .attr("stroke-width", 0.4);

  //console.log(data)

  dots = svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d, i) {
      if (d.geometry) {
        return projection(d.geometry.coordinates)[0];
      } else {
        return 0;
      }
    })
    .attr("cy", function (d, i) {
      if (d.geometry) {
        return projection(d.geometry.coordinates)[1];
      } else {
        return 0;
      }
    })
    .attr("r", function (d) {
      if (!d.geometry) {
        return 0;
      } else if (
        d.geometry.coordinates[0] < -90 - rotation ||
        d.geometry.coordinates[0] > 90 - rotation
      ) {
        return 0;
      }
      return r2(+d.properties.mass);
    })
    .attr("fill", function (d, i) {
      var index = i % 4;
      return colors[index];
    })
    .attr("opacity", 0.5)
    //.attr("stroke", "black")
    .on("mouseover", handleMouseover)
    .on("mouseout", handleMouseout);
}

d3.select("#plus").on("click", plusClick);
d3.select("#minus").on("click", minusClick);
d3.select("#upp").on("click", upClick);
d3.select("#ner").on("click", downClick);
