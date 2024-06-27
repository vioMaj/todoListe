// Funktion zum Durchsuchen von Einträgen basierend auf dem Suchwort im Suchfeld
function searchResultat() {
    // Das Suchwort wird aus dem Suchfeld geholt und in Kleinbuchstaben umgewandelt
    const suchwort = document.getElementById('searchbar').value.toLowerCase();
    // Alle Elemente mit der Klasse 'entry' werden selektiert
    const eintraege = document.querySelectorAll('.entry');

    // Schleife über alle Einträge
    eintraege.forEach(entry => {
        // Der Titel jedes Eintrags wird ausgelesen und in Kleinbuchstaben umgewandelt
        const title = entry.querySelector('.boxtitel').textContent.toLowerCase();
        // Wenn der Titel das Suchwort enthält, wird der Eintrag angezeigt, andernfalls versteckt
        if (title.includes(suchwort)) {
            entry.style.display = 'block';
        } else {
            entry.style.display = 'none';
        }
    });
}

// Funktion zum Öffnen des Formulars zum Hinzufügen eines neuen Eintrags
function openHinzufuegen() {
    // Kein Eintrag wird bearbeitet, es wird ein neuer Eintrag hinzugefügt, darum null
    zuBearbeitenderEintrag = null;
    // Formular-Titel wird angepasst
    document.getElementById('formTitel').textContent = "Eintrag hinzufügen";
    // Formular wird sichtbar gemacht
    document.getElementById('hinzufuegenPop').style.display = 'block';
}

// Funktion zum Schliessen des Formulars zum Hinzufügen/Bearbeiten eines Eintrags
function closeHinzufuegen() {
    // Formular wird unsichtbar gemacht
    document.getElementById('hinzufuegenPop').style.display = 'none';
    // Formular wird zurückgesetzt
    document.getElementById('formHinzufuegen').reset();
}

// Funktion zum Löschen eines Eintrags
function deleteEintrag(button) {
    // Bestätigungsdialog anzeigen
    let deleteBox = confirm("Sind Sie sicher, dass Sie den ausgewählten Eintrag löschen wollen?");
    if (deleteBox == true) {
        // Nächstgelegenen Eintrag mit der Klasse 'entry' finden und entfernen
        let entry = button.closest('.entry');
        entry.remove();
        // Fortschrittsanzeige aktualisieren (erledigte Todos in Prozent)
        updateErledigtProzent();   
    }
}

// Funktion zur Berechnung der Priorität basierend auf den Parametern wichtig und dringend
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

// Funktion zum Öffnen des Formulars zum Bearbeiten eines bestehenden Eintrags
function openBearbeiten(button) {
    // Den Eintrag, der bearbeitet werden soll, finden (nächstgelegener Eintrag)
    zuBearbeitenderEintrag = button.closest('.entry');

    // Textinhalte der Felder ermitteln und im Formular eintragen
    const titel = zuBearbeitenderEintrag.querySelector('.boxtitel').textContent;
    // Der Text vom jeweiligen Element wird genommen und beim Doppelpunkt geteilt und nur das zweite Element übernehmen
    // z.B. Beschreibung: Dies ist eine Beschreibung, dann wird nur "Dies ist eine Beschreibung" im Feld angezeigt
    const beschreibung = zuBearbeitenderEintrag.querySelector('.beschreibungEntry').textContent.split(": ")[1];
    const enddatum = zuBearbeitenderEintrag.querySelector('.enddatumEntry').textContent.split(": ")[1];
    const autor = zuBearbeitenderEintrag.querySelector('.details p:nth-child(1)').textContent.split(": ")[1];
    const kategorie = zuBearbeitenderEintrag.querySelector('.details p:nth-child(2)').textContent.split(": ")[1];
    const wichtig = zuBearbeitenderEintrag.querySelector('.details p:nth-child(3)').textContent.split(": ")[1] === 'Ja';
    const dringend = zuBearbeitenderEintrag.querySelector('.details p:nth-child(4)').textContent.split(": ")[1] === 'Ja';
    const startdatum = zuBearbeitenderEintrag.querySelector('.details p:nth-child(5)').textContent.split(": ")[1];

    // Werte in das Formular setzen
    document.getElementById('formTitel').textContent = "Eintrag bearbeiten";
    document.getElementById('hinzufuegenPop').style.display = 'block';

    document.getElementById('titel').value = titel;
    document.getElementById('beschreibung').value = beschreibung;
    document.getElementById('autor').value = autor;
    document.querySelector('select[name="kategorie"]').value = kategorie;
    document.getElementById('wichtig').checked = wichtig;
    document.getElementById('dringend').checked = dringend;
    document.getElementById('startdatum').value = startdatum;
    document.getElementById('enddatum').value = enddatum;

    // Priorität im Formular aktualisieren
    updatePrioritaet();
}

