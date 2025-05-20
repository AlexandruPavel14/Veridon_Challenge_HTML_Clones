import sys
import os
import shutil
from bs4 import BeautifulSoup
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import AgglomerativeClustering

# ✅ Check CLI arg
if len(sys.argv) < 2:
    print("❌ No path provided")
    sys.exit(1)

BASE_PARENT_FOLDER = sys.argv[1]

def extract_text_and_tags(html):
    soup = BeautifulSoup(html, "html.parser")
    text = soup.get_text(separator=' ', strip=True)
    tags = [tag.name for tag in soup.find_all()]
    return ' '.join(tags), text

def load_html_files(folder_path):
    data = []
    filenames = []
    for fname in os.listdir(folder_path):
        if not fname.lower().endswith(".html"):
            continue
        full_path = os.path.join(folder_path, fname)
        with open(full_path, 'r', encoding='utf-8') as f:
            html = f.read()
        tags, text = extract_text_and_tags(html)
        data.append(tags + " " + text)
        filenames.append(fname)
    return filenames, data

def process_folder(input_folder, output_folder):
    print(f"\n🔍 Processing folder: {input_folder}")

    # ❌ Remove old output folder if it exists
    if os.path.exists(output_folder):
        shutil.rmtree(output_folder)

    os.makedirs(output_folder, exist_ok=True)

    filenames, documents = load_html_files(input_folder)
    if not documents:
        print("⚠️ No HTML files found. Skipping.")
        return

    vectorizer = TfidfVectorizer().fit_transform(documents)
    clustering = AgglomerativeClustering(n_clusters=None, distance_threshold=1.5).fit(vectorizer.toarray())

    groups = {}
    for file, label in zip(filenames, clustering.labels_):
        groups.setdefault(label, []).append(file)

    print(f"📦 Found {len(groups)} clusters")

    for label, files in groups.items():
        group_folder = os.path.join(output_folder, f"group_{label}")
        os.makedirs(group_folder, exist_ok=True)
        for fname in files:
            src_path = os.path.join(input_folder, fname)
            dst_path = os.path.join(group_folder, fname)
            shutil.copy(src_path, dst_path)

    print(f"✅ Output saved to {output_folder}")

# ✅ Loop over tier folders or *_grouped_output folders
for entry in os.listdir(BASE_PARENT_FOLDER):
    input_path = os.path.join(BASE_PARENT_FOLDER, entry)

    if not os.path.isdir(input_path):
        continue

    # Skip already processed group folders as input
    if entry.endswith("_grouped_output"):
        continue

    # Use entry_grouped_output as output
    output_name = f"{entry}_grouped_output"
    output_path = os.path.join(BASE_PARENT_FOLDER, output_name)

    process_folder(input_path, output_path)
