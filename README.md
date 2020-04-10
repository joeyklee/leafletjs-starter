# leafletjs starter
> An (opinionated) template for building leafletjs applications. Prepared for [All Maps Lie 2020](https://all-maps-lie-2020.netlify.com/#/).

![preview](/assets/preview.png)

## About

The purpose of this map is to demo the important components to include on a  web map. This includes:
*  map details about the author, 
*  when the map was created, 
*  the map's intentions, 
*  the map's data sources, and 
*  any additional references and links.

This map also includes basic support for: 
* the creation of a legend for map data, 
* a scale bar, 
* zoom buttons, and 
* support for URL query parameters that allow people to center a map based on a given URL which is handy for sharing map views.

## Audience 
This template is designed for students who are just getting started with leaflet and web mapping. The idea is to provide as much boilerplate setup as possible so people can focus on the mapping concepts and map data.

## Usage

### Local development
In your terminal or commandline:
* 1: change directories to the project folder
  ```sh
  cd path/to/your/leafletjs-starter
  ```
* 2: start a local web server 
  ```sh
  python -m SimpleHTTPServer
  ```
go to: `http://localhost:8080`

### Deployment

The simplest thing to do is deploy it on [glitch.com](https://glitch.com/). Uploading from a Github repo is my recommended method, but you can also upload your files manually.


## TODOS

* add categorical legend scale support -- right now it is only numeric
* create a mini library from this?
  * maybe worth creating a mini plugin for the query URL parameters?


## `Map` class
The `Map.js` class is a thin wrapper layer to hide some of the inner workings of leaflet, the d3-legend library, and the other "map setup stuff" mentioned above. If you look in there, you can see how the methods and mappy stuff are handled.

## Built with:
* leaflet.js
  * leaflet-sidebar
* turf.js
* d3
  * d3-legend

## Authors
* [@joeyklee](https://github.com/joeyklee)
