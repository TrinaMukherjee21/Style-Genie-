import os

sizes = []
for dirpath, _, filenames in os.walk('.'):
    if '.git' in dirpath:
        continue
    for f in filenames:
        fp = os.path.join(dirpath, f)
        if not os.path.islink(fp):
            try:
                sizes.append((os.path.getsize(fp) / (1024**3), fp))
            except Exception:
                pass

sizes.sort(reverse=True)
for s, fp in sizes[:15]:
    print(f"{s:.2f} GB: {fp}")
