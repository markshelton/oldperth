// This file manages all the photo information.
// Some of this comes in via lat-lons.js.
// Some is requested via XHR.

// Maps photo_id -> { title: ..., date: ..., library_url: ... }
var photo_id_to_info = {};

// The callback is called with the photo_ids that were just loaded, after the
// UI updates.  The callback may assume that infoForPhotoId() will return data
// for all the newly-available photo_ids.

export function loadInfoForLatLon(lat_lon) {
  const url = "/data.json";
  return $.getJSON(url).then(function(response_data) {
    // Add these values to the cache.
    let filtered_data;
    if (lat_lon === "pop") {
      filtered_data = response_data.photos.filter(photo => photo.popular);
    } else {
      filtered_data = response_data.photos.filter(photo => {
        const photo_lat_lon = `${photo.location.lat},${photo.location.lon}`;
        return lat_lon === photo_lat_lon;
      });
    }
    $.extend(photo_id_to_info, filtered_data);
    const photo_ids = filtered_data.map(el => el.photo_id);
    if (lat_lon != "pop") {
      lat_lon_to_name[lat_lon] = extractName(response_data);
    }
    return photo_ids;
  });
}

// Returns a {title: ..., date: ..., library_url: ...} object.
// If there's no information about the photo yet, then the values are all set
// to the empty string.
export function infoForPhotoId(photo_id) {
  return $.getJSON("/data.json").then(response_data => {
    const chosen_photo = response_data.photos.find(
      photo => photo.photo_id === photo_id
    );
    return $.extend(
      {
        title: chosen_photo.title,
        date: chosen_photo.date,
        library_url: chosen_photo.image_url
      },
      chosen_photo
    );
  });
}

// Would it make more sense to incorporate these into infoForPhotoId?
export function descriptionForPhotoId(photo_id) {
  infoForPhotoId(photo_id).then(info => {
    var desc = info.title;
    if (desc) desc += " ";
    var date = info.date.replace(/n\.d\.?/, "No Date");
    if (!date) date = "No Date";
    desc += date;
    console.log(desc);
    return desc;
  });
}

export function libraryUrlForPhotoId(photo_id) {
  return `${process.env.BASE_SOURCE_URL}/${photo_id}`;
}

var lat_lon_to_name = {};

// Does this lat_lon have a name, e.g. "Manhattan: 14th Street - 8th Avenue"?
export function nameForLatLon(lat_lon) {
  var v = lat_lon_to_name[lat_lon] || "";
  return v.replace(/: | - | & /g, "\n");
}

function extractName(lat_lon_json) {
  // if any entries have an original_title, it's got to be a pure location.
  for (var k in lat_lon_json) {
    var v = lat_lon_json[k];
    if (v.original_title) return v.original_title;
  }
}

export var lat_lons = $.getJSON("/data.json").then(response_data => {
  return response_data.photos.reduce((acc, photo) => {
    const lat_lon_string = `${photo.location.lat},${photo.location.lon}`;
    photo.years.forEach(year => {
      if (acc[lat_lon_string]) {
        if (acc[lat_lon_string][year]) {
          acc[lat_lon_string][year] += 1;
        } else {
          acc[lat_lon_string][year] = 1;
        }
      } else {
        acc[lat_lon_string] = {};
        acc[lat_lon_string][year] = 1;
      }
    });
    return acc;
  }, {});
});

export var popular_photos = $.getJSON("/data.json").then(response_data => {
  return response_data.photos.filter(photo => photo.popular).map(photo => {
    return {
      id: photo.photo_id,
      date: photo.date,
      loc: photo.location.address,
      height: photo.height,
      desc: photo.title
    };
  });
});
