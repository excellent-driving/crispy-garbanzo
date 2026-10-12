// Real course content, sourced from materiaalrijonderricht/VRAGEN CAT A EN B.pdf,
// VRAGEN CAT C.pdf and VRAGEN CAT D.pdf: the school's question lists for the
// theory exam. All three start with the same general questions (1–107, with
// 82a and 82b; number 47 is a table of maximum speeds); C adds questions for
// trucks, D for buses. Text as in the PDFs; only spacing and four words split
// across lines are tidied. Students study them as pages of questions whose
// answers open when tapped (owner's choice, 2026-10-12): nothing is scored.
// Answer 25 (alcohol) reads oddly and is for the instructor to confirm.

type Vraag = { nr: string; vraag: string; antwoord: string | string[]; lijst?: "a" | "A" };

const ALGEMEEN: Vraag[] = [
  { nr: "1", vraag: "Is men strafbaar bij een aanrijding als men door rijdt?", antwoord: "Ja, behalve als men binnen 4 uren dit vrijwillig aan de politie doorgeeft." },
  { nr: "2", vraag: "Voor wie is een inschrijvingsbewijs nodig?", antwoord: "Voor motorrijtuigen waarmee men tegen betaling personen of lading vervoert." },
  { nr: "3", vraag: "Mogen twee motorrijtuigen naast elkaar rijden?", antwoord: "Ja, bij het inhalen of ingehaald worden." },
  { nr: "4", vraag: "Wanneer moet men naar links uitwijken?", antwoord: "Bij het ingehaald worden en bij het tegenkomen van andere bestuurders." },
  { nr: "5", vraag: "Hoe moet men van richting te veranderen?", antwoord: "Zich vergewissen dat men dit kan doen zonder andere weggebruikers in gevaar te brengen of tijdig en op duidelijke wijze dit voornemen kenbaar te maken door richting aan te geven." },
  { nr: "6", vraag: "Mag men een bromfiets besturen als zijn rijbewijs is ingevorderd?", antwoord: "Ja, omdat er geen rijbewijs is vereist voor het besturen van een bromfiets." },
  { nr: "7", vraag: "Mag men een bromfiets besturen als zijn rijbevoegdheid is ontzegt?", antwoord: "Neen, hij mag dan geen enkele motorrijtuig besturen." },
  { nr: "8", vraag: "Mag een brandweer, politiewagen of ambulance met loeiende sirene boven de Maximumsnelheid rijden?", antwoord: "Ja, dat is toegestaan." },
  { nr: "9", vraag: "Mag een bestuurder wegrijden bij een verkeersongeval?", antwoord: "Ja, indien de identiteit van de bestuurder en van het voertuig op een behoorlijke wijze is achtergelaten of afgegeven bij de politie." },
  { nr: "10", vraag: "Hoe geschiedt het achteruit rijden?", antwoord: "Stapvoets." },
  { nr: "11", vraag: "Wanneer moet men gebruikmaken van geluidsignaal?", antwoord: "Bij het inhalen of wanneer en gevaar dreigt te ontstaan." },
  { nr: "12", vraag: "Hoe dient een voetganger de weg over te steken?", antwoord: "Haaks op de weg, zonder onnodige onderbreking in de verkeersrijrichting." },
  { nr: "13", vraag: "Door wie wordt het rijbewijs afgegeven?", antwoord: "Door of vanwege de Procureur-generaal." },
  { nr: "14", vraag: "Door wie wordt het nummerbewijs / nummerplaten afgegeven?", antwoord: "Door of vanwege de Procureur-generaal." },
  { nr: "15", vraag: "Door wie wordt het inschrijvingsbewijs afgegeven?", antwoord: "Door de District-Commissaris (D.C.)." },
  { nr: "16", vraag: "Binnen hoeveel dagen en bij welke instantie moet men het nummerbewijs inleveren?", antwoord: "Binnen 30 dagen bij de Procureur-Generaal (P.G.)." },
  { nr: "17", vraag: "Van hoeveel achterlichten moet een auto voorzien zijn?", antwoord: "Van ten minste een (1) aan de rechter achterzijde van het voertuig." },
  { nr: "18", vraag: "Op hoeveel meters afstand moet men de nummerplaten kunnen waarnemen?", antwoord: "Op een afstand van 50 meters." },
  { nr: "19", vraag: "Op hoeveel meters afstand moeten de achterlichten waarneembaar zijn?", antwoord: "Op een afstand van 200 meters" },
  { nr: "20", vraag: "Mag een bestuurder onder toezicht een auto besturen als zijn rijbewijs is ingevorderd?", antwoord: "Neen, dat is verboden." },
  { nr: "21", vraag: "Wanneer is het verboden links en rechts in te halen?", antwoord: "Bij het naderen van een zebrapad of voetgangersoversteekplaats." },
  { nr: "22", vraag: "Wanneer bent u verplicht naar rechts uit te wijken?", antwoord: "Bij het inhalen, indien het van voren en van achteren naderend verkeer geen hinder ondervindt of in gevaar wordt gebracht." },
  { nr: "23", vraag: "Op hoeveel meters afstand moeten parkeerlichten waarneembaar zijn?", antwoord: "Op een afstand van 150 meter." },
  { nr: "24", vraag: "Van hoeveel ruitenwissers moet een auto voorzoen zijn?", antwoord: "Ten minste een (1) goedwerkende en doelmatige werkende aan de zijde van de bestuurder." },
  { nr: "25", vraag: "Mag een leerling onder invloed van alcohol of andere bedwelmende middelen een auto besturen?", antwoord: "Ja, als hij het naar behoren kan doen." },
  { nr: "26", vraag: "Voor wie is een inhaalverbod van kracht?", antwoord: "Motorrijtuigen op meer dan twee wielen." },
  { nr: "27", vraag: "Wie mogen door roodlicht rijden?", antwoord: "Politie; Brandweer en Ambulance met loeiende sirene of bel." },
  { nr: "28", vraag: "Wat is verboden bij een aanrijding als men ongelukken heeft veroorzaakt?", antwoord: "Het slachtoffer in hulpeloze toestand achter te laten en wegrijden" },
  { nr: "29", vraag: "Wat zijn de kleuren van de richtingaanwijzer?", antwoord: "Wit of oranje tot oranjerood." },
  { nr: "30", vraag: "Op een T-kruising is de doorgaande weg onverhard en de zijweg (eindigende) verhard. Een fietser staat op de onverharde weg en een personenauto op de verharde weg die linksaf wil slaan. Wie heeft voorrang?", antwoord: "De fietser, omdat hij zich op een doorgaande weg bevindt." },
  { nr: "31", vraag: "Wat mag men niet doen op een autoweg?", antwoord: "Keren, achteruitrijden, stoppen en gebruikmaken van de middenberm." },
  { nr: "32", vraag: "Van hoeveel reminrichtingen moet een auto zijn voorzien?", antwoord: "Van twee deugdelijke reminrichtingen (voet- en handrem)" },
  { nr: "33", vraag: "Wat is bepaald t.a.v. de geldigheid van het Surinaamse rijbewijs?", antwoord: "Het rijbewijs is tien (10) achtereenvolgende jaren geldig, gerekend vanaf de dag van afgifte." },
  { nr: "34", vraag: "Binnen welke afstand is de voetganger verplicht gebruik te maken van de voetgangersoversteekplaats?", antwoord: "Binnen de afstand van 30m van de oversteekplaats." },
  { nr: "35", vraag: "Mag een motorrijtuig met ten minste vierwielen een ander rij-of voertuig voortslepen op de openbare weg?", antwoord: "Nee, hiervoor is er een vergunning van de D.C. vereist." },
  { nr: "36", vraag: "Hoeveel personen en van welke leeftijd mag de bestuurder van een motorfiets vervoeren?", antwoord: "Maximaal een (1) persoon van 10 jaar of ouder." },
  { nr: "37", vraag: "Een Politie- of Militaire colonne, een begrafenisstoet of een geoorloofde optocht begint bij groen te lopen. Op een gegeven ogenblik vertoont zich een ander kleur licht. Wat moet men doen?", antwoord: "Blijven voortgaan, ook nadat een ander kleur zichtbaar is geworden." },
  { nr: "38", vraag: "Bij gevaarlijke punten zijn ter waarschuwing van het verkeer geel knipperlichten aangebracht. Wat betekent dat?", antwoord: "Dat betekent voorzichtigheid geboden." },
  { nr: "39", vraag: "Wat betekent groenlicht voor voetganders?", antwoord: "Oversteken voor zover er geen ander verkeer is." },
  { nr: "40", vraag: "Wat betekent roodlicht voor voetgangers?", antwoord: "Voetgangers mogen niet oversteken." },
  { nr: "41", vraag: "Waar bevindt zich het vak waarin het rode licht voor voetgangers verschijnt?", antwoord: "Boven het vak van groen licht voor voetgangers." },
  { nr: "42", vraag: "Wat is de minimum leeftijd om een auto te besturen onder toezicht?", antwoord: "De leeftijd van 18 jaar." },
  { nr: "43", vraag: "Wat mag men besturen indien men in het bezit is van een B-E rijbewijs?", antwoord: "Motorrijtuigen op meer dan twee wielen, ingericht voor het vervoer van ten hoogste 8 personen, de bestuurder daaronder niet inbegrepen en andere motorrijtuigen niet ingericht voor het vervoer van personen, waarvan het ledig gewicht vermeerderd met laadvermogen niet meer dan 3500kg bedraagt." },
  { nr: "44", vraag: "Wie kunnen een autoweg volgen?", antwoord: "Bestuurders van motorrijtuigen die met een snelheid van meer dan 40 km per uur kunnen en mogen rijden." },
  { nr: "45", vraag: "Een inschrijvingsbewijs is nodig indien:", antwoord: "Het gaat om een rij-of voertuig dat niet gebruik word voor gemak of weelde." },
  { nr: "46", vraag: "Wanneer kan men anders dan links rijden?", antwoord: "Indien de omstandigheden zulks rechtvaardigen." },
  { nr: "48", vraag: "Is het verboden op een autoweg te stoppen?", antwoord: "Ja, dat is verboden." },
  { nr: "49", vraag: "Heeft een ambulance met loeiende sirene een maximum snelheid?", antwoord: "Neen." },
  { nr: "50", vraag: "Mag een bestuurder een motorfiets besturen als zijn rijbewijs is ingetrokken?", antwoord: "Neen, het is verboden." },
  { nr: "51", vraag: "Uit hoeveel stoplichten moet een auto voorzien zijn?", antwoord: "Ten minste een (1) geplaatst in het midden van het voertuig." },
  { nr: "52", vraag: "Hoeveel geluidsignalen moet een auto voorzien zijn?", antwoord: "Ten minste een (1) van eenzelfde toonhoogte." },
  { nr: "53", vraag: "Van welke kleuren moeten de achterlichten voorzien zijn?", antwoord: "Helder rood." },
  { nr: "54", vraag: "Wanneer is het verboden te laden of te lossen?", antwoord: "Indien zulks elders kan geschieden zonder ernstige bezwaren. (waar het middels borden is aangegeven)" },
  { nr: "55", vraag: "Als twee tegenliggers elkaar op een smalle weg naderen, hoe is hun gedrag ten opzichte van elkaar?", antwoord: "Voor degene voor wie zulks gezien de omstandigheden het minst bezwaar oplevert, hij zodanig maatregelen treft zodat de ander ongehinderd kan passeren." },
  { nr: "56", vraag: "Wanneer moet een bestuurder, anders dan bij het tegenkomen van andere weggebruikers ook naar links uitwijken?", antwoord: "Bij het ingehaald worden door de andere weggebruikers." },
  { nr: "57", vraag: "Is een wielrijder verplicht voor te sorteren?", antwoord: "Hij is niet verplicht, maar hij mag." },
  { nr: "58", vraag: "U rijdt over een voorrangsweg en nadert een kruising met een ander weg. Wat is uw gedrag bij die kruising?", antwoord: "U dient bijzondere voorzorg maatregelen te treffen om ongelukken / ongevallen te voorkomen ook al hebt je recht op voorrang." },
  { nr: "59", vraag: "De bestuurder van een voertuig nadert een kruising waar op zijn weg een stopbord is geplaatst. Is hij verplicht te stoppen en voorrang te verlenen aan het kruisende verkeer?", antwoord: "Ja, hij is verplicht te stoppen en voorrang te verlenen." },
  { nr: "60", vraag: "Wat verstaat men onder een T-kruising?", antwoord: "Een T-kruising is een kruising van wegen waarbij de ene weg ter plaatse eindigt (of doodloopt) en de andere doorloopt (doorgaande weg" },
  { nr: "61", vraag: "Een politie of brandweer rijdt met sirene mag hij door het rood verkeerslicht rijden?", antwoord: "Ja, met inachtneming van de voorzichtigheid." },
  { nr: "62", vraag: "U rijdt in het verkeer bent u verplicht links van de weg te rijden?", antwoord: "Ja, u bent verplicht." },
  { nr: "63", vraag: "Wanneer is de inhalende weggebruiker verboden te komen op het voor hem rechter weggedeelte?", antwoord: "Bij kruisingen of splitsingen van wegen of indien daardoor gevaar of belemmeringen ontstaat of kan ontstaan voor het tegemoet komend verkeer." },
  { nr: "64", vraag: "Wat is verboden als u wordt ingehaald?", antwoord: "Om de snelheid op te voeren." },
  { nr: "65", vraag: "Wanneer mag de ingehaalde weggebruiker zich weer op links begeven?", antwoord: "Hij mag zich pas dan naar links terug begeven, wanneer er geen gevaar of belemmering voor de ingehaalde weggebruiker ontstaat." },
  { nr: "66", vraag: "Hoe moet men stoppen voor een kruising of splitsing van een weg?", antwoord: "12 meter voor of na de kruising." },
  { nr: "67", vraag: "De bestuurder rijdt over een weg en komt een voetganger tegen die bezig is over te steken. Wat moet hij doen?", antwoord: "Bestuurders van motorrij- en voertuigen moeten zich zodanig gedragen dat de voetganger geen gevaar loopt." },
  { nr: "68", vraag: "Hoe moet men stoppen voor of na een verkeersheuvel?", antwoord: "6 meter afstand." },
  { nr: "69", vraag: "De bestuurder is voornemens van richting te veranderen. Hoe gebeurt dat?", antwoord: "Hij is verplicht tijdig en op duidelijke zichtbare wijze het voornemen daartoe kenbaar te maken door een duidelijk teken. (door richting te gegeven)" },
  { nr: "70", vraag: "Wanneer is het toegestaan dat twee auto’s naast elkaar rijden?", antwoord: "Alleen bij het inhalen of ingehaald worden is de bestuurder toegestaan naast elkaar te rijden." },
  { nr: "71", vraag: "Mogen tweewielige rijwielen naast elkaar rijden?", antwoord: "Zij mogen niet met meer dan twee (2) naast elkaar rijden, alleen indien zij niet door een ander wielrijder of een ander verkeer wordt ingehaald(wanneer er gevaar dreigt)" },
  { nr: "72", vraag: "Wanneer is het verboden stil te staan?", antwoord: "Als de vrijheid van het verkeer daardoor meer dan nodig wordt belemmerd of de veiligheid op de weg in gevaar wordt gebracht." },
  { nr: "73", vraag: "Wat zijn gescheiden rijbanen?", antwoord: "Zijn twee gelijkwaardige rijbanen op een afstand van niet meer dan 20 meter naast elkaar liggend en gescheiden door verkeersstroken, bomen, beplantingen, bermen, grachten, enz." },
  { nr: "74", vraag: "Mag een voetganger zich op een autoweg bevinden?", antwoord: "Neen, alleen bij het oversteken van de weg." },
  { nr: "75", vraag: "Is het verboden een motorrijtuig op een autoweg tot stilstand te brengen?", antwoord: "Ja, dat is verboden." },
  { nr: "76", vraag: "U verschijnt met een motorrijtuig op de weg. Waaraan moet het voldoen?", antwoord: "Van een deugdelijke bouw of inrichting, dan wel rij-technisch in voldoende staat van onderhoud verkerende." },
  { nr: "77", vraag: "Hoe lang mag de bestuurder of eigenaar zijn niet rijklare voertuig op de openbare weg laten staan?", antwoord: "Niet langer dan twee (2) maal 24 uur." },
  { nr: "78", vraag: "Hoe oud moet je zijn om in het bezit te komen van een A-rijbewijs?", antwoord: "16 jaar of ouder." },
  { nr: "79", vraag: "Hoe oud moet men zijn om in het bezit te komen van een B-E rijbewijs?", antwoord: "18 jaar of ouder." },
  { nr: "80", vraag: "Wanneer is het verboden een motorrijtuig onder toezicht te besturen als het gaat om een personenauto?", antwoord: "Als degene die onder toezicht rijdt de leeftijd van 18 jaar nog niet heeft bereikt." },
  { nr: "81", vraag: "Uw rijbewijs is ingevorderd. Mag u onder toezicht van een ander een motorrijtuig besturen?", antwoord: "Neen, dat is verboden." },
  { nr: "82", vraag: "Is er een rijbewijs vereist om een gemotoriseerde driewielige bestelwagen, waarvan het ledig gewicht ten hoogste 400kg. bedraagt en een snelheid ontwikkeld van 12 km/u te besturen?", antwoord: "neen, geen rijbewijs vereist." },
  { nr: "82a", vraag: "U rijdt op een rijwiel. Hoeveel passagiers boven de leeftijd van 10 jaar mag u mede vervoeren?", antwoord: "Een (1)" },
  { nr: "82b", vraag: "Waar dient de mede vervoerde persoon boven 10 jaarplaats nemen?", antwoord: "Achter de bestuurder met de benen aan weerzijden van het voertuig." },
  { nr: "83", vraag: "Langs de weg zijn er voetpaden aangebracht. Mag de voetganger gebruik maken van een rijbaan?", antwoord: "Neen, omdat er voetpaden aanwezig zijn." },
  { nr: "84", vraag: "Voetpaden en rijwielpaden zijn aanwezig. Hoe dient de voetganger zich te gedragen?", antwoord: "Hij dient van de voetpaden (bermen) gebruik te maken." },
  { nr: "85", vraag: "Hoe moeten voetgangers gebruik maken van de rijbaan?", antwoord: "Zoveel mogelijk aan de kant, bij voorkeur de rechterkant van de rijbaan, in hun bewegingsrichting gezien, lopen." },
  { nr: "86", vraag: "Een voetganger bevindt zich binnen dertig meter van een kruising en wil oversteken. Mag dat wel?", antwoord: "Hij mag niet oversteken." },
  { nr: "87", vraag: "Op een kruising naderen elkaar op verharde wegen (gelijke rangorde) een auto en een fiets. De auto komt van rechts en de fiets van links. Wie heeft voorrang?", antwoord: "De fiets, want hij komt van links." },
  { nr: "88", vraag: "Moeten bestuurders van motorrijtuigen voorsorteren als zij linksaf gaan?", antwoord: "Ja, dat is verplicht." },
  { nr: "89", vraag: "Wat zijn verkeerstekens?", antwoord: "Deze zijn: a. Verkeerslichten; b. Verkeersborden; c. verkeersteken op het wegdek (markeringen) en verkeerstekens of aanwijzingen van politie." },
  { nr: "90", vraag: "Aan welke zijde moet u in het algemeen met uw auto een ander voertuig inhalen?", antwoord: "Rechts." },
  { nr: "91", vraag: "Geef de voorrang volgens volgorde bij het rijden door rood licht met loeiende sirene door het bijzondere verkeer?", antwoord: ["Politie", "Brandweer", "Ambulance"], lijst: "A" },
  { nr: "92", vraag: "Mag een motorfiets inhalen waar een inhaalverbod van kracht is?", antwoord: "Dat is toegestaan." },
  { nr: "93", vraag: "Wat is de bestuurder, betrokken bij een ongeval verboden?", antwoord: "Het slachtoffer in hulpeloze toestand achterlaten." },
  { nr: "94", vraag: "De politie is bezig met verkeerscontrole op de weg.Wat moeten bestuurders van rij – en voertuigen doen bij het geven van bevelen door de politie?", antwoord: "De bestuurder is verplicht gevolg te geven aan de aanwijzingen en bevelen van de politie." },
  { nr: "95", vraag: "Wat bedoelt men met nacht?", antwoord: "De tijd gelegen tussen half zeven (18.30 u) s ’avond en half zes s’morgens (05.30 u) of de tijde gelegen tussen zonsondergangen zonsopkomst." },
  { nr: "96", vraag: "Wie is een bestuurder?", antwoord: "Hij die rijdt, die onder toezicht laat rijden en geleiders van trekdieren en vee." },
  { nr: "97", vraag: "Wat zijn motorrijtuigen?", antwoord: "Alle rij- en voertuigen bestemd om uitsluitend of mede door een krachtwerktuig op of aan het rij- en voertuig zelf aanwezig, anders dan langs spoorstaven, te worden voortbewogen." },
  { nr: "98", vraag: "Wat is de bestuurder verplicht te doen alvorens hij afremt of gaat stoppen?", antwoord: "Het voornemen daartoe moet hij duidelijk en tijdig kenbaar maken aan het van achter komende verkeer." },
  { nr: "99", vraag: "Wat moet de bestuurder allereerst doen als hij van richting wenst te veranderen?", antwoord: "Zich vergewissen dat hij dit kan zonder ander weggebruikers in gevaar te brengen." },
  { nr: "100", vraag: "Aan welke voetgangers moeten bestuurders ongehinderd doorgang verlenen?", antwoord: "Aan blinden, voorzien van een blindenstok en aan alle personen die zich moeilijk kunnen voortbewegen." },
  { nr: "101", vraag: "U bent op een voorrangsweg, doch merkt u dat u geen voorrang zal worden verleend. Wat doet u?", antwoord: "Ik laat hem gaan om ongevallen te voorkomen." },
  { nr: "102", vraag: "Van welke kleur moeten de richtingaanwijzers voorzien zijn?", antwoord: "Wit of oranjegeel tot oranjerood." },
  { nr: "103", vraag: "Wat moet je doen bij het tegenkomen van een begrafenisstoet?", antwoord: "Aan de uiterste linkerzijde van de weg stilstaan totdat de lijkenwagen voorbij is." },
  { nr: "104", vraag: "Waar moeten bestuurders hun voertuig tot stilstand brengen?", antwoord: "Aan de uiterste linkerzijde van de weg beken in hun rijrichting" },
  { nr: "105", vraag: "Hoe oud moet je zijn om een tweewielig motorrijtuig te besturen?", antwoord: "16 jaar of ouder." },
  { nr: "106", vraag: "Hoe moet men voorrang verlenen?", antwoord: "Voorrang wordt verleend door vaart te verminderen, te stoppen of meer naar links uit te wijken." },
  { nr: "107", vraag: "Welke tekens / bevelen kunnen door de politie worden gegeven?", antwoord: ["stoptekens.", "doorrij tekens", "tekens sneller rijden", "tekens langzaam rijden."] },
];

