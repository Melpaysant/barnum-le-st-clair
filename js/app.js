
const PASSWORD='LeStClair2026';

let products=[
{name:'Pelforth 25cl',price:3},
{name:'Pelforth 50cl',price:5},
{name:'Despé Sunlight 25cl',price:4},
{name:'Despé Sunlight 50cl',price:7},
{name:'3 Monts Chapelle 25cl',price:3.50},
{name:'3 Monts Chapelle 50cl',price:6},
{name:'Vin blanc ou rosé',price:2.50},
{name:'Punch',price:3},
{name:'Soft',price:3},
{name:'Eau',price:1},
];

let sales=JSON.parse(localStorage.getItem('sales'))||[];
let ticket=[];

function saveData(){
 localStorage.setItem('products',JSON.stringify(products));
 localStorage.setItem('sales',JSON.stringify(sales));
}

function renderProducts(){
 const div=document.getElementById('products');
 div.innerHTML='';
 products.forEach(p=>{
   const b=document.createElement('button');
   b.className='product';
   b.innerHTML=`${p.name}<br>${p.price} €`;
   b.onclick=()=>addProduct(p);
   div.appendChild(b);
 });
}

function addProduct(p){
 const item=ticket.find(x=>x.name===p.name);
 if(item)item.qty++;
 else ticket.push({...p,qty:1});
 renderTicket();
}

function renderTicket(){
 let total=0;
 const div=document.getElementById('ticket');
 div.innerHTML='';
 ticket.forEach(i=>{
   total+=i.qty*i.price;
   div.innerHTML+=`${i.qty} x ${i.name} = ${i.qty*i.price} €<br>`;
 });
 document.getElementById('total').textContent=total.toFixed(2);
 updateChange();
}

function updateChange(){
 const total=parseFloat(document.getElementById('total').textContent)||0;
 const rec=parseFloat(document.getElementById('received').value)||0;
 document.getElementById('change').textContent=Math.max(rec-total,0).toFixed(2);
}

document.addEventListener('input',e=>{
 if(e.target.id==='received')updateChange();
});

function saveSale(){
 if(ticket.length===0)return;
 sales.push({
   date:new Date().toLocaleString(),
   payment:document.getElementById('payment').value,
   total:parseFloat(document.getElementById('total').textContent),
   items:ticket
 });
 saveData();
 alert('Vente enregistrée');
 clearTicket();
}

function resetProducts() {

  const pwd = prompt("Mot de passe administrateur");

  if (pwd !== PASSWORD) {
    alert("Mot de passe incorrect");
    return;
  }

  if (!confirm("Réinitialiser les produits ?")) {
    return;
  }

  localStorage.removeItem('products');

  alert("Produits réinitialisés");
  location.reload();
}

function clearTicket(){

  if(!confirm("Vider le ticket en cours ?")){
    return;
  }

  ticket = [];

  document.getElementById('received').value = '';

  renderTicket();
}

function adminLogin(){
 const pwd=prompt('Mot de passe administrateur');
 if(pwd!==PASSWORD)return alert('Mot de passe incorrect');

 const action=prompt('1=Ajouter produit\n2=Supprimer produit');
 if(action==='1'){
   const name=prompt('Nom produit');
   const price=parseFloat(prompt('Prix'));
   products.push({name,price});
 }
 if(action==='2'){
   const name=prompt('Nom produit à supprimer');
   products=products.filter(p=>p.name!==name);
 }
 saveData();
 renderProducts();
}

function showStats(){
 const out=document.getElementById('output');
 let html='<h2>Statistiques</h2>';
 let ca=0;
 const prod={};
 const pay={};

 sales.forEach(s=>{
   ca+=s.total;
   pay[s.payment]=(pay[s.payment]||0)+s.total;
   s.items.forEach(i=>prod[i.name]=(prod[i.name]||0)+i.qty);
 });

 html+=`<p>CA Total : ${ca.toFixed(2)} €</p>`;
 html+='<h3>Produits</h3>';
 for(const k in prod) html+=`${k}: ${prod[k]}<br>`;

 html+='<h3>Paiements</h3>';
 for(const k in pay) html+=`${k}: ${pay[k].toFixed(2)} €<br>`;

 out.innerHTML=html;
}

function resetSales() {

  const pwd = prompt("Mot de passe administrateur");

  if (pwd !== PASSWORD) {
    alert("Mot de passe incorrect");
    return;
  }

  if (!confirm("Supprimer toutes les ventes ?")) {
    return;
  }

  localStorage.removeItem('sales');
  sales = [];

  alert("Ventes réinitialisées");
  location.reload();
}

function exportJSON(){
 const blob=new Blob([JSON.stringify({products,sales},null,2)],{type:'application/json'});
 const a=document.createElement('a');
 a.href=URL.createObjectURL(blob);
 a.download='barnum-backup.json';
 a.click();
}

function exportCSV(){
 let csv='Date;Paiement;Total\n';
 sales.forEach(s=>csv+=`${s.date};${s.payment};${s.total}\n`);
 const blob=new Blob([csv],{type:'text/csv'});
 const a=document.createElement('a');
 a.href=URL.createObjectURL(blob);
 a.download='ventes.csv';
 a.click();
}

renderProducts();
renderTicket();
