#!/usr/bin/env python
'''Generates rotated versions of static images.

This winds up being way simpler than trying to apply the rotations in the
client's browser.

Input:  data.json
Output: rotated-assets/{thumb,600px}/*.jpg

This won't overwrite existing files (i.e. it's incremental).
'''

import json
import os
import sys
import time
from io import BytesIO

import requests
import shutil
from PIL import Image
from thickshake.utils import open_file

def download(url, destination_path):
    response = requests.get(url, stream=True)
    im = Image.open(BytesIO(response.content))
    with open_file(destination_path, 'wb') as out_file:
        shutil.copyfileobj(response.raw, out_file)
    return im

def image_path(output_dir, photo_id, degrees, is_thumb):
    folder = 'thumb' if is_thumb else '600px'
    extension = 'png' if is_thumb else 'jpg'
    return '%s/%s/%s.%s.%s' % (output_dir, folder, photo_id, degrees, extension)


def image_url(base_url, photo_id, is_thumb):
    extension = 'png' if is_thumb else 'jpg'
    return '%s/%s.%s' % (base_url, photo_id, extension)


def generate_rotated_images(input_file, output_dir, base_url) -> None:
    work = []  # (photo_id, degrees) tuples
    for photo in json.load(open_file(input_file))['photos']:
        degrees = photo.get('rotation')
        if not degrees:
            continue

        photo_id = photo['photo_id']
        if not os.path.exists(image_path(output_dir, photo_id, degrees, is_thumb=False)):
            work.append((photo_id, degrees))

    print('Will generate %d rotated images and thumbnails' % len(work))

    for photo_id, degrees in work:
        for is_thumb in (False, True):
            temp_dest = '/tmp/%s.jpg' % photo_id
            final_dest = image_path(output_dir, photo_id, degrees, is_thumb)
            url = image_url(base_url, photo_id, is_thumb)
            sys.stderr.write('Fetching %s --> %s\n' % (url, final_dest))
            im = download(url, temp_dest)
            #im = Image.open(open_file(temp_dest))
            if degrees == 0:
                return None
            elif degrees == 90: 
                im = im.transpose(Image.ROTATE_270)
            elif degrees == 180:
                im = im.transpose(Image.ROTATE_180)
            elif degrees == 270:
                im = im.transpose(Image.ROTATE_90)
            else:
                raise ValueError('Invalid rotation: %d' % degrees)
            im.save(final_dest)
        time.sleep(1)

