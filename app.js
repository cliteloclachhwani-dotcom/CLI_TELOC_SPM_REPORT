let cliMap = {}, stationMap = {}, crewMap = {};

// ---------- CSV LOADER ----------
async function loadCSV(path, callback){
  const res = await fetch(path);
  const text = await res.text();
  const rows = text.split("\n").map(r => r.split(","));
  callback(rows);
}

// ---------- LOAD MASTERS ----------
loadCSV("masters/cli_master.csv", rows=>{
  rows.slice(1).forEach(r=>{
    cliMap[r[0]?.trim()] = r[1]?.trim();
  });
});

loadCSV("masters/station_master.csv", rows=>{
  rows.slice(1).forEach(r=>{
    stationMap[r[0]?.trim()] = r[1]?.trim();
  });
});

loadCSV("masters/crew_master.csv", rows=>{
  rows.slice(1).forEach(r=>{
    crewMap[r[0]?.trim()] = {
      name:r[1], desg:r[2], gcli:r[3]
    };
  });
});

// ---------- DEFAULT DATE ----------
document.getElementById("today").valueAsDate = new Date();

// ---------- MPS DROPDOWN ----------
let mps = document.getElementById("train_mps");
for(let i=40;i<=140;i+=5){
  mps.innerHTML += `<option>${i}</option>`;
}

// ---------- AUTO FILL ----------
cli_id.oninput = ()=> cli_name.value = cliMap[cli_id.value.toUpperCase()] || "";

from_code.oninput = ()=> from_name.value = stationMap[from_code.value.toUpperCase()] || "";
to_code.oninput   = ()=> to_name.value   = stationMap[to_code.value.toUpperCase()] || "";

lp_id.oninput = ()=>{
  let d = crewMap[lp_id.value.toUpperCase()];
  if(d){ lp_name.value=d.name; lp_desg.value=d.desg; lp_gcli.value=d.gcli; }
};

alp_id.oninput = ()=>{
  let d = crewMap[alp_id.value.toUpperCase()];
  if(d){ alp_name.value=d.name; alp_desg.value=d.desg; alp_gcli.value=d.gcli; }
};

// ---------- REPORT ----------
function generateReport(){
  alert("All inputs captured successfully.\n(Next phase: RTIS + Violation logic)");
}
