---
orden: 3
titulo: Diversificación y correlación
resumen: Por qué combinar activos que no se mueven igual reduce el riesgo del conjunto, y cómo la correlación decide cuánto.
minutos: 5
quiz:
  - pregunta: Dos activos tienen correlación +1. ¿Qué pasa con la volatilidad si los combinas mitad y mitad?
    opciones:
      - Se reduce a cero
      - Es igual al promedio ponderado de sus volatilidades; no hay beneficio de diversificación
      - Se duplica
    correcta: 1
    explicacion: Con correlación +1 los activos se mueven siempre juntos, así que ninguno amortigua al otro. La volatilidad del portafolio es exactamente el promedio ponderado.
  - pregunta: ¿Cuándo es mayor el beneficio de diversificar?
    opciones:
      - Cuando la correlación entre los activos es baja o negativa
      - Cuando la correlación es exactamente +1
      - La correlación no influye
    correcta: 0
    explicacion: Mientras menor sea la correlación, más se compensan los movimientos entre sí y más baja la volatilidad del conjunto respecto del promedio.
  - pregunta: ¿Diversificar elimina todo el riesgo?
    opciones:
      - Sí, si tienes al menos diez activos
      - No; reduce el riesgo propio de cada activo, pero queda el riesgo que afecta a todo el mercado
    correcta: 1
    explicacion: Hay riesgos que golpean a casi todos los activos a la vez, como una recesión global. Ese riesgo de mercado no desaparece al diversificar.
faq:
  - pregunta: ¿Qué es la correlación entre dos inversiones?
    respuesta: Es un número entre −1 y +1 que indica qué tan parecido se mueven dos activos. +1 significa que se mueven siempre en la misma dirección, 0 que no tienen relación y −1 que se mueven siempre en direcciones opuestas.
  - pregunta: ¿Por qué diversificar reduce el riesgo?
    respuesta: Porque cuando los activos no se mueven exactamente igual, las caídas de unos se compensan parcialmente con otros. Así, la volatilidad del portafolio queda por debajo del promedio de las volatilidades de sus partes, sin reducir el retorno esperado en la misma proporción.
---

En la lección 1 dijimos que diversificar reduce el riesgo. Ahora veamos *por qué* y *cuánto*.

## La idea central

El retorno esperado de un portafolio es simplemente el promedio ponderado de los retornos esperados de sus partes. Si tienes mitad en un activo que espera 7% y mitad en uno que espera 4%, esperas 5,5%.

Con el riesgo **no pasa lo mismo**. La volatilidad del portafolio puede ser *menor* que el promedio de las volatilidades. Esa diferencia es el beneficio de diversificar, y depende de un número: la correlación.

## Correlación

La **correlación** mide qué tan parecido se mueven dos activos. Va de −1 a +1:

- **+1**: se mueven siempre juntos. Cuando uno sube 1%, el otro también sube en proporción.
- **0**: no hay relación. Saber qué hizo uno no te dice nada del otro.
- **−1**: se mueven siempre en sentido contrario.

En la práctica, las acciones de distintas empresas chilenas suelen tener correlaciones positivas pero menores que 1. Acciones y bonos de alta calidad han tenido muchas veces correlaciones bajas, aunque no siempre: en 2022, por ejemplo, ambos cayeron al mismo tiempo en buena parte del mundo.

## La fórmula, sin miedo

Para dos activos A y B, con pesos *w* y *1 − w*:

> volatilidad² = w²·σA² + (1−w)²·σB² + 2·w·(1−w)·ρ·σA·σB

Donde σ es la volatilidad de cada uno y ρ (rho) la correlación. Fíjate en el último término: si ρ es menor que 1, ese término se achica, y con él la volatilidad total. Si ρ = −1 y eliges bien los pesos, ¡la volatilidad puede llegar a cero!

Mueve los controles de abajo. Compara la línea punteada (el promedio simple de volatilidades) con la curva (la volatilidad real del portafolio). La distancia entre ambas es lo que ganas por diversificar.

## Lo que la diversificación no hace

Diversificar reduce el riesgo **propio** de cada activo: que una empresa quiebre o que un sector tenga un mal año. Pero hay un riesgo que afecta a casi todo a la vez (una recesión mundial, una crisis financiera). Ese **riesgo de mercado** no desaparece por mucho que diversifiques.

Y ojo: las correlaciones cambian con el tiempo, y en las crisis tienden a subir justo cuando más las necesitas bajas.