const CATEGORIE_C: Vraag[] = [
  { nr: "1", vraag: "Wat houdt de categorie C in?", antwoord: "Het besturen van motorrijtuigen, niet ingericht voor het vervoer van personen, Waarvan het ledig gewicht vermeerderd met het laadvermogen, meer bedraagt dan 3500 kg." },
  { nr: "2", vraag: "Wanneer is een vergunning van de D.C. vereist om met een motorrijtuig op de Openbare weg te begeven?", antwoord: "Wanneer dit voertuig meer dan gewoonlijk de weg in beslag neemt" },
  { nr: "3", vraag: "Hoe kan de weg meer dan gewoonlijk in beslag worden genomen.", antwoord: ["Indien de uitstekende lading breder is dan nagenoeg de afstand tussen de twee om dezelfde as draaiende wielen.", "Indien de snelheid zo traag is, dat er verkeersstagnaties kunnen ontstaan.", "Indien het bijzondere voertuigen betreft, welke niet voor het wegverkeer bestemd zijn."] },
  { nr: "4", vraag: "Wat is de maximale hoogte van een motorrijtuig?", antwoord: "3.80 meter." },
  { nr: "5", vraag: "Wat is de maximum breedte van een motorrijtuig?", antwoord: "2.50 meter." },
  { nr: "6", vraag: "Wat is de maximum asdruk van een motorrijtuig?", antwoord: "8000 kg, waarbij de achter elkaar liggende assen als afzonderlijk assen worden aangemerkt." },
  { nr: "7a", vraag: "Wat is de maximumsnelheid van een autotruck buiten bebouwde kom op een verharde weg?", antwoord: "60 km/u" },
  { nr: "7b", vraag: "Wat is de maximumsnelheid van een autotruck binnen bebouwde kom op een verharde weg?", antwoord: "40 km/u" },
  { nr: "7c", vraag: "Wat is de maximumsnelheid van een autotruck buiten bebouwde kom op een onverharde weg?", antwoord: "40 km/u" },
  { nr: "8", vraag: "Wat is de afmeting van de vlag die bevestigd dienst te worden bij een uitstekende lading?", antwoord: "Ten minste 40 x 40 cm." },
  { nr: "9", vraag: "Op welke hoogte en waar dient men de vlag te bevestigen?", antwoord: "Op en hoogte van 30 cm van de begane grond tot 125 cm en aan de voor alsook de achter zijde van de lading." },
  { nr: "10", vraag: "Welke kleur dient de vlag te hebben?", antwoord: "Rood." },
  { nr: "11", vraag: "Als u een truck bestuurd bent u dan verplicht te sorteren?", antwoord: "Ja, omdat ook een truck tot het snelverkeer behoort." },
  { nr: "12", vraag: "Hoe geschied het plaatsen van de vlag bij nacht met een uitstekende lading?", antwoord: "Aan de voorzijde een helder wit uitstralende lantaarn en aan de achterzijde een roodlicht uitstralende lantaarn." },
  { nr: "13", vraag: "Hoe dient de lading van een rij of voertuig te zijn geplaatst of gestuwd?", antwoord: "Zodanig dat daardoor geen schade of gevaar wordt veroorzaakt of kan worden veroorzaakt." },
  { nr: "14", vraag: "Mag de lading de bedrijf zekerheid verminderen?", antwoord: "Neen, de bedrijf zekerheid mag niet worden verminderd." },
];

