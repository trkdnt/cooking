# Mit főzzek ma?

Magyar nyelvű, ingyenesen futtatható receptajánló GitHub Pages-re. Nincs regisztráció, fizetős API, adatbázis vagy telepítendő csomag.

## Mit tud az MVP?

- 124 választható alapanyag, ékezet nélküli keresés és gyakori elnevezések (pl. krumpli → burgonya).
- 9 magyar, forrással ellátott, részletes recept; minden szükséges hozzávaló beleszámít az egyezésbe.
- Egyezési százalék, tételes hiányzólista, másolható bevásárlólista.
- Idő- és étrendszűrő, „minden megvan” szűrő, három rendezési mód.
- Kedvencek és otthoni alapanyagok mentése a böngészőben.
- Az eredeti magyar recept aktuális szövegének letöltése a Wikikönyvek nyilvános MediaWiki API-jából, igény szerint, időkorláttal és gyorsítótárral.
- Mobilhoz igazodó elrendezés, billentyűzettel használható vezérlők, natív, fókuszt kezelő receptablak.

## Helyi indítás

Node.js 22+ és Python 3 szükséges a kényelmi parancsokhoz. Nem kell `npm install`.

```sh
npm test
npm start
```

Megnyitás: http://127.0.0.1:4173

Az alkalmazást HTTP-n kell kiszolgálni: a HTML-fájl közvetlen megnyitása (`file://`) nem tölti be a JavaScript-modulokat.

```sh
npm run build
```

A közzétehető oldal a `dist/` könyvtárba kerül. Csak a weboldalhoz szükséges fájlok másolódnak ide. Minden helyi hivatkozás relatív, így a `/cooking/` alkönyvtárban is működik.

## GitHub Pages közzététel

1. A repó **Settings → Pages → Build and deployment → Source** mezőjében válaszd a **GitHub Actions** lehetőséget.
2. A `main` ágra küldött változtatás elindítja a `.github/workflows/pages.yml` folyamatot.
3. A folyamat Node.js 24 alatt lefuttatja a teszteket, elkészíti a `dist/` mappát, és közzéteszi a Pages-oldalt.
4. Az **Actions → GitHub Pages** futásban megjelenő URL a ténylegesen közzétett oldal címe.

Ehhez a repóhoz a várt cím: https://trkdnt.github.io/cooking/ . A cím csak sikeres deployment után él.

Nyilvános repó GitHub Free csomaggal is használhat Pages-t. A GitHub Actions használatára a GitHub aktuális korlátai vonatkoznak. Hivatalos leírás: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages

## Online receptek és az MVP határai

A kezdőgyűjtemény tudatosan kicsi és ellenőrzött. Ez nem az egész interneten kereső vagy tetszőleges oldalakat másoló rendszer. A receptkártyák a repóban található, szerkesztett magyar változatokból dolgoznak (`data/recipes.js`). A hozzávalók egységesítését kézzel ellenőriztük.

A részleteknél az **Online leírás betöltése** közvetlenül a recept magyar Wikikönyvek-oldalának aktuális szövegét tölti le. Az eredetit csak szövegként jelenítjük meg, nem futtatunk belőle HTML-t vagy JavaScriptet. A hozzávalók és az egyezés a mentett, egységesített változatra vonatkoznak, nem egy esetleg közben változott wiki-oldalra. Az alkalmazás ezt a felületen is jelzi.

Ha a forrás nem érhető el, 12 másodperc után megszakítjuk a kérést; az utolsó letöltött változatot és a beépített receptet továbbra is lehet használni. A böngésző első betöltéséhez internetkapcsolat szükséges: ez az MVP nem teljes offline/PWA alkalmazás.

A MediaWiki API dokumentációja: https://www.mediawiki.org/wiki/API:Main_page . A CORS-lekérdezés `origin=*` paramétert használ, hitelesítés nélkül. A forrás szolgáltatási korlátai és elérhetősége nem állnak az alkalmazás felügyelete alatt.

A mennyiségeket az egyezés nem méri: egy alapanyag kijelölése csak azt jelenti, hogy van belőle otthon. Az idők becslések, a lencse áztatását és a kész alapanyagok előállítását külön jelezzük. Az étrendcímkék a felsorolt változatra vonatkoznak; ezek nem allergénmentességi garanciák.

## API-hozzáférés és biztonság

Az MVP **nem igényel API-kulcsot**, így nincs elrejteni vagy kiszivárogtatni való hitelesítő adat. Kizárólag a `hu.wikibooks.org` felé engedélyezett külső hálózati kapcsolat; nincs analitika, harmadik féltől töltött script, külső font vagy fotó. A Content Security Policy az `index.html` fejlécében található.

GitHub Pages csak statikus fájlokat szolgál ki. Ha később kulcsot igénylő recept- vagy fordító API kerül be, a kulcsot külön szerveroldali szolgáltatásban / függvényben kell tárolni, engedélyezett szolgáltatóval, kérésszám-korláttal és ellenőrzött bemenettel. Sem a böngésző kódjába, sem a buildbe beégetett környezeti változóba nem kerülhet titkos kulcs. A GitHub Secretből frontend-fájlba írt kulcs is nyilvánossá válna.

A deployment a GitHub saját rövid életű `GITHUB_TOKEN` / OIDC mechanizmusát használja, a szükséges `pages: write` és `id-token: write` jogosultságokkal. Kézi személyes token nem kell a weboldal működéséhez.

## Adatkezelés

A kiválasztott alapanyagok és kedvencek a `localStorage` `cooking:v1` bejegyzésében tárolódnak. A lekért eredeti szövegek `cooking:source:<id>` alatt kapnak helyet. Az adatokat nem továbbítjuk saját szervernek, nem szinkronizáljuk eszközök között. A tárolás letiltása vagy megtelt tárhely esetén az oldal tovább működik, de a mentés nem garantált. A felület **Források és adatkezelés** ablakában minden saját mentés törölhető.

Online leírás lekérésekor a Wikimédia megkapja a szokásos hálózati adatokat, de az otthoni alapanyaglistát nem küldjük el. A GitHub Pages kiszolgálási naplózására a GitHub adatkezelése vonatkozik.

## Receptek és licencek

A receptszövegek a magyar Wikikönyvek közreműködőitől származó szerkesztett változatok, **CC BY-SA 4.0** licenc alatt. Minden recept mellett megtalálható az eredeti oldal és a szerzőket megnevező laptörténet. Az alapanyagok neveinek egységesítése, a lépések átfogalmazása/tagolása, az idő- és adagbecslések és egyes zsiradékcserék szerepelnek a változtatások között. A konkrét eltérést minden recept külön jelzi.

- Licencek és források: [SOURCES.md](SOURCES.md)
- Receptadatok licence: https://creativecommons.org/licenses/by-sa/4.0/deed.hu

A kód és a saját SVG-rajzok felhasználására ez a projekt nem ad a receptlicenctől független nyílt forrású licencet; a repó tulajdonosa később választhat ilyet.
