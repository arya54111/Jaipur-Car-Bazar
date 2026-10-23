const CARSVG='<svg viewBox="0 0 120 50" width="120" fill="none" stroke="#D8B574" stroke-width="1.5" aria-hidden="true"><path d="M6 36c0-5 3-8 9-9l14-3 11-10c2-2 5-3 8-3h22c3 0 6 1 9 3l10 9 15 3c4 1 6 4 6 8v3H6z" stroke-linejoin="round"/><circle cx="30" cy="38" r="6"/><circle cx="92" cy="38" r="6"/></svg><br>Photo coming soon';
/* ===== CONFIG – edit these ===== */
const PHONE="918852000008";
const WA_MSG="Hello Jaipur Car Bazar! I am looking for a pre-owned car. Please share your currently available cars, prices, and details.";
const GOOGLE_REVIEWS_URL=""; // paste verified Google Business review link
const FORM_ENDPOINT="";      // e.g. Formspree/Netlify endpoint URL
/* Real stock goes here. Fields: id,make,model,year,fuel,trans,body,km,price,image */
const INVENTORY=[];
/* Visible only at #demo – clearly labelled sample data, NOT real stock */
const DEMO=[{id:"d1",make:"Sample",model:"Sedan A",year:2019,fuel:"Petrol",trans:"Manual",body:"Sedan",km:42000,price:650000},{id:"d2",make:"Sample",model:"SUV B",year:2021,fuel:"Diesel",trans:"Automatic",body:"SUV",km:28000,price:1450000},{id:"d3",make:"Demo",model:"Hatch C",year:2017,fuel:"CNG",trans:"Manual",body:"Hatchback",km:61000,price:380000}];
const $=s=>document.querySelector(s),waURL=m=>`https://wa.me/${PHONE}?text=${encodeURIComponent(m||WA_MSG)}`;
document.querySelectorAll("[data-wa]").forEach(a=>{a.href=waURL();a.target="_blank";a.rel="noopener"});
$("#yr").textContent=new Date().getFullYear();
const addr="Jaipur Car Bazar Roopam Enclave A-15 Sikar Road Vidyadhar Nagar Jaipur Rajasthan 302039",q=encodeURIComponent(addr);
$("#mp").src=`https://www.google.com/maps?q=${q}&output=embed`;
$("#dir").href=`https://www.google.com/maps/search/?api=1&query=${q}`;
$("#gr").href=GOOGLE_REVIEWS_URL||`https://www.google.com/maps/search/?api=1&query=${q}`;
/* nav */
const hd=$("#hd"),bg=$("#bg"),lk=$("#lk");
addEventListener("scroll",()=>hd.classList.toggle("s",scrollY>20),{passive:true});
bg.onclick=()=>{const o=lk.classList.toggle("o");bg.setAttribute("aria-expanded",o)};
lk.querySelectorAll("a").forEach(a=>a.onclick=()=>{lk.classList.remove("o");bg.setAttribute("aria-expanded","false")});
/* reveal */
const io=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}}),{threshold:.15});
document.querySelectorAll(".rev").forEach(el=>io.observe(el));
/* subtle parallax */
const ci=$("#carimg");
if(!matchMedia("(prefers-reduced-motion:reduce)").matches)addEventListener("scroll",()=>{if(scrollY<700)ci.style.transform=`translateY(${scrollY*.06}px)`},{passive:true});
/* inventory */
const inv=$("#inv"),F={q:$("#q"),b:$("#fb"),p:$("#fp"),f:$("#ff"),t:$("#ft"),y:$("#fy"),s:$("#so")};
const data=location.hash==="#demo"?DEMO:INVENTORY,demo=data===DEMO;
[...new Set(data.map(c=>c.make))].sort().forEach(m=>F.b.add(new Option(m,m)));
const fmt=n=>"₹"+n.toLocaleString("en-IN");
function empty(){inv.innerHTML=`<div class="empty" style="grid-column:1/-1"><h3>Looking for a specific car?</h3><p>Tell us what you need, and our team can help you explore available options.</p><a class="btn b1" href="${waURL()}" target="_blank" rel="noopener">Find My Car on WhatsApp</a></div>`}
function render(){
 let l=data.filter(c=>{const [lo,hi]=F.p.value?F.p.value.split("-").map(Number):[0,1e12];
  return (!F.q.value||(c.make+" "+c.model).toLowerCase().includes(F.q.value.toLowerCase()))&&(!F.b.value||c.make===F.b.value)&&c.price>=lo&&c.price<=hi&&(!F.f.value||c.fuel===F.f.value)&&(!F.t.value||c.trans===F.t.value)&&(!F.y.value||c.body===F.y.value)});
 const s=F.s.value;if(s)l.sort((a,b)=>s==="pa"?a.price-b.price:s==="pd"?b.price-a.price:s==="yn"?b.year-a.year:a.year-b.year);
 if(!l.length)return empty();
 inv.innerHTML=l.map(c=>{const t=`${c.year} ${c.make} ${c.model}`;return `<article class="card"><div class="ph">${c.image?`<img src="${c.image}" alt="${t}" loading="lazy" style="width:100%;height:100%;object-fit:cover">`:CARSVG}</div><div class="bd">${demo?'<span class="tag">SAMPLE LISTING – NOT REAL STOCK</span>':""}<h3>${c.make} ${c.model}</h3><div class="meta"><span>${c.year}</span><span>${c.fuel}</span><span>${c.trans}</span><span>${c.km.toLocaleString("en-IN")} km</span></div><div class="price">${fmt(c.price)}</div><a class="btn b3" href="${waURL("Hello Jaipur Car Bazar! I would like details on the "+t+".")}" target="_blank" rel="noopener">View Details</a> <a class="btn b2" href="${waURL("Hello Jaipur Car Bazar! I am interested in the "+t+". Is it available?")}" target="_blank" rel="noopener">WhatsApp Enquiry</a></div></article>`}).join("");
}
inv.innerHTML='<div class="skel"></div><div class="skel"></div><div class="skel"></div>';
setTimeout(render,400);
Object.values(F).forEach(e=>e.addEventListener("input",render));
$("#clr").onclick=()=>{Object.values(F).forEach(e=>e.value="");render()};
addEventListener("hashchange",()=>{if(location.hash==="#demo")location.reload()});
/* form */
const cf=$("#cf"),fs=$("#fs");
cf.addEventListener("submit",async e=>{
 e.preventDefault();let ok=true;
 cf.querySelectorAll("[required]").forEach(i=>{const bad=!i.value.trim()||(i.name==="phone"&&!/^[+\d][\d\s-]{8,}$/.test(i.value.trim()));i.setAttribute("aria-invalid",bad);i.nextElementSibling.textContent=bad?(i.name==="phone"?"Enter a valid phone number.":"This field is required."):"";if(bad)ok=false});
 if(!ok){fs.className="no";fs.textContent="Please fix the highlighted fields.";return}
 const d=Object.fromEntries(new FormData(cf));
 if(!FORM_ENDPOINT){fs.className="no";fs.innerHTML=`Online form delivery isn’t set up yet, so nothing was sent. <a style="text-decoration:underline" target="_blank" rel="noopener" href="${waURL(`Hello Jaipur Car Bazar! My name is ${d.name}, phone ${d.phone}. Looking for: ${d.pref||"-"}. ${d.msg||""}`)}">Send this via WhatsApp instead</a>.`;return}
 try{const r=await fetch(FORM_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(d)});if(!r.ok)throw 0;fs.className="ok";fs.textContent="Thank you! Our team will contact you soon.";cf.reset()}
 catch{fs.className="no";fs.textContent="Sorry, your message could not be sent. Please call or WhatsApp us."}
});

