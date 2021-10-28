import React from "react";
import { Circle, Popup } from "react-leaflet";
import numeral from "numeral";
// Styling For each Case type
const casesTypeColors = {
  cases: {
    hex: "#CC1034",

    multiplier: 800,
  },
  recovered: {
    hex: "#7dd71d",

    multiplier: 1200,
  },
  deaths: {
    hex: "#fb4443",

    multiplier: 2000,
  },
};
export const sortData = (data) => {
  const sortedData = [...data];

  sortedData.sort((a, b) => {
    if (a.cases > b.cases) {
      // returns less than 0, sort a to an index lower than b (i.e. a comes first).
      return -1;
    } else {
      // sort b to an index lower than a (i.e. b comes first).
      return 1;
    }
  });
  return sortedData;
};
export const showDataOnMap = (data, casesType = "cases") => {
  return data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      color={casesTypeColors[casesType].hex}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup>
        <div className="info-cont">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          ></div>
          <div className="info-name">{country.country}</div>
          <div className="info-text">
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info-text">
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="info-text">
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
};

export const pPrint = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";
