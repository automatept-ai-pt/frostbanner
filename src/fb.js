/*! FrostBanner v0.4.2 — beautiful cookie banners */
(function (w, d) {
  'use strict';
  if (w.FrostBanner) return;

  // ---------- constants ----------
  var KEY = 'fb_consent';
  var EU = 'AT BE BG HR CY CZ DK EE FI FR DE GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE IS LI NO GB CH'.split(' ');
  // FrostBanner category -> Google Consent Mode v2 keys
  var GCM = {
    analytics: ['analytics_storage'],
    marketing: ['ad_storage', 'ad_user_data', 'ad_personalization'],
    functional: ['functionality_storage', 'personalization_storage']
  };
  // Default long text (T.*.text) is built from the active categories at render time — see defText().
  // These are the clauses the sentence is made of, one per category.
  // GENERATED from i18n/banner_langs.py by i18n/apply.py: edit translations there, not here.
  var CATTXT = {"en":{"necessary":"run this site","analytics":"measure traffic","marketing":"personalise ads","functional":"remember your preferences","lead":"We use cookies to ","and":" and ","tail":". You choose which ones we can use."},"pt":{"necessary":"o site funcionar","analytics":"medir o tráfego","marketing":"personalizar anúncios","functional":"lembrar as suas preferências","lead":"Usamos cookies para ","and":" e ","tail":". Escolha quais podemos usar."},"ca":{"necessary":"fer funcionar el lloc","analytics":"mesurar el trànsit","marketing":"personalitzar anuncis","functional":"recordar les teves preferències","lead":"Fem servir galetes per ","and":" i ","tail":". Tu tries quines podem fer servir."},"da":{"necessary":"drive hjemmesiden","analytics":"måle trafikken","marketing":"tilpasse annoncer","functional":"huske dine præferencer","lead":"Vi bruger cookies til at ","and":" og ","tail":". Du vælger, hvilke vi må bruge."},"de":{"necessary":"die Website zu betreiben","analytics":"Besuche zu messen","marketing":"Werbung zu personalisieren","functional":"Ihre Einstellungen zu speichern","lead":"Wir verwenden Cookies, um ","and":" und ","tail":". Sie entscheiden, welche wir verwenden dürfen."},"et":{"necessary":"veebilehe toimimiseks","analytics":"külastuste mõõtmiseks","marketing":"reklaamide isikupärastamiseks","functional":"teie eelistuste meelespidamiseks","lead":"Kasutame küpsiseid ","and":" ja ","tail":". Teie valite, milliseid võime kasutada."},"es":{"necessary":"que el sitio funcione","analytics":"medir el tráfico","marketing":"personalizar anuncios","functional":"recordar tus preferencias","lead":"Usamos cookies para ","and":" y ","tail":". Tú eliges cuáles podemos usar."},"fr":{"necessary":"faire fonctionner le site","analytics":"mesurer l’audience","marketing":"personnaliser les publicités","functional":"mémoriser vos préférences","lead":"Nous utilisons des cookies pour ","and":" et ","tail":". Vous choisissez lesquels nous pouvons utiliser."},"ga":{"necessary":"an suíomh a rith","analytics":"trácht a thomhas","marketing":"fógraí a phearsantú","functional":"do roghanna a mheabhrú","lead":"Úsáidimid fianáin chun ","and":" agus ","tail":". Is tusa a roghnaíonn cé acu is féidir linn a úsáid."},"hr":{"necessary":"rad stranice","analytics":"mjerenje posjeta","marketing":"prilagodbu oglasa","functional":"pamćenje vaših postavki","lead":"Koristimo kolačiće za ","and":" i ","tail":". Vi birate koje smijemo koristiti."},"it":{"necessary":"far funzionare il sito","analytics":"misurare il traffico","marketing":"personalizzare gli annunci","functional":"ricordare le tue preferenze","lead":"Usiamo i cookie per ","and":" e ","tail":". Sei tu a scegliere quali possiamo usare."},"lv":{"necessary":"vietnes darbībai","analytics":"apmeklējumu mērīšanai","marketing":"reklāmu personalizēšanai","functional":"jūsu iestatījumu atcerēšanai","lead":"Mēs izmantojam sīkdatnes ","and":" un ","tail":". Jūs izvēlaties, kuras mēs drīkstam izmantot."},"lt":{"necessary":"svetainės veikimui","analytics":"lankomumui matuoti","marketing":"reklamoms pritaikyti","functional":"jūsų nustatymams įsiminti","lead":"Naudojame slapukus ","and":" ir ","tail":". Jūs renkatės, kuriuos galime naudoti."},"hu":{"necessary":"a webhely működtetéséhez","analytics":"a forgalom méréséhez","marketing":"a hirdetések személyre szabásához","functional":"a beállításai megjegyzéséhez","lead":"Sütiket használunk ","and":" és ","tail":". Ön dönti el, melyeket használhatjuk."},"mt":{"necessary":"biex is-sit jaħdem","analytics":"biex inkejlu t-traffiku","marketing":"biex inpersonalizzaw ir-reklami","functional":"biex niftakru l-preferenzi tiegħek","lead":"Nużaw il-cookies ","and":" u ","tail":". Int tagħżel liema nistgħu nużaw."},"nl":{"necessary":"de website te laten werken","analytics":"bezoeken te meten","marketing":"advertenties te personaliseren","functional":"uw voorkeuren te onthouden","lead":"We gebruiken cookies om ","and":" en ","tail":". U kiest welke we mogen gebruiken."},"no":{"necessary":"drive nettstedet","analytics":"måle trafikken","marketing":"tilpasse annonser","functional":"huske innstillingene dine","lead":"Vi bruker informasjonskapsler for å ","and":" og ","tail":". Du velger hvilke vi kan bruke."},"pl":{"necessary":"zapewnić działanie strony","analytics":"mierzyć ruch","marketing":"personalizować reklamy","functional":"zapamiętywać Twoje preferencje","lead":"Używamy plików cookie, aby ","and":" i ","tail":". Ty decydujesz, których możemy używać."},"ro":{"necessary":"a face site-ul să funcționeze","analytics":"a măsura traficul","marketing":"a personaliza reclamele","functional":"a reține preferințele tale","lead":"Folosim cookie-uri pentru ","and":" și ","tail":". Tu alegi pe care le putem folosi."},"sk":{"necessary":"zabezpečili fungovanie webu","analytics":"merali návštevnosť","marketing":"prispôsobili reklamy","functional":"pamätali si vaše preferencie","lead":"Používame cookies, aby sme ","and":" a ","tail":". Vy rozhodujete, ktoré môžeme používať."},"sl":{"necessary":"delovanje spletnega mesta","analytics":"merjenje obiska","marketing":"prilagajanje oglasov","functional":"shranjevanje vaših nastavitev","lead":"Piškotke uporabljamo za ","and":" in ","tail":". Vi izberete, katere lahko uporabljamo."},"fi":{"necessary":"sivuston toimintaan","analytics":"kävijämäärien mittaamiseen","marketing":"mainosten kohdentamiseen","functional":"asetustesi muistamiseen","lead":"Käytämme evästeitä ","and":" ja ","tail":". Sinä päätät, mitä saamme käyttää."},"sv":{"necessary":"driva webbplatsen","analytics":"mäta trafiken","marketing":"anpassa annonser","functional":"komma ihåg dina inställningar","lead":"Vi använder cookies för att ","and":" och ","tail":". Du väljer vilka vi får använda."},"tr":{"necessary":"sitenin çalışması","analytics":"trafiğin ölçülmesi","marketing":"reklamların kişiselleştirilmesi","functional":"tercihlerinizin hatırlanması","lead":"Çerezleri ","and":" ve ","tail":" için kullanıyoruz. Hangilerini kullanabileceğimizi siz seçersiniz."},"cs":{"necessary":"zajistili fungování webu","analytics":"měřili návštěvnost","marketing":"přizpůsobili reklamy","functional":"pamatovali si vaše preference","lead":"Používáme cookies, abychom ","and":" a ","tail":". Vy rozhodujete, které můžeme používat."},"el":{"necessary":"τη λειτουργία του ιστότοπου","analytics":"τη μέτρηση της επισκεψιμότητας","marketing":"την εξατομίκευση διαφημίσεων","functional":"την απομνημόνευση των προτιμήσεών σας","lead":"Χρησιμοποιούμε cookies για ","and":" και ","tail":". Εσείς επιλέγετε ποια μπορούμε να χρησιμοποιούμε."},"bg":{"necessary":"работата на сайта","analytics":"измерване на посещаемостта","marketing":"персонализиране на рекламите","functional":"запомняне на вашите предпочитания","lead":"Използваме бисквитки за ","and":" и ","tail":". Вие избирате кои можем да използваме."},"ru":{"necessary":"работы сайта","analytics":"измерения посещаемости","marketing":"персонализации рекламы","functional":"сохранения ваших настроек","lead":"Мы используем файлы cookie для ","and":" и ","tail":". Вы выбираете, какие из них мы можем использовать."},"uk":{"necessary":"роботи сайту","analytics":"вимірювання відвідуваності","marketing":"персоналізації реклами","functional":"збереження ваших налаштувань","lead":"Ми використовуємо файли cookie для ","and":" та ","tail":". Ви обираєте, які з них ми можемо використовувати."}};
  var T = {"en":{"title":"We value your privacy","short":"We use cookies to improve your experience.","accept":"Accept all","reject":"Reject all","prefs":"Customise","save":"Save choices","policy":"Cookie policy","manage":"Cookie settings","always":"Always on","embed":"This content from {site} uses {cat} cookies. It loads only with your consent.","embedBtn":"Allow and show","c":{"necessary":["Strictly necessary","Needed for the site to work. Always on."],"analytics":["Analytics","Helps us understand how visitors use the site."],"marketing":["Marketing","Used to show relevant ads and measure campaigns."],"functional":["Functional","Remembers choices like language and region."]}},"pt":{"title":"A sua privacidade importa","short":"Usamos cookies para melhorar a sua experiência.","accept":"Aceitar todos","reject":"Rejeitar todos","prefs":"Personalizar","save":"Guardar escolhas","policy":"Política de cookies","manage":"Definições de cookies","always":"Sempre ativos","embed":"Este conteúdo de {site} usa cookies de {cat}. Só é carregado com o seu consentimento.","embedBtn":"Permitir e mostrar","c":{"necessary":["Estritamente necessários","Indispensáveis para o site funcionar. Sempre ativos."],"analytics":["Análise","Ajudam-nos a perceber como o site é utilizado."],"marketing":["Marketing","Permitem mostrar anúncios relevantes e medir campanhas."],"functional":["Funcionais","Guardam preferências como idioma e região."]}},"ca":{"title":"Valorem la teva privacitat","short":"Fem servir galetes per millorar la teva experiència.","accept":"Acceptar-les totes","reject":"Rebutjar-les totes","prefs":"Personalitzar","save":"Desar les preferències","policy":"Política de galetes","manage":"Configuració de galetes","always":"Sempre actives","embed":"Aquest contingut de {site} fa servir galetes de «{cat}». Només es carrega amb el teu consentiment.","embedBtn":"Permetre i mostrar","c":{"necessary":["Estrictament necessàries","Imprescindibles perquè el lloc funcioni. Sempre actives."],"analytics":["Analítiques","Ens ajuden a entendre com es fa servir el lloc."],"marketing":["Màrqueting","Serveixen per mostrar anuncis rellevants i mesurar campanyes."],"functional":["Funcionals","Recorden preferències com l’idioma i la regió."]}},"da":{"title":"Dit privatliv er vigtigt","short":"Vi bruger cookies til at forbedre din oplevelse.","accept":"Accepter alle","reject":"Afvis alle","prefs":"Tilpas","save":"Gem valg","policy":"Cookiepolitik","manage":"Cookieindstillinger","always":"Altid aktive","embed":"Dette indhold fra {site} bruger cookies til “{cat}”. Det indlæses kun med dit samtykke.","embedBtn":"Tillad og vis","c":{"necessary":["Nødvendige","Kræves for at hjemmesiden virker. Altid aktive."],"analytics":["Statistik","Hjælper os med at forstå, hvordan hjemmesiden bruges."],"marketing":["Marketing","Bruges til at vise relevante annoncer og måle kampagner."],"functional":["Funktionelle","Husker valg som sprog og region."]}},"de":{"title":"Ihre Privatsphäre ist uns wichtig","short":"Wir verwenden Cookies, um Ihr Erlebnis zu verbessern.","accept":"Alle akzeptieren","reject":"Alle ablehnen","prefs":"Anpassen","save":"Auswahl speichern","policy":"Cookie-Richtlinie","manage":"Cookie-Einstellungen","always":"Immer aktiv","embed":"Dieser Inhalt von {site} verwendet Cookies der Kategorie „{cat}“. Er wird nur mit Ihrer Einwilligung geladen.","embedBtn":"Erlauben und anzeigen","c":{"necessary":["Unbedingt erforderlich","Für den Betrieb der Website nötig. Immer aktiv."],"analytics":["Statistik","Helfen uns zu verstehen, wie die Website genutzt wird."],"marketing":["Marketing","Dienen dazu, relevante Werbung zu zeigen und Kampagnen zu messen."],"functional":["Funktional","Speichern Einstellungen wie Sprache und Region."]}},"et":{"title":"Hoolime teie privaatsusest","short":"Kasutame küpsiseid, et teie kogemust parandada.","accept":"Nõustu kõigiga","reject":"Keeldu kõigist","prefs":"Kohanda","save":"Salvesta valikud","policy":"Küpsiste kasutamise põhimõtted","manage":"Küpsiste seaded","always":"Alati sees","embed":"See sisu saidilt {site} kasutab küpsiseid (kategooria: {cat}). See laaditakse ainult teie nõusolekul.","embedBtn":"Luba ja näita","c":{"necessary":["Hädavajalikud","Vajalikud veebilehe toimimiseks. Alati sees."],"analytics":["Analüütika","Aitavad mõista, kuidas veebilehte kasutatakse."],"marketing":["Turundus","Kasutatakse asjakohaste reklaamide näitamiseks ja kampaaniate mõõtmiseks."],"functional":["Funktsionaalsed","Jätavad meelde valikud, nagu keel ja piirkond."]}},"es":{"title":"Valoramos tu privacidad","short":"Usamos cookies para mejorar tu experiencia.","accept":"Aceptar todas","reject":"Rechazar todas","prefs":"Personalizar","save":"Guardar preferencias","policy":"Política de cookies","manage":"Configuración de cookies","always":"Siempre activas","embed":"Este contenido de {site} usa cookies de «{cat}». Solo se carga con tu consentimiento.","embedBtn":"Permitir y mostrar","c":{"necessary":["Estrictamente necesarias","Imprescindibles para que el sitio funcione. Siempre activas."],"analytics":["Analíticas","Nos ayudan a entender cómo se usa el sitio."],"marketing":["Marketing","Sirven para mostrar anuncios relevantes y medir campañas."],"functional":["Funcionales","Recuerdan preferencias como el idioma y la región."]}},"fr":{"title":"Votre vie privée compte","short":"Nous utilisons des cookies pour améliorer votre expérience.","accept":"Tout accepter","reject":"Tout refuser","prefs":"Personnaliser","save":"Enregistrer mes choix","policy":"Politique de cookies","manage":"Paramètres des cookies","always":"Toujours actifs","embed":"Ce contenu de {site} utilise des cookies « {cat} ». Il ne se charge qu’avec votre consentement.","embedBtn":"Autoriser et afficher","c":{"necessary":["Strictement nécessaires","Indispensables au fonctionnement du site. Toujours actifs."],"analytics":["Mesure d’audience","Nous aident à comprendre comment le site est utilisé."],"marketing":["Marketing","Servent à afficher des publicités pertinentes et à mesurer les campagnes."],"functional":["Fonctionnels","Mémorisent des choix comme la langue et la région."]}},"ga":{"title":"Tá do phríobháideachas tábhachtach dúinn","short":"Úsáidimid fianáin chun d’eispéireas a fheabhsú.","accept":"Glac le gach ceann","reject":"Diúltaigh do gach ceann","prefs":"Saincheap","save":"Sábháil roghanna","policy":"Beartas fianán","manage":"Socruithe fianán","always":"Ar siúl i gcónaí","embed":"Úsáideann an t-ábhar seo ó {site} fianáin den chatagóir “{cat}”. Ní lódáiltear é ach le do thoiliú.","embedBtn":"Ceadaigh agus taispeáin","c":{"necessary":["Fíor-riachtanach","Teastaíonn siad chun go n-oibreoidh an suíomh. Ar siúl i gcónaí."],"analytics":["Anailísíocht","Cabhraíonn siad linn tuiscint a fháil ar conas a úsáidtear an suíomh."],"marketing":["Margaíocht","Úsáidtear iad chun fógraí ábhartha a thaispeáint agus feachtais a thomhas."],"functional":["Feidhmiúil","Cuimhníonn siad ar roghanna amhail teanga agus réigiún."]}},"hr":{"title":"Vaša privatnost nam je važna","short":"Koristimo kolačiće kako bismo poboljšali vaše iskustvo.","accept":"Prihvati sve","reject":"Odbij sve","prefs":"Prilagodi","save":"Spremi odabir","policy":"Pravila o kolačićima","manage":"Postavke kolačića","always":"Uvijek uključeni","embed":"Ovaj sadržaj sa stranice {site} koristi kolačiće vrste „{cat}”. Učitava se samo uz vašu privolu.","embedBtn":"Dopusti i prikaži","c":{"necessary":["Nužni","Potrebni za rad stranice. Uvijek uključeni."],"analytics":["Analitički","Pomažu nam razumjeti kako se stranica koristi."],"marketing":["Marketinški","Služe za prikaz relevantnih oglasa i mjerenje kampanja."],"functional":["Funkcionalni","Pamte odabire poput jezika i regije."]}},"it":{"title":"La tua privacy è importante","short":"Usiamo i cookie per migliorare la tua esperienza.","accept":"Accetta tutti","reject":"Rifiuta tutti","prefs":"Personalizza","save":"Salva le scelte","policy":"Cookie policy","manage":"Impostazioni dei cookie","always":"Sempre attivi","embed":"Questo contenuto di {site} usa cookie «{cat}». Viene caricato solo con il tuo consenso.","embedBtn":"Consenti e mostra","c":{"necessary":["Strettamente necessari","Indispensabili per il funzionamento del sito. Sempre attivi."],"analytics":["Statistiche","Ci aiutano a capire come viene usato il sito."],"marketing":["Marketing","Servono a mostrare annunci pertinenti e a misurare le campagne."],"functional":["Funzionali","Ricordano scelte come la lingua e la regione."]}},"lv":{"title":"Mums rūp jūsu privātums","short":"Mēs izmantojam sīkdatnes, lai uzlabotu jūsu pieredzi.","accept":"Pieņemt visas","reject":"Noraidīt visas","prefs":"Pielāgot","save":"Saglabāt izvēli","policy":"Sīkdatņu politika","manage":"Sīkdatņu iestatījumi","always":"Vienmēr aktīvas","embed":"Šis saturs no {site} izmanto sīkdatnes (kategorija: {cat}). Tas tiek ielādēts tikai ar jūsu piekrišanu.","embedBtn":"Atļaut un rādīt","c":{"necessary":["Obligātās","Nepieciešamas vietnes darbībai. Vienmēr aktīvas."],"analytics":["Analītikas","Palīdz mums saprast, kā vietne tiek izmantota."],"marketing":["Mārketinga","Tiek izmantotas atbilstošu reklāmu rādīšanai un kampaņu mērīšanai."],"functional":["Funkcionālās","Atceras izvēles, piemēram, valodu un reģionu."]}},"lt":{"title":"Mums rūpi jūsų privatumas","short":"Naudojame slapukus, kad pagerintume jūsų patirtį.","accept":"Priimti visus","reject":"Atmesti visus","prefs":"Tinkinti","save":"Išsaugoti pasirinkimus","policy":"Slapukų politika","manage":"Slapukų nustatymai","always":"Visada įjungti","embed":"Šis turinys iš {site} naudoja slapukus (kategorija: {cat}). Jis įkeliamas tik gavus jūsų sutikimą.","embedBtn":"Leisti ir rodyti","c":{"necessary":["Būtinieji","Reikalingi svetainei veikti. Visada įjungti."],"analytics":["Analitiniai","Padeda suprasti, kaip naudojama svetainė."],"marketing":["Rinkodaros","Naudojami tinkamoms reklamoms rodyti ir kampanijoms vertinti."],"functional":["Funkciniai","Įsimena pasirinkimus, pavyzdžiui, kalbą ir regioną."]}},"hu":{"title":"Fontos számunkra az adatvédelem","short":"Sütiket használunk, hogy jobb élményt nyújtsunk.","accept":"Összes elfogadása","reject":"Összes elutasítása","prefs":"Testreszabás","save":"Választás mentése","policy":"Sütikezelési szabályzat","manage":"Sütibeállítások","always":"Mindig aktív","embed":"Ez a tartalom ({site}) „{cat}” sütiket használ. Csak az Ön hozzájárulásával töltődik be.","embedBtn":"Engedélyezés és megjelenítés","c":{"necessary":["Feltétlenül szükséges","A webhely működéséhez kellenek. Mindig aktívak."],"analytics":["Statisztikai","Segítenek megérteni, hogyan használják a webhelyet."],"marketing":["Marketing","Releváns hirdetések megjelenítésére és kampányok mérésére szolgálnak."],"functional":["Funkcionális","Megjegyzik a választásokat, például a nyelvet és a régiót."]}},"mt":{"title":"Il-privatezza tiegħek hi importanti","short":"Nużaw il-cookies biex intejbu l-esperjenza tiegħek.","accept":"Aċċetta kollox","reject":"Irrifjuta kollox","prefs":"Ippersonalizza","save":"Issejvja l-għażliet","policy":"Politika dwar il-cookies","manage":"Settings tal-cookies","always":"Dejjem attivi","embed":"Dan il-kontenut minn {site} juża cookies tal-kategorija \"{cat}\". Jitgħabba biss bil-kunsens tiegħek.","embedBtn":"Ippermetti u uri","c":{"necessary":["Strettament meħtieġa","Meħtieġa biex is-sit jaħdem. Dejjem attivi."],"analytics":["Analitiċi","Jgħinuna nifhmu kif jintuża s-sit."],"marketing":["Marketing","Jintużaw biex juru reklami rilevanti u jkejlu l-kampanji."],"functional":["Funzjonali","Jiftakru għażliet bħal-lingwa u r-reġjun."]}},"nl":{"title":"Uw privacy is belangrijk","short":"We gebruiken cookies om uw ervaring te verbeteren.","accept":"Alles accepteren","reject":"Alles weigeren","prefs":"Aanpassen","save":"Keuzes opslaan","policy":"Cookiebeleid","manage":"Cookie-instellingen","always":"Altijd actief","embed":"Deze inhoud van {site} gebruikt cookies voor ‘{cat}’. Hij wordt alleen geladen met uw toestemming.","embedBtn":"Toestaan en tonen","c":{"necessary":["Strikt noodzakelijk","Nodig om de website te laten werken. Altijd actief."],"analytics":["Statistieken","Helpen ons te begrijpen hoe de website wordt gebruikt."],"marketing":["Marketing","Worden gebruikt om relevante advertenties te tonen en campagnes te meten."],"functional":["Functioneel","Onthouden keuzes zoals taal en regio."]}},"no":{"title":"Personvernet ditt er viktig","short":"Vi bruker informasjonskapsler for å gi deg en bedre opplevelse.","accept":"Godta alle","reject":"Avvis alle","prefs":"Tilpass","save":"Lagre valg","policy":"Retningslinjer for informasjonskapsler","manage":"Innstillinger for informasjonskapsler","always":"Alltid på","embed":"Dette innholdet fra {site} bruker informasjonskapsler for «{cat}». Det lastes bare inn med ditt samtykke.","embedBtn":"Tillat og vis","c":{"necessary":["Nødvendige","Trengs for at nettstedet skal fungere. Alltid på."],"analytics":["Statistikk","Hjelper oss å forstå hvordan nettstedet brukes."],"marketing":["Markedsføring","Brukes til å vise relevante annonser og måle kampanjer."],"functional":["Funksjonelle","Husker valg som språk og region."]}},"pl":{"title":"Szanujemy Twoją prywatność","short":"Używamy plików cookie, aby ulepszyć Twoje doświadczenia.","accept":"Akceptuj wszystkie","reject":"Odrzuć wszystkie","prefs":"Dostosuj","save":"Zapisz wybór","policy":"Polityka cookie","manage":"Ustawienia cookie","always":"Zawsze aktywne","embed":"Ta treść z {site} używa plików cookie z kategorii „{cat}”. Wczyta się tylko za Twoją zgodą.","embedBtn":"Zezwól i pokaż","c":{"necessary":["Niezbędne","Potrzebne do działania strony. Zawsze aktywne."],"analytics":["Analityczne","Pomagają nam zrozumieć, jak korzystasz ze strony."],"marketing":["Marketingowe","Służą do wyświetlania trafnych reklam i mierzenia kampanii."],"functional":["Funkcjonalne","Zapamiętują wybory, takie jak język i region."]}},"ro":{"title":"Confidențialitatea ta contează","short":"Folosim cookie-uri pentru a-ți îmbunătăți experiența.","accept":"Acceptă toate","reject":"Respinge toate","prefs":"Personalizează","save":"Salvează opțiunile","policy":"Politica de cookie-uri","manage":"Setări cookie-uri","always":"Mereu active","embed":"Acest conținut de pe {site} folosește cookie-uri „{cat}”. Se încarcă doar cu acordul tău.","embedBtn":"Permite și afișează","c":{"necessary":["Strict necesare","Necesare pentru funcționarea site-ului. Mereu active."],"analytics":["Analiză","Ne ajută să înțelegem cum este folosit site-ul."],"marketing":["Marketing","Folosite pentru a afișa reclame relevante și a măsura campaniile."],"functional":["Funcționale","Rețin opțiuni precum limba și regiunea."]}},"sk":{"title":"Záleží nám na vašom súkromí","short":"Používame cookies, aby sme zlepšili váš zážitok.","accept":"Prijať všetko","reject":"Odmietnuť všetko","prefs":"Prispôsobiť","save":"Uložiť voľby","policy":"Zásady cookies","manage":"Nastavenia cookies","always":"Vždy aktívne","embed":"Tento obsah z {site} používa cookies kategórie „{cat}“. Načíta sa len s vaším súhlasom.","embedBtn":"Povoliť a zobraziť","c":{"necessary":["Nevyhnutné","Potrebné na fungovanie webu. Vždy aktívne."],"analytics":["Analytické","Pomáhajú nám pochopiť, ako sa web používa."],"marketing":["Marketingové","Slúžia na zobrazovanie relevantných reklám a meranie kampaní."],"functional":["Funkčné","Pamätajú si voľby, ako je jazyk a región."]}},"sl":{"title":"Vaša zasebnost nam je pomembna","short":"Piškotke uporabljamo za boljšo uporabniško izkušnjo.","accept":"Sprejmi vse","reject":"Zavrni vse","prefs":"Prilagodi","save":"Shrani izbiro","policy":"Politika piškotkov","manage":"Nastavitve piškotkov","always":"Vedno vklopljeni","embed":"Ta vsebina s strani {site} uporablja piškotke vrste »{cat}«. Naloži se le z vašim soglasjem.","embedBtn":"Dovoli in prikaži","c":{"necessary":["Nujno potrebni","Potrebni za delovanje spletnega mesta. Vedno vklopljeni."],"analytics":["Analitični","Pomagajo nam razumeti, kako se spletno mesto uporablja."],"marketing":["Trženjski","Uporabljajo se za prikaz ustreznih oglasov in merjenje kampanj."],"functional":["Funkcionalni","Zapomnijo si izbire, kot sta jezik in regija."]}},"fi":{"title":"Yksityisyytesi on meille tärkeää","short":"Käytämme evästeitä parantaaksemme käyttökokemustasi.","accept":"Hyväksy kaikki","reject":"Hylkää kaikki","prefs":"Mukauta","save":"Tallenna valinnat","policy":"Evästekäytäntö","manage":"Evästeasetukset","always":"Aina käytössä","embed":"Tämä sisältö palvelusta {site} käyttää evästeitä (luokka: {cat}). Se ladataan vain suostumuksellasi.","embedBtn":"Salli ja näytä","c":{"necessary":["Välttämättömät","Tarvitaan sivuston toimintaan. Aina käytössä."],"analytics":["Analytiikka","Auttavat ymmärtämään, miten sivustoa käytetään."],"marketing":["Markkinointi","Käytetään osuvien mainosten näyttämiseen ja kampanjoiden mittaamiseen."],"functional":["Toiminnalliset","Muistavat valinnat, kuten kielen ja alueen."]}},"sv":{"title":"Din integritet är viktig","short":"Vi använder cookies för att förbättra din upplevelse.","accept":"Godkänn alla","reject":"Avvisa alla","prefs":"Anpassa","save":"Spara val","policy":"Cookiepolicy","manage":"Cookieinställningar","always":"Alltid på","embed":"Det här innehållet från {site} använder cookies för ”{cat}”. Det laddas bara med ditt samtycke.","embedBtn":"Tillåt och visa","c":{"necessary":["Nödvändiga","Krävs för att webbplatsen ska fungera. Alltid på."],"analytics":["Statistik","Hjälper oss att förstå hur webbplatsen används."],"marketing":["Marknadsföring","Används för att visa relevanta annonser och mäta kampanjer."],"functional":["Funktionella","Kommer ihåg val som språk och region."]}},"tr":{"title":"Gizliliğinize önem veriyoruz","short":"Deneyiminizi iyileştirmek için çerezler kullanıyoruz.","accept":"Tümünü kabul et","reject":"Tümünü reddet","prefs":"Özelleştir","save":"Seçimleri kaydet","policy":"Çerez politikası","manage":"Çerez ayarları","always":"Her zaman açık","embed":"{site} kaynağından gelen bu içerik “{cat}” çerezleri kullanır. Yalnızca onayınızla yüklenir.","embedBtn":"İzin ver ve göster","c":{"necessary":["Zorunlu","Sitenin çalışması için gereklidir. Her zaman açık."],"analytics":["Analitik","Sitenin nasıl kullanıldığını anlamamıza yardımcı olur."],"marketing":["Pazarlama","İlgili reklamları göstermek ve kampanyaları ölçmek için kullanılır."],"functional":["İşlevsel","Dil ve bölge gibi seçimleri hatırlar."]}},"cs":{"title":"Záleží nám na vašem soukromí","short":"Používáme cookies, abychom zlepšili váš zážitek.","accept":"Přijmout vše","reject":"Odmítnout vše","prefs":"Přizpůsobit","save":"Uložit volby","policy":"Zásady cookies","manage":"Nastavení cookies","always":"Vždy aktivní","embed":"Tento obsah z {site} používá cookies kategorie „{cat}“. Načte se jen s vaším souhlasem.","embedBtn":"Povolit a zobrazit","c":{"necessary":["Nezbytné","Nutné pro fungování webu. Vždy aktivní."],"analytics":["Analytické","Pomáhají nám pochopit, jak se web používá."],"marketing":["Marketingové","Slouží k zobrazování relevantních reklam a měření kampaní."],"functional":["Funkční","Pamatují si volby, jako je jazyk a region."]}},"el":{"title":"Η ιδιωτικότητά σας μετράει","short":"Χρησιμοποιούμε cookies για να βελτιώσουμε την εμπειρία σας.","accept":"Αποδοχή όλων","reject":"Απόρριψη όλων","prefs":"Προσαρμογή","save":"Αποθήκευση επιλογών","policy":"Πολιτική cookies","manage":"Ρυθμίσεις cookies","always":"Πάντα ενεργά","embed":"Αυτό το περιεχόμενο από το {site} χρησιμοποιεί cookies της κατηγορίας «{cat}». Φορτώνεται μόνο με τη συγκατάθεσή σας.","embedBtn":"Αποδοχή και εμφάνιση","c":{"necessary":["Απολύτως απαραίτητα","Χρειάζονται για τη λειτουργία του ιστότοπου. Πάντα ενεργά."],"analytics":["Στατιστικά","Μας βοηθούν να καταλάβουμε πώς χρησιμοποιείται ο ιστότοπος."],"marketing":["Μάρκετινγκ","Χρησιμοποιούνται για σχετικές διαφημίσεις και μέτρηση καμπανιών."],"functional":["Λειτουργικά","Θυμούνται επιλογές όπως γλώσσα και περιοχή."]}},"bg":{"title":"Вашата поверителност е важна","short":"Използваме бисквитки, за да подобрим вашето изживяване.","accept":"Приемане на всички","reject":"Отказ на всички","prefs":"Персонализиране","save":"Запазване на избора","policy":"Политика за бисквитките","manage":"Настройки на бисквитките","always":"Винаги активни","embed":"Това съдържание от {site} използва бисквитки от категория „{cat}“. Зарежда се само с вашето съгласие.","embedBtn":"Разрешаване и показване","c":{"necessary":["Задължителни","Нужни са за работата на сайта. Винаги активни."],"analytics":["Аналитични","Помагат ни да разберем как се използва сайтът."],"marketing":["Маркетингови","Използват се за показване на подходящи реклами и измерване на кампании."],"functional":["Функционални","Запомнят избори като език и регион."]}},"ru":{"title":"Мы ценим вашу конфиденциальность","short":"Мы используем файлы cookie, чтобы сделать сайт удобнее.","accept":"Принять все","reject":"Отклонить все","prefs":"Настроить","save":"Сохранить выбор","policy":"Политика cookie","manage":"Настройки cookie","always":"Всегда активны","embed":"Этот материал с {site} использует файлы cookie категории «{cat}». Он загрузится только с вашего согласия.","embedBtn":"Разрешить и показать","c":{"necessary":["Необходимые","Нужны для работы сайта. Всегда активны."],"analytics":["Аналитические","Помогают понять, как используется сайт."],"marketing":["Маркетинговые","Используются для показа релевантной рекламы и оценки кампаний."],"functional":["Функциональные","Запоминают выбор, например язык и регион."]}},"uk":{"title":"Ми цінуємо вашу приватність","short":"Ми використовуємо файли cookie, щоб покращити ваш досвід.","accept":"Прийняти всі","reject":"Відхилити всі","prefs":"Налаштувати","save":"Зберегти вибір","policy":"Політика cookie","manage":"Налаштування cookie","always":"Завжди активні","embed":"Цей вміст із {site} використовує файли cookie категорії «{cat}». Він завантажиться лише за вашою згодою.","embedBtn":"Дозволити й показати","c":{"necessary":["Необхідні","Потрібні для роботи сайту. Завжди активні."],"analytics":["Аналітичні","Допомагають зрозуміти, як використовується сайт."],"marketing":["Маркетингові","Використовуються для показу релевантної реклами та оцінки кампаній."],"functional":["Функціональні","Запам’ятовують вибір, наприклад мову та регіон."]}}};
  var LALIAS = {"nb":"no","nn":"no"};

  // ---------- templates (visual presets; any field can be overridden in config) ----------
  var TPL = {
    frost:     { layout: 'corner', theme: 'light', glass: true,  glow: false, icon: false, radius: 18, accent: '#2b64d9' },
    midnight:  { layout: 'corner', theme: 'dark',  glass: true,  glow: false, icon: false, radius: 18, accent: '#6e9bff' },
    aurora:    { layout: 'corner', theme: 'dark',  glass: true,  glow: true,  icon: true,  radius: 22, accent: '#8b6cff' },
    glacier:   { layout: 'bar',    theme: 'light', glass: true,  glow: false, icon: false, radius: 16, accent: '#2b64d9' },
    obsidian:  { layout: 'bar',    theme: 'dark',  glass: true,  glow: false, icon: true,  radius: 12, accent: '#e0a33a' },
    porthole:  { layout: 'center', theme: 'light', glass: true,  glow: false, icon: true,  radius: 24, accent: '#0f8b8d' },
    nightfall: { layout: 'center', theme: 'dark',  glass: true,  glow: true,  icon: false, radius: 20, accent: '#ff7a59' },
    pebble:    { layout: 'pill',   theme: 'light', glass: true,  glow: false, icon: false, radius: 16, accent: '#1d2433' },
    paper:     { layout: 'corner', theme: 'light', glass: false, glow: false, icon: false, radius: 6,  accent: '#1d2433' },
    mint:      { layout: 'corner', theme: 'tint',  glass: true,  glow: false, icon: true,  radius: 28, accent: '#1f9d7a' },
    bubble:    { layout: 'chat',   theme: 'light', glass: true,  glow: false, icon: false, radius: 20, accent: '#6a4cff' },
    whisper:   { layout: 'chat',   theme: 'dark',  glass: true,  glow: false, icon: false, radius: 20, accent: '#38bdf8' },
    biscuit:   { layout: 'split',  theme: 'light', glass: false, glow: false, icon: false, radius: 18, accent: '#c4682b' },
    cocoa:     { layout: 'split',  theme: 'dark',  glass: true,  glow: true,  icon: false, radius: 18, accent: '#e8a55c' }
  };

  // ---------- config ----------
  var user = w.frostBannerConfig || {};
  // <script src=".../v1/fb.js" data-site="SITE_ID">: site id and log endpoint come from the tag itself
  var me = d.currentScript, auto = {};
  if (me && me.src) {
    if (me.getAttribute('data-site')) auto.site = me.getAttribute('data-site');
    try { auto.endpoint = new URL('/v1/consent', me.src).href; } catch (e) {}
  }
  user = assign({}, auto, user);
  var DEF = {
    site: 'demo', version: 1, lang: null, template: 'frost',
    layout: 'corner',            // corner | bar | center | pill | chat | split
    theme: 'light',              // light | dark | tint
    glass: true, glow: false, icon: false,
    accent: '#2b64d9', radius: 18, blur: 18,
    categories: ['necessary', 'analytics', 'marketing', 'functional'],
    policyUrl: '#', geo: { mode: 'all', country: null }, // mode: all | eu
    endpoint: null, maxAgeDays: 180, branding: true,
    reloadOnWithdraw: true,      // reload the page when a category whose scripts already ran is withdrawn
    container: null,             // selector: render inside an element (editor preview)
    texts: {}
  };
  var cfg = assign({}, DEF, TPL[user.template] || TPL.frost, user);

  // Settings published in the dashboard replace the inline config entirely
  // (only site, endpoint and container are kept from the page).
  // The server always sends the owner's plan; Free limits apply to inline settings too.
  var FREE = ['frost', 'midnight', 'glacier'];
  var STYLE = ['layout', 'theme', 'glass', 'glow', 'icon', 'accent', 'radius', 'blur'];
  function useRemote(r) {
    if (!r || typeof r !== 'object') return;
    if (r.template) {
      cfg = assign({}, DEF, TPL[r.template] || TPL.frost, r,
        { site: cfg.site, endpoint: cfg.endpoint, container: cfg.container, texts: r.texts || {} });
      if (!cfg.policyUrl) cfg.policyUrl = '#';
    }
    cfg.geo = assign({}, cfg.geo || {}, { country: (r.geo && r.geo.country) || null });
    if (r.plan !== 'pro') {
      cfg.branding = true;
      var tp = FREE.indexOf(cfg.template) > -1 ? cfg.template : 'frost';
      for (var i = 0; i < STYLE.length; i++) cfg[STYLE[i]] = TPL[tp][STYLE[i]] !== undefined ? TPL[tp][STYLE[i]] : DEF[STYLE[i]];
      cfg.template = tp;
      cfg.geo = assign({}, cfg.geo, { mode: 'all' });
    }
  }

  var L = {}, mem = null, stored = null, state = null, draft = { necessary: true };
  var host, root, view = 'main', mode = null, typed = false;

  function assign(t) {
    for (var i = 1; i < arguments.length; i++) { var s = arguments[i]; for (var k in s) if (Object.prototype.hasOwnProperty.call(s, k)) t[k] = s[k]; }
    return t;
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); }
  function emit(n, p) {
    (L[n] || []).forEach(function (f) { try { f(p); } catch (e) {} });
    try { w.dispatchEvent(new CustomEvent('frostbanner:' + n, { detail: p })); } catch (e) {}
  }
  function warn(m) { try { console.warn('FrostBanner: ' + m); } catch (e) {} }
  function uid() {
    try { return crypto.randomUUID(); } catch (e) { return 'fb-' + Math.random().toString(36).slice(2) + Date.now().toString(36); }
  }
  // ---------- config values that reach HTML/CSS are validated (defence in depth against a bad config) ----------
  // Accent goes into a <style> block: only #rgb … #rrggbbaa is accepted.
  function accent() { return /^#[0-9a-fA-F]{3,8}$/.test(cfg.accent || '') ? cfg.accent : DEF.accent; }
  // Category keys go into attributes and the consent record: lower-case letters and "_" only.
  function cats() {
    return (Array.isArray(cfg.categories) ? cfg.categories : DEF.categories)
      .filter(function (k) { return typeof k === 'string' && /^[a-z_]+$/.test(k); });
  }
  // URLs from config (policy link, iframe data-src): http(s), relative paths and #anchors only
  // (no javascript:, data:, …). The string is normalised exactly as the browser's URL parser does
  // (tabs/newlines removed anywhere, C0 controls and spaces trimmed at both ends: "java\tscript:",
  // "\u0001javascript:" must not slip through), and the SAME string is checked and returned.
  // Not String#trim(): it also strips U+00A0, U+FEFF… which the browser keeps, so
  // "\u00a0javascript:" would pass the check as a relative path and come back as "javascript:".
  function cleanUrl(u) {
    if (typeof u !== 'string') return null;
    var v = u.replace(/[\t\n\r]/g, '').replace(/^[\u0000-\u0020]+|[\u0000-\u0020]+$/g, '');
    var scheme = v.match(/^([a-zA-Z][a-zA-Z0-9+.\-]*):/);
    return v && (!scheme || /^https?$/i.test(scheme[1])) ? v : null;
  }
  function safeUrl(u) { return cleanUrl(u) || '#'; }
  function each(fn) { cats().forEach(fn); }
  function pick(fn) { var o = {}; each(function (k) { o[k] = k === 'necessary' ? true : !!fn(k); }); return o; }
  // Default long text names only the categories actually in use (e.g. no "personalise ads" if Marketing is off).
  function defText(l) {
    var m = CATTXT[l] || CATTXT.en, parts = [];
    each(function (k) { if (m[k]) parts.push(m[k]); });
    if (!parts.length) parts.push(m.necessary);
    var joined = parts.length > 1 ? parts.slice(0, -1).join(', ') + m.and + parts[parts.length - 1] : parts[0];
    return m.lead + joined + m.tail;
  }

  // Consent lifetime in days. A non-numeric or non-positive maxAgeDays would give "max-age=NaN"
  // (a session cookie) and a record that never expires, so it falls back to the default.
  function maxAge() { var n = +cfg.maxAgeDays; return n > 0 && n < 1e5 ? n : DEF.maxAgeDays; }

  // ---------- storage: cookie, then localStorage, then memory ----------
  function readStore() {
    var raw = null;
    try { var m = d.cookie.match(/(?:^|; )fb_consent=([^;]*)/); if (m) raw = decodeURIComponent(m[1]); } catch (e) {}
    if (!raw) { try { raw = w.localStorage.getItem(KEY); } catch (e) {} }
    if (!raw) raw = mem;
    try { return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
  }
  function writeStore(o) {
    var s = JSON.stringify(o); mem = s;
    try {
      d.cookie = KEY + '=' + encodeURIComponent(s) + ';path=/;max-age=' + Math.round(maxAge() * 86400) +
        ';SameSite=Lax' + (location.protocol === 'https:' ? ';Secure' : '');
    } catch (e) {}
    try { w.localStorage.setItem(KEY, s); } catch (e) {}
  }
  function clearStore() {
    mem = null;
    try { d.cookie = KEY + '=;path=/;max-age=0'; } catch (e) {}
    try { w.localStorage.removeItem(KEY); } catch (e) {}
  }

  // ---------- Google Consent Mode v2 ----------
  w.dataLayer = w.dataLayer || [];
  if (typeof w.gtag !== 'function') w.gtag = function () { w.dataLayer.push(arguments); };
  // Options (inline config only: the default must be sent before any Google tag loads, i.e. before
  // the dashboard settings arrive): consentMode: { region: ['ES', 'PT'], waitForUpdate: 500,
  // adsDataRedaction: true, urlPassthrough: true }.
  function gcmState(c) {
    var o = {};
    for (var k in GCM) GCM[k].forEach(function (x) { o[x] = c && c[k] ? 'granted' : 'denied'; });
    return o;
  }
  function gcm(kind, c) {
    var o = gcmState(c);
    if (kind === 'default') {
      var g = cfg.consentMode && typeof cfg.consentMode === 'object' ? cfg.consentMode : {};
      var wait = +g.waitForUpdate;
      o.security_storage = 'granted';
      o.wait_for_update = g.waitForUpdate != null && wait >= 0 && wait <= 1e4 ? wait : 500;
      var reg = (Array.isArray(g.region) ? g.region : []).filter(function (r) { return typeof r === 'string' && /^[A-Za-z]{2}(-[A-Za-z0-9]{1,3})?$/.test(r); });
      if (reg.length) {
        // Denied by default only in these regions (Google uses the most specific default);
        // everywhere else the tags start granted. The owner's choice: off unless configured.
        var all = gcmState(pick(function () { return true; }));
        all.security_storage = 'granted';
        w.gtag('consent', 'default', all);
        o.region = reg;
      }
      w.gtag('consent', 'default', o);
      if (g.adsDataRedaction === true) w.gtag('set', 'ads_data_redaction', true);
      if (g.urlPassthrough === true) w.gtag('set', 'url_passthrough', true);
    } else w.gtag('consent', kind, o);
    emit('consentmode', { kind: kind, state: o });
  }

  // ---------- script blocking: <script type="text/plain" data-category="analytics"> ----------
  // Scripts run in document order, as they would have without blocking:
  // - an external script without "async" is inserted with async = false, so external scripts keep
  //   their order among themselves (a script created from JS is async by default);
  // - an inline script waits until every earlier non-async external script has loaded (or failed),
  //   so `<script src="lib.js">` + an inline script that uses lib.js work after consent.
  var runQ = [], waiting = 0, runGen = 0, ran = {};   // ran: categories whose scripts ran on this page
  function unblock(c) {
    var n = d.querySelectorAll('script[type="text/plain"][data-category]');
    for (var i = 0; i < n.length; i++) {
      var o = n[i];
      if (!c[o.getAttribute('data-category')] || o.hasAttribute('data-fb-run')) continue;
      o.setAttribute('data-fb-run', '');
      runQ.push(o);
    }
    pump();
  }
  function pump() {
    while (runQ.length) {
      if (!runQ[0].hasAttribute('src') && waiting) return;   // inline: wait for the external scripts before it
      runScript(runQ.shift());
    }
  }
  // JavaScript MIME types from the HTML spec, plus "module". Case-insensitive, parameters ignored.
  function isJs(t) {
    t = String(t || '').split(';')[0].trim().toLowerCase();
    return !t || t === 'module' ||
      /^(text|application)\/(x-)?(java|ecma)script$/.test(t) || /^text\/(javascript1\.[0-5]|jscript|livescript)$/.test(t);
  }
  function runScript(o) {
    // Removed from the page while waiting (SPA route change): skip it, but let it run if it comes back.
    if (!o.parentNode || o.isConnected === false) { o.removeAttribute('data-fb-run'); return; }
    var cat = o.getAttribute('data-category'), ext = o.hasAttribute('src');
    var s = d.createElement('script');
    // All attributes are copied except our own, on purpose: they are written by the site owner
    // (same trust as the script itself) and sites rely on them, e.g. onload="init()", nonce,
    // integrity, crossorigin, referrerpolicy. Documented in the README.
    for (var j = 0; j < o.attributes.length; j++) {
      var a = o.attributes[j];
      if (!/^(type|data-category|data-fb-run)$/.test(a.name)) s.setAttribute(a.name, a.value);
    }
    s.type = o.getAttribute('data-type') || 'text/javascript';
    s.setAttribute('data-fb-clone', '');
    // Wait only for types the browser actually loads: for anything else (data-type="text/x-template",
    // "application/ld+json", …) no load/error ever fires and the queue would stall.
    // "nomodule" scripts are skipped by every browser with module support: no event fires either.
    if (ext && !o.hasAttribute('async') && !o.hasAttribute('nomodule') && isJs(s.type)) {
      s.async = false;
      waiting++;
      var gen = runGen, done = function () {
        if (done.ran || gen !== runGen) return;   // once per script; ignored after reset()
        done.ran = true; clearTimeout(tm); waiting--; pump();
      };
      // Safety net: a script that never reports load/error must not block the queue for ever.
      var tm = setTimeout(function () {
        warn(o.getAttribute('src') + ' did not load within 15 s, running the next blocked scripts anyway');
        done();
      }, 15000);
      s.addEventListener('load', done);
      s.addEventListener('error', done);
    }
    if (!ext) s.text = o.text;
    o.parentNode.insertBefore(s, o.nextSibling);
    ran[cat] = true;
    emit('script', { category: cat, name: o.getAttribute('data-name') || o.src || 'inline script' });
  }

  // ---------- embeds: <iframe data-src="https://www.youtube.com/embed/..." data-category="marketing"> ----------
  // Until the visitor accepts that category the iframe has no src (nothing loads, no third-party
  // cookies) and a placeholder with an "Allow and show" button is shown in its place.
  function hostOf(u) { try { return new URL(u, location.href).hostname.replace(/^www\./, ''); } catch (e) { return ''; } }
  function size(v, unit) { return /^\d+(\.\d+)?$/.test(v || '') ? v + unit : /^\d+(\.\d+)?(px|%|rem|em|vh|vw)$/.test(v || '') ? v : ''; }
  function embeds(c) {
    // A placeholder whose iframe has left the page (an SPA removed or replaced it) goes too,
    // otherwise its "Allow and show" button would stay behind on its own.
    var old = d.querySelectorAll('[data-fb-ph]');
    for (var o = 0; o < old.length; o++) {
      var fr = old[o]._fbFrame;
      if (!fr || !fr.parentNode || fr.isConnected === false) old[o].parentNode.removeChild(old[o]);
    }
    var n = d.querySelectorAll('iframe[data-src][data-category]');
    for (var i = 0; i < n.length; i++) {
      // The placeholder is linked to its iframe (not found as the previous sibling), so it survives
      // the iframe being moved or another element being inserted between them.
      var f = n[i], cat = f.getAttribute('data-category'), ph = f._fbPh;
      var has = !!(ph && ph.parentNode && ph.isConnected !== false);
      if (c && c[cat]) {
        var src = cleanUrl(f.getAttribute('data-src'));          // no javascript:/data: iframes
        if (src && f.getAttribute('src') !== src) {
          f.setAttribute('src', src);
          emit('embed', { category: cat, src: src });
        } else if (!src && !f.hasAttribute('data-fb-bad')) {
          f.setAttribute('data-fb-bad', '');                       // warn once per iframe
          warn('iframe data-src "' + f.getAttribute('data-src') + '" is not an http(s) or relative address, not loaded');
        }
        if (f.hasAttribute('data-fb-disp')) { f.style.display = f.getAttribute('data-fb-disp'); f.removeAttribute('data-fb-disp'); }
        if (has) ph.parentNode.removeChild(ph);
        f._fbPh = null;
        continue;
      }
      if (f.hasAttribute('src')) f.removeAttribute('src');          // consent withdrawn: unload
      if (has) { if (ph.nextSibling !== f) f.parentNode.insertBefore(ph, f); continue; }   // keep it next to the iframe
      var t = tx(), name = t.c && t.c[cat] ? t.c[cat][0] : cat;
      if (/\s\{cat\}[\s.]/.test(t.embed)) name = name.toLowerCase(); // lower-case only inside a sentence (en, pt); quoted names keep their case
      var acc = accent();
      var p = d.createElement('div');
      p.setAttribute('data-fb-ph', ''); p.setAttribute('role', 'note');
      p.style.cssText = 'box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;' +
        'text-align:center;padding:20px;max-width:100%;background:#eef1f5;color:#1d2433;border:1px solid #d6dde6;border-radius:10px;' +
        'font:14px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;' +
        'width:' + (f.style.width || size(f.getAttribute('width'), 'px') || '100%') + ';' +
        'min-height:' + (f.style.height || (/%$/.test(f.getAttribute('height') || '') ? '' : size(f.getAttribute('height'), 'px')) || '220px') + ';';
      var m = d.createElement('p');
      m.style.cssText = 'margin:0;max-width:34em';
      m.textContent = t.embed.replace('{site}', hostOf(f.getAttribute('data-src')) || '?').replace('{cat}', name);
      var b = d.createElement('button');
      b.type = 'button'; b.textContent = t.embedBtn;
      b.style.cssText = 'cursor:pointer;border:0;border-radius:8px;padding:10px 18px;font:600 14px/1.2 system-ui,-apple-system,sans-serif;color:#fff;background:' + acc;
      b.addEventListener('click', (function (k) {
        return function () { var cc = assign({}, state || pick(function () { return false; })); cc[k] = true; draft = assign({}, cc); decide(cc, 'custom'); };
      })(cat));
      p.appendChild(m); p.appendChild(b);
      // Remember the iframe's own display only once: on a second pass it is already "none".
      if (!f.hasAttribute('data-fb-disp')) f.setAttribute('data-fb-disp', f.style.display || '');
      f.style.display = 'none';
      f.parentNode.insertBefore(p, f);
      f._fbPh = p; p._fbFrame = f;
    }
  }

  // ---------- cookies of refused categories are removed (consent withdrawn = data stops) ----------
  var PURGE = {
    analytics: [/^_ga/, /^_gid$/, /^_gat/, /^_clck$/, /^_clsk$/, /^_hj/],
    marketing: [/^_fbp$/, /^_fbc$/, /^_gcl_/, /^_uet/, /^_ttp$/]
  };
  function purge(c) {
    var names = [], parts = location.hostname.split('.'), doms = [''];
    try { d.cookie.split(/;\s*/).forEach(function (x) { if (x) names.push(x.split('=')[0]); }); } catch (e) { return; }
    for (var i = 0; i < parts.length - 1; i++) doms.push(';domain=.' + parts.slice(i).join('.'));
    for (var cat in PURGE) {
      if (c[cat]) continue;
      names.forEach(function (n) {
        if (!PURGE[cat].some(function (re) { return re.test(n); })) return;
        doms.forEach(function (dm) { try { d.cookie = n + '=;path=/;max-age=0' + dm; } catch (e) {} });
      });
    }
  }

  // ---------- decisions ----------
  function apply(c, source) { state = c; gcm('update', c); purge(c); unblock(c); embeds(c); emit('change', { choices: c, source: source }); }
  // Ask again only when the set of categories changes, not on every text/colour edit.
  function catKey() { return cats().sort().join(','); }
  function decide(c, action) {
    // Scripts that already ran cannot be unloaded: if the visitor withdraws a category whose
    // scripts ran on this page, the page is reloaded so they stop (reloadOnWithdraw: false to opt out).
    var gone = Object.keys(ran).filter(function (k) { return !c[k]; });
    stored = { v: cfg.version, k: catKey(), id: (stored && stored.id) || uid(), ts: Date.now(), c: c };
    writeStore(stored);
    apply(c, action);
    log(stored, action);   // sendBeacon survives the reload
    // The banner is replaced by the floating button: if the choice was made in the banner (focus
    // inside it), focus moves to the button instead of being lost. Choices made elsewhere (the
    // "Allow and show" button of an embed) keep the focus where it is.
    var hadFocus = !!(root && root.activeElement);
    showFab();
    if (hadFocus) focusIn('.fab');
    if (gone.length && cfg.reloadOnWithdraw !== false && !cfg.container) {
      emit('reload', { categories: gone });
      try { location.reload(); } catch (e) {}
    }
  }
  // Fingerprint of what the visitor was shown (language, layout, texts, category names), so a log
  // entry can be matched to the banner version that was on screen. FNV-1a, 32 bit: not a secret.
  function textHash(t) {
    var parts = [lang(), layout(), t.title, t.text, t.short, t.accept, t.reject, t.prefs, t.save, t.policy];
    each(function (k) { var c = t.c[k]; parts.push(k, c && c[0], c && c[1]); });
    var s = JSON.stringify(parts), h = 0x811c9dc5;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return ('0000000' + h.toString(16)).slice(-8);
  }
  function log(rec, action) {
    var t = tx();
    var p = { site: cfg.site, consent_id: rec.id, config_version: rec.v, choices: rec.c, action: action, ts: rec.ts,
      lang: lang(), text_hash: textHash(t), url: location.href.split(/[?#]/)[0] };
    emit('log', p);
    if (!cfg.endpoint) return;
    try {
      var b = JSON.stringify(p);
      if (!(navigator.sendBeacon && navigator.sendBeacon(cfg.endpoint, b))) {
        fetch(cfg.endpoint, { method: 'POST', body: b, keepalive: true, headers: { 'Content-Type': 'application/json' } }).catch(function () {});
      }
    } catch (e) {}
  }
  function act(a) {
    if (a === 'accept') decide(pick(function () { return true; }), 'accept_all');
    else if (a === 'reject') decide(pick(function () { return false; }), 'reject_all');
    else if (a === 'save') decide(pick(function (k) { return draft[k]; }), 'custom');
    else if (a === 'prefs') render('prefs');
    else if (a === 'fab') render('prefs');
  }

  // ---------- UI (Shadow DOM, no global styles) ----------
  function reqLang() { var l = String(cfg.lang || navigator.language || 'en').slice(0, 2).toLowerCase(); return LALIAS[l] || l; }
  // Language the banner is actually shown in: a built-in one, one with custom texts, else English.
  function lang() { var l = reqLang(); return T[l] || (cfg.texts && typeof cfg.texts === 'object' && cfg.texts[l] && typeof cfg.texts[l] === 'object') ? l : 'en'; }
  function tx() {
    var l = reqLang();
    var base = T[l] || T.en, bl = T[l] ? l : 'en';
    // Custom texts may be missing or malformed (texts: null, texts.en: "x", c: null, title: 5):
    // anything that is not an object / a string falls back to the built-in text.
    var own = cfg.texts && typeof cfg.texts === 'object' ? cfg.texts[l] : null;
    var t = assign({}, base, { text: defText(bl) }, own && typeof own === 'object' ? own : {});
    for (var k in base) if (k !== 'c' && typeof t[k] !== 'string') t[k] = base[k];
    if (typeof t.text !== 'string') t.text = defText(bl);
    // Category texts are merged per category: a custom text for one category must not hide the
    // switches of the others; an entry is used only if it is [name, description].
    var oc = own && typeof own === 'object' ? own.c : null;
    t.c = assign({}, base.c);
    if (oc && typeof oc === 'object') for (var ck in oc) if (Array.isArray(oc[ck])) t.c[ck] = oc[ck];
    return t;
  }
  function css() {
    return ':host{all:initial}' +
      '.w{--a:' + accent() + ';--r:' + (+cfg.radius) + 'px;--b:' + (+cfg.blur) + 'px;font:14px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--fg);-webkit-font-smoothing:antialiased}' +
      '.light{--fg:#141a24;--mut:#465062;--bg:rgba(255,255,255,.56);--ln:rgba(255,255,255,.72);--sw:rgba(20,26,36,.14);--sh:0 20px 50px -12px rgba(16,28,56,.35)}' +
      '.dark{--fg:#eef2f8;--mut:#b3bccb;--bg:rgba(18,22,30,.5);--ln:rgba(255,255,255,.16);--sw:rgba(255,255,255,.18);--sh:0 20px 50px -12px rgba(0,0,0,.6)}' +
      '.tint{--fg:#10261f;--mut:#3b574e;--bg:color-mix(in srgb,var(--a) 16%,rgba(255,255,255,.62));--ln:rgba(255,255,255,.8);--sw:rgba(16,38,31,.14);--sh:0 20px 50px -14px color-mix(in srgb,var(--a) 45%,transparent)}' +
      '.light.solid{--bg:#fff;--ln:#dfe3ea}.dark.solid{--bg:#161b24;--ln:#2a3240}.tint.solid{--bg:color-mix(in srgb,var(--a) 10%,#fff)}' +
      '.solid .card,.solid .fab{-webkit-backdrop-filter:none;backdrop-filter:none;box-shadow:0 12px 32px -12px rgba(16,24,40,.28)}' +
      '.glow .card{box-shadow:var(--sh),0 0 0 1px color-mix(in srgb,var(--a) 60%,transparent),0 0 42px -6px color-mix(in srgb,var(--a) 55%,transparent)}' +
      '.hd{display:flex;gap:12px;align-items:center;margin-bottom:6px}.hd h2{margin:0}' +
      '.ico{flex:none;width:36px;height:36px;border-radius:50%;display:grid;place-items:center;color:var(--a);background:color-mix(in srgb,var(--a) 16%,transparent);border:1px solid color-mix(in srgb,var(--a) 30%,transparent)}' +
      '.pill{position:fixed;z-index:2147483000;left:50%;bottom:16px;transform:translateX(-50%);width:min(760px,calc(100% - 32px))}' +
      '.in-c .pill{position:absolute}.pill .m{display:flex;align-items:center;gap:10px 14px;border-radius:999px;padding:8px 8px 8px 20px}' +
      '.pill .m p{flex:1 1 auto;color:var(--fg)}.pill .m .btns{margin:0;flex-wrap:nowrap}.pill .m button{padding:8px 14px;border-radius:999px}.pill .m .pri{flex:0 0 auto}' +
      '.corner,.bar,.center{position:fixed;z-index:2147483000}.in-c .corner,.in-c .bar,.in-c .center,.in-c .fab{position:absolute}' +
      '.corner{left:16px;bottom:16px;width:min(400px,calc(100% - 32px))}.bar{left:16px;right:16px;bottom:16px}' +
      '.center{inset:0;display:grid;place-items:center;padding:16px;background:rgba(8,12,20,.28)}.center .card{width:min(460px,100%)}' +
      '.card,.fab{background:var(--bg);-webkit-backdrop-filter:blur(var(--b)) saturate(170%);backdrop-filter:blur(var(--b)) saturate(170%);border:1px solid var(--ln);box-shadow:var(--sh),inset 0 1px 0 var(--ln)}' +
      '.card{border-radius:var(--r);padding:20px;box-sizing:border-box}' +
      '@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){.light .card,.light .fab{background:#fff}.dark .card,.dark .fab{background:#161b24}}' +
      '.bar .card.m{display:flex;gap:16px 24px;align-items:center;flex-wrap:wrap}.bar .txt{flex:1 1 380px}.bar .m .btns{margin-top:0}' +
      'h2{margin:0 0 6px;font-size:16px;font-weight:650;letter-spacing:-.01em;line-height:1.3}p{margin:0;color:var(--mut)}' +
      'a{color:inherit;text-decoration:underline;text-underline-offset:2px}' +
      '.btns{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}' +
      'button{font:inherit;font-weight:600;cursor:pointer;border-radius:calc(var(--r)*.6);padding:10px 16px;border:1px solid transparent;transition:transform .12s,filter .12s}' +
      'button:active{transform:scale(.97)}button:focus-visible,.sw:focus-visible{outline:2px solid var(--a);outline-offset:2px}' +
      '.pri{flex:1 1 0;background:var(--a);color:#fff;white-space:nowrap}.pri:hover{filter:brightness(1.08)}' +
      '.lnk{background:none;color:var(--fg);padding:10px 6px;text-decoration:underline;text-underline-offset:3px;font-weight:500}' +
      '.cats{margin-top:12px}.cat{display:flex;gap:14px;align-items:flex-start;padding:11px 0;border-top:1px solid var(--sw);cursor:pointer}.cat:first-child{border-top:0}' +
      '.cat span{flex:1}.cat b{display:block;font-weight:600}.cat small{display:block;color:var(--mut);font-size:13px;line-height:1.4}' +
      '.sw{-webkit-appearance:none;appearance:none;flex:none;width:38px;height:22px;margin:2px 0 0;border-radius:11px;background:var(--sw);position:relative;cursor:pointer;transition:background .15s}' +
      '.sw::after{content:"";position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.35);transition:transform .15s}' +
      '.sw:checked{background:var(--a)}.sw:checked::after{transform:translateX(16px)}.sw:disabled{opacity:.55;cursor:default}' +
      '.brand{margin-top:12px;font-size:11px;color:var(--mut);text-align:right}.brand a{color:inherit;text-decoration:none}.brand a:hover,.brand a:focus-visible{text-decoration:underline}' +
      '.btns .brand{flex:0 0 100%;margin-top:8px}' +
      '.chat{position:fixed;z-index:2147483000;right:16px;bottom:16px;width:min(330px,calc(100% - 32px));display:flex;flex-direction:column;align-items:flex-end;gap:14px}' +
      '.chat .card{position:relative;width:100%;border-radius:var(--r) var(--r) 4px var(--r)}' +
      '.chat .card.m{padding:16px 16px 14px;font-size:13.5px}.chat .m p b{display:block;color:var(--fg);font-size:14.5px;margin-bottom:3px}' +
      '.chat .card.m::after{content:"";position:absolute;right:16px;bottom:-11px;width:16px;height:11px;background:var(--bg);-webkit-backdrop-filter:blur(var(--b));backdrop-filter:blur(var(--b));clip-path:polygon(0 0,100% 0,100% 100%)}' +
      '.chat .m .btns{margin-top:12px;gap:6px}.chat .m button{border-radius:999px;padding:7px 14px;font-size:13px}.chat .m .pri{flex:0 0 auto}.chat .m .lnk{padding:7px 4px}' +
      '.chat .m .brand{margin-top:8px}' +
      '.dots{display:none;gap:5px;padding:4px 2px}.dots i{width:7px;height:7px;border-radius:50%;background:var(--mut);opacity:.5;animation:fbdot 1s infinite}' +
      '.dots i:nth-child(2){animation-delay:.15s}.dots i:nth-child(3){animation-delay:.3s}@keyframes fbdot{50%{opacity:1;transform:translateY(-3px)}}' +
      '.chat .typing{width:auto}.chat .typing>*{display:none}.chat .typing>.dots{display:flex}' +
      '.ava{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;padding:0;background:var(--a);color:#fff;border:0;box-shadow:var(--sh)}' +
      '.ava svg{width:26px;height:26px}' +
      '.split{position:fixed;z-index:2147483000;left:50%;bottom:16px;transform:translateX(-50%);width:min(640px,calc(100% - 32px))}' +
      '.split .card.m{display:flex;padding:0;overflow:hidden}.split .art{flex:0 0 150px;display:grid;place-items:center;color:var(--a);background:color-mix(in srgb,var(--a) 18%,transparent)}' +
      '.split .art svg{width:84px;height:84px}.split .body{flex:1;padding:20px 22px}' +
      '.in-c .chat,.in-c .split{position:absolute}' +
      '.fab{position:fixed;z-index:2147483000;left:16px;bottom:16px;width:44px;height:44px;border-radius:50%;padding:0;display:grid;place-items:center;color:var(--fg)}' +
      '.in{animation:fbin .38s cubic-bezier(.2,.8,.2,1)}@keyframes fbin{from{opacity:0;transform:translateY(14px)}}' +
      '@media (prefers-reduced-motion:reduce){.in{animation:none}button,.sw,.sw::after{transition:none}}' +
      '@media (max-width:480px){.corner,.bar{left:8px;right:8px;bottom:8px;width:auto}.pri{flex-basis:100%}' +
      '.chat{right:8px;bottom:8px;width:calc(100% - 16px)}.split{bottom:8px;width:calc(100% - 16px)}.split .card.m{flex-direction:column}.split .art{flex-basis:96px}.split .art svg{width:60px;height:60px}' +
      '.pill .m{flex-wrap:wrap;border-radius:var(--r);padding:14px}.pill .m .btns{flex-wrap:wrap;width:100%}.pill .m .pri{flex:1 1 0}}' +
      /* v0.3.3: phones — keep preferences reachable (scroll inside the card) and respect iPhone safe areas */
      '.card.p{max-height:calc(100vh - 32px);max-height:calc(100dvh - 32px);overflow-y:auto;overscroll-behavior:contain}' +
      '@media (max-height:640px){.card.p .btns{position:sticky;bottom:-20px;z-index:1;margin:12px -20px -20px;padding:12px 20px 20px;border-radius:0 0 var(--r) var(--r);background:rgba(255,255,255,.95)}' +
      '.dark .card.p .btns{background:rgba(22,27,36,.96)}.tint .card.p .btns{background:color-mix(in srgb,var(--a) 12%,#fff)}.solid .card.p .btns{background:var(--bg)}}' +
      '.corner,.bar,.pill,.split,.fab{bottom:calc(16px + env(safe-area-inset-bottom,0px))}' +
      '.corner,.bar,.fab{left:calc(16px + env(safe-area-inset-left,0px))}.bar{right:calc(16px + env(safe-area-inset-right,0px))}' +
      '.chat{right:calc(16px + env(safe-area-inset-right,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px))}' +
      '.center{padding:calc(16px + env(safe-area-inset-top,0px)) 16px calc(16px + env(safe-area-inset-bottom,0px))}' +
      '@media (max-width:480px){.corner,.bar{left:calc(8px + env(safe-area-inset-left,0px));right:calc(8px + env(safe-area-inset-right,0px));bottom:calc(8px + env(safe-area-inset-bottom,0px))}' +
      '.chat{right:8px}.chat,.split{bottom:calc(8px + env(safe-area-inset-bottom,0px))}.card.p{max-height:calc(100vh - 16px);max-height:calc(100dvh - 16px)}}';
  }
  function mount() {
    if (host) return;
    host = d.createElement('div');
    host.id = 'frostbanner';
    root = host.attachShadow({ mode: 'open' });
    // An invalid selector would throw and a missing element would leave the banner positioned
    // for a container that is not there: both fall back to the page with a warning.
    var box = null;
    if (cfg.container) {
      try { box = d.querySelector(cfg.container); } catch (e) {}
      if (!box) { warn('container "' + cfg.container + '" not found, the banner is shown on the page'); cfg.container = null; }
    }
    (box || d.body).appendChild(host);
    root.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-a]');
      if (b) act(b.getAttribute('data-a'));
    });
    root.addEventListener('change', function (e) {
      var k = e.target.getAttribute && e.target.getAttribute('data-c');
      if (k) draft[k] = e.target.checked;
    });
    root.addEventListener('keydown', function (e) {
      if (mode !== 'banner') return;
      // Escape leaves the preferences: back to the banner, or to the floating button if a choice
      // was already made. On the main banner it does nothing on purpose: a choice is required.
      if (e.key === 'Escape' && view === 'prefs') {
        if (stored) { showFab(); focusIn('.fab'); } else { render('main'); focusIn('.card button'); }
        return;
      }
      // Modal window (centre layout, aria-modal="true"): Tab stays inside the card.
      if (e.key === 'Tab' && isModal()) {
        var f = Array.prototype.slice.call(root.querySelectorAll('.card button, .card a[href], .card input:not([disabled])'));
        if (!f.length) return;
        var i = f.indexOf(root.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && (i === -1 || i === f.length - 1)) { e.preventDefault(); f[0].focus(); }
      }
    });
  }
  var COOKIE = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M21 12.5A9 9 0 1 1 11.5 3a3 3 0 0 0 3.5 3.5 3 3 0 0 0 3 3 3 3 0 0 0 3 3z"/>' +
    '<circle cx="8.5" cy="10" r="1" fill="currentColor"/><circle cx="12" cy="15.5" r="1" fill="currentColor"/><circle cx="16" cy="12.5" r=".8" fill="currentColor"/></svg>';
  var ART = '<svg viewBox="0 0 64 64" aria-hidden="true"><path fill="currentColor" d="M58 34A26 26 0 1 1 30 6a7 7 0 0 0 8 8 7 7 0 0 0 7 7 7 7 0 0 0 7 7 7 7 0 0 0 6 6z"/>' +
    '<g fill="#fff" fill-opacity=".85"><circle cx="21" cy="26" r="3.2"/><circle cx="30" cy="42" r="3.6"/><circle cx="42" cy="37" r="2.6"/><circle cx="19" cy="40" r="2.2"/><circle cx="32" cy="22" r="1.8"/></g></svg>';
  function wrap(inner, layout) {
    var th = /^(dark|tint)$/.test(cfg.theme) ? cfg.theme : 'light';
    return '<style>' + css() + '</style><div class="w ' + th + (cfg.glass === false ? ' solid' : '') + (cfg.glow ? ' glow' : '') +
      (cfg.container ? ' in-c' : '') + '">' + (layout ? '<div class="' + layout + '">' + inner + '</div>' : inner) + '</div>';
  }
  function render(v) {
    if (v === null) return showFab();
    mount(); mode = 'banner'; view = v;
    var t = tx(), lay = layout();
    var h = '<div class="card in ' + (v === 'main' ? 'm' : 'p') + '" role="dialog" aria-modal="' + (lay === 'center') + '" aria-labelledby="fbt" aria-describedby="fbd">';
    var pol = ' <a href="' + esc(safeUrl(cfg.policyUrl)) + '" target="_blank" rel="noopener">' + esc(t.policy) + '</a>';
    var typing = false;
    // On sites that use the WordPress.org plugin the credit stays plain text:
    // the plugin directory does not allow credit links without the owner's opt-in.
    var viaWp = !!document.getElementById('frostbanner-js');
    var brand = !cfg.branding ? '' : viaWp ? '<div class="brand">Powered by FrostBanner</div>' :
      '<div class="brand"><a href="https://frostbanner.com/?utm_source=banner&amp;utm_medium=powered_by&amp;utm_campaign=free" target="_blank" rel="nofollow noopener">Powered by FrostBanner</a></div>', after = '';
    if (v === 'main' && lay === 'chat') {
      var typing = !cfg.container && !typed && !(w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches);
      if (typing) h = h.replace('class="card in m"', 'class="card in m typing"');
      h += '<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><p id="fbd"><b id="fbt">' + esc(t.title) + '</b>' + esc(t.text) + pol + '</p>' +
        '<div class="btns"><button class="pri" data-a="reject">' + esc(t.reject) + '</button>' +
        '<button class="pri" data-a="accept">' + esc(t.accept) + '</button>' +
        '<button class="lnk" data-a="prefs">' + esc(t.prefs) + '</button>' + brand + '</div>';
      after = '<button class="ava in" data-a="prefs" aria-label="' + esc(t.manage) + '">' + COOKIE + '</button>';
    } else if (v === 'main' && lay === 'split') {
      h += '<div class="art">' + ART + '</div><div class="body"><h2 id="fbt">' + esc(t.title) + '</h2><p id="fbd">' + esc(t.text) + pol + '</p>' +
        '<div class="btns"><button class="pri" data-a="reject">' + esc(t.reject) + '</button>' +
        '<button class="pri" data-a="accept">' + esc(t.accept) + '</button>' +
        '<button class="lnk" data-a="prefs">' + esc(t.prefs) + '</button>' + brand + '</div></div>';
    } else if (v === 'main' && lay === 'pill') {
      h += '<p id="fbd"><span id="fbt">' + esc(t.short) + '</span>' + pol + '</p>' +
        '<div class="btns"><button class="lnk" data-a="prefs">' + esc(t.prefs) + '</button>' +
        '<button class="pri" data-a="reject">' + esc(t.reject) + '</button>' +
        '<button class="pri" data-a="accept">' + esc(t.accept) + '</button></div>';
    } else if (v === 'main') {
      h += '<div class="txt">' + (cfg.icon ? '<div class="hd"><span class="ico">' + COOKIE + '</span>' : '') +
        '<h2 id="fbt">' + esc(t.title) + '</h2>' + (cfg.icon ? '</div>' : '') + '<p id="fbd">' + esc(t.text) + pol + '</p></div>' +
        '<div class="btns"><button class="pri" data-a="reject">' + esc(t.reject) + '</button>' +
        '<button class="pri" data-a="accept">' + esc(t.accept) + '</button>' +
        '<button class="lnk" data-a="prefs">' + esc(t.prefs) + '</button>' + brand + '</div>';
    } else {
      h += '<h2 id="fbt">' + esc(t.manage) + '</h2><p id="fbd">' + esc(t.text) + '</p><div class="cats">';
      each(function (k) {
        var c = t.c[k]; if (!c || typeof c !== 'object') return;
        var nec = k === 'necessary';
        h += '<label class="cat"><span><b>' + esc(c[0]) + '</b><small>' + esc(c[1]) + '</small></span>' +
          '<input type="checkbox" role="switch" class="sw" data-c="' + k + '"' +
          (nec || draft[k] ? ' checked' : '') + (nec ? ' disabled title="' + esc(t.always) + '"' : '') + '></label>';
      });
      h += '</div><div class="btns"><button class="pri" data-a="reject">' + esc(t.reject) + '</button>' +
        '<button class="pri" data-a="save">' + esc(t.save) + '</button>' +
        '<button class="pri" data-a="accept">' + esc(t.accept) + '</button>' + brand + '</div>';
    }
    root.innerHTML = wrap(h + '</div>' + after, lay);
    if (typing) setTimeout(function () { typed = true; var c = root && root.querySelector('.typing'); if (c) c.classList.remove('typing'); }, 900);
    if (v === 'prefs' || lay === 'center') { var f = root.querySelector('.card button, .card input:not([disabled])'); if (f) f.focus({ preventScroll: true }); }
  }
  function showFab() {
    mount(); mode = 'fab';
    root.innerHTML = wrap('<button class="fab in" data-a="fab" aria-label="' + esc(tx().manage) + '" title="' + esc(tx().manage) + '">' +
      COOKIE + '</button>');
  }
  function layout() { return /^(corner|bar|center|pill|chat|split)$/.test(cfg.layout) ? cfg.layout : 'corner'; }
  function isModal() { return layout() === 'center'; }
  function focusIn(sel) { var el = root && root.querySelector(sel); if (el) { try { el.focus({ preventScroll: true }); } catch (e) {} } }
  function rerender() { if (mode === 'banner') render(view); else if (mode === 'fab') showFab(); }

  // ---------- boot ----------
  function inRegion() {
    var g = cfg.geo || {};
    return g.mode !== 'eu' || !g.country || EU.indexOf(String(g.country).toUpperCase()) > -1;
  }
  function valid(s) {
    if (!s || !s.c) return false;
    // The cookie expires after maxAgeDays, but the localStorage copy never does:
    // check the age of the record itself (ts is Date.now(), in milliseconds).
    // A ts more than a day in the future (visitor's clock was set ahead) would never expire: rejected too.
    var age = typeof s.ts === 'number' ? Date.now() - s.ts : NaN;
    if (!(age >= -864e5 && age <= maxAge() * 864e5)) return false;
    return s.k ? s.k === catKey() : s.v === cfg.version;   // records before v0.3 have no k
  }
  // ---------- content added later (SPA routes, lazy-loaded blocks): same rules as on load ----------
  // New <script type="text/plain" data-category> run if their category is accepted; new
  // <iframe data-src data-category> load or get a placeholder. Our own nodes are skipped:
  // script clones (data-fb-clone), placeholders (data-fb-ph) and the banner host (#frostbanner,
  // whose content is in a shadow root that the observer does not see).
  var SEL = 'script[type="text/plain"][data-category],iframe[data-src][data-category]', watcher = null, queued = false;
  function ours(n) { return n === host || n.hasAttribute('data-fb-clone') || n.hasAttribute('data-fb-ph'); }
  function relevant(n) {
    if (n.nodeType !== 1 || ours(n)) return false;
    return (n.matches && n.matches(SEL)) || !!(n.querySelector && n.querySelector(SEL));
  }
  function watch() {
    if (watcher || typeof MutationObserver !== 'function') return;
    watcher = new MutationObserver(function (list) {
      if (queued) return;
      for (var i = 0; i < list.length; i++) {
        // Added nodes: new content. Removed nodes: an iframe that left takes its placeholder along.
        var nodes = Array.prototype.slice.call(list[i].addedNodes).concat(Array.prototype.slice.call(list[i].removedNodes));
        for (var j = 0; j < nodes.length; j++) {
          if (!relevant(nodes[j])) continue;
          // One pass per batch of mutations, after the page has finished inserting its nodes.
          queued = true;
          Promise.resolve().then(function () {
            queued = false;
            if (state) unblock(state);   // before a decision, scripts stay blocked
            embeds(state || {});          // before a decision, iframes get a placeholder
          });
          return;
        }
      }
    });
    watcher.observe(d.documentElement, { childList: true, subtree: true });
  }

  function start() {
    watch();
    stored = readStore();
    if (valid(stored)) {
      draft = assign({}, stored.c); apply(stored.c, 'restore'); showFab(); return;
    }
    stored = null; draft = { necessary: true };
    embeds({});
    if (!inRegion()) {
      apply(pick(function () { return true; }), 'outside_region');
      emit('skip', { country: cfg.geo.country });
      return;
    }
    render('main');
    emit('shown', { layout: cfg.layout });
  }

  gcm('default'); // must run before any Google tag loads

  // ---------- remote config: /v1/config/:site, cached in localStorage ----------
  // Fresh cache (< 10 min): used as is. Stale cache: used now, refreshed in the background.
  // No cache: wait for the server (max 2.5 s), then fall back to the inline config.
  var CK = 'fb_cfg_' + cfg.site, FRESH = 6e5;
  function cfgUrl() { try { return new URL('/v1/config/' + encodeURIComponent(cfg.site), cfg.endpoint).href; } catch (e) { return null; } }
  function readCache() { try { var o = JSON.parse(w.localStorage.getItem(CK)); return o && o.t ? o : null; } catch (e) { return null; } }
  function fetchRemote(done) {
    var url = cfgUrl(), fin = false;
    function end(r) { if (!fin) { fin = true; done(r); } }
    if (!url || typeof fetch !== 'function') return end(null);
    var tm = setTimeout(function () { end(undefined); }, 2500);
    fetch(url, { credentials: 'omit', cache: 'no-store' }).then(function (res) {
      return res.status === 404 ? { plan: 'free', published: false } : res.ok ? res.json() : null;   // unknown site = Free
    }).then(function (j) {
      clearTimeout(tm);
      if (j) { try { w.localStorage.setItem(CK, JSON.stringify({ t: Date.now(), c: j })); } catch (e) {} }
      end(j || undefined);
    }).catch(function () { clearTimeout(tm); end(undefined); });
  }
  function boot() {
    var remote = user.remote !== false && cfg.site !== 'demo' && cfg.endpoint && !cfg.container;
    if (!remote) return ready();
    var c = readCache();
    if (c && c.c) {
      useRemote(c.c);
      if (Date.now() - c.t > FRESH) fetchRemote(function () {});
      return ready();
    }
    fetchRemote(function (r) { if (r) useRemote(r); ready(); });
  }
  function ready() {
    if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', start); else start();
  }
  boot();

  // ---------- public API ----------
  w.FrostBanner = {
    version: '0.4.2',
    open: function () { render('prefs'); },
    getConsent: function () { return state ? assign({}, state) : null; },
    on: function (e, f) { (L[e] = L[e] || []).push(f); },
    templates: Object.keys(TPL),
    show: function () { render('main'); },
    configure: function (o) { o = o || {}; if (TPL[o.template]) assign(cfg, TPL[o.template]); assign(cfg, o); rerender(); },
    // New visitor simulation. On a real site, call this and reload the page:
    // scripts that already ran cannot be unloaded.
    reset: function () {
      clearStore(); stored = null; state = null;
      runQ = []; waiting = 0; runGen++; ran = {};
      d.querySelectorAll('script[data-fb-clone]').forEach(function (s) { s.remove(); });
      d.querySelectorAll('script[data-fb-run]').forEach(function (s) { s.removeAttribute('data-fb-run'); });
      gcm('update', {});
      if (host) { host.remove(); host = root = null; mode = null; }
      start();
    }
  };
})(window, document);
