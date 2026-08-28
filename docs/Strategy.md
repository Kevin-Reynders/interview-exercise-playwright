# Hier leg je kort uit hoe je de tests hebt opgezet, welke risico’s je zag, en hoe je flaky tests vermeden hebt.

## In het begin
Om te beginnen is de volledige opdracht doorgenomen. Op basis daarvan heb ik testen, pagina's toegevoegd die relevant zouden kunnen zijn, om toch al een ruwe structuur op te zetten en mijn code al duidelijk te kunnen afbakenen.

De beslissingen die hier uitgelegd worden zijn genomen op basis van de opdracht.

## Scenario 1: Homepage en zoekfunctie

Hierbij hebben we via de page do `goto()` functie gedefinieërd met een vaste link, sinds de homepage in deze testomgeving altijd dezelfde blijft.

Natuurlijk, bij de meeste sites die zich aan alle regels willen voldoen, moet er een cookiebanner zichtbaar zijn om cookies te accepted, eventuele optionele cookies aan te passen, of te weigeren. Hiervoor is er een aparte herbruikbare functie voor gemaakt, samen met een functie voor de taalselectie, die bijna altijd op de cookieinstellingen volgde, die altijd tijdens de `beforeEach()` wordt uitgevoerd.

Beiden zijn voorzien van een try catch, indien er in een zeldzaam geval geen van deze 2 zichtbaar zou zijn, waardoor de test niet volledig dreigt te falen alleen vanwege de cookies.










Eens ik zag dat het veranderen van de sortering lang op zich laat wachten, heb ik ook een wait specifiek voor de loader ingebouwd.