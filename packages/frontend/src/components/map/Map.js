import React, { useEffect, useRef, useState } from "react";
import useService from "../../hooks/useService";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import styled from "styled-components/macro";
import { useQuery } from "react-query";
import { findRawRecords } from "../../services/crudService";
import ResetZoomControl from "./ResetZoomControl";
import { STARTING_LOCATION } from "../../constants";
import { useApp } from "../../AppProvider";
import ToggleBasemapControl from "./ToggleBasemapControl";
import debounce from "lodash.debounce";

import pipestoneMarker from "./pipestone-marker.png";
import { lineColors } from "../../utils";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const Root = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Coordinates = styled.pre`
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  position: absolute;
  bottom: 40px;
  left: 10px;
  padding: 5px 10px;
  margin: 0;
  font-size: 11px;
  line-height: 18px;
  border-radius: 3px;
  z-index: 100000;
  display: none;
`;

const Map = () => {
  const [mapIsLoaded, setMapIsLoaded] = useState(false);
  const [map, setMap] = useState();
  const mapContainer = useRef(null); // create a reference to the map container
  const coordinates = useRef(null);
  const DUMMY_BASEMAP_LAYERS = [
    { url: "outdoors-v11", icon: "park" },
    { url: "streets-v11", icon: "commute" },
    { url: "satellite-streets-v11", icon: "satellite_alt" },
  ];

  function onPointClick(e) {
    coordinates.current.style.display = "block";
    coordinates.current.innerHTML = `Longitude: ${e.features[0].geometry.coordinates[0]}<br />Latitude: ${e.features[0].geometry.coordinates[1]}`;
  }
  const service = useService({ toast: false });

  const { currentUser } = useApp();

  const { data, isLoading, error } = useQuery(
    ["dropdown-locations", currentUser],
    async () => {
      try {
        const response = await service([findRawRecords, ["DropdownLocations"]]);
        return response.filter((location) => location.location_geometry);
      } catch (err) {
        console.error(err);
      }
    },
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/" + DUMMY_BASEMAP_LAYERS[0].url,
      center: STARTING_LOCATION,
      zoom: 12,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-left");
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true,
      }),
      "top-left"
    );
    map.addControl(new mapboxgl.FullscreenControl());
    // Add locate control to the map.
    map.addControl(new ResetZoomControl(), "top-left");

    DUMMY_BASEMAP_LAYERS.forEach((layer) => {
      return map.addControl(new ToggleBasemapControl(layer.url, layer.icon));
    });

    map.on("load", () => {
      setMapIsLoaded(true);
      setMap(map);
    });
  }, []); // eslint-disable-line

  //resizes map when mapContainerRef dimensions changes (sidebar toggle)
  useEffect(() => {
    if (map) {
      const resizer = new ResizeObserver(debounce(() => map.resize(), 100));
      resizer.observe(mapContainer.current);
      return () => {
        resizer.disconnect();
      };
    }
  }, [map]);

  useEffect(() => {
    if (mapIsLoaded && data?.length > 0 && typeof map != "undefined") {
      map.loadImage(pipestoneMarker, (error, image) => {
        if (error) throw error;
        // Add the image to the map style.
        map.addImage("pipestoneMarker", image);
        if (!map.getSource("locations")) {
          map.addSource("locations", {
            // This GeoJSON contains features that include an "icon"
            // property. The value of the "icon" property corresponds
            // to an image in the Mapbox Streets style's sprite.
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: data.map((location) => {
                return {
                  type: "Feature",
                  properties: {
                    description: location.location_name,
                  },
                  geometry: {
                    type: location.location_geometry.type,
                    coordinates: location.location_geometry.coordinates,
                  },
                };
              }),
            },
          });
          // Add a layer showing the places.
          map.addLayer({
            id: "locationsCircles",
            type: "circle",
            source: "locations",
            paint: {
              "circle-radius": 4,
              "circle-color": lineColors.black,
              "circle-stroke-width": 8,
              "circle-stroke-color": lineColors.lightGreen,
            },
          });

          map.addLayer({
            id: "locationsMarkers",
            type: "symbol",
            source: "locations",
            layout: {
              "icon-image": "pipestoneMarker", // reference the image
              "icon-size": 0.75,
              "icon-allow-overlap": true,
            },
          });

          map.addLayer({
            id: "locations-labels",
            type: "symbol",
            source: "locations",
            // minzoom: 12,
            layout: {
              "text-field": ["get", "description"],
              "text-offset": [0, -1.5],
              "text-size": 14,
              "text-font": [
                "literal",
                ["Roboto Black", "Arial Unicode MS Bold"],
              ],
            },
            paint: {
              "text-color": "rgb(49,49,49)",
              "text-halo-color": "rgba(255,255,255,1)",
              "text-halo-width": 3,
            },
          });

          // When a click event occurs on a feature in the places layer, open a popup at the
          // location of the feature, with description HTML from its properties.
          map.on("click", "locationsCircles", (e) => {
            // Copy coordinates array.
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = e.features[0].properties.description;

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
              .setLngLat(coordinates)
              .setHTML(description)
              .addTo(map);
          });

          map.on("click", "locations", onPointClick);

          // Change the cursor to a pointer when the mouse is over the places layer.
          map.on("mouseenter", "locations", () => {
            map.getCanvas().style.cursor = "pointer";
          });

          // Change it back to a pointer when it leaves.
          map.on("mouseleave", "locations", () => {
            map.getCanvas().style.cursor = "";
          });
        }
      });
    }
  }, [isLoading, mapIsLoaded, map, data]);

  if (error) return "An error has occurred: " + error.message;

  return (
    <Root>
      <MapContainer ref={mapContainer} />
      <Coordinates ref={coordinates} />
    </Root>
  );
};

export default Map;
