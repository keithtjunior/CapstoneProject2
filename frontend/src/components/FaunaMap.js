import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
import Graphic from '@arcgis/core/Graphic';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import FeatureTable from '@arcgis/core/widgets/FeatureTable';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';


const FaunaMap = ({ locations, observations, getFaunaeByPlace, defaultOptions }) => {
    const [options, setOptions] = useState(defaultOptions);
    const [isTable, setIsTable] = useState(false);
    const faunaMapDiv = useRef(null);
    const tableDiv = useRef(null);
    const { id } = useParams();
    
    useEffect(() => {

        let view = null;
        let webmap = null;
        let featureLayer = null;

        if(id) {

          const rangeLayer = new WebTileLayer({
            urlTemplate: `https://api.inaturalist.org/v1/taxon_ranges/${id}/{level}/{col}/{row}.png`,
            subDomains: ['a', 'b', 'c', 'd'],
            copyright: '©Copyright 2023 iNaturalist'
          });

          const placeLayer = new WebTileLayer({
            urlTemplate: `https://api.inaturalist.org/v1/taxon_places/${id}/{level}/{col}/{row}.png`,
            subDomains: ['a', 'b', 'c', 'd'],
            copyright: '©Copyright 2023 iNaturalist'
          });

          webmap = new WebMap({
            basemap: 'topo-vector',
            layers: [rangeLayer, placeLayer]
          });

          view = new MapView({
            container: faunaMapDiv.current, 
            map: webmap, 
            center: [options.lngLat.lng, options.lngLat.lat],
            zoom: options.zoom,
            constraints: {
                snapToZoom: true
            },
            ui: {
                components: ['zoom'] 
            }
          });


          if(locations && locations.length || observations && observations.length) {

            setIsTable(true);

            const graphics = [];
            const commonProperties = {
              type: 'simple-marker',
              outline: {
                  color: [255, 255, 255],
                  width: 1
              }
            };
            const locationSym = {
              ...commonProperties,
              color: [255, 10, 10]
            };
            const observationSym = {
              ...commonProperties,
              color: [255, 140, 10]
            };
            const featureRenderer = {
              type: 'unique-value', 
              field: 'Type',
              uniqueValueInfos: [
                {
                  value: 'Location', 
                  symbol: locationSym
                },
                {
                  value: 'Observation',
                  symbol: observationSym
                },
              ]
            };
        
            

            const createGraphics = (items, type) => {
                items.forEach(async item => {
                    if(item.lat && item.lng) {
                        let graphic = new Graphic({
                            geometry: {
                                type: 'point',
                                latitude: item.lat.toFixed(2),
                                longitude: item.lng.toFixed(2),
                            },
                            attributes: {
                              ObjectID: item.id,
                              Name: item.name,
                              DisplayName: item.display_name,
                              Type: type,
                              View: 'View All Fauna',
                              Lat: item.lat,
                              Lng: item.lng
                            }
                        });
                        graphics.push(graphic);
                    }
                });
                
            }

            const createFeatureLayer = () => {
                featureLayer = new FeatureLayer({
                    source: graphics,
                    title: 'Locations / Observations',
                    renderer: featureRenderer,
                    fields: [
                        {
                            name: 'ObjectID',
                            alias: 'ID',
                            label: 'ID',
                            type: 'oid',
                            
                        }, 
                        {
                            name: 'Name',
                            alias: 'Name',
                            label: 'Name',
                            type: 'string'
                        },
                        {
                            name: 'DisplayName',
                            alias: 'Display Name',
                            label: 'Display Name',
                            type: 'string'
                        },
                        {
                          name: 'Type',
                          alias: 'Type',
                          label: 'Type',
                          type: 'string'
                        },
                        {
                          name: 'View',
                          alias: 'View',
                          label: 'View',
                          type: 'string'
                        },
                        {
                          name: 'Lat',
                          alias: 'Lat',
                          label: 'Lat',
                          type: 'double'
                        },
                        {
                          name: 'Lng',
                          alias: 'Lng',
                          label: 'Lng',
                          type: 'double'
                        }
                    ]
                })
            }

            const createTable = () => {
              const featureTable = new FeatureTable({
                view: view,
                layer: featureLayer,
                returnGeometryEnabled: true,
                visibleElements: {
                  menuItems: {
                    clearSelection: true,
                    refreshData: true,
                    toggleColumns: true,
                    selectedRecordsShowAllToggle: true,
                    selectedRecordsShowSelectedToggle: true,
                    zoomToSelection: true
                  }
                },
                tableTemplate: {
                  columnTemplates: [
                    {
                      type: 'field',
                      fieldName: 'Name',
                      label: 'Name'
                    },
                    {
                      type: 'field',
                      fieldName: 'DisplayName',
                      label: 'Display Name'
                    },
                    {
                      type: 'field',
                      fieldName: 'Type',
                      label: 'Type'
                    },
                    {
                      type: 'field',
                      fieldName: 'View',
                      label: 'View'
                    }
                  ]
                },
                container: tableDiv.current,
                actionColumnConfig: {
                  label: 'Zoom',
                  icon: 'magnifying-glass-plus',
                  callback: ({ feature }) => view.goTo({
                      geometry:feature.geometry,
                      zoom:7
                  })
                }
              });
    
              reactiveUtils.when(
                () => view.stationary,
                () => {
                  featureTable.filterGeometry = view.extent;
                },
                {
                  initial: true
                }
              );
    
              view.on('immediate-click', async (event) => {
                const response = await view.hitTest(event);
    
                let candidate = response.results.find((result) => {
                  return result.graphic && result.graphic.layer && result.graphic.layer === featureLayer;
                });
    
                if (candidate) {
                  const objectId = candidate.graphic.getObjectId();
    
                  if (featureTable.highlightIds.includes(objectId)) {
                    featureTable.highlightIds.remove(objectId);
                  } else {
                    featureTable.highlightIds.add(objectId);
                  }
                }
              });
    
              reactiveUtils.watch(
                () => featureTable.highlightIds.length,
                (highlightIdsCount) => {
                  featureTable.viewModel.activeFilters.forEach((filter) => {
                    if (filter.type === 'selection') {
                      let selectionIdCount = filter.objectIds.length;
                      if (selectionIdCount !== highlightIdsCount) {
                        featureTable.filterBySelectionEnabled();
                      }
                    }
                  });
                }
              );

              featureTable.viewModel.on('cell-click', (event) => {
                if(event && event.feature && event.feature.attributes){
                  if(event.fieldName && event.fieldName === 'View'){
                    let location = {
                      ancestorPlaceIds: [event.feature.attributes.ObjectID],
                      location: {
                      lat: event.feature.attributes.Lat,
                      lng: event.feature.attributes.Lng
                    }}
                    handleClick(location);
                  }
                }
              });

            }

            const addToLayers = () => {
                webmap.layers.add(featureLayer);
            }

            view.when()
            .then(createGraphics(locations, 'Location'))
            .then(createGraphics(observations, 'Observation'))
            .then(createFeatureLayer)
            .then(addToLayers)
            .then(createTable)
            .catch((err) => {
                console.error('ArcGIS error: ', err);
            })


          }

        }

    }, [id, locations, observations]);

    const handleClick = async (location) => {
      let data = {
          lat: location.location.lat,
          lng: location.location.lng,
          place_ids: location.ancestorPlaceIds,
          per_page: undefined,
          radius: undefined
      }
      await getFaunaeByPlace(data);
    }

    if(!id || !locations || !observations) return <></>
    return (
        <div className='d-flex flex-column justify-content-center'>
            <div className='faunaMapDiv mb-5' ref={faunaMapDiv} 
              style={{ 
                height: '500px',
                background: 'rgb(26,181,24)',
                background: 'linear-gradient(180deg, rgba(26,181,24,1) 0%, rgba(198,243,203,1) 56%, rgba(198,243,203,0) 100%)'}}></div>
            {isTable && 
              <div ref={tableDiv}></div>
            }
        </div>
    );
}

FaunaMap.defaultProps = {
    defaultOptions: { 
      zoom: 2,
      lngLat: { lng: 0, lat: 25 }
    }
}

export default FaunaMap;
