'use strict';

angular.module('redreapApp')
  .directive('donut', function (User, Subreddit) {
    return {
      template: '<div></div>',
      restrict: 'EA',
      link: function (scope, element, attrs) {
        var data = User.getUserData().data;
        var subData = Subreddit.getSubData().data;
        var sub2Data = Subreddit.getSubTwoData().data;

        var curAction = attrs.action;
        var color = d3.scale.ordinal();

        var svgWidth,
            svgHeight,
            radius,
            donutWidth;

        if ((curAction == "Comment") || (curAction == "Adjective") || (curAction == "Subreddit") || (curAction == "OverallSubSentiment") || (curAction == "Politics"))
        {
          if (curAction == "Comment")
          {
            /* Positive/Negative of Comments */
            var dataset = [
              { label: 'Other', count: 100 - data.negativePercentage, enabled: true }, 
              { label: 'Negative', count: Math.round(data.negativePercentage*100)/100, enabled: true },
            ];

            color.range(['#5D5D5D','#EA1C1C']); 
          }
          else if (curAction == "Adjective")
          {
            svgWidth  = 405,
            svgHeight = 470,
            radius = (Math.min(svgWidth+40, svgHeight) / 2) - 35,
            donutWidth = 50;

            /* Positive/Negative of Adjectives */
            var dataset = [
              { label: 'Very Positive', count: data.vpPer, enabled: true },
              { label: 'Positive', count: data.pPer, enabled: true }, 
              { label: 'Negative', count: data.nPer, enabled: true },
              { label: 'Very Negative', count: data.vnPer, enabled: true },
            ];

            color.range(['#1B9F9F','#1CEAEA','#EA1C1C','#9F1B1B']); 
          }
          else if (curAction == "Subreddit")
          {
            var curIndex = attrs.curIndex;

              if (curIndex != 0)
              {
                svgWidth  = 265,
                svgHeight = 330,
                radius = (Math.min(svgWidth, svgHeight) / 2) - 10,
                donutWidth = 35;
              }
              else
              {
                svgWidth  = 360,
                svgHeight = 470,
                radius = (Math.min(svgWidth+35, svgHeight) / 2) - 35,
                donutWidth = 50;
              }
              var dataset = [
                { label: 'Positive', count: data.sentimentBySub[curIndex].posPer, enabled: true },
                { label: 'Neutral', count: data.sentimentBySub[curIndex].neuPer, enabled: true }, 
                { label: 'Negative', count: data.sentimentBySub[curIndex].negPer, enabled: true },
              ];

            color.range(['#1CEAEA','#5D5D5D','#EA1C1C']); 
          }
          else if (curAction == "Politics")
          {
            var curIndex = attrs.curIndex;

            svgWidth  = 360,
            svgHeight = 400,
            radius = (Math.min(svgWidth+35, svgHeight) / 2) - 35,
            donutWidth = 50;
            
            var dataset = [
              { label: 'Positive', count: sub2Data.trendSent[curIndex].posPerr, enabled: true },
              { label: 'Neutral', count: sub2Data.trendSent[curIndex].neuPerr, enabled: true }, 
              { label: 'Negative', count: sub2Data.trendSent[curIndex].negPerr, enabled: true },
              ];
            color.range(['#1CEAEA','#5D5D5D','#EA1C1C']); 
          }
          else if (curAction == "OverallSubSentiment")
          {
            svgWidth  = 405,
            svgHeight = 475,
            radius = (Math.min(svgWidth+40, svgHeight) / 2) - 35,
            donutWidth = 50;

            var dataset = [
              { label: 'Positive', count: sub2Data.positivePer, enabled: true },
              { label: 'Neutral', count: sub2Data.neutralPer, enabled: true }, 
              { label: 'Negative', count: sub2Data.negativePer, enabled: true },
              ];
            color.range(['#1CEAEA','#5D5D5D','#EA1C1C']); 
          }
          //var color = d3.scale.category10();    
       
          var tip = d3.tip()
            .attr('class', 'd3-tip')
            .html(function(d) {
              if (d.data.enabled)
              {
                var tempTotal = 0;
                var disabledExist = false;
                dataset.forEach(function(c) {
                  if (c.enabled == true)
                  {
                    tempTotal += c.count;
                  }
                  else
                  {
                    disabledExist = true;
                  }
                });

                if (disabledExist == false)
                {
                  return "<strong>" + d.data.label + "</strong> <span style='color:red'>" + d.data.count + "%</span>";
                }
                else
                {
                  return "<strong>" + d.data.label + "</strong> <span style='color:red'>" + Math.round((d.data.count/tempTotal)*100) + "%</span>";
                }

              }
            });

          var svg = d3.select(element[0])
                      .append('svg')
                        .attr('width', svgWidth)
                        .attr('height', svgHeight)
                      .append('g')
                        .attr("class", "container")
                        .attr('transform', 'translate(' + (svgWidth / 2) +  ',' + (svgHeight / 2) + ')'); 

          svg.call(tip);
          // Define the radius

          var arc = d3.svg.arc()
                          .innerRadius(radius - donutWidth)
                          .outerRadius(radius);


          // Define the angles
          var pie = d3.layout.pie()
                      .value(function(d) {
                        return d.count;
                      })
                      .sort(null);
          // Define the PIE chart          
          var path = svg.selectAll('path')
                        .data(pie(dataset))
                        .enter()
                        .append('path')
                        .attr('d', arc)
                        .attr('fill', function(d, i) { 
                          return color(d.data.label);
                        })
                        .on('mouseover', tip.show)
                        .on('mouseout', tip.hide)
                        .each(function(d) { this._current = d; });

          var legend;
          if ((curAction == "Adjective") || (curAction == "Subreddit") || (curAction == "OverallSubSentiment") || (curAction == "Politics"))
          {
            if (curAction == "Subreddit")
            { 
              var curIndex = attrs.curIndex;
              if (curIndex == 0)
              {
                // svg.append("text")
                //        .attr('dy', '0.35em')
                //        .attr({
                //          "text-anchor": "middle",
                //        }).style({'fill': 'black', 'font-size': '60px'}).text(data.sentimentBySub[curIndex].avSentSent);

                legend = svg.selectAll('.legend')
                            .data(color.domain())
                            .enter()
                            .append('g')
                          .attr("class", "legend")
                          .attr("transform", function(d, i) { return "translate(" + (-125 + i * 110) + ", 210)"; });
              }
              else
              {
                // svg.append("text")
                //        .attr('dy', '0.35em')
                //        .attr({
                //          "text-anchor": "middle",
                //        }).style({'fill': 'black', 'font-size': '40px'}).text(data.sentimentBySub[curIndex].avSentSent);

                legend = svg.selectAll('.legend')
                            .data(color.domain())
                            .enter()
                            .append('g')
                          .attr("class", "legend")
                          .attr("transform", function(d, i) { return "translate(" + (-100 + i * 75) + ", 140)"; });
              }
            }
            else if (curAction == "Adjective")
            {
              // if ((data.vpPer >= data.pPer) && (data.vpPer >= data.nPer) && (data.vpPer >= data.vnPer))
              // {  
              //   svg.append("text")
              //            .attr('dy', '0.35em')
              //            .attr({
              //              "text-anchor": "middle",
              //            }).style({'fill': 'black', 'font-size': '30px'}).text("Mostly Very Positive");
              // }
              // else if ((data.pPer > data.vpPer) && (data.pPer >= data.nPer) && (data.pPer >= data.vnPer))
              // {
              //   svg.append("text")
              //            .attr('dy', '0.35em')
              //            .attr({
              //              "text-anchor": "middle",
              //            }).style({'fill': 'black', 'font-size': '30px'}).text("Mostly Positive");
              // }
              // else if ((data.nPer > data.vpPer) && (data.nPer > data.pPer) && (data.nPer >= data.vnPer))
              // {
              //   svg.append("text")
              //            .attr('dy', '0.35em')
              //            .attr({
              //              "text-anchor": "middle",
              //            }).style({'fill': 'black', 'font-size': '30px'}).text("Mostly Negative");
              // }
              // else if ((data.vnPer > data.vpPer) && (data.vnPer > data.nPer) && (data.vnPer > data.nPer))
              // {
              //   svg.append("text")
              //            .attr('dy', '0.35em')
              //            .attr({
              //              "text-anchor": "middle",
              //            }).style({'fill': 'black', 'font-size': '30px'}).text("Mostly Very Negative");
              // }

              legend = svg.selectAll('.legend')
                            .data(color.domain())
                            .enter()
                            .append('g')
                          .attr("class", "legend")
                          .attr("transform", function(d, i) { return "translate(" + (-190 + i * 100) + ", 210)"; });
            }
            else if (curAction == "Politics")
            {
              legend = svg.selectAll('.legend')
                            .data(color.domain())
                            .enter()
                            .append('g')
                          .attr("class", "legend")
                          .attr("transform", function(d, i) { return "translate(" + (-120 + i * 100) + ", 175)"; });
            }
            else if (curAction == "OverallSubSentiment")
            {
              legend = svg.selectAll('.legend')
                            .data(color.domain())
                            .enter()
                            .append('g')
                          .attr("class", "legend")
                          .attr("transform", function(d, i) { return "translate(" + (-120 + i * 100) + ", 210)"; });
            }
          }

            // Define the Legend
            var legendRectSize = 18,
                legendSpacing  = 4;              

            // Legend Content
            legend.append('rect')
                    .attr('width', legendRectSize)
                    .attr('height', legendRectSize)
                    .style('fill', color)
                    .style('stroke', color)
                    .on('click', function(label) {
                      var rect = d3.select(this);
                      var enabled = true;
                      var totalEnabled = d3.sum(dataset.map(function(d) {
                        return (d.enabled) ? 1 : 0;
                      }));
                      
                      if (rect.attr('class') === 'disabled') {
                        rect.attr('class', '')
                        .style('fill', color);
                      } else {
                        if (totalEnabled < 2) return;
                        rect.attr('class', 'disabled')
                        rect.style('fill', "gray");
                        enabled = false;
                      }

                      pie.value(function(d) {
                        if (d.label === label) d.enabled = enabled;
                        return (d.enabled) ? d.count : 0;
                      });

                      path = path.data(pie(dataset));

                      path.transition()
                        .duration(750)
                        .attrTween('d', function(d) {
                          var interpolate = d3.interpolate(this._current, d);
                          this._current = interpolate(0);
                          return function(t) {
                            return arc(interpolate(t));
                          };
                        });

                    });

            legend.append('text')
                    .attr('x', legendRectSize + legendSpacing)
                    .attr('y', legendRectSize - legendSpacing - 1)
                    .style("font-weight", "bold")
                    .style({'fill': 'black', 'font-size': '10px'})
                    .text(function(d) { return d; }); 
          
        }
      }
    };
  });