import os

import yaml

from scripts.util import get_project_root, slugify


def generate_profiles():
    members_yaml_path = os.path.join(get_project_root(), "_data", "members.yaml")
    with open(members_yaml_path, "r") as f:
        members = yaml.safe_load(f)

    member_types = ["xai", "alumni", "others"]
    member_names = []
    for member_type in member_types:
        member_names.extend([m["name"] for m in members[member_type]])

    for member_name in member_names:
        profile_path = os.path.join(get_project_root(), "_profiles", f"{slugify(member_name)}.md")
        profile_content = \
            f"""---
layout: profile
name: {member_name}
---
"""
        with open(profile_path, "w") as f:
            f.write(profile_content.strip() + "\n")


if __name__ == '__main__':
    generate_profiles()
