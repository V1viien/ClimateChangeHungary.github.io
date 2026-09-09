# Hungary Climate Explorer - Adatkészletek és Adatstruktúra Dokumentáció

Ez a mappa tartalmazza a **Magyar Klíma Felfedező** (Hungary Climate Explorer) alkalmazás idősoros klímaadatait 1940 és 2026. szeptember (2026-09) között.

## Adatforrások és Hitelesség (Sources & Methodology)

1. **Hőmérsékleti és csapadék adatok (OMSZ / HungaroMet & KSH):**
   - Az 1940–2026 közötti adatok az Országos Meteorológiai Szolgálat (jelenleg **HungaroMet Zrt.**) publikált éves országos átlagain, valamint a **KSH** (Központi Statisztikai Hivatal) STADAT környezeti adatbázisán alapulnak.
   - Referencia-bázisidőszak a vizualizációban: **1940–1949 átlaga (10.15 °C)**, illetve összehasonlítható az 1961–1990 vagy 1991–2020 WMO normálokkal.
   - Szélsőértékek: 2024 a HungaroMet mérései szerint az eddigi legmelegebb év lett Magyarországon (~12.9 °C országos átlaggal), míg 2022 az évszázad legsúlyosabb aszályát hozta (~448 mm országos csapadék, katasztrofális PAI aszályindex). A 2026-os év (2026-09-ig YTD) folytatta a tartós felmelegedési trendet kora tavaszi és július-augusztusi rekordközeli hőhullámokkal.

2. **Havi felbontású adatsorok (2020.01 – 2026.09):**
   - `hungary_monthly_2020_2026_09.csv` / `.json`: 81 egymást követő hónap részletes bontása (havi középhőmérséklet, anomália, havi csapadék, hőségnapok, trópusi éjszakák, fagyos napok).

2. **Üvegházhatású gázok (CO₂ ppm):**
   - NOAA Global Monitoring Laboratory & Mauna Loa Obszervatórium globális légköri szén-dioxid koncentráció átlagai.

3. **Extrém napok:**
   - **Hőségnapok:** Maximális hőmérséklet Tmax ≥ 30 °C.
   - **Trópusi éjszakák:** Minimális hőmérséklet Tmin ≥ 20 °C.
   - **Fagyos napok:** Minimális hőmérséklet Tmin < 0 °C.

4. **Agrár- és hidrológiai indikátorok (Bónusz adatsorok):**
   - **Tokaji és Balatoni szüret kezdete:** A szőlő fenológiai érési napja az évben (DOY - Day of Year). Míg az 1950-70-es években október közepén (285-295. nap) indult a fő szüret, az elmúlt évtizedben augusztus végére – szeptember elejére (240-250. nap) tolódott előre.
   - **Duna vízállás anomália (Budapest vigadó / mérce):** Az augusztus-szeptemberi kisvízszintek eltolódása.

---

## Fájlformátumok és Séma

Minden metrika elérhető JSON és CSV formátumban is:

### 1. `annual_temperatures.csv` / `.json`
```csv
year,temp,anomaly_1940s,baseline,moving_avg_5y,is_record
1940,8.85,-1.30,10.15,8.85,false
...
2024,12.92,+2.77,10.15,12.44,true
```

### 2. `seasonal_temperatures.csv` / `.json`
```csv
year,winter,spring,summer,autumn
1940,-2.1,9.2,19.1,9.3
...
```

### 3. `precipitation_drought.csv` / `.json`
```csv
year,precipitation_mm,anomaly_pct,drought_index_pai,drought_category
1940,635,+7.6,3.8,Normal
2022,448,-24.1,8.9,Extreme
```

### 4. `extreme_days.csv` / `.json`
```csv
year,heat_wave_days,tropical_nights,frost_days
1940,9,1,114
...
2024,51,26,52
```

---

## Saját CSV adatok beillesztése (How to swap in your real datasets)

1. Ha a HungaroMet vagy KSH hivatalos nyers adataival szeretnéd frissíteni az alkalmazást, egyszerűen:
   - Másold be az új CSV/JSON fájlt a `/data/` mappába vagy a `/src/data/` forrásfájlokba.
   - Vagy használd az alkalmazás felületén lévő **"Egyéni CSV feltöltés"** gombot az azonnali élő vizualizációhoz!
2. A mezőnevek egyezzenek meg a fenti fejléc-struktúrával.
