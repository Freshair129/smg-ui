import subprocess, tempfile, json
from pathlib import Path
NODE=r'C:\Users\pc\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
CLI=r'C:\Users\pc\AppData\Local\npm-cache\_npx\6de2aa2fded2970c\node_modules\agent-browser\bin\agent-browser.js'
OUT=Path('docs/qa-home-story'); OUT.mkdir(exist_ok=True)
def browser(*args,script=None):
    with tempfile.TemporaryFile(mode='w+',encoding='utf-8') as f:
        p=subprocess.run([NODE,CLI,'--session','smg-story',*map(str,args)],input=script,text=True,encoding='utf-8',stdout=f,stderr=subprocess.STDOUT,timeout=45)
        f.seek(0); text=f.read()
    assert p.returncode==0,text
    return text
browser('open','http://localhost:8080/?v=5.2#archive')
for w,h in [(390,844),(430,932),(1366,768)]:
    browser('set','viewport',w,h)
    browser('open','http://localhost:8080/?v=5.2#archive')
    browser('reload')
    browser('wait','--load','networkidle')
    result=browser('eval','--stdin',script="""(async()=>{
      const wait=()=>new Promise(r=>setTimeout(r,1200));
      const images=[...document.querySelectorAll('.bp-card img')];
      if(images.length!==7||images.some(i=>!i.complete||!i.naturalWidth||!i.src.includes('/assets/smartgift/'))) throw Error('images');
      const headings=[...document.querySelectorAll('.home-story-heading h2')];
      const samples=[];
      for(const heading of [...headings,...headings.slice().reverse()]) {
        scrollTo(0,0); await wait();
        scrollTo(0,heading.getBoundingClientRect().top-100); await wait();
        const rect=heading.getBoundingClientRect();
        if(rect.left<0||rect.right>innerWidth+1||rect.top<0||rect.bottom>innerHeight) throw Error('heading clipping '+heading.textContent);
        samples.push({title:heading.textContent,top:rect.top});
      }
      scrollTo(0,document.documentElement.scrollHeight); await wait();
      if(Number(getComputedStyle(document.querySelector('#outro-overlay')).opacity)<.99) throw Error('outro');
      scrollTo(0,innerHeight); await wait();
      if(Number(getComputedStyle(document.querySelector('#outro-info')).opacity)>.01) throw Error('hero info overlaps story');
      return {status:'PASS',width:innerWidth,images:images.length,headings:samples,overflow:document.documentElement.scrollWidth>innerWidth};
    })()""")
    assert 'PASS' in result,result
    (OUT/f'{w}.json').write_text(result,encoding='utf-8')
    browser('screenshot',OUT/f'{w}.png')
    print(result,flush=True)
print(browser('errors'),flush=True)

