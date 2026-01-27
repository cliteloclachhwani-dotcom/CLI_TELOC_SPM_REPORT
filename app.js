let cliMap={}, stationMap={}, crewMap={}, mastersLoaded=false;
let rtisFile=null, cautionFile=null;

async function loadCSV(path){
  const res = await fetch(path);
  const text = await res.text();
  return text.trim().split(/\r?\n/).map(r=>r.split(",").map(c=>c.trim()));
}

async function loadMasters(){
  (await loadCSV("masters/cli_master.csv")).slice(1).forEach(r=>{
    if(r[0]) cliMap[r[0].toUpperCase()]=r[1];
  });
  (await loadCSV("masters/station_master.csv")).slice(1).forEach(r=>{
    if(r[0]) stationMap[r[0].toUpperCase()]=r[1];
  });
  (await loadCSV("masters/crew_master.csv")).slice(1).forEach(r=>{
    if(r[0]) crewMap[r[0].toUpperCase()]={name:r[1],desg:r[2],gcli:r[3]};
  });
  mastersLoaded=true;
}
loadMasters();

document.addEventListener("DOMContentLoaded",()=>{
  today.value=new Date().toISOString().split("T")[0];
});

function waitForMasters(cb){
  if(mastersLoaded) cb();
  else setTimeout(()=>waitForMasters(cb),100);
}

cli_id.oninput=()=>waitForMasters(()=>cli_name.value=cliMap[cli_id.value.trim().toUpperCase()]||"");
from_code.oninput=()=>waitForMasters(()=>from_name.value=stationMap[from_code.value.trim().toUpperCase()]||"");
to_code.oninput=()=>waitForMasters(()=>to_name.value=stationMap[to_code.value.trim().toUpperCase()]||"");

lp_id.oninput=()=>waitForMasters(()=>{
  const d=crewMap[lp_id.value.trim().toUpperCase()];
  lp_name.value=d?d.name:""; lp_desg.value=d?d.desg:""; lp_gcli.value=d?d.gcli:"";
});
alp_id.oninput=()=>waitForMasters(()=>{
  const d=crewMap[alp_id.value.trim().toUpperCase()];
  alp_name.value=d?d.name:""; alp_desg.value=d?d.desg:""; alp_gcli.value=d?d.gcli:"";
});

rtis_file.onchange=e=>rtisFile=e.target.files[0]||null;
caution_file.onchange=e=>cautionFile=e.target.files[0]||null;

function generateReport(){
  if(!rtisFile || !cautionFile){
    alert("RTIS Data aur Caution Order dono upload karna mandatory hai.");
    return;
  }
  alert("All inputs + uploads captured.\nNext: Validation + RTIS analysis.");
}
