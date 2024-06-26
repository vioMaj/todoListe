function searchResultat() {
    const searchTerm = document.getElementById('searchbar').value.toLowerCase();
    const entries = document.querySelectorAll('.entry');

    entries.forEach(entry => {
        const title = entry.querySelector('.boxtitel').textContent.toLowerCase();
        if (title.includes(searchTerm)) {
            entry.style.display = 'block';
        } else {
            entry.style.display = 'none';
        }
    });
}

function openHinzufuegen() {
    document.getElementById('hinzufuegenPop').style.display = 'block';
}

function closeHinzufuegen() {
    document.getElementById('hinzufuegenPop').style.display = 'none';
    document.getElementById('formHinzufuegen').reset();
}

function deleteEintrag(button) {
    let deleteBox = window.confirm("Sind Sie sicher, dass Sie den ausgewählten Eintrag löschen wollen?");
    if (deleteBox == true) {
        let entry = button.closest('.entry');
        entry.remove();
        updateErledigtProzent();   
    }
}

function updateEintrag(button) {
    // Funktion zur Aktualisierung eines Eintrags
}

function berechnePrioritaet(wichtig, dringend) {
    if (wichtig && dringend) {
        return 'schnell erledigen';
    } else if (wichtig) {
        return 'muss noch erledigt werden';
    } else if (dringend) {
        return 'heute noch';
    } else {
        return 'weg damit';
    }
}

function addDaten(titel, beschreibung, autor, kategorie, wichtig, dringend, startdatum, enddatum) {
    let container = document.getElementById('eintraege');
    let entry = document.createElement('div');
    entry.className = 'entry';

    let prioritaet = berechnePrioritaet(wichtig, dringend);

    entry.innerHTML = `
        <div class="header">
            <input type="checkbox" name="abgehackt" class="abgehackt" onclick="updateErledigtProzent()"><b class="boxtitel">${titel}</b>
            <p>Beschreibung: ${beschreibung}</p>
            <p>Enddatum: ${enddatum}</p>
            <div class="details">
                <p>Autor: ${autor}</p>
                <p>Kategorie: ${kategorie}</p>
                <p>Wichtig: ${wichtig ? 'Ja' : 'Nein'}</p>
                <p>Dringend: ${dringend ? 'Ja' : 'Nein'}</p>
                <p>Priorität: ${prioritaet}</p>
                <p>Startdatum: ${startdatum}</p>
            </div>
            <button onclick="toggleDetails(this)" id="erweitern"><b>&#11015;</b></button>
            <button onclick="updateEintrag(this)" class="btns">&#x270E</button>
            <button onclick="deleteEintrag(this)" class="btns">&#128465</button>
        </div>
    `;

    container.appendChild(entry);
    updateErledigtProzent();
}

function toggleDetails(button) {
    let entry = button.closest('.entry');
    entry.classList.toggle('expanded');
    button.querySelector('b').classList.toggle('rotate');
}

function updatePriority() {
    const wichtig = document.getElementById('wichtig').checked;
    const dringend = document.getElementById('dringend').checked;
    const priorityElement = document.getElementById('prioritaet');

    let prioritaet = berechnePrioritaet(wichtig, dringend);
    priorityElement.textContent = `Priorität: ${prioritaet}`;
}

function updateErledigtProzent() {
    const checkboxes = document.querySelectorAll('.abgehackt');
    const total = checkboxes.length;
    const checked = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;
    const percent = total === 0 ? 0 : Math.round((checked / total) * 100);
    document.getElementById('anzeigenErledigt').textContent = `TODO's abgehakt: ${percent}%`;
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('formHinzufuegen').addEventListener('submit', function(e) {
        e.preventDefault();

        let titel = document.getElementById('titel').value;
        let beschreibung = document.getElementById('beschreibung').value;
        let autor = document.getElementById('autor').value;
        let kategorie = document.querySelector('select[name="kategorie"]').value;
        let wichtig = document.getElementById('wichtig').checked;
        let dringend = document.getElementById('dringend').checked;
        let startdatum = document.getElementById('startdatum').value;
        let enddatum = document.getElementById('enddatum').value;

        // Validation
        if (titel.length === 0 || titel.length > 255){
            alert("Tit");
            return;
        }

        if (titel.length > 255){
            aler
        }

        if (beschreibung.length === 0){
            alert("Beschreibung is required.");
            return;
        }

        if (autor.length === 0 || autor.length > 20){
            alert("Autor is required and should be at most 20 characters.");
            return;
        }

        if (kategorie === "default"){
            alert("Kategorie is required.");
            return;
        }

        if (typeof wichtig !== "boolean"){
            alert("Wichtig is required.");
            return;
        }

        if (typeof dringend !== "boolean"){
            alert("Dringend is required.");
            return;
        }

        if (startdatum.length === 0){
            alert("Startdatum is required.");
            return;
        }

        if (enddatum.length === 0){
            alert("Enddatum is required.");
            return;
        }

        addDaten(titel, beschreibung, autor, kategorie, wichtig, dringend, startdatum, enddatum);

        document.getElementById('formHinzufuegen').reset();
        closeHinzufuegen();
    });

    document.getElementById('wichtig').addEventListener('change', updatePriority);
    document.getElementById('dringend').addEventListener('change', updatePriority);
    document.getElementById('searchbar').addEventListener('input', searchResultat);
});
