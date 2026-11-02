#!/usr/bin/env python3
"""Add a new project: optimises your images and prints the block to paste into js/projects-data.js.
Usage:  python3 tools/add_project.py my-project-id "Project Title" social-media path/to/img1.jpg path/to/img2.png
Category ids: social-media, banners, visiting-cards, posters, logos, packaging, invitations, brochures, other
Needs:  pip install pillow"""
import sys, os, json
from PIL import Image, ImageOps
Image.MAX_IMAGE_PIXELS = None
pid, title, cats, *files = sys.argv[1:]
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def prep(im, edge):
    im = ImageOps.exif_transpose(im)
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA'); bg = Image.new('RGB', im.size, (255, 255, 255)); bg.paste(im, mask=im.split()[3]); im = bg
    im = im.convert('RGB'); im.thumbnail((edge, edge)); return im
imgs = []
for n, f in enumerate(files, 1):
    iid = f'{pid}-{n}'; im = Image.open(f)
    full = prep(im, 1600); full.save(f'{root}/assets/img/full/{iid}.webp', 'WEBP', quality=82, method=6)
    prep(im, 720).save(f'{root}/assets/img/thumb/{iid}.webp', 'WEBP', quality=78, method=6)
    imgs.append({'id': iid, 'w': full.size[0], 'h': full.size[1], 'alt': f'{title}, design {n} of {len(files)}', 'size': ''})
block = {'id': pid, 'title': title, 'category': cats.strip(), 'brand': '', 'summary': '', 'palette': [],
         'objective': '', 'concept': '', 'process': '', 'typography': '', 'software': [], 'images': imgs}
print('Paste this inside the PROJECTS array in js/projects-data.js (add a comma after the previous project):\n')
print(json.dumps(block, indent=1, ensure_ascii=False))
