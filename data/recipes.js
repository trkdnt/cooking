// Receptszövegek: Wikikönyvek közreműködői, CC BY-SA 4.0.
// Szerkesztett, tagolt változatok; az idő és néhol az adagszám becslés.
const base = 'Szakácskönyv/';
const i = (id, amount, label) => ({ id, amount, ...(label ? { label } : {}) });
export const recipes = [
  {
    id: 'gombapaprikas', title: 'Krémes gombapaprikás', emoji: '🍄', color: 'sage', category: 'Magyar klasszikus',
    description: 'Selymes tejföl, puha gomba, egy csipet pirospaprika. Igazi otthoníz.',
    minutes: 30, servings: '2–4', vegetarian: true, vegan: false, dairyFree: false,
    page: base + 'Gombás ételek/Gombapaprikás',
    ingredients: [i('gomba','50 dkg'),i('hagyma','1 fej'),i('petrezselyem','3–4 szál'),i('tejfol','2 dl'),i('olaj','1 ek'),i('liszt','1 tk'),i('pirospaprika','1 csapott kk'),i('so','ízlés szerint')],
    steps: ['A gombát tisztítsd meg, szeleteld fel. A hagymát és a petrezselymet aprítsd finomra.', 'Az olajon párold üvegesre a hagymát. Add hozzá a gombát és a petrezselymet, szórd meg a pirospaprikával, sózd meg.', 'Párold puhára; ha szükséges, kevés vízzel pótold az elpárolgott folyadékot.', 'Szórd meg a liszttel, keverd hozzá a tejfölt, és egyszer forrald össze.'],
    note: 'A forrásban szereplő zsiradékot ebben a változatban növényi olajként adtuk meg. Köret nincs beleszámítva a hozzávalókba.'
  },
  {
    id: 'paprikas-krumpli', title: 'Paprikás krumpli', emoji: '🥔', color: 'terracotta', category: 'Egy lábasban',
    description: 'Laktató, szaftos kedvenc a kamra legegyszerűbb alapanyagaiból.',
    minutes: 40, servings: '4 (becsült)', vegetarian: false, vegan: false, dairyFree: true,
    page: base + 'Növények/Burgonyás/Paprikás krumpli',
    ingredients: [i('krumpli','1 kg'),i('virsli','2–3 pár'),i('hagyma','3–4 fej'),i('szalonna','kis darab szalonnabőr'),i('olaj','2 ek'),i('gulyaskrem','3 ek'),i('bors','1 csipet'),i('so','ízlés szerint')],
    steps: ['A hagymát kockázd fel, a burgonyát hámozd meg, mosd meg és vágd hasábokra.', 'Az olajon pirítsd meg a hagymát és a kis darab szalonnabőrt. Keverd hozzá a borsot és a gulyáskrémet. Sózás előtt kóstold meg, mert a krém is sós.', 'Add hozzá a krumplit és 2–3 dl vizet. Fedő alatt főzd puhára; ha szükséges, pótold a vizet.', 'Végül add hozzá a felkarikázott virslit, és főzd össze.'],
    note: 'A forrásban szereplő sómennyiséget ízlés szerinti sózásra módosítottuk. A virsli és a gulyáskrém összetételét ellenőrizd, ha kerülöd a tejet.'
  },
  {
    id: 'rakott-krumpli', title: 'Sütőben sült rakott krumpli', emoji: '🥘', color: 'gold', category: 'Sütőből az asztalra',
    description: 'Aranyszínű tejfölréteg alatt tojás, kolbász és puha burgonya.',
    minutes: 75, servings: '4 (becsült)', vegetarian: false, vegan: false, dairyFree: false,
    page: base + 'Növények/Burgonyás/Rakott krumpli',
    ingredients: [i('krumpli','1 kg'),i('tojas','6 db'),i('kolbasz','1 pár füstölt'),i('tejfol','5 dl'),i('olaj','a tál kikenéséhez'),i('so','ízlés szerint')],
    steps: ['A burgonyát főzd meg héjában. Külön edényben főzd keményre a tojásokat. Hámozd meg és karikázd fel mindkettőt, a kolbászt is vágd karikákra.', 'Egy tűzálló tálat kenj ki olajjal. Rétegezd bele a burgonya harmadát, sózd, majd add hozzá a kolbász és a tojás felét, és locsold meg tejföllel.', 'Ismételd meg a rétegezést. A maradék burgonyával fedd be, majd kend rá a maradék tejfölt, és csöpögtess rá kevés olajat.', 'Előmelegített, körülbelül 180 °C-os sütőben süsd 35–40 percig, amíg a teteje megpirul.'],
    note: 'A zsiradék alternatívái közül növényi olajat választottunk. A 180 °C szerkesztői irányérték; a sütők eltérhetnek.'
  },
  {
    id: 'zoldborsofozelek', title: 'Karamelles zöldborsófőzelék', emoji: '🫛', color: 'mint', category: 'Zöldségek főszerepben',
    description: 'Egy régi, tej nélkül készülő változat, finoman édeskés karamellel.',
    minutes: 60, servings: '4 (becsült)', vegetarian: true, vegan: true, dairyFree: true,
    page: base + 'Főzelékek/Zöldborsófőzelék',
    ingredients: [i('zoldborso','1,5 kg friss vagy 1 csomag mirelit'),i('olaj','2 ek'),i('cukor','2–3 ek'),i('so','ízlés szerint'),i('liszt','1–2 ek')],
    steps: ['A megtisztított, megmosott borsót tedd az olajra, adj hozzá 1 dl vizet, és fedő alatt párold puhára.', 'Szórd meg liszttel, keverd át, majd fokozatosan adj hozzá körülbelül fél liter vizet.', 'Külön kis edényben olvaszd aranyszínűre a cukrot. Óvatosan add a főzelékhez: a forró karamell a folyadéktól felcsaphat.', 'Sózd ízlés szerint. Hagyd legalább fél órát állni, amíg a karamell feloldódik; ezt az időt a becsült elkészítési idő tartalmazza.'],
    note: 'A forrásban szereplő sómennyiséget ízlés szerinti sózásra módosítottuk. A mirelit csomag mérete a forrásban nincs megadva.'
  },
  {
    id: 'tepsis-lecso', title: 'Rizses-kolbászos tepsis lecsó', emoji: '🫑', color: 'peach', category: 'Tartalmas egytálétel',
    description: 'Paprika, paradicsom és fűszeres kolbász, szaftos rizzsel összesütve.',
    minutes: 55, servings: '4 (becsült)', vegetarian: false, vegan: false, dairyFree: false,
    page: base + 'Növények/Lecsó/Tepsis lecsó',
    ingredients: [i('paprika','1 kg'),i('kolbasz','2 szál lángolt'),i('rizs','2 zacskó gyorsrizs'),i('tejfol','2 dl'),i('hagyma','2 nagy fej'),i('paradicsom','4 db'),i('szalonna','5 dkg füstölt'),i('eteliz','2 ek ételízesítő'),i('pirospaprika','1 púpozott ek'),i('fokhagyma','3 gerezd'),i('bors','1 mk'),i('so','ízlés szerint')],
    steps: ['A gyorsrizst kevés vízben, az ételízesítővel főzd félpuhára. A paprikát szeleteld, a paradicsomot negyedeld, a hagymát karikázd fel.', 'A szalonnát aprítsd fel, olvaszd ki a zsírját, és fonnyaszd meg rajta a hagymát. Add hozzá a paprikát, sózd, és fedő alatt párold üvegesre.', 'Keverd hozzá a pirospaprikát és a zúzott fokhagymát. A tejfölt keverd össze a borssal és ízlés szerint sóval.', 'A rizst, a kolbászkarikákat és a lecsót keverd össze, terítsd tepsibe. Tedd rá a paradicsomot, locsold meg a tejföllel.', 'Alufóliával befedve, előmelegített, közepesen forró sütőben párold körülbelül 20 percig, amíg a rizs megpuhul. Villával lazítsd fel tálalás előtt.'],
    note: 'A „gyorsrizs” csomagméretét a forrás nem határozza meg. Az ételízesítő sótartalmát vedd figyelembe.'
  },
  {
    id: 'lencsefozelek', title: 'Mustáros lencsefőzelék', emoji: '🍲', color: 'sand', category: 'Kamrából az asztalra',
    description: 'Fokhagymás, babérleveles klasszikus egy kevés mustárral és tejföllel.',
    minutes: 60, servings: '4 (becsült)', vegetarian: false, vegan: false, dairyFree: false,
    page: base + 'Főzelékek/Lencsefőzelék',
    ingredients: [i('lencse','400 g'),i('fokhagyma','3 gerezd'),i('baber','2 db levél'),i('hagyma','1 db'),i('so','ízlés szerint'),i('zsir','a rántáshoz'),i('liszt','a rántáshoz'),i('pirospaprika','a rántáshoz'),i('tejfol','1 pohár'),i('ecet','néhány csepp'),i('mustar','ízlés szerint'),i('huskocka','1 db füstölthús-ízesítésű')],
    steps: ['A megtisztított, megmosott lencsét előzetesen áztasd be hideg vízbe. Az áztatás ideje nincs benne a 60 perces becslésben.', 'Bő vízben tedd fel főni a hagymával, fokhagymával, babérlevéllel és a füstölthús-ízesítésű kockával. Sózd az ízesítő sótartalmát figyelembe véve.', 'Ha a lencse megpuhult, a zsírból és lisztből készíts világos rántást, a tűzről levéve keverj hozzá pirospaprikát, majd kevés főzőlével hígítva add a lencséhez.', 'A tejfölt keverd össze kevés mustárral és ecettel. Keverd a főzelékhez, és főzd össze.'],
    note: 'A forrás füstízű port is említ alternatívaként. Az MVP a húskockás változatot számolja; ezért nem jelöljük vegetáriánusnak.'
  },
  {
    id: 'palacsinta', title: 'Habkönnyű palacsinta', emoji: '🥞', color: 'butter', category: 'Valami édes',
    description: 'Móra Ferencné régi receptje, felvert tojásfehérjével lazítva.',
    minutes: 30, servings: '4 (becsült)', vegetarian: true, vegan: false, dairyFree: false,
    page: 'Móra Ferencné/Tészták/Zsírban sült tészták/Palacsinta',
    ingredients: [i('tojas','3 db'),i('cukor','1 késhegynyi'),i('so','1 késhegynyi'),i('liszt','20–25 dkg'),i('tej','1 l'),i('olaj','a sütéshez')],
    steps: ['Válaszd szét a tojásokat. A sárgáját keverd el kevés sóval és cukorral, majd a tejjel és a liszttel készíts sima tésztát.', 'Egy-két tojás fehérjét verj habbá, és közvetlenül sütés előtt óvatosan forgasd a tésztába.', 'A palacsintasütőben forrósíts kevés olajat, majd merj bele annyi tésztát, hogy vékonyan elterüljön.', 'Ha az alja megpirult, fordítsd meg, és süsd meg a másik oldalát is. Ismételd a maradék tésztával.'],
    note: 'A történeti forrás arányait követjük; a tészta hígabb lehet a mai változatoknál. A sütéshez zsírt növényi olajra cseréltünk. Töltelék nincs beleszámítva.'
  },
  {
    id: 'lecsos-palacsinta', title: 'Lecsós palacsinta', emoji: '🌯', color: 'rose', category: 'Új élet a maradéknak',
    description: 'Ha maradt sós palacsinta és lecsó, készülhet belőlük egy egészen új fogás.',
    minutes: 40, servings: '4 (becsült)', vegetarian: true, vegan: false, dairyFree: false,
    page: base + 'Növények/Lecsó/Lecsós palacsinta',
    ingredients: [i('keszpalacsinta','8 db sós, kész'),i('keszlecso','8 dl húsmentes, kész'),i('tojas','6 db'),i('hagyma','2 fej'),i('tejfol','4 dl'),i('olaj','2 ek'),i('cukor','ízlés szerint'),i('pirospaprika','ízlés szerint'),i('so','ízlés szerint'),i('bors','ízlés szerint')],
    steps: ['Az egyik hagymát aprítsd finomra, párold meg egy evőkanál olajon, és szórd meg pirospaprikával. Add hozzá a kész lecsót, sózd, párold össze.', 'Keverd hozzá a tejföl felét és a tojásokat; ízlés szerint kevés cukorral ízesítsd. Melegítsd forráspontig, majd töltsd meg vele a sós palacsintákat, és göngyöld fel őket.', 'A másik hagymát aprítsd fel, és párold meg a maradék olajon. Sóval, borssal, pirospaprikával ízesítsd, majd a maradék tejföllel főzd 4–5 percig.', 'A palacsintákat fektesd tűzálló tálba, öntsd le a mártással, és sütőben melegítsd át, pirítás nélkül.'],
    note: 'A húsmentes lecsó és az előre megsütött sós palacsinta külön, kész alapanyagként szerepel. Ezek elkészítési ideje nincs benne a becslésben. A forrás elkészítésében szereplő borsot a listához adtuk.'
  }
];