// Funktion zum Hinzufügen eines neuen Eintrags oder Aktualisieren eines bestehenden Eintrags
function addDaten(titel, beschreibung, autor, kategorie, wichtig, dringend, startdatum, enddatum) {
    // Container für die Einträge holen
    let container = document.getElementById('eintraege');
    // Neuen Eintrag erstellen
    let entry = document.createElement('div');
    entry.className = 'entry';

    // Priorität berechnen
    let prioritaet = berechnePrioritaet(wichtig, dringend);

    // Symbole entsprechend der Auswahl hinzufügen
    let symbols = '';
    if (dringend && wichtig) {
        symbols = '<b>&#10710; !</b>'; 
    } else if (dringend) {
        symbols = '<b>&#10710;</b>'; 
    } else if (wichtig) {
        symbols = '<b>!</b>'; 
    }

    // HTML-Inhalt des neuen Eintrags
    entry.innerHTML = `
        <div class="header">
            <input type="checkbox" name="abgehackt" class="abgehackt" onclick="updateErledigtProzent(); updateEintragFarbe(this);"><b class="boxtitel">${titel}</b><aside class="symbols">${symbols}</aside>
            <p class="beschreibungEntry">Beschreibung: ${beschreibung}</p>
            <p class="enddatumEntry">Enddatum: ${enddatum}</p>
            <div class="details">
                <p>Autor: ${autor}</p>
                <p>Kategorie: ${kategorie}</p>
                <p>Wichtig: ${wichtig ? 'Ja' : 'Nein'}</p>
                <p>Dringend: ${dringend ? 'Ja' : 'Nein'}</p>
                <p>Startdatum: ${startdatum}</p>
                <p>Priorität: ${prioritaet}</p>
            </div>
            <button onclick="toggleDetails(this)" id="erweitern" class="erweitern"><b>&#11021;</b></button>
            <button onclick="openBearbeiten(this)" class="btns">&#x270E</button>
            <button onclick="deleteEintrag(this)" class="btns">&#128465</button>
        </div>
    `;

    // Eintrag zum Container hinzufügen
    container.appendChild(entry);
    // Fortschrittsanzeige aktualisieren
    updateErledigtProzent();
}

// Funktion zum Umschalten der Anzeige von Details eines Eintrags
function toggleDetails(button) {
    let entry = button.closest('.entry');
    entry.classList.toggle('expanded');
    button.querySelector('b').classList.toggle('rotate');
}

// Funktion zur Aktualisierung der Priorität im Formular
function updatePrioritaet() {
    const wichtig = document.getElementById('wichtig').checked;
    const dringend = document.getElementById('dringend').checked;
    const priorityElement = document.getElementById('prioritaet');

    let prioritaet = berechnePrioritaet(wichtig, dringend);
    priorityElement.textContent = `Priorität: ${prioritaet}`;
}

// Funktion zur Aktualisierung des Fortschritts der erledigten Einträge
function updateErledigtProzent() {
    const checkboxes = document.querySelectorAll('.abgehackt');
    const total = checkboxes.length;
    const checked = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;
    const percent = total === 0 ? 0 : Math.round((checked / total) * 100);
    document.getElementById('anzeigenErledigt').textContent = `TODO's abgehakt: ${percent}%`;
}

// Funktion zur Aktualisierung der Farbe eines Eintrags basierend auf dem Zustand des Kontrollkästchens
function updateEintragFarbe(checkbox) {
    let entry = checkbox.closest('.entry');
    let buttons = entry.querySelectorAll('button');  // Selektiert alle Buttons im Eintrag
    let symbols = entry.querySelector('aside.symbols');  // Selektiert die Symbole

    if (checkbox.checked) {
        entry.style.backgroundColor = 'grey';
        buttons.forEach(button => button.style.display = 'none');  // Versteckt alle Buttons
        if (symbols) {
            symbols.style.display = 'none';  // Versteckt die Symbole
        }
    } else {
        entry.style.backgroundColor = '#f6e4fb';
        buttons.forEach(button => button.style.display = '');  // Zeigt alle Buttons wieder an
        if (symbols) {
            symbols.style.display = '';  // Zeigt die Symbole wieder an
        }
    }
    // Einträge neu sortieren
    sortiereEintraege();
}

// Funktion zum Sortieren der Einträge, um erledigte Einträge nach unten zu verschieben
function sortiereEintraege() {
    let container = document.getElementById('eintraege');
    let entries = Array.from(container.getElementsByClassName('entry'));
    entries.sort((a, b) => {
        let aChecked = a.querySelector('.abgehackt').checked;
        let bChecked = b.querySelector('.abgehackt').checked;
        return aChecked - bChecked;  // Erledigte Einträge nach unten verschieben
    });
    entries.forEach(entry => container.appendChild(entry));
}

