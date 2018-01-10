##########################################################
# Standard Library Imports

import json
import os
import shutil
from collections import defaultdict

##########################################################
# Third Party Imports

from thickshake.parse import (
    parse_images, parse_collection,
    parse_records, parse_record_section, parse_marcxml,
)
from thickshake.database import (
    initialise_db, manage_db_session, export_records_to_json,
)
from thickshake.schema import Image
from thickshake._types import (
    Any, List, Dict, Optional, Union,
    ParsedRecord, DBConfig, FilePath, DirPath, JSONType,
    Record, Engine,
)
from thickshake.utils import (
    check_and_make_directory, open_file,
    logged, deep_get, consolidate_list, json_serial,
)

##########################################################
# Local Imports

from rotate import generate_rotated_images

##########################################################
# Environmental Variables

## Flags
FLAG_GEOCODING = True # type: bool
FLAG_DIMENSIONS = True # type: bool
FLAG_SAMPLE_SIZE = 5 # type: Optional[int]
FLAG_REGENERATE_DATA_FILE = True # type: bool
FLAG_OVERWRITE_BACK = True # type: bool
FLAG_OVERWRITE_FRONT = True # type: bool

## Input
INPUT_MARCXML_FILE = "/home/app/back-end/data/input/marc21.xml" # type: FilePath

## Output
OUTPUT_BACK_PARENT_DIR =  "/home/app/back-end/data/output" # type: DirPath
OUTPUT_FRONT_PARENT_DIR = "/home/app/front-end" # type: DirPath
OUTPUT_PATHS = {}
OUTPUT_PATHS["data_json_file"] = "%s/data.json" % (OUTPUT_BACK_PARENT_DIR) # type: Optional[FilePath]
OUTPUT_PATHS["popular_json_file"] = "%s/popular.json" % (OUTPUT_BACK_PARENT_DIR) # type: Optional[FilePath]
OUTPUT_PATHS["popular_photos_js_file"] = "%s/js/popular-photos.js" % (OUTPUT_BACK_PARENT_DIR) # type: Optional[FilePath]
OUTPUT_PATHS["by_location_dir"] = "%s/by-location" % (OUTPUT_BACK_PARENT_DIR) # type: Optional[DirPath]
OUTPUT_PATHS["id4_to_location_dir"] = "%s/id4-to-location" % (OUTPUT_BACK_PARENT_DIR) # type: Optional[DirPath]
OUTPUT_PATHS["rotated_assets_dir"] = "%s/rotated-assets" % (OUTPUT_BACK_PARENT_DIR) # type: Optional[DirPath]

## Database
DB_CONFIG = {} # type: DBConfig
DB_CONFIG["database"] = "%s/old_perth.sqlite3" % (OUTPUT_BACK_PARENT_DIR)
DB_CONFIG["drivername"] = "sqlite"
DB_CONFIG["host"] = None
DB_CONFIG["username"] = None
DB_CONFIG["password"] = None

## External
SOURCE_BASE_URL = "http://purl.slwa.wa.gov.au" # type: Url

##########################################################

@logged
def reformat_for_old_perth(records: List[ParsedRecord]) -> JSONType:
    records_out = {"photos": [
        {
            "text": None,
            "height": record["image_height"],
            "date": record["image_date_created"],
            "thumb_url": record["image_url_thumb"],
            "photo_id": record["image_id"],
            "title": record["image_note"],
            "width": record["image_width"],
            "image_url": record["image_url_raw"],
            "location": {
                "lat": record["image_latitude"],
                "lon": record["image_longitude"],
                "address": record["image_address"],
            },
            "folder": None,
            "years": [""],
            "rotation": 0,
            "popular": False,
        } for record in records if record["image_latitude"] is not None
    ]}
    return records_out

@logged
def get_query_results(db_engine: Engine) -> List[ParsedRecord]:
    with manage_db_session(db_engine) as session:
        images = session.query(
            session.query(Image)
            .subquery()
        ).all()
        images = [record._asdict() for record in images]
    return images

@logged
def prepare_records_for_export(db_engine: Engine) -> JSONType:
    records_raw = get_query_results(db_engine)
    records_clean = reformat_for_old_perth(records_raw)
    return records_clean


##########################################################

@logged
def collect_images(record: Record, **kwargs: Any) -> List[ParsedRecord]:
    images_raw = parse_images(record, **kwargs)
    collection_raw = parse_collection(record, **kwargs)
    images = [] # type: List[ParsedRecord]
    for image_raw in images_raw:
        image = {
            "image_id": image_raw["image_id"],
            "image_url_main": image_raw["image_url_main"],
            "image_url_raw": image_raw["image_url_raw"],
            "image_url_thumb": image_raw["image_url_thumb"],
            "image_note": image_raw["image_note"],
            "image_width": deep_get(image_raw, "image_dimensions", "width"),
            "image_height": deep_get(image_raw, "image_dimensions", "height"),
            "image_longitude": deep_get(image_raw, "image_location", "longitude"),
            "image_latitude": deep_get(image_raw, "image_location", "latitude"),
            "image_address": deep_get(image_raw, "image_location", "address"),
            "image_date_created": image_raw["image_date_created"],
            "collection_id": collection_raw["collection_id"],
        }
    images.append(image)
    return images


##########################################################


def parse_record(record: Record, **kwargs: Any) -> None:
    parse_record_section(record, Image, collect_images, **kwargs)


##########################################################

@logged
def prepare_data(input_file: FilePath, db_engine: Engine, **kwargs: Any) -> None:
    records_sample = parse_marcxml(input_file, **kwargs)
    parse_records(records_sample, parse_record, engine=db_engine, **kwargs)


