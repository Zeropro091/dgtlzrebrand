# Verify the generated paper PDF: page count and key content checkpoints
from pypdf import PdfReader

p = r"C:\Users\Putu Ari\Desktop\dgt remake minimalist\dgt-remake\public\case_study_paper_payment_dgtlz.pdf"
r = PdfReader(p)
print("pages:", len(r.pages))
full = ""
for i, pg in enumerate(r.pages):
    t = pg.extract_text() or ""
    full += f"\n--- PAGE {i+1} ---\n" + t

checks = ["REKAYASA", "Abstrak", "Tabel 1", "Tabel 2", "Gambar 1", "Hevner",
          "PBI", "DAFTAR PUSTAKA", "double-entry", "Xendit", "non-kustodian",
          "Kata kunci", "Peffers"]
print("total chars:", len(full))
for c in checks:
    print(f"{c!r}: {full.count(c)} occurrences")
print("=== FIRST PAGE (first 1300 chars) ===")
print(full[:1300])
