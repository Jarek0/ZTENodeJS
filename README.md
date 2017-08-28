# ZTENodeJS
Prosta aplikacja napisana w node js pobierająca z lubelskiego zte dane potrzebne do analizy przestrzennej i zapisujące je w formie tabeli SVC


struktura danych w tabli na jakiej nam zalezy jest taka:
id przystanku, współrzędna x przystanku, współrzędna y przystanku, nr linii, kolejność na linii (czyli który z kolei jest to przystanek licząc początkowy jako = 0), kierunek (opis kierunku siedzi w zmiennej "direction_name" ze zbioru "line" z API ZTMu), czas przejazdu między przystankiem o danym ID, a poprzedzającym (może być wzięty dowolny z kursu z godziny między 7 a 8)
