import React, { useState, useEffect } from "react";
import "./App.css";
import { MenuItem, FormControl, Select } from "@material-ui/core";
import InfoBoxes from "./InfoBoxes";
import Map from "./Map";
import { Card, CardContent } from "@material-ui/core";
import Table from "./Table";
import { sortData } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import { pPrint } from "./util";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCaseType] = useState("cases");
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((res) => res.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);
  useEffect(() => {
    const getCountryData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((res) => res.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setMapCountries(data);
          setCountries(countries);
          setTableData(sortedData);
        });
    };
    getCountryData();
  }, []);
  const countryChange = async (e) => {
    const cCode = e.target.value;
    const url =
      cCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${cCode}`;
    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCountry(cCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(5);
      });
    console.log(countryInfo);
  };
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid 19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select onChange={countryChange} variant="outlined" value={country}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__status">
          {/* Info Boxes */}
          <InfoBoxes
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCaseType("cases")}
            title="Coronavirus Cases"
            cases={pPrint(countryInfo.todayCases)}
            total={pPrint(countryInfo.cases)}
          />
          <InfoBoxes
            active={casesType === "recovered"}
            onClick={(e) => setCaseType("recovered")}
            title="Recoverd"
            cases={pPrint(countryInfo.todayRecovered)}
            total={pPrint(countryInfo.recovered)}
          />
          <InfoBoxes
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCaseType("deaths")}
            title="Deaths"
            cases={pPrint(countryInfo.todayDeaths)}
            total={pPrint(countryInfo.deaths)}
          />
        </div>

        <Map
          caseType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app_right">
        <CardContent>
          <h3>Live Cases</h3>
          <Table countries={tableData} />
          <div className="app__linegraph">
            <h3 className="app__worldwide">
              Worldwide {casesType.toUpperCase()}
            </h3>
            <LineGraph caseType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
