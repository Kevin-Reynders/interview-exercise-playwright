# Hier leg je kort uit hoe je de tests hebt opgezet, welke risico’s je zag, en hoe je flaky tests vermeden hebt.

## In het begin
Om te beginnen is de volledige opdracht doorgenomen. Op basis daarvan heb ik testen, pagina's toegevoegd die relevant zouden kunnen zijn, om toch al een ruwe structuur op te zetten en mijn code al duidelijk te kunnen afbakenen.

Nu, uiteindelijk had ik verschillende testfiles gemaakt, maar heb ik alles in 1 testfile gestopt omdat alles praktisch rond dezelfde pagina's wordt gedaan.

De beslissingen die hier uitgelegd worden zijn genomen op basis van de opdracht.

## Scenario 1: Homepage en zoekfunctie

Hierbij hebben we via de page do `goto()` functie gedefinieërd met een vaste link, sinds de homepage in deze testomgeving altijd dezelfde blijft.

Natuurlijk, bij de meeste sites die zich aan alle regels willen voldoen, moet er een cookiebanner zichtbaar zijn om cookies te accepted, eventuele optionele cookies aan te passen, of te weigeren. Hiervoor is er een aparte herbruikbare functie voor gemaakt, samen met een functie voor de taalselectie, die bijna altijd op de cookieinstellingen volgde, die altijd tijdens de `beforeEach()` wordt uitgevoerd.

Beiden zijn voorzien van een try catch, indien er in een zeldzaam geval geen van deze 2 zichtbaar zou zijn, waardoor de test niet volledig dreigt te falen alleen vanwege de cookies.

## Scenario 2: Filteren en sorteren
De jaarfilter als enum gedeclareerd. Bol.com gebruikt alleen maar testid's op hun homepage, en in zeldzame gevallen op andere, dus achter de jaren zitten de directie filter id's die verbonden zijn aan deze jaren. Dus ook indien een ander jaar zich aanstelt, is er geen probleem.
Eens ik zag dat het veranderen van de sortering lang op zich laat wachten, heb ik ook een wait specifiek voor de loader ingebouwd.
Hierbij was er ook nog het probleem dat de prijs op een hele rare manier weergegeven wordt, en opgesplitst wordt in de HTML in verschillende elementen.

Hierdoor heb ik dus `getThreePrices()` voor aangemaakt, met een specifieke filter die een zin met de prijs ontleedt.

## Scenario 3: Productdetailpagina
Als eerste was het probleem om een nieuw product in een nieuwe tab te openen, en er ook verder op te gaan, omdat de nieuwe tab in de UI testen er soms uitzag als een pagina zonder CSS. Om toch duidelijk te maken dat we op een andere tab bezig waren, heb ik de originele pagina gesloten.

Op de productpagina zelf zijn bepaalde elementen niet consistent:
    Geen propere test id's
    De prijs is HTML gewijs opgesplits, opnieuw
    De availability is niet aanwezig bij elk product, dus hiervoor moest een try catch voorzien worden
    Zelfde voor de add to cart button, sommige producten kunnen out of stock zijn, dus hiervoor dus ook een try catch
    Juist omdat er zoveel mogelijke verschillen zijn, heb ik hier een try catch op alle gecheckte elementen gedaan.

## Scenario 4: Paginering
Om hier toch een fatsoenlijk resultaat te krijgen met het vergelijken van producten op verschillende pagina's, heb ik product 3 tot 7 gekozen ipv 1 tot 5, omdat de 2 eerste producten bijna altijd gesponserd zijn en altijd dezelfde zijn op elke pagina, dus zouden ze er altijd voor zorgen dat de test faalt op het einde omdat er producten zijn die overeenkomen.
