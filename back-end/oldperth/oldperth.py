##########################################################
# Standard Library Imports

import os
import datetime
import json
from collections import defaultdict

##########################################################
# Third Party Imports

import numpy as np
import pandas as pd

##########################################################
# Local Imports

from thickshake.storage import Database
from thickshake.utils import open_file, json_serial, deep_get, check_output_directory

##########################################################
# Constants


##########################################################
# Helpers


def load_data_file(data_file):
    with open_file(data_file, 'r+', encoding='utf-8') as infile:
        return json.load(infile)


def retrieve_data(data_file=None, dump_file=None):
    if data_file is not None: return load_data_file(data_file)
    elif dump_file is not None: return load_data_file(create_data_json(dump_file=dump_file))
    else: return load_data_file(create_data_json())


def dump_json_file(data, file_path, force=False, **kwargs):
    if os.path.exists(file_path) and force == False: raise IOError
    with open_file(file_path, 'w+', encoding='utf-8') as outfile:
        json.dump(data, outfile, indent=2, default=json_serial)


def dump_json_files(data, dir_path, **kwargs):
    check_output_directory(output_dir=dir_path, **kwargs)
    for k,v in data.items():
        dump_json_file(v, dir_path + k + ".json")


def dump_js_file(data, file_path, force=False, **kwargs):
    if os.path.exists(file_path) and force == False: raise IOError
    with open_file(file_path, 'w+', encoding='utf-8') as outfile:
        outfile.write(data)


def extract_address(row):
    try:
        address = ""
        if row["building_name"]: address += row["building_name"] + ", "
        if row["street_number"]: address += row["street_number"] + " "
        if row["street_name"]: address += row["street_name"] + " "
        if row["street_type"]: address += row["street_type"] + ", "
        if row["suburb"]: address += row["suburb"]
        return address
    except: pass


def truncate(number):
    if number is None: return None
    return format(number, '.6f')


def num_there(s):
    return any(i.isdigit() for i in s)


def extract_year(date_created):
    try: return int(datetime.datetime.strptime(str(date_created), "%Y-%M-%d").year)
    except: pass

##########################################################
# Functions


def create_data_json(output_path=None, dump_file=None, **kwargs):
    if output_path is None: data_file = NamedTemporaryFile().name
    else: data_file = output_path
    if dump_file is None: dump_file = get_dump_file()
    df = pd.read_csv(dump_file)
    df["image_year"] = df["image_date_created"].apply(extract_year)
    df["address"] = df.apply(extract_address, axis=1)
    df = df.where((pd.notnull(df)), None)
    photos = [
        {
            "text": None,
            "height": photo["image_height"],
            "date": photo.get("image_date_created",""),
            "thumb_url": photo["image_url_thumb"],
            "photo_id": photo["image_note"].split(":")[0].strip(),
            "title": (":").join(photo["image_note"].split(":")[1:]).strip(),
            "width": photo["image_width"],
            "image_url": photo["image_url_raw"],
            "location": {
                "lat": truncate(photo["latitude"]),
                "lon": truncate(photo["longitude"]),
                "address": photo["address"]
            },
            "folder": None,
            "years": [photo["image_year"]],
            "rotation": 0,
            "popular": photo["image_height"] is not None,
        }
        for photo in df.to_dict(orient='records')
        if num_there(photo["image_note"].split(":")[0][:4])
        and photo["location_type"] == "geocoded"
    ]
    data = dict(photos=photos,timestamp=datetime.datetime.now().isoformat())                           
    dump_json_file(data, data_file, **kwargs)
    return data_file


def create_popular_json(output_path, data_file, **kwargs):
    data = retrieve_data(data_file=data_file)
    photos = {
        photo["photo_id"]: {
            "width": photo["width"],
            "thumb_url": photo["thumb_url"],
            "image_url": photo["image_url"],
            "title": photo["title"],
            "date": photo["date"],
            "text": photo["text"],
            "height": photo["height"],
            "years": photo["years"]
        }
        for photo in data["photos"] 
        if photo["popular"] == True
    }
    dump_json_file(photos, output_path, **kwargs)