const CATEGORIE_D: Vraag[] = [
  { nr: "1", vraag: "Wat verstaat u onder autobussen?", antwoord: ["Motorrijtuigen die ingericht zijn of gebruikt worden voor het vervoer van meer dan acht volwassen personen, de bestuurder daaronder niet inbegrepen. ( Cat. D)", "Motorrijtuigen bestemd om personen die zich daartoe aanmelden te vervoeren, indien voor het vervoer per plaats betaalt wordt ."] },
  { nr: "2", vraag: "Wat is de max. Snelheid van autobussen:", antwoord: ["Buiten de bebouwde kom verharde weg? 60 km/u", "Buiten de bebouwde kom onverharde weg? 40 km/u", "Binnen de bebouwde kom verhard / onverhard? 40 km/u"], lijst: "A" },
  { nr: "3", vraag: "Wat is de max. Breedte van een autobus?", antwoord: "2.50 meter." },
  { nr: "4", vraag: "Wat is de max. Hoogte van een autobus?", antwoord: "3.80 meter." },
  { nr: "5", vraag: "Wat is de minimale breedte van elke in-uitgang van een autobus?", antwoord: "50 cm." },
  { nr: "6", vraag: "Wat is de minimale breedte van elke (binnen) gang van een autobus?", antwoord: "80 cm." },
  { nr: "7", vraag: "Wat is de minimale breedte van een zitplaats van een kind boven 10jaar of een volwassen persoon?", antwoord: "40 cm. (2 kinderen beneden 10 jaar worden voor 1 (een) persoon berekend)." },
  { nr: "8", vraag: "Moet de bestuurder van een autobus over een inschrijvingsbewijs beschikken?", antwoord: "Ja, indien het voertuig gebruikt wordt om personen tegen betalingen per zitplaats moeten vervoeren." },
  { nr: "9", vraag: "Door wie geschiedt de overdracht van het nummerbewijs van een autobus?", antwoord: "Door of vanwege de Procureur-Generaal (P.G.)." },
  { nr: "10", vraag: "Door wie geschiedt de overdracht van de vergunning?", antwoord: "Door de minister van T.C.T." },
  { nr: "11", vraag: "Door wie geschiedt de overdracht van het inschrijvingsbewijs?", antwoord: "Door de District-Commissaris (D.C.)." },
];