@logged
def create_data_file(db_engine: Engine, output_file: FilePath, regenerate_flag: bool) -> None:
    if not regenerate_flag: return None
    records = prepare_records_for_export(db_engine)
    export_records_to_json(records, output_file)


@logged
def create_popular_json_file(
        input_file: FilePath,
        output_file: Optional[FilePath],
        overwrite_back_flag: bool,
        **kwargs: Any
    ) -> None:
    if output_file is None: return None
    if not overwrite_back_flag and os.path.exists(output_file): return None
    photos = json.load(open_file(input_file))['photos']
    popular_photos = {photo["photo_id"]:photo for photo in photos if photo["popular"] == True}
    with open_file(output_file, 'w+', encoding='utf-8') as outfile:
        json.dump(popular_photos, outfile, indent=2, default=json_serial)


@logged
def create_popular_photos_js_file(
        input_file: FilePath,
        output_file: Optional[FilePath],
        overwrite_back_flag: bool,
        **kwargs: Any
    ) -> None:
    if output_file is None: return None
    if not overwrite_back_flag and os.path.exists(output_file): return None
    photos = json.load(open_file(input_file))['photos']
    popular_photos_raw = [photo for photo in photos if photo["popular"] == True]
    popular_photos = [{
        "date": photo["date"],
        "loc": deep_get(photo, "location", "address"),
        "height": photo["height"],
        "desc": photo["title"]
    } for photo in popular_photos_raw]
    with open_file(output_file, 'w+', encoding='utf-8') as outfile:
        json_str = json.dumps(popular_photos, indent=2, default=json_serial)
        outfile.write("export var popular photos = {};".format(json_str))


@logged
def create_by_location_dir(
        input_file: FilePath,
        output_dir: Optional[DirPath],
        overwrite_back_flag: bool,
        **kwargs: Any
    ) -> None:
    if output_dir is None: return None
    if not overwrite_back_flag and os.path.exists(output_dir): return None
    #TODO:
    return None


@logged
def create_id4_to_location_dir(
        input_file: FilePath,
        output_dir: Optional[DirPath],
        overwrite_back_flag: bool,
        **kwargs: Any
    ) -> None:
    if output_dir is None: return None
    if not overwrite_back_flag and os.path.exists(output_dir): return None
    #TODO:
    return None


@logged
def create_rotated_assets_dir(
        input_file: FilePath,
        output_dir: Optional[DirPath],
        overwrite_back_flag: bool,
        **kwargs: Any
    ) -> None:
    if output_dir is None: return None
    if not overwrite_back_flag and os.path.exists(output_dir): return None
    generate_rotated_images(input_file, output_dir, SOURCE_BASE_URL)


@logged
def export_data(
        db_engine: Engine,
        input_file: FilePath,
        output_paths: Any,
        **kwargs: Any
    ) -> None:
    create_popular_json_file(input_file, output_paths["popular_json_file"], **kwargs) #TEST
    create_popular_photos_js_file(input_file, output_paths["popular_photos_js_file"], **kwargs) #TEST
    create_by_location_dir(input_file, output_paths["by_location_dir"], **kwargs) #TODO
    create_id4_to_location_dir(input_file, output_paths["id4_to_location_dir"], **kwargs) #TODO
    create_rotated_assets_dir(input_file, output_paths["rotated_assets_dir"], **kwargs) #TEST

def copy(src, dst, overwrite=False):
    if os.path.exists(dst):
        if not overwrite: return None
        elif os.path.isdir(dst): shutil.rmtree(dst)
        elif os.path.isfile(dst): os.unlink(dst)
        else: raise IOError
    if os.path.isdir(src): shutil.copytree(src, dst)
    elif os.path.isfile(src): shutil.copy(src, dst)
    else: raise IOError

@logged
def move_files_to_front_end(
        output_paths: Dict[str, Union[FilePath, DirPath]],
        back_parent_dir: DirPath,
        front_parent_dir: DirPath,
        overwrite_front_flag: bool = False 
    ) -> None:
    for back_path in output_paths.values():
        front_path = back_path.replace(back_parent_dir, front_parent_dir)
        copy(back_path, front_path, overwrite=overwrite_front_flag)

def main() -> None:
    db_engine = initialise_db(DB_CONFIG)
    # prepare_data(
    #     INPUT_MARCXML_FILE,
    #     db_engine, 
    #     sample_size=FLAG_SAMPLE_SIZE,
    #     geocoding_flag=FLAG_GEOCODING,
    #     dimensions_flag=FLAG_DIMENSIONS
    # )
    # create_data_file(
    #     db_engine,
    #     OUTPUT_PATHS["data_json_file"],
    #     regenerate_flag=FLAG_REGENERATE_DATA_FILE
    # )
    export_data(
        db_engine,
        OUTPUT_PATHS["data_json_file"],
        OUTPUT_PATHS,
        overwrite_back_flag=FLAG_OVERWRITE_BACK,
    )
    move_files_to_front_end(
        OUTPUT_PATHS,
        back_parent_dir=OUTPUT_BACK_PARENT_DIR,
        front_parent_dir=OUTPUT_FRONT_PARENT_DIR,
        overwrite_front_flag=FLAG_OVERWRITE_FRONT
    )


def setup_logging() -> None:
    import logging
    logging.basicConfig(level=logging.DEBUG)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.DEBUG)
    logging.getLogger("PIL.Image").setLevel(logging.INFO)
    logging.getLogger("PIL.PngImagePlugin").setLevel(logging.INFO)
    logging.getLogger("datefinder").setLevel(logging.INFO)

def setup_warnings() -> None:
    import warnings
    import sqlalchemy
    warnings.filterwarnings("ignore", category=sqlalchemy.exc.SAWarning)


if __name__ == "__main__":
    setup_logging()
    setup_warnings()
    main()

##########################################################
# Notes