def create_popular_photos_js(output_path, data_file, **kwargs):
    data = retrieve_data(data_file=data_file)
    photos = [
        {
            "date": photo["date"],
            "loc": deep_get(photo, "location", "address"),
            "height": photo["height"],
            "id": photo["photo_id"],
            "desc": photo["title"],
        }
        for photo in data["photos"] 
        if photo["popular"] == True
    ]
    output_str = "export var popular_photos = %s;" % json.dumps(photos, indent=2, default=json_serial)
    dump_js_file(output_str, output_path, **kwargs)


def create_by_location_dir(output_path, data_file, **kwargs):
    data = retrieve_data(data_file=data_file)
    photos = defaultdict(dict)
    for photo in data["photos"]:
        latlon = "%s%s" % (deep_get(photo, "location", "lat"),deep_get(photo, "location", "lon"))
        photo_id = photo["photo_id"]
        photos[latlon][photo_id] = {
            "width": photo["width"],
            "thumb_url": photo["thumb_url"],
            "image_url": photo["image_url"],
            "title": photo["title"],
            "date": photo["date"],
            "text": photo["text"],
            "folder": photo["folder"],
            "height": photo["height"],
            "original_title": "",
            "years": photo["years"]
        }
    dump_json_files(photos, output_path, **kwargs)


def create_id4_to_location_dir(output_path, data_file, **kwargs):
    data = retrieve_data(data_file=data_file)
    photos = defaultdict(dict)
    for photo in data["photos"]:
        photo_id = photo["photo_id"]
        id4 = photo_id[:4]
        latitude = deep_get(photo, "location", "lat")
        longitude = deep_get(photo, "location", "lon")
        photos[id4][photo_id] = "%s,%s" % (latitude, longitude)
    dump_json_files(photos, output_path, **kwargs)

def create_lat_lon_counts_js(output_path, data_file, **kwargs):
    data = retrieve_data(data_file=data_file)
    counts = defaultdict(dict)
    for photo in data["photos"]:
        latitude = deep_get(photo, "location", "lat")
        longitude = deep_get(photo, "location", "lon")
        latlon = "%s,%s" % (latitude, longitude)
        year = extract_year(photo["date"])
        if year is None: continue
        counts[latlon][year] = counts[latlon].get(year, 0) + 1
    output_str = "var lat_lons = %s;" % json.dumps(counts, indent=2, default=json_serial)
    dump_js_file(output_str, output_path, **kwargs)


def generate_static_files(output_dir, input_file=None):
    data_file = create_data_json(output_dir + "/data.json", input_file, force=True)
    create_popular_json(output_dir + "/popular.json", data_file=data_file, force=True)
    create_popular_photos_js(output_dir + "/js/popular-photos.js", data_file=data_file, force=True)
    create_by_location_dir(output_dir + "/by-location/" , data_file=data_file, force=True)
    create_id4_to_location_dir(output_dir + "/id4-to-location/", data_file=data_file, force=True)
    create_lat_lon_counts_js(output_dir + "/lat-lon-counts.js", data_file=data_file, force=True)


##########################################################
# Main

def main():
    from thickshake.config import Config
    from thickshake.interface import import_metadata
    from thickshake.interface.report import export_query
    from thickshake.augment import parse_locations, parse_dates, parse_links, parse_sizes
    
    external_config_path = "/home/back-end/config/settings.ini"
    config = Config(external_config_path=external_config_path, sample=0, force=True)
    input_file = config.get_dict()["output_dump_file"]
    output_dir = config.get_dict()["output_build_dir"]
    generate_static_files(output_dir, input_file)
    # to copy generated files use: 
    # rsync -avh --progress SOURCE DESTINATION
    # rsync -avh --progress ../data/output/build/ ../../oldperth/

if __name__ == "__main__":
    main()

##########################################################
# Notes