# Build DGTLZ payment paper PDF from markdown via Chrome headless
import os, re, shutil, subprocess, sys, tempfile, markdown

SRC = r"C:\Users\Putu Ari\Downloads\dgtlz-payment-case-study.md"
IMG = r"C:\Users\Putu Ari\Downloads\flow_payment_submerchant_dgtlz.png"
OUT = r"C:\Users\Putu Ari\Desktop\dgt remake minimalist\dgt-remake\public\case_study_paper_payment_dgtlz.pdf"
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

build = tempfile.mkdtemp(prefix="dgtlz_paper_")
shutil.copy(IMG, os.path.join(build, "figure1.png"))

md = open(SRC, encoding="utf-8").read()
md = md.replace("(flow_payment_submerchant_dgtlz.png)", "(figure1.png)")

body = markdown.markdown(md, extensions=["tables", "fenced_code"])

css = """
@page { size: A4; margin: 20mm 19mm 22mm 19mm; }
* { box-sizing: border-box; }
body { font-family: Georgia, 'Times New Roman', serif; font-size: 10.5pt;
       line-height: 1.58; color: #14141a; text-align: justify; margin: 0; }
p { margin: 0 0 7pt 0; orphans: 3; widows: 3; }
em { color: #333; }
h1 { font-size: 14.5pt; text-align: center; text-transform: uppercase;
     letter-spacing: 0.02em; line-height: 1.3; margin: 10pt 0 4pt 0; }
h2 { font-size: 12pt; margin: 16pt 0 6pt 0; page-break-after: avoid;
     border-bottom: 1.2pt solid #14141a; padding-bottom: 2pt; }
h3 { font-size: 10.5pt; margin: 11pt 0 4pt 0; page-break-after: avoid; }
hr { border: none; border-top: 0.6pt solid #bbb; margin: 12pt 0; }
blockquote { margin: 8pt 18pt; padding: 6pt 10pt; border-left: 2.5pt solid #0B17EF;
             background: #f3f4ff; font-style: italic; }
blockquote p { margin: 0; }
table { border-collapse: collapse; width: 100%; font-size: 8.3pt; margin: 8pt 0 10pt 0;
        font-family: Georgia, serif; }
th { background: #14141a; color: #fff; font-weight: bold; padding: 3.5pt 5pt;
     text-align: left; border: 0.5pt solid #14141a; }
td { border: 0.5pt solid #9a9aa2; padding: 3.5pt 5pt; vertical-align: top; }
tr { page-break-inside: avoid; }
pre { font-family: 'Cascadia Mono', Consolas, 'Courier New', monospace;
      font-size: 7.4pt; line-height: 1.45; background: #f5f5f7;
      border: 0.5pt solid #d5d5dc; border-left: 2.5pt solid #0B17EF;
      padding: 7pt 9pt; white-space: pre-wrap; word-wrap: break-word;
      text-align: left; margin: 7pt 0 9pt 0; }
code { font-family: 'Cascadia Mono', Consolas, 'Courier New', monospace;
       font-size: 8.6pt; background: #f0f0f4; padding: 0.5pt 2.5pt; }
pre code { background: none; padding: 0; font-size: 7.4pt; }
img { display: block; margin: 8pt auto 4pt auto; max-width: 100%;
      max-height: 190mm; }
strong { color: #000; }
/* Series header block (first elements before first h2) */
body > p:first-child { text-align: center; font-style: italic; color: #0B17EF;
                       font-size: 9pt; letter-spacing: 0.06em; }
h1 + p { text-align: center; }
"""

html = f"""<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<title>DGTLZ Payment Orchestration Paper</title>
<style>{css}</style>
</head>
<body>
{body}
</body>
</html>"""

html_path = os.path.join(build, "paper.html")
open(html_path, "w", encoding="utf-8").write(html)

cmd = [CHROME, "--headless", "--disable-gpu", "--no-pdf-header-footer",
       "--virtual-time-budget=15000",
       f"--print-to-pdf={OUT}", f"file:///{html_path.replace(os.sep, '/')}"]
r = subprocess.run(cmd, capture_output=True, text=True, timeout=180)
print("chrome rc:", r.returncode, r.stderr[:300])
print("exists:", os.path.exists(OUT), "size:", os.path.getsize(OUT) if os.path.exists(OUT) else 0)
print("build dir:", build)
