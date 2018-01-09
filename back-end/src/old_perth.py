##########################################################
# Standard Library Imports

##########################################################
# Third Party Imports

##########################################################
# Local Imports

import sys; sys.path.append("/home/app/src/lib/")

from parse import (
    parse_images, parse_collection,
    parse_records, parse_record_section,
    parse_marcxml, deep_get, logged,
)
from database import (
    initialise_db, manage_db_session, export_records_to_json,
)
from schema import Image
from _types import (
    Any, List, Dict, Optional,
    ParsedRecord, DBConfig, FilePath, DirPath, JSONType,
    Record, Engine,
)

##########################################################
# Environmental Variables

PROJECT_DIRECTORY = "/home/app/src/scripts/old_perth" # type: DirPath
OUTPUT_DIRECTORY = "/home/app/data/output/old_perth" # type: DirPath
INPUT_MARCXML_FILE = "/home/app/data/input/metadata/marc21.xml" # type: FilePath
INPUT_SAMPLE_SIZE = 10 # type: Optional[int]

FLAG_GEOCODING = True # type: bool
FLAG_DIMENSIONS = True # type: bool

OUTPUT_FILE = "%s/old_perth.json" % (OUTPUT_DIRECTORY) # type: FilePath

DB_CONFIG = {} # type: DBConfig
DB_CONFIG["database"] = "%s/old_perth.sqlite3" % (OUTPUT_DIRECTORY)
DB_CONFIG["drivername"] = "sqlite"
DB_CONFIG["host"] = None
DB_CONFIG["username"] = None
DB_CONFIG["password"] = None

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
                "lon": record["image_longitude"]
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
            "image_longitude": deep_get(image_raw, "image_coordinates", "longitude"),
            "image_latitude": deep_get(image_raw, "image_coordinates", "latitude"),
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
def main() -> None:
    #records_sample = parse_marcxml(INPUT_MARCXML_FILE, INPUT_SAMPLE_SIZE)
    db_engine = initialise_db(DB_CONFIG)
    #parse_records(records_sample, parse_record, engine=db_engine, geocoding_flag=FLAG_GEOCODING, dimensions_flag=FLAG_DIMENSIONS)
    records_out = prepare_records_for_export(db_engine)
    export_records_to_json(records_out, OUTPUT_FILE)


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
