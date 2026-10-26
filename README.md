# Mi van otthon?

Egyszerű, magyar nyelvű otthoni alapanyaglista. Jelöld be, mi van nálad, add meg a mennyiséget, ha szeretnéd, majd másold ki a listát vagy a kész receptkereső kérdést egy beszélgetésbe.

## Funkciók

- 124 beépített alapanyag, kategóriák és ékezet nélküli keresés.
- Saját alapanyagok hozzáadása; a már létező neveket nem duplázza.
- Mennyiség és receptkeresési megjegyzés, például „2 főre, 30 perc alatt”.
- Automatikus helyi mentés. A korábbi receptajánló bejelölt alapanyagait átveszi.
- Egy gombbal másolható alapanyaglista vagy teljes magyar receptkereső kérdés.
- Ha a böngésző nem engedi az automatikus vágólapmásolást, kijelölhető szöveget mutat.
- Listaürítés 12 másodpercig visszavonható.

A receptkeresést a felhasználó abban a beszélgetésben indítja el, ahová a szöveget beilleszti. Az oldal nem hív AI-t vagy külső receptszolgáltatót, nem igényel API-kulcsot.

## Használat helyben

Node.js 22+ és Python 3. Nincs telepítendő függőség.

```sh
npm test
npm start
```

Megnyitás: http://127.0.0.1:4173 . A JavaScript-modulokhoz HTTP-kiszolgálás szükséges; a `file://` megnyitás nem támogatott.

```sh
npm run build
```

A közzétehető állományok a `dist/` mappába kerülnek. A relatív hivatkozások miatt a `/cooking/` alkönyvtárban is működnek.

## GitHub Pages

Éles oldal: https://trkdnt.github.io/cooking/

A `main` ágra küldött módosítás a `.github/workflows/pages.yml` folyamaton keresztül tesztel, összeállít és közzétesz. A repó **Settings → Pages → Source** értéke **GitHub Actions**.

## Helyi mentés és adatkezelés

A lista a böngésző `localStorage` tárhelyének `cooking:pantry:v2` bejegyzésében él. A korábbi `cooking:v1` alapanyagválasztásait az első megnyitáskor átveszi. Másik böngészőre/eszközre nem szinkronizálódik. A böngésző adatainak törlése vagy privát mód használata miatt elveszhet. Letiltott vagy megtelt tárhely esetén jól látható figyelmeztetés jelenik meg; másolással ilyenkor is elmenthető a lista.

Nincs saját szerver, analitika, külső script, külső font vagy recept-API. A weboldal CSP-je kizárólag saját forrásokat engedélyez. A GitHub tárhelykiszolgálására a GitHub adatkezelése vonatkozik.

A helyi tárhelyen található egyedi neveket, mennyiségeket és megjegyzéseket bemenetként kezeljük: hosszukat korlátozzuk, a megjelenítésüket biztonságosan kódoljuk. A vágólapra csak a felhasználó gombnyomása után kerül szöveg.

A favicon és a tányérrajz saját SVG. Az alapanyagjelölők az eszköz beépített emoji-betűkészletével jelennek meg.
