import json, os, shutil
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'pruebas'
OUT.mkdir(exist_ok=True)
results=[]
with sync_playwright() as p:
    executable=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium')
    browser=p.chromium.launch(executable_path=executable,headless=True)
    for name,width,height,kind,js,reduced in [
        ('pc-sin-internet',1440,1000,'offline',True,False),
        ('movil-sin-internet',390,844,'offline',True,False),
        ('movil-320',320,640,'offline',True,False),
        ('tableta',820,1180,'offline',True,False),
        ('horizontal',844,390,'offline',True,False),
        ('sin-javascript',390,844,'offline',False,False),
        ('movimiento-reducido',390,844,'offline',True,True)]:
        ctx=browser.new_context(viewport={'width':width,'height':height},java_script_enabled=js,reduced_motion='reduce' if reduced else 'no-preference',offline=kind=='offline')
        page=ctx.new_page(); errors=[]; requests=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.on('request',lambda r:requests.append(r.url))
        checks=[]
        def check(description,value):
            checks.append({'prueba':description,'correcta':bool(value)})
            if not value: print('FAIL',name,description)
        page.set_content(ROOT.joinpath('index.html').read_text(encoding='utf-8'),wait_until='load')
        page.wait_for_timeout(120)
        check('Sin desbordamiento horizontal en portada',page.evaluate('document.documentElement.scrollWidth <= window.innerWidth'))
        if js:
            check('Portada visible',page.locator('#intro').is_visible())
            check('Carta oculta hasta abrir',not page.locator('#experience').is_visible())
            if name=='pc-sin-internet': page.screenshot(path=str(OUT/'portada-pc.png'))
            if name=='movil-sin-internet': page.screenshot(path=str(OUT/'portada-movil.png'))
            page.locator('#open-experience').click(); page.wait_for_timeout(550)
            check('Boton abrir muestra carta',page.locator('#experience').is_visible() and not page.locator('#intro').is_visible())
            check('Mensaje completo disponible inmediatamente',len(page.locator('#birthday-message').inner_text())>1150)
            check('Viaje oculto antes de revelar',not page.locator('#trip-section').is_visible())
            page.locator('#reveal-trip').click(); page.wait_for_timeout(900)
            check('Regalo visible',page.locator('#trip-section').is_visible())
            check('Cierre visible',page.locator('#final-section').is_visible())
            check('Fecha correcta','2027' in page.locator('#ticket-valid-until').inner_text())
            check('No desbordamiento horizontal con regalo',page.evaluate('document.documentElement.scrollWidth <= window.innerWidth'))
            check('Boton indica estado abierto',page.locator('#reveal-trip').get_attribute('aria-expanded')=='true')
            if name=='pc-sin-internet': page.screenshot(path=str(OUT/'regalo-pc.png'),full_page=True)
            if name=='movil-sin-internet': page.screenshot(path=str(OUT/'regalo-movil.png'),full_page=True)
            page.locator('#celebrate-again').click(); page.wait_for_timeout(100)
            check('Confeti respeta movimiento reducido',page.locator('.confetti').count()==(0 if reduced else 72))
            for _ in range(3): page.locator('#celebrate-again').click()
            check('Confeti no se acumula con clics repetidos',page.locator('.confetti').count()<73)
            page.locator('#back-to-cover').click()
            check('Volver a portada funciona',page.locator('#intro').is_visible() and not page.locator('#experience').is_visible())
            page.locator('#open-experience').focus(); page.keyboard.press('Enter')
            page.locator('#reveal-trip').focus(); page.keyboard.press('Enter')
            check('Apertura y regalo con teclado',page.locator('#trip-section').is_visible())
        else:
            check('Mensaje legible sin JavaScript',page.locator('#birthday-message').is_visible())
            check('Regalo legible sin JavaScript',page.locator('#trip-section').is_visible())
        external=[r for r in requests if r.startswith('http') and not r.startswith('http://127.0.0.1:8766')]
        check('Sin solicitudes a servicios externos',len(external)==0)
        check('Sin errores de JavaScript',len(errors)==0)
        results.append({'escenario':name,'correcto':all(c['correcta'] for c in checks),'comprobaciones':checks,'errores':errors,'peticiones_externas':external})
        ctx.close()
    browser.close()
OUT.joinpath('resultados.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps([{'escenario':r['escenario'],'correcto':r['correcto'],'pruebas':len(r['comprobaciones'])} for r in results],ensure_ascii=False,indent=2))
if not all(r['correcto'] for r in results): raise SystemExit(1)
