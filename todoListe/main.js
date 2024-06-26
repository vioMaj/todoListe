function searchResultat() {
    const suchwort = document.getElementById('searchbar').value.toLowerCase();
    const eintraege = document.querySelectorAll('.entry');

    eintraege.forEach(entry => {
        const title = entry.querySelector('.boxtitel').textContent.toLowerCase();
        if (title.includes(suchwort)) {
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
    let deleteBox = confirm("Sind Sie sicher, dass Sie den ausgewählten Eintrag löschen wollen?");
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

function updatePrioritaet() {
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

function validieren(titel, beschreibung, autor, kategorie, startdatum, enddatum){
    let gut = true;

    if (titel.length === 0) {
        document.getElementById('errorTitel').textContent = "Titel wird benötigt.";
        document.getElementById('errorTitel').style.display = 'inline';
        gut = false;
    }

    if (titel.length > 255) {
        document.getElementById('errorTitel').textContent = "Titel darf maximal 255 Zeichen lang sein.";
        document.getElementById('errorTitel').style.display = 'inline';
        gut = false;
    }

    if (beschreibung.length === 0) {
        document.getElementById('errorBeschreibung').textContent = "Beschreibung wird benötigt.";
        document.getElementById('errorBeschreibung').style.display = 'inline';
        gut = false;
    }

    if (autor.length === 0) {
        document.getElementById('errorAutor').textContent = "Autor wird benötigt.";
        document.getElementById('errorAutor').style.display = 'inline';
        gut = false;
    }

    if (autor.length > 20) {
        document.getElementById('errorAutor').textContent = "Autor darf maximal 20 Zeichen lang sein.";
        document.getElementById('errorAutor').style.display = 'inline';
        gut = false;
    }

    if (kategorie === "default") {
        document.getElementById('errorKategorie').textContent = "Kategorie wird benötigt.";
        document.getElementById('errorKategorie').style.display = 'inline';
        gut = false;
    }

    if (startdatum.length === 0) {
        document.getElementById('errorStartdatum').textContent = "Startdatum wird benötigt.";
        document.getElementById('errorStartdatum').style.display = 'inline';
        gut = false;
    }

    if (enddatum.length === 0) {
        document.getElementById('errorEnddatum').textContent = "Enddatum wird benötigt.";
        document.getElementById('errorEnddatum').style.display = 'inline';
        gut = false;
    }

    return gut;
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('formHinzufuegen').addEventListener('submit', function(e) {
        e.preventDefault();

        document.querySelectorAll('.error').forEach(error => error.style.display = 'none');

        let titel = document.getElementById('titel').value;
        let beschreibung = document.getElementById('beschreibung').value;
        let autor = document.getElementById('autor').value;
        let kategorie = document.querySelector('select[name="kategorie"]').value;
        let wichtig = document.getElementById('wichtig').checked;
        let dringend = document.getElementById('dringend').checked;
        let startdatum = document.getElementById('startdatum').value;
        let enddatum = document.getElementById('enddatum').value;

        validieren(titel, beschreibung, autor, kategorie, startdatum, enddatum);

        if (validieren(titel, beschreibung, autor, kategorie, startdatum, enddatum)) {
            addDaten(titel, beschreibung, autor, kategorie, wichtig, dringend, startdatum, enddatum);
            document.getElementById('formHinzufuegen').reset();
            closeHinzufuegen();
        }
    });
    // alle Eventlistener, die gebraucht werden (schaut, ob etwas bei den jeweiligen Elementen geändert werden)
    document.getElementById('wichtig').addEventListener('change', updatePrioritaet);
    document.getElementById('dringend').addEventListener('change', updatePrioritaet);
    document.getElementById('searchbar').addEventListener('input', searchResultat);
});