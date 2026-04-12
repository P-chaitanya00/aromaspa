import easyocr
import glob

print("Initializing EasyOCR...")
reader = easyocr.Reader(['en'], verbose=False)
print("EasyOCR initialized.")

text = ""
for f in sorted(glob.glob('menu_page_*.png')):
    print(f"Reading {f}...")
    try:
        results = reader.readtext(f, detail=0)
        text += f'--- {f} ---\n' + '\n'.join(results) + '\n\n'
    except Exception as e:
        print(f"Error reading {f}: {e}")

with open('menu_ocr.txt', 'w', encoding='utf-8') as out:
    out.write(text)
print("Finished writing to menu_ocr.txt")
