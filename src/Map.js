import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const initialAreas = [
  {
    id: 1,
    name: "Area 1",
    disabled: false,
    coordinates: [
      [
        [35.92256825424914, 31.952239201910302],
        [35.92256825424914, 31.952844346707323],
        [35.92237183608157, 31.952844346707323],
        [35.92237183608157, 31.952239201910302],
        [35.92256825424914, 31.952239201910302],
      ],
    ],
    disabled: false,
  },

  {
    id: 3,
    name: "Area 3",
    coordinates: [
      [
        [35.923522015437754, 31.95347552534801],
        [35.92375258285449, 31.953501214317356],
        [35.923780530419435, 31.95346959712326],
        [35.92382012280473, 31.953412290932107],
        [35.923810806949376, 31.95333621196761],
        [35.92314239433756, 31.953310522953046],
        [35.92334850763507, 31.95324926450334],
        [35.92359654227951, 31.953432051692033],
        [35.923438172740646, 31.95365831208646],
        [35.92316568397595, 31.9535427118672],
        [35.9232576780465, 31.953453788522083],
        [35.92342419895766, 31.953517022909423],
        [35.923522015437754, 31.95347552534801],
      ],
    ],
    disabled: false,
  },
  {
    id: 2,
    name: "Area 2",
    coordinates: [
      [
        [35.92432752703138, 31.953282305910733],
        [35.92393030605277, 31.9533645582234],
        [35.92381208552251, 31.953332459768305],
        [35.92406744186695, 31.953422736643674],
        [35.92441501022347, 31.953356533610645],
        [35.924419739044765, 31.95340267512327],
        [35.92440791699164, 31.953380607445766],
        [35.924448111971145, 31.95337860129301],
        [35.924490671362435, 31.953386625903804],
        [35.92434644231642, 31.953450822763955],
        [35.92410763684646, 31.9534347735529],
        [35.92397759426419, 31.953232152025763],
        [35.924422103455356, 31.953111782589758],
        [35.92432752703138, 31.953282305910733],
      ],
    ],
  },
  {
    id: 4,
    name: "Area 4",
    coordinates: [
      [
        [35.923749089408744, 31.953504178427835],
        [35.92381430039512, 31.95342612346451],
        [35.9238387545154, 31.953378697631436],
        [35.92382594521436, 31.953355972743935],
        [35.924048361257604, 31.953436003843535],
        [35.92403788092034, 31.953550616160456],
        [35.924139190845096, 31.953661276192804],
        [35.92429290245627, 31.953606934229313],
        [35.92398547923506, 31.953728462576137],
        [35.92354646955806, 31.953730438645522],
        [35.92352550888353, 31.95348836983358],
        [35.9234323503311, 31.953679060828705],
        [35.92351735751012, 31.953734390784177],
        [35.92351968647395, 31.95367412065241],
        [35.923749089408744, 31.953504178427835],
      ],
    ],
    disabled: false,
  },
];
const FitBounds = ({ geoJsonLayers }) => {
  const map = useMap();

  useEffect(() => {
    const bounds = geoJsonLayers.map((layer) =>
      layer.geometry.coordinates[0].map((coord) => [coord[1], coord[0]])
    );

    map.fitBounds(bounds.flat());
  }, [geoJsonLayers, map]);

  return null;
};
const MapComponent = () => {
  const [areas, setAreas] = useState(initialAreas);

  const onEachFeature = (feature, layer) => {
    const area = feature.properties;

    layer.on({
      mouseover: (e) => {
        if (!area.disabled) {
          layer.bindPopup(`<b> ${area.name}</b>`).openPopup();
        }
      },
      click: (e) => {
        if (!area.disabled) {
          setAreas((prevAreas) =>
            prevAreas.map((a) =>
              a.id === area.id ? { ...a, disabled: true } : a
            )
          );
          layer.bindPopup(`<b>${area.name} reserved</b>`).openPopup();
        }
      },
    });
  };
  const getStyle = (area) => ({
    color: area.disabled ? "gray" : "red",
    weight: 2,
    fillOpacity: 0.3,
    cursor: area.disabled ? "none" : "pointer",
  });

  const geoJsonLayers = areas.map((area) => ({
    type: "Feature",
    properties: {
      id: area.id,
      name: area.name,
      disabled: area.disabled,
    },
    geometry: {
      type: "Polygon",
      coordinates: area.coordinates,
    },
  }));
  const jordanCenter = [31.9454, 35.9284]; // Coordinates for Amman, Jordan

  return (
    <MapContainer
      center={jordanCenter}
      zoom={15}
      style={{ height: "90vh", width: "90vw", margin: "auto", marginTop:'5vh'}}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FitBounds geoJsonLayers={geoJsonLayers} />

      {geoJsonLayers.map((geoJsonLayer, index) => (
        <GeoJSON
          key={index}
          data={geoJsonLayer}
          onEachFeature={onEachFeature}
          style={() => getStyle(geoJsonLayer.properties)}
        />
      ))}
    </MapContainer>
  );
};

export default MapComponent;
