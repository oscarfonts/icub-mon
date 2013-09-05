from shapely.geometry import shape, mapping
from geoalchemy2.shape import from_shape, to_shape
from geoalchemy2 import WKBElement, WKTElement

def dumps(data):
    if 'geometry' in data.keys(): # Single Feature
        return dumps_feature(data)
    elif 'objects' in data.keys(): # Feature collection
        return dumps_feature_collection(data)

def loads(feature, srid):
    row = {} # Always single feature
    if 'id' in feature:
        row.update({"id": feature['id']})
    if 'geometry' in feature:
        row.update({"geometry": loads_geometry(feature['geometry'], srid)})
    if 'properties' in feature and feature['properties'] is not None:
        row.update(feature['properties'])
    return row

def dumps_feature_collection(data):
    collection = {
        "Type": "FeatureCollection",
        "features": []
    }
    for item in data['objects']:
        collection['features'].append(dumps_feature(item));
    return collection

def dumps_feature(data):
    feature = {
       "type": "Feature",
       "properties": None
    }
    properties = {}
    for fieldname in data.keys():
        if fieldname == "geometry":
            feature['geometry'] = dumps_geometry(data[fieldname])
        elif fieldname == "id":
            feature['id'] = data[fieldname]
        else:
            properties.update({fieldname: data[fieldname]})
    if len(properties) > 0:
        feature.update({'properties': properties});
    return feature

def dumps_geometry(wkb):
    if isinstance(wkb, (WKBElement, WKTElement)):
        return mapping(to_shape(wkb))
    else:
        return None

def loads_geometry(geometry, srid):
    return from_shape(shape(geometry), srid=srid)
