# share-a-meal server

## Introductie

Dit is een node js API server is gemaakt als opdracht voor de opleiding Informatica bij Avans Hogeschool te Breda. Deze API server heeft op het moment twee typen objecten, gebruikers en maaltijden.

De server biedt de mogelijkheid om:

-   Een user/meal aan te maken
-   In te loggen
-   Een lijst van alle user/meal op te vragen
-   Om de lijst van user/meal te filteren op naam en of de user actief is
-   Een user/meal aan te passen
-   Een user/meal te verwijderen

De server maakt gebruik van authenticatie aan hand van [JSON Web Tokens](https://jwt.io) om ervoor te zorgen dat alle methodes behalve het aanmaken/inloggen van een user, en het opvragen van meals enkel door een bestaande gebruiker kunnen worden uitgevoerd. Verder zorgt de authenticatie ervoor dat een user enkel zijn/haar eigen gegevens kan wijzigen.

Als je deze API wilt uitproberen voordat je hem zelf installeert is een versie van deze API beschikbaar via de base-url : https://share-a-meal-2022.herokuapp.com/

## Instalatie

Als je de server lokaal wilt runnen is het nodig om de volgende programma’s geïnstalleerd te hebben:

-   [NodeJS](https://nodejs.org/en/)
-   [XAMPP] (https://www.apachefriends.org/index.html) voor de MySQL database
-   [Postman](https://www.postman.com) voor het aanroeppen van de API

Als je deze programma’s wilt installeren kun je dit doen door in de volgende stappen:

1. Download het zip bestand van deze repo
2. Pak dit bestand uit waar je de installatie wilt hebben
3. Navigeer met de command prompt (of andere CLI als je die hebt) naar de uitgepakte volder
4. Run de command "npm install" in de command prompt

Als je lokaal GIT hebt geïnstalleerd kun je stap 1 en 2 vervangen door de repo te clonen.

Opmerking: Deze server is enkel getest op Windows 11

## Gebruik

Hier volgen de ondersteunde API calls, JSON objecten die je (eventueel) mee moet sturen en een voorbeeld van een response, de items in de JSON objecten zijn verplicht, als deze niet meegestuurd worden zal een foutmelding teruggestuurd worden (bij requests waar een token voor nodig is wordt ervan uitgegaan dat deze is toegevoegd).

Een overzicht van alle API calls samen met voorbeelddata is te vinden in dit GoogleDocs document:
https://docs.google.com/document/d/1PVPy2GyWRQYvly5arEWQ70EA4ltfdhA2uCqGyYHEUvw/edit?usp=sharing

## Support

Op dit moment wordt deze API niet actief ontwikkeld of onderhouden. Mocht dit veranderen dan wordt hier een email toegevoegd waar je mogelijke vragen naar toe kunt sturen. Deze zullen dan zo snel mogelijk worden beantwoord.

## Roadmap

Op dit moment wordt deze API niet actief ontwikkeld. Als dit verandert wil ik de mogelijkheid om je aan of af te melden voor een maaltijd toevoegen. Ook wil ik ervoor zorgen dat wachtwoorden versleuteld worden (dat is op het moment nog niet het geval)

## Contributie

Dit project staat niet open voor veranderingen op deze repo. Als je deze API wilt veranderen kan dat in een eigen repository.

## Auteurs

Deze API is gemaakt door Jascha van der Ark. Delen van deze code zijn overgenomen uit voorbeeld code die is gemaakt door Robin Schellius en Davide Ambesi

## Project status

Dit project wordt op het moment niet actief ontwikkeld
