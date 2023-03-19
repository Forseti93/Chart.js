import React from "react";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  TooltipPositionerFunction,
  ChartType,
} from "chart.js";
import { Bubble } from "react-chartjs-2";
import styles from "../styles/ChartComponent.module.css";

declare module "chart.js" {
  interface TooltipPositionerMap {
    top: TooltipPositionerFunction<ChartType>;
  }
}

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

export const ChartComponent = ({ chartData }: any) => {
  const sizeOrder: any[] = [...chartData].sort(
    (a: any, b: any) => +b.diameter - +a.diameter
  );
  const populationOrder: any[] = [...chartData].sort(
    (a: any, b: any) => +b.population - +a.population
  );
  // const coefficientDiameter = +sizeOrder[0].diameter / 100;
  const coefficientDiameter = 0.4;
  // const coefficientPopulation = +populationOrder[0].population / 200;
  const coefficientPopulation = 0.18;
  const planetsDiameter = sizeOrder.map((planet: any, index: number) => {
    return {
      x: index,
      y: 4,
      r: 5 + Math.pow(+planet.diameter, +coefficientDiameter),
    };
  });
  const planetsPopulation = populationOrder.map(
    (planet: any, index: number) => {
      return {
        x: index,
        y: 0,
        r: 5 + Math.pow(+planet.population, +coefficientPopulation),
      };
    }
  );

  const data = {
    datasets: [
      {
        label: "Diameter",
        data: planetsDiameter,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        hoverRadius: "0",
        hoverBorderWidth: "1",
        hoverBorderColor: "black",
      },
      {
        label: "Population",
        data: planetsPopulation,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        hoverRadius: "0",
        hoverBorderWidth: "1",
        hoverBorderColor: "black",
      },
    ],
  };

  // to check existance of a tooltip with neccesary index
  const getOrCreateTooltip = (chart: any): any => {
    let tooltipEl = chart.canvas.parentNode.querySelector("div");
    const tooltipUL = document.createElement("UL");
    tooltipUL.classList.add(`${styles.tooltipList}`);
    if (!tooltipEl) {
      tooltipEl = document.createElement("DIV");
      tooltipEl.classList.toggle(`${styles.chartTooltip}`);
      tooltipEl.appendChild(tooltipUL);
      chart.canvas.parentNode.appendChild(tooltipEl);
    }
    return {
      tooltipEl,
    };
  };

  // custom tooltip
  const chartTooltipHandler = (context: any) => {
    const { chart, tooltip } = context;
    const tooltipEl = getOrCreateTooltip(chart);
    // "tooltip index: ", tooltip.dataPoints[0].dataIndex
    if (tooltip.opacity === 0) {
      tooltipEl.tooltipEl.style.opacity = 0;
      return;
    }
    if (tooltip.body) {
      tooltipEl.tooltipEl.style.opacity = 1;
      const choseArray = () => {
        if (tooltip.dataPoints[0].dataset.label === "Diameter") {
          return sizeOrder;
        } else {
          return populationOrder;
        }
      };
      const sortedArray = choseArray();
      const planetData = () => {
        const hoveredPlanet = chartData.filter(
          (planet: any) =>
            planet.name === sortedArray[tooltip.dataPoints[0].dataIndex].name
        );

        const { population, diameter } = hoveredPlanet[0];
        return { population, diameter };
      };

      const tooltipTitle = document.createElement("LI");
      tooltipTitle.innerText =
        sortedArray[tooltip.dataPoints[0].dataIndex].name;

      const tooltipDiameter = document.createElement("LI");
      const tooltipDiameterColor = document.createElement("SPAN");
      const tooltipDiameterText = document.createElement("SPAN");
      tooltipDiameterColor.classList.add(`${styles.tooltipColor}`);
      tooltipDiameterColor.innerText = " ";
      tooltipDiameterColor.style.backgroundColor =
        chart.legend.legendItems[0].fillStyle;
      tooltipDiameterText.innerText = `Diameter: ${planetData().diameter} `;
      tooltipDiameter.appendChild(tooltipDiameterColor);
      tooltipDiameter.appendChild(tooltipDiameterText);

      const tooltipPopulation = document.createElement("LI");
      const tooltipPopulationColor = document.createElement("SPAN");
      const tooltipPopulationText = document.createElement("SPAN");
      tooltipPopulationColor.classList.add(`${styles.tooltipColor}`);
      tooltipPopulationColor.innerText = " ";
      tooltipPopulationColor.style.backgroundColor =
        chart.legend.legendItems[1].fillStyle;
      tooltipPopulationText.innerText = `Population: ${
        planetData().population
      } `;
      tooltipPopulation.appendChild(tooltipPopulationColor);
      tooltipPopulation.appendChild(tooltipPopulationText);

      if (tooltipEl.tooltipEl) {
        tooltipEl.tooltipEl.children[0].replaceChildren();
      }

      tooltipEl.tooltipEl.children[0].appendChild(tooltipTitle);
      tooltipEl.tooltipEl.children[0].appendChild(tooltipDiameter);
      tooltipEl.tooltipEl.children[0].appendChild(tooltipPopulation);
    }

    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;
    const left = Math.floor(positionX + tooltip.caretX) + "px";
    const top = Math.floor(positionY + tooltip.caretY) + "px";

    tooltipEl.tooltipEl.style.left = left;
    tooltipEl.tooltipEl.style.top = top;
  };

  const options = {
    layout: {
      padding: 0,
      margin: 0,
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback:
            // Include a dollar sign in the ticks
            function (value: any, index: any, ticks: any) {
              if (index === 0) {
                return "Population";
              }
              if (index === 8) {
                return "Diameter";
              }
              return "";
            },
        },
      },
    },
    plugins: {
      legend: { position: "right" },
      tooltip: {
        enabled: false,
        external: chartTooltipHandler,
        // tooltips with a standard body
        /*  position: "top",
         callbacks: {
           title: function (context: any) {
             if (context[0].dataset.label === "Diameter") {
               return `${sizeOrder[context[0].dataIndex].name}`;
             }
             return `${populationOrder[context[0].dataIndex].name}`;
           },
           afterTitle: function (context: any) {
             if (context[0].dataset.label === "Diameter") {
               return `${context[0].dataset.label}: ${
                 sizeOrder[context[0].dataIndex].diameter
               }`;
             }
             return `${context[0].dataset.label}: ${
               populationOrder[context[0].dataIndex].population
             }`;
           },
         }, */
      },
    },
  };

  Tooltip.positioners.top = (elements: any, eventPosition: any) => {
    if (
      elements[0] &&
      elements[0].element &&
      eventPosition &&
      eventPosition.x &&
      eventPosition.y
    ) {
      return { x: eventPosition.x, y: eventPosition.y };
    }
    return { x: eventPosition.x, y: eventPosition.y };
  };

  return (
    <div style={{ width: "100%" }}>
      <Bubble options={options as any} data={data as any} />
    </div>
  );
};