const escape = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const vraagHtml = (v: Vraag) =>
  `<details class="qa"><summary><span class="qa-nr">${v.nr}.</span> ${escape(v.vraag)}</summary><div class="qa-a">` +
  (Array.isArray(v.antwoord)
    ? `<ol type="${v.lijst ?? "a"}">${v.antwoord.map((a) => `<li>${escape(a)}</li>`).join("")}</ol>`
    : `<p>${escape(v.antwoord)}</p>`) +
  `</div></details>`;

// Number 47 in the PDF: the maximum speeds per kind of vehicle and road.
const SNELHEDEN =
  "<h3>47. Maximumsnelheden</h3>" +
  '<div class="table-scroll"><table class="speed-table">' +
  "<tr><th>Voertuig</th><th>Binnen de bebouwde kom, verhard</th><th>Binnen de bebouwde kom, onverhard</th><th>Buiten de bebouwde kom, verhard</th><th>Buiten de bebouwde kom, onverhard</th></tr>" +
  "<tr><td>Bromfiets</td><td>30 km/u</td><td>30 km/u</td><td>40 km/u</td><td>30 km/u</td></tr>" +
  "<tr><td>Pers. auto/mf</td><td>40 km/u</td><td>40 km/u</td><td>80 km/u</td><td>40 km/u</td></tr>" +
  "<tr><td>Autobus/truck</td><td>40 km/u</td><td>40 km/u</td><td>60 km/u</td><td>40 km/u</td></tr>" +
  "</table></div>";

