import os

import requests
import yaml

from scripts.util import get_project_root


def fetch_zotero(yml_path):
    bibs = []
    start = 0
    limit = 100

    while True:
        url = f"https://api.zotero.org/groups/2770680/collections/YREG49H9/items?format=json&sort=date&start={start}&limit={limit}"
        try:
            response = requests.get(url)
            bib = response.json()
            if not bib:
                break
        except requests.RequestException as e:
            break

        bibs.extend(bib)
        start += limit
    print(f"Fetched {len(bibs)} items from Zotero. Writing to {yml_path}")

    bibs = [{
        "DOI": bib["data"].get("DOI", ""),
        "title": bib["data"].get("title", ""),
        "url": bib["data"].get("url", ""),
        "date": bib["data"].get("date", ""),
        # "creators": bib["data"].get("creators", []),
        "authors": [
            f"{creator.get('firstName', '')} {creator.get('lastName', '')}"
            for creator in bib["data"].get("creators", [])
            if creator.get("creatorType", "") == "author"]
    } for bib in bibs]

    with open(yml_path, "w") as f:
        yaml.dump(bibs, f, allow_unicode=True)


if __name__ == "__main__":
    fetch_zotero(os.path.join(get_project_root(), "_data/zotero.yml"))
