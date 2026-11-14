import json
from playwright.sync_api import sync_playwright

OUT = r"C:\Users\Putu Ari\AppData\Local\hermes\cache\scratch"
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", headless=True, args=["--disable-gpu"])
    pg = b.new_page(viewport={"width": 1440, "height": 900})
    pg.goto("http://localhost:3000/", wait_until="load", timeout=45000)
    pg.wait_for_timeout(2500)
    facts = pg.evaluate("""() => {
      const img = document.querySelector('img[alt*="Classical marble statue"]');
      const cell = img && img.parentElement;
      const b = img && img.getBoundingClientRect();
      const c = cell && cell.getBoundingClientRect();
      return {
        imgSrc: img && img.getAttribute('src'),
        natural: img && [img.naturalWidth, img.naturalHeight],
        objectFit: img && getComputedStyle(img).objectFit,
        renderedBox: b && [Math.round(b.width), Math.round(b.height)],
        cellBox: c && [Math.round(c.width), Math.round(c.height)],
        taglinePresent: /MENJALANKAN BISNIS/i.test(document.body.innerText),
        headline: (document.querySelector('h1') || {}).innerText
      };
    }""")
    print(json.dumps(facts, indent=1, ensure_ascii=False))
    pg.screenshot(path=OUT + r"\dgt-hero.png")
    pg.set_viewport_size({"width": 390, "height": 844})
    pg.wait_for_timeout(700)
    pg.screenshot(path=OUT + r"\dgt-hero-mobile.png")
    b.close()
print("screenshots ok")