const HINT =
  '<p class="qa-hint">Bedenk eerst zelf het antwoord. Tik daarna op de vraag om het antwoord te zien.</p>';

const page = (title: string, vragen: Vraag[], na?: { nr: string; html: string }) => ({
  title,
  type: "TEXT" as const,
  content: {
    type: "TEXT",
    body: HINT + vragen.map((v) => vraagHtml(v) + (na && v.nr === na.nr ? na.html : "")).join(""),
  },
});

const num = (v: Vraag) => parseInt(v.nr, 10);
// Ten numbers per page: 1–10, 11–20, …, 101–107. 82a and 82b stay with 82.
const ALGEMEEN_PAGES = Array.from({ length: 11 }, (_, i) => {
  const [from, to] = [i * 10 + 1, Math.min(i * 10 + 10, 107)];
  return page(`Examenvragen ${from}–${to}`, ALGEMEEN.filter((v) => num(v) >= from && num(v) <= to), { nr: "46", html: SNELHEDEN });
});

export const theorieAlgemeenLessons = ALGEMEEN_PAGES;
export const theorieCategorieCLessons = [page("Vrachtauto (categorie C): examenvragen", CATEGORIE_C)];
export const theorieCategorieDLessons = [page("Autobus (categorie D): examenvragen", CATEGORIE_D)];
export const VRAGEN = { ALGEMEEN, CATEGORIE_C, CATEGORIE_D };
