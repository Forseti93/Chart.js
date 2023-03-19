import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useEffect } from "react";
import { findMargins } from "@/functions/getElementAttribute";
import { usePlanets } from "@/api/api.usePlanets";
import { nanoid } from "nanoid";
import { PlanetsChart } from "@/components/PlanetsChart";
import { ChartComponent } from "@/components/ChartComponent";

export default function Home() {
  const { data: planetsData, isLoading } = usePlanets();
  const planetsListElement = planetsData?.results.map((planet: any) => {
    return (
      <li key={nanoid()}>
        {`Planet ${planet.name} has diameter: ${planet.diameter}km, population: ${planet.population}`}
      </li>
    );
  });
  useEffect(() => {
    // #region to calculate min-height for the main tag
    const headerEl = document.querySelector("header");
    const footerEl = document.querySelector("footer");
    const allNavHeights = (): number => {
      return (
        findMargins(["top", "bottom"], headerEl!) +
        findMargins(["top", "bottom"], footerEl!) +
        headerEl!.getBoundingClientRect().height +
        footerEl!.getBoundingClientRect().height
      );
    };
    const newMainMinHeight: string = `${allNavHeights()}px`;

    document.documentElement.style.setProperty(
      "--footer-header-height",
      newMainMinHeight
    );
    // #endregion to calculate min height for a main block
  }, [isLoading]);

  return (
    <>
      <Head>
        <title>Chart.js SW_API</title>
        <meta name="description" content="App for learning chart.js" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <header className={styles.header}>
        Data from{" "}
        <a
          href="https://swapi.dev/api/planets/"
          className={styles.link}
          target="_blank"
        >
          SWAPI
        </a>
      </header>
      {isLoading ? (
        <main className={styles.main}>LOADING...</main>
      ) : (
        <main className={styles.main}>
          <ul>{planetsListElement}</ul>
          <ChartComponent chartData={planetsData.results} />
        </main>
      )}
      <footer className={styles.footer}>
        Links:{" "}
        <a
          href="https://learn-chartjs.vercel.app/"
          target="_blank"
          className={styles.link}
        >
          the app online
        </a>
        ||{" "}
        <a
          href="https://github.com/Forseti93/Chart.js"
          target="_blank"
          className={styles.link}
        >
          the code
        </a>
      </footer>
    </>
  );
}
