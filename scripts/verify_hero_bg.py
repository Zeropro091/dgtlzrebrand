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
      const header = document.querySelector('header');
      const h1 = document.querySelector('h1');
      const cs = img && getComputedStyle(img);
      const wrap = img && img.parentElement;
      const wcs = wrap && getComputedStyle(wrap);
      const r = el => { const b = el.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; };
      return {
        headerBox: r(header),
        imgBox: r(img),
        wrapBox: r(wrap),
        wrapPosition: wcs && wcs.position,
        imgObjectFit: cs && cs.objectFit,
        headlineBox: r(h1),
        headlineZ: getComputedStyle(h1.parentElement).zIndex,
        overlapsHeadline: (() => { const a = img.getBoundingClientRect(), t = h1.getBoundingClientRect();
          return !(t.right < a.left || t.left > a.right || t.bottom < a.top || t.top > a.bottom); })(),
        taglinePresent: /MENJALANKAN BISNIS/i.test(document.body.innerText)
      };
    }""")
    print(json.dumps(facts, indent=1, ensure_ascii=False))
    pg.screenshot(path=OUT + r"\dgt-hero-bg.png")
    pg.set_viewport_size({"width": 390, "height": 844})
    pg.wait_for_timeout(700)
    pg.screenshot(path=OUT + r"\dgt-hero-bg-mobile.png")
    b.close()
print("screenshots ok")
