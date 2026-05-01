# src/chatbot/image_vault.py
import random

# A robust, curated vault of high-quality Unsplash image IDs for fashion.
# Categorized by gender and clothing type to ensure accuracy.
IMAGE_VAULT = {
    "men": {
        "tops": [
            "1521572163474-6864f9cf17ab", "1617137984095-74e4e5e3613f", "1598033129183-c4f50c7176c8", 
            "1583743814966-8936f5b7be1a", "1556821840-3a63f95609a7", "1503342394128-c104d54dba01",
            "1512436991641-6745cdb1723f", "1576566588028-4147f3842f27", "1507679717677-7e9972c8fe59"
        ],
        "bottoms": [
            "1541099649105-f69ad21f3246", "1473966968600-fa801b869a1a", "1624378439575-d6ececf5cb5e",
            "1584865288642-4ce26bb02497", "1515904071869-bc78b301f237", "1567015509-b4b6fc70c8ae"
        ],
        "outerwear": [
            "1593032465175-481ac7f401a0", "1551028719-00167b16eac5", "1525450824786-227cbef70703",
            "1495105787522-5334e3ef0e27", "1504593811411-9b177239cc84", "1519501025264-65ba15a82390"
        ],
        "shoes": [
            "1549298916-b41d501d3772", "1542291026-7eec264c27ff", "1608256246200-53e8b694267f",
            "1595950653106-6c9ebd61f138", "1603808033192-082d6919d3e1", "1543163521-1bf539c55dd2"
        ],
        "accessories": [
            "1511499767150-a48a237f0083", "1611652022419-a9419f74343d", "1546868871853-1f19fbb1fd9c",
            "1523275335684-37898b6baf30", "1585123334902-39bd21307b6f"
        ]
    },
    "women": {
        "tops": [
            "1434389677669-e08b4cac3105", "1564557287817-3785e38ec1f5", "1515886657613-9f3515b0c78f",
            "1503341455253-b2e723bb3dbb", "1485230895920-ed8202aa90cc"
        ],
        "bottoms": [
            "1541099649105-f69ad21f3246", "1509631179647-0c4464d4cd4f", "1582533561751-ebdf14d2417e",
            "1450243100148-0c33a2ebbd23", "1602330107255-a4f6cf6be8ed"
        ],
        "outerwear": [
            "1551028719-00167b16eac5", "1509631179647-0c4464d4cd4f", "1554412933-685b57d6e87f",
            "1532453288672-3a27e9be2efd"
        ],
        "dresses": [
            "1469334031218-e382a71b716b", "1515372039744-b8f02a3ae446", "1595777457583-95e059d581b8",
            "1495385794353-8186ebba2665", "1566206091558-4f11ef3ed5c3"
        ],
        "shoes": [
            "1544966503-7cc5ac882d5b", "1543163521-1bf539c55dd2", "1515347619363-d14207f21eec",
            "1564584217132-2271feaeb3c5", "1534653631-0df08e983411"
        ],
        "accessories": [
            "1553062407-98eeb64c6a62", "1606760227091-3dd870d97f1d", "1548036328-c1571e7d2836",
            "1515562141206-a453af28148b", "1599643478514-46b38cffccaf"
        ]
    },
    "unisex": {
        "tops": ["1521572163474-6864f9cf17ab", "1564557287817-3785e38ec1f5"],
        "outerwear": ["1551028719-00167b16eac5", "1593032465175-481ac7f401a0"],
        "bottoms": ["1541099649105-f69ad21f3246", "1624378439575-d6ececf5cb5e"],
        "shoes": ["1549298916-b41d501d3772", "1542291026-7eec264c27ff"],
        "accessories": ["1511499767150-a48a237f0083", "1611652022419-a9419f74343d"]
    }
}

def get_smart_image(gender: str, category: str) -> str:
    """
    Returns a high-quality Unsplash image URL based on gender and category.
    Includes smart fallbacks.
    """
    g = gender.lower()
    if g not in ["men", "women", "unisex", "male", "female"]:
        g = "unisex"
    
    if g == "male": g = "men"
    if g == "female": g = "women"

    cat = category.lower()
    
    # Fuzzy matching for categories returned by AI
    mapped_cat = "tops"
    if any(x in cat for x in ["shirt", "top", "t-shirt", "tee", "sweater", "hoodie"]):
        mapped_cat = "tops"
    elif any(x in cat for x in ["pant", "jeans", "trouser", "short", "bottom", "skirt"]):
        mapped_cat = "bottoms"
    elif any(x in cat for x in ["jacket", "coat", "blazer", "outerwear"]):
        mapped_cat = "outerwear"
    elif any(x in cat for x in ["shoe", "sneaker", "boot", "footwear", "heel", "sandal"]):
        mapped_cat = "shoes"
    elif any(x in cat for x in ["dress", "gown", "jumpsuit"]):
        mapped_cat = "dresses" if g == "women" else "tops"
    elif any(x in cat for x in ["accessory", "jewelry", "bag", "watch", "sunglasses", "hat", "cap"]):
        mapped_cat = "accessories"

    options = IMAGE_VAULT.get(g, {}).get(mapped_cat, [])
    
    if not options:
        # Fallback to unisex if specific gender/category combo is empty
        options = IMAGE_VAULT.get("unisex", {}).get(mapped_cat, [])
        
    if not options:
        # Ultimate fallback
        options = ["1556905055-8f358a7a47b2"]

    selected_id = random.choice(options)
    # High-quality dynamic crop for mobile/card views
    return f"https://images.unsplash.com/photo-{selected_id}?w=600&h=800&fit=crop&auto=format&q=80"
