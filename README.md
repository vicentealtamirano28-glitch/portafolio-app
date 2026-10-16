# Cuaderno de portafolios

App web estática y educativa que explica cómo funciona un portafolio de inversión: activos, riesgo y retorno, diversificación, interés compuesto e inflación, perfil de riesgo, comisiones y simulación de Monte Carlo. Siete lecciones cortas en español de Chile, cada una con una herramienta interactiva y un quiz.

**Contenido educativo. No es una recomendación de inversión.**

## Cómo correrlo

Requiere Node 22.22 o superior.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
npm run preview  # sirve dist/
npx astro check  # chequeo de tipos
```

## Estructura

```
src/
  content.config.ts        colección `lecciones` (schema zod: quiz y faq)
  content/lecciones/*.md   las 7 lecciones
  lib/finance.ts           funciones puras: supuestos, portfolioStats, compound, feeDrag, monteCarlo, RISK_QUIZ
  lib/indicadores.ts       fetch a mindicador.cl con validación, timeout de 5 s y caché de 6 h en localStorage
  lib/svg.ts               ayudas mínimas para dibujar gráficos SVG sin librerías
  lib/format.ts            formato es-CL (CLP, %, fechas)
  lib/progreso.ts          progreso de lecciones en localStorage (`portafolio:progreso`)
  components/              layout, quiz, indicadores, supuestos, aviso legal
  components/widgets/      una herramienta interactiva por lección
  pages/                   inicio, /lecciones/[slug], /glosario
```

Sin framework de UI: la interactividad son `<script>` en componentes Astro con TypeScript.

## Fuentes y supuestos

- Indicadores (UF, dólar, IPC, TPM): [mindicador.cl](https://mindicador.cl), que publica datos del Banco Central de Chile y el INE. El IPC de 12 meses se calcula componiendo las últimas 12 variaciones mensuales; si no hay datos se usa 3%.
- Retornos, volatilidades y correlaciones (`src/lib/finance.ts`) son **supuestos ilustrativos, no proyecciones**: renta variable 7% / 16%, renta fija 4% / 6%, caja 3% / 1%; correlaciones RV–RF 0,2, RV–caja 0, RF–caja 0,1.
- Límites de renta variable de los multifondos AFP son aproximados; los vigentes están en [spensiones.cl](https://www.spensiones.cl).
- El simulador usa pasos anuales, retornos normales correlacionados (Cholesky), rebalanceo anual y una semilla fija (mulberry32). No incluye comisiones, impuestos ni inflación.
