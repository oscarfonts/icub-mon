import geojson

def removePagination(result=None, **kw):
    if result:
        result.pop("num_results", None)
        result.pop("page", None)
        result.pop("total_pages", None)

def fromGeoJSON(instance_id=None, data=None, **kw):
    row = geojson.loads(data, 4326)
    data.clear()
    data.update(row)

def toGeoJSON(result=None, **kw):
    doc = geojson.dumps(result)
    result.clear()
    result.update(doc)
