/* ===============================
   GLOBAL MASTER MAPS
================================ */
let cliMap = {};
let stationMap = {};
let crewMap = {};
let mastersLoaded = false;

/* ===============================
   CSV LOADER (SAFE)
================================ */
async function loadCSV(path) {
    const res = await fetch(path);
    const text = await res.text();
    return text
        .trim()
        .split(/\r?\n/)
        .map(r => r.split(",").map(c => c.trim()));
}

/* ===============================
   LOAD ALL MASTERS
================================ */
async function loadMasters() {

    // CLI MASTER
    const cliRows = await loadCSV("masters/cli_master.csv");
    cliRows.slice(1).forEach(r => {
        if (r[0]) cliMap[r[0].toUpperCase()] = r[1];
    });

    // STATION MASTER
    const stnRows = await loadCSV("masters/station_master.csv");
    stnRows.slice(1).forEach(r => {
        if (r[0]) stationMap[r[0].toUpperCase()] = r[1];
    });

    // CREW MASTER
    const crewRows = await loadCSV("masters/crew_master.csv");
    crewRows.slice(1).forEach(r => {
        if (r[0]) {
            crewMap[r[0].toUpperCase()] = {
                name: r[1],
                desg: r[2],
                gcli: r[3]
            };
        }
    });

    mastersLoaded = true;
    console.log("✔ All masters loaded successfully");
}

loadMasters();

/* ===============================
   DATE DEFAULT = TODAY
================================ */
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("today").value =
        new Date().toISOString().split("T")[0];
});

/* ===============================
   AUTO FILL LOGIC
================================ */
function waitForMasters(cb) {
    if (mastersLoaded) cb();
    else setTimeout(() => waitForMasters(cb), 100);
}

// CLI
cli_id.addEventListener("input", () => {
    waitForMasters(() => {
        cli_name.value =
            cliMap[cli_id.value.trim().toUpperCase()] || "";
    });
});

// STATIONS
from_code.addEventListener("input", () => {
    waitForMasters(() => {
        from_name.value =
            stationMap[from_code.value.trim().toUpperCase()] || "";
    });
});

to_code.addEventListener("input", () => {
    waitForMasters(() => {
        to_name.value =
            stationMap[to_code.value.trim().toUpperCase()] || "";
    });
});

// LP
lp_id.addEventListener("input", () => {
    waitForMasters(() => {
        const d = crewMap[lp_id.value.trim().toUpperCase()];
        if (d) {
            lp_name.value = d.name;
            lp_desg.value = d.desg;
            lp_gcli.value = d.gcli;
        } else {
            lp_name.value = lp_desg.value = lp_gcli.value = "";
        }
    });
});

// ALP
alp_id.addEventListener("input", () => {
    waitForMasters(() => {
        const d = crewMap[alp_id.value.trim().toUpperCase()];
        if (d) {
            alp_name.value = d.name;
            alp_desg.value = d.desg;
            alp_gcli.value = d.gcli;
        } else {
            alp_name.value = alp_desg.value = alp_gcli.value = "";
        }
    });
});

/* ===============================
   REPORT BUTTON (PLACEHOLDER)
================================ */
function generateReport() {
    alert(
        "✔ All inputs captured successfully\n" +
        "Next Phase: RTIS + Signal + OHE logic"
    );
}