// Funktion zur Validierung der Formulareingaben
function validieren(titel, beschreibung, autor, kategorie, startdatum, enddatum){
    let gut = true;

    // Validierung des Titels
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

    // Validierung der Beschreibung
    if (beschreibung.length === 0) {
        document.getElementById('errorBeschreibung').textContent = "Beschreibung wird benötigt.";
        document.getElementById('errorBeschreibung').style.display = 'inline';
        gut = false;
    }

    // Validierung des Autors
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

    // Validierung der Kategorie
    if (kategorie === "default") {
        document.getElementById('errorKategorie').textContent = "Kategorie wird benötigt.";
        document.getElementById('errorKategorie').style.display = 'inline';
        gut = false;
    }

    // Validierung des Startdatums
    if (startdatum.length === 0) {
        document.getElementById('errorStartdatum').textContent = "Startdatum wird benötigt.";
        document.getElementById('errorStartdatum').style.display = 'inline';
        gut = false;
    }

    // Validierung des Enddatums
    if (enddatum.length === 0) {
        document.getElementById('errorEnddatum').textContent = "Enddatum wird benötigt.";
        document.getElementById('errorEnddatum').style.display = 'inline';
        gut = false;
    }

    return gut;
}

// Event-Listener für DOMContentLoaded, um das Formular und andere Elemente zu initialisieren
document.addEventListener('DOMContentLoaded', function() {
    // Event-Listener für das Formular zum Hinzufügen/Bearbeiten eines Eintrags
    document.getElementById('formHinzufuegen').addEventListener('submit', function(e) {
        e.preventDefault();

        // Alle Fehlermeldungen ausblenden
        document.querySelectorAll('.error').forEach(error => error.style.display = 'none');

        // Werte aus dem Formular holen
        let titel = document.getElementById('titel').value;
        let beschreibung = document.getElementById('beschreibung').value;
        let autor = document.getElementById('autor').value;
        let kategorie = document.querySelector('select[name="kategorie"]').value;
        let wichtig = document.getElementById('wichtig').checked;
        let dringend = document.getElementById('dringend').checked;
        let startdatum = document.getElementById('startdatum').value;
        let enddatum = document.getElementById('enddatum').value;

        // Validierung der Eingaben
        if (validieren(titel, beschreibung, autor, kategorie, startdatum, enddatum)) {
            // Wenn ein Eintrag bearbeitet wird, diesen aktualisieren
            if (zuBearbeitenderEintrag) {
                zuBearbeitenderEintrag.querySelector('.boxtitel').textContent = titel;
                zuBearbeitenderEintrag.querySelector('.beschreibungEntry').textContent = "Beschreibung: " + beschreibung;
                zuBearbeitenderEintrag.querySelector('.enddatumEntry').textContent = "Enddatum: " + enddatum; 
                zuBearbeitenderEintrag.querySelector('.details p:nth-child(1)').textContent = "Autor: " + autor;
                zuBearbeitenderEintrag.querySelector('.details p:nth-child(2)').textContent = "Kategorie: " + kategorie;
                zuBearbeitenderEintrag.querySelector('.details p:nth-child(3)').textContent = "Wichtig: " + (wichtig ? 'Ja' : 'Nein');
                zuBearbeitenderEintrag.querySelector('.details p:nth-child(4)').textContent = "Dringend: " + (dringend ? 'Ja' : 'Nein');
                zuBearbeitenderEintrag.querySelector('.details p:nth-child(5)').textContent = "Startdatum: " + startdatum;
                zuBearbeitenderEintrag.querySelector('.details p:nth-child(6)').textContent = "Priorität: " + berechnePrioritaet(wichtig, dringend);

                // Formular und Bearbeitungsstatus zurücksetzen
                zuBearbeitenderEintrag = null;
                document.getElementById('formHinzufuegen').reset();
                closeHinzufuegen();
            } else {
                // Andernfalls neuen Eintrag hinzufügen
                addDaten(titel, beschreibung, autor, kategorie, wichtig, dringend, startdatum, enddatum);
                document.getElementById('formHinzufuegen').reset();
                closeHinzufuegen();
            }
        }
    });

    // Event-Listener für Änderungen der Wichtigkeit und Dringlichkeit
    document.getElementById('wichtig').addEventListener('change', updatePrioritaet);
    document.getElementById('dringend').addEventListener('change', updatePrioritaet);
    // Event-Listener für die Eingabe in der Suchleiste
    document.getElementById('searchbar').addEventListener('input', searchResultat);
});
