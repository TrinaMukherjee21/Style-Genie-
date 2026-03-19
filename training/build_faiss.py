# training/build_faiss.py
"""
Reads product_embeddings.pkl and builds FAISS indices for image & text embeddings.
Saves:
- data/models/faiss_index_image.index
- data/models/faiss_meta_image.pkl  (mapping from index pos -> product_id)
- data/models/faiss_index_text.index
- data/models/faiss_meta_text.pkl
"""

import pickle, os
import numpy as np
from pathlib import Path
import faiss

EMB_FILE = "data/models/product_embeddings.pkl"
OUT_DIR = "data/models"

def main():
    Path(OUT_DIR).mkdir(parents=True, exist_ok=True)
    with open(EMB_FILE, "rb") as f:
        data = pickle.load(f)

    product_ids = data["product_ids"]
    image_embs = data["image_embeddings"]  # list with possibly None
    text_embs = data["text_embeddings"]

    # Build arrays only for valid entries
    valid_img_idxs = [i for i, e in enumerate(image_embs) if e is not None]
    if valid_img_idxs:
        img_matrix = np.vstack([image_embs[i] for i in valid_img_idxs]).astype("float32")
        d = img_matrix.shape[1]
        index_img = faiss.IndexFlatIP(d)  # inner-product (use cosine after normalization)
        faiss.normalize_L2(img_matrix)
        index_img.add(img_matrix)
        faiss.write_index(index_img, os.path.join(OUT_DIR, "faiss_index_image.index"))
        meta_img = {"valid_idxs": valid_img_idxs, "product_ids": product_ids}
        with open(os.path.join(OUT_DIR, "faiss_meta_image.pkl"), "wb") as f:
            pickle.dump(meta_img, f)
        print("Saved image FAISS index:", img_matrix.shape)
    else:
        print("No image embeddings to index.")

    valid_text_idxs = [i for i, e in enumerate(text_embs) if e is not None]
    if valid_text_idxs:
        text_matrix = np.vstack([text_embs[i] for i in valid_text_idxs]).astype("float32")
        d = text_matrix.shape[1]
        index_text = faiss.IndexFlatIP(d)
        faiss.normalize_L2(text_matrix)
        index_text.add(text_matrix)
        faiss.write_index(index_text, os.path.join(OUT_DIR, "faiss_index_text.index"))
        meta_text = {"valid_idxs": valid_text_idxs, "product_ids": product_ids}
        with open(os.path.join(OUT_DIR, "faiss_meta_text.pkl"), "wb") as f:
            pickle.dump(meta_text, f)
        print("Saved text FAISS index:", text_matrix.shape)
    else:
        print("No text embeddings to index.")

if __name__ == "__main__":
    main()
