# Hier leg je kort uit wat de installatie- en run-instructies zijn.

## Installatie
Eerst een fork gemaakt van de opdracht naar mijn eigen account

git clone https://github.com/Kevin-Reynders/interview-exercise-playwright

Zorg ervoor dat node.js geïnstalleerd is op je device die je kan vinden op https://nodejs.org/en/download
Na de installatie kan je checken of node succesvol geïnstalleerd is met dit commando

```bash
node -v
```

in terminal en/of via IDE naar interview-exercise-playwright

```bash
npm init playwright@latest
```

```bash
√ Do you want to use TypeScript or JavaScript? · TypeScript
√ Where to put your end-to-end tests? · tests
√ Add a GitHub Actions workflow? (Y/n) · true
√ Install Playwright browsers (can be done manually via 'npx playwright install')? (Y/n) · true
```

## Run instructies

Executing it with a report being written and opening up once it's finished
```
npx playwright test
```

Execute only a specific browser
```
npx playwright test --project chromium
```

Executing the program in UI mode
```
npx playwright test --ui
```

Executing the program in a specific browser while seeing what the program is doing by opening the browsers visually
```
npx playwright test --project chromium --headed 
```

Open the last HTML report run
```
npx playwright show-report 
```

## Additionele informatie
Het instllen van de pipeline is geen probleem, maar de pipeline loopt al direct vast op de beforeEach van elke test. Hierdoor is het probleem dat er praktisch niks uitgevoerd werd.
Lokaal werkt deze rapportering wel, met opgemaakt report, maar via de pipeline is dit een probleem.