/* ===== Brands ===== */
const BRANDS=["Maruti Suzuki","Hyundai","Tata","Mahindra","Honda","Toyota","Kia","Volkswagen","Skoda","Renault","Ford","MG"];
$("#bgrid").innerHTML=BRANDS.map(b=>`<a class="bc rev" target="_blank" rel="noopener" href="${waURL("Hello Jaipur Car Bazar! Do you have any "+b+" cars available? Please share details and prices.")}"><svg viewBox="0 0 120 50" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 36c0-5 3-8 9-9l14-3 11-10c2-2 5-3 8-3h22c3 0 6 1 9 3l10 9 15 3c4 1 6 4 6 8v3H6z" stroke-linejoin="round"/><circle cx="30" cy="38" r="6"/><circle cx="92" cy="38" r="6"/></svg><b>${b}</b><span>Ask on WhatsApp →</span></a>`).join("");
document.querySelectorAll(".bc").forEach(el=>io.observe(el));

/* ===== WhatsApp chat widget ===== */
const wp=$("#wp"),wab=$("#wab"),tip=$("#tip");
const CHIPS=["🚗 Show available cars","💰 Cars under ₹5 lakh","🚙 I want an SUV","⚙️ Automatic cars","🚚 Is delivery available?","📍 I want to visit the showroom"];
$("#chips").innerHTML=CHIPS.map(c=>`<a class="chip" target="_blank" rel="noopener" href="${waURL("Hello Jaipur Car Bazar! "+c.replace(/^\S+\s/,""))}">${c}</a>`).join("");
function togglePanel(open){wp.hidden=!open;wab.setAttribute("aria-expanded",open);tip.style.display=open?"none":"";if(open)$("#wi").focus()}
wab.onclick=()=>togglePanel(wp.hidden);$("#wx").onclick=()=>togglePanel(false);
addEventListener("keydown",e=>{if(e.key==="Escape")togglePanel(false)});
$("#wf").addEventListener("submit",e=>{e.preventDefault();const v=$("#wi").value.trim();window.open(waURL(v?"Hello Jaipur Car Bazar! "+v:WA_MSG),"_blank","noopener")});
setTimeout(()=>{if(wp.hidden)tip.classList.add("show")},3000);

