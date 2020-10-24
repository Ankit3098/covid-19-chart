import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import { Alert,AlertTitle } from '@material-ui/lab'
import './App.css';
import Infobox from './components/Infobox/Infobox';
import Map from './components/Map/Map';
import Table from './components/Table/Table';
import {prettyPrintStat, sortData} from './util'
import LineGraph from './components/LineGraph/LineGraph';
import 'leaflet/dist/leaflet.css'

function App() {
  const [countries,setCountries] = useState([])
  const [mapCountries,setMapCountries] = useState([])
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({}) 
  const [tableData,setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({lat:20.5937, lng:78.9629})
  const [mapZoom, setMapZoom] = useState(3)  
  const [casesType,setCasesType] = useState('cases')
  //  https://disease.sh/v3/covid-19/countries


  useEffect(()=>{
    fetch('https://disease.sh/v3/covid-19/all').then(response=>response.json()).then(data=>{setCountryInfo(data)})
  },[])

  useEffect(()=>{
    const getContriesData = async() =>{
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then(response=>response.json())
        .then(data=>{
          const countries = data.map(country=>({
            name:country.country,
            value: country.countryInfo.iso2
          }))

          const sortedData = sortData(data)
          setTableData(sortedData)
          setMapCountries(data)
          setCountries(countries)
        })
      }

      getContriesData()
  },[])


  const onCountryChane = async (e) =>{
    const countryCode = e.target.value

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`
    await fetch(url)
      .then(response=>response.json())
      .then(data=>{
      setCountry(countryCode)
      setCountryInfo(data)

      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);

    })
  }


  return (
    <div className= 'container'>
      <Alert variant="outlined" severity="info">
        I made this webapp just for the developing purpose. Visit <a href='https://www.who.int/emergencies/diseases/novel-coronavirus-2019'><strong>WHO</strong></a> website for more and accurate information. 
      </Alert>
      <div className="app">
        <div className='app__left'>
          {/* Header + dropdown */}
          <div className='app__header'>
            <h1 className='app__title'>Covid 19 Tracker</h1>
            <FormControl className='app__dropdown'>
              <Select variant='outlined' value={country} onChange={onCountryChane}>
              <MenuItem value='worldwide'>Worldwide</MenuItem>
                {countries.map((country, i)=>(
                <MenuItem key = {i} value={country.value}>{country.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          {/* infoboxex */}
          <div className='app__stats'>
            <Infobox isCases active = {casesType === 'cases'} onClick = {e=>setCasesType('cases')} title='Coronavirus Cases' cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)} />
            <Infobox isRecovered active = {casesType === 'recovered'} onClick = {e=>setCasesType('recovered')} title='Rcovered' cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)} />
            <Infobox isDeaths active = {casesType === 'deaths'} onClick = {e=>setCasesType('deaths')} title='Deaths' cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)} />
          </div>
          <div className='app__map'>
            <Map casesType={casesType} countries = {mapCountries} center={mapCenter} zoom={mapZoom} />
          </div>
        </div>
        <Card className='app__rigth'>
          <CardContent>
            <h3 style={{color:'#6a5d5d'}}>Live Cases by Country</h3>
            <Table countries = {tableData} />
          </CardContent>
          <CardContent>
            <h3 style={{color:'#6a5d5d'}}>Worldwide New {casesType}</h3>
            <br></br>
            <LineGraph className='app__graph' casesType={casesType} />
          </CardContent>
        </Card>
      </div>
      <div className='app__footer'>
        <h4>Made by Ankit inspired by <a href='https://www.cleverprogrammer.com/'>Clever Propgramer</a></h4>
      </div>
    </div>
  );
}

export default App;
