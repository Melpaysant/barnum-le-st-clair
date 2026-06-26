
const PASSWORD='LeStClair2026';

let products=[
{name:'Pelforth 30cl',price:3.50},
{name:'Despé 30cl',price:4.60},
{name:'3 Monts 30cl',price:4.00},
{name:'Pelforth 50cl',price:5.40},
{name:'Despé 50cl',price:7.20},
{name:'3 Monts 50cl',price:6.60},
{name:'Pelforth 1,5L',price:16.50},
{name:'Despé 1,5L',price:21.50},
{name:'3 Monts 1,5L',price:20.00},
{name:'Vin 15cl',price:3.50},
{name:'Punch 15cl',price:3.00},
{name:'Sangria 15cl',price:3.00},
{name:'Soft',price:3.00},
 {name:'Eau 50cl',price:1.00},
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
   b.innerHTML=`
<div class="product-name">${p.name}</div>
<div class="product-price">${p.price} €</div>
`;
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
   div.innerHTML += `${i.qty} x ${i.name} = ${(i.qty * i.price).toFixed(2).replace('.', ',')} €<br>`;
 });
 document.getElementById('total').textContent =
    total.toFixed(2).replace('.', ',');
 updateChange();
}

function updateChange(){
 const total=parseFloat(
    document.getElementById('total').textContent.replace(",", ".")
)||0;
 const rec=parseFloat(document.getElementById('received').value)||0;
 document.getElementById('change').textContent =
    Math.max(rec-total,0)
      .toFixed(2)
      .replace('.', ',');
}

document.addEventListener('input',e=>{
 if(e.target.id==='received')updateChange();
});

function saveSale(){
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

function removeLastItem(){

    if(ticket.length === 0){
        return;
    }

    const lastItem = ticket[ticket.length - 1];

    if(lastItem.qty > 1){
        lastItem.qty--;
    } else {
        ticket.pop();
    }

    renderTicket();
}

function clearTicket(){

    ticket = [];

    document.getElementById("received").value = "";
    document.getElementById("change").textContent = "0,00";

    const cash = document.getElementById("cashAmount");
    if(cash) cash.value = "";

    const card = document.getElementById("cardAmount");
    if(card) card.value = "";

    document.getElementById("payment").value = "Espèces";

    setPayment("Espèces");

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

function setPayment(mode){

    document.getElementById("payment").value = mode;

    document.querySelectorAll(".payment-btn")
        .forEach(btn => btn.classList.remove("active"));

    document.getElementById("btnCash").classList.remove("active");
    document.getElementById("btnCard").classList.remove("active");
    document.getElementById("btnShared").classList.remove("active");

    if(mode==="Espèces")
        document.getElementById("btnCash").classList.add("active");

    if(mode==="Carte")
        document.getElementById("btnCard").classList.add("active");

    if(mode==="Partagé")
        document.getElementById("btnShared").classList.add("active");

    changePaymentMode();

}


function changePaymentMode(){

    const mode = document.getElementById("payment").value;

    const shared = document.getElementById("sharedPayment");
    const received = document.getElementById("received");
    const changeBox = document.querySelector(".change-box");

    if(mode === "Espèces"){

        received.style.display = "block";
        changeBox.style.display = "block";
        shared.style.display = "none";

    }

    if(mode === "Carte"){

        received.style.display = "none";
        changeBox.style.display = "none";
        shared.style.display = "none";

    }

    if(mode === "Partagé"){

        received.style.display = "none";
        changeBox.style.display = "none";
        shared.style.display = "block";

    }

}


function calculateShared(){

    const total =
        parseFloat(document.getElementById("total").textContent.replace(",", ".")) || 0;

    let cash =
        parseFloat(document.getElementById("cashAmount").value.replace(",", ".")) || 0;

    if(cash < 0) cash = 0;

    if(cash > total) cash = total;

    const card = total - cash;

    document.getElementById("cardAmount").value =
        card.toFixed(2).replace(".", ",");

}


renderProducts();
renderTicket();
changePaymentMode();

