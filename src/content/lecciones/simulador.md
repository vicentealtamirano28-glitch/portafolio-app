---
orden: 7
titulo: El simulador
resumen: Junta todo lo aprendido. Elige una asignación, simula mil futuros posibles y aprende a leer percentiles.
minutos: 6
quiz:
  - pregunta: El simulador muestra un percentil 10 de $8 millones a 20 años. ¿Qué significa?
    opciones:
      - Que hay 10% de probabilidad de terminar con exactamente $8 millones
      - Que en 10% de los escenarios simulados terminas con $8 millones o menos
      - Que vas a ganar 10% al año
    correcta: 1
    explicacion: El percentil 10 es el valor que deja por debajo al 10% de los escenarios. Es una forma de mirar un "mal escenario" razonable, no el peor posible.
  - pregunta: ¿Por qué el abanico de resultados se abre con los años?
    opciones:
      - Porque la simulación tiene un error
      - Porque la incertidumbre se acumula; cada año agrega una nueva fuente de variación
      - Porque los aportes cambian cada año
    correcta: 1
    explicacion: Cada año aporta su propio retorno incierto, y esos retornos se componen. En pesos, la distancia entre escenarios buenos y malos crece con el plazo.
  - pregunta: ¿Qué tan confiables son los resultados de una simulación como esta?
    opciones:
      - Son una proyección exacta del futuro
      - Son tan buenos como sus supuestos; sirven para entender rangos y comparar alternativas, no para predecir
    correcta: 1
    explicacion: Una simulación depende por completo de los retornos, volatilidades y correlaciones que supone. Aquí son supuestos ilustrativos.
faq:
  - pregunta: ¿Qué es una simulación de Monte Carlo en inversiones?
    respuesta: Es una técnica que genera miles de trayectorias posibles de un portafolio sorteando retornos aleatorios según supuestos de retorno esperado, volatilidad y correlación. Permite ver un rango de resultados posibles y su probabilidad, en vez de un único número.
  - pregunta: ¿Qué es un percentil?
    respuesta: Es el valor bajo el cual queda un porcentaje dado de los casos. El percentil 50 (mediana) deja la mitad de los escenarios por debajo; el percentil 10, el 10%; y el percentil 90, el 90%.
---

En las lecciones anteriores viste cada pieza por separado. Ahora vamos a juntarlas: una asignación de activos, aportes mensuales, interés compuesto, volatilidad y correlación.

## Qué hace el simulador

En vez de suponer que tu portafolio rinde lo mismo todos los años, el simulador **sortea** un retorno distinto para cada año, respetando:

- el retorno esperado y la volatilidad de cada clase de activo,
- y cómo se mueven juntas (su correlación).

Repite eso **mil veces**. El resultado no es un único futuro, sino mil futuros posibles. Esta técnica se llama **simulación de Monte Carlo**.

Para que puedas comparar con calma, la simulación usa una semilla fija: con los mismos datos, verás siempre los mismos resultados.

## Cómo leer el gráfico: percentiles

Con mil resultados, no tiene sentido mostrarlos todos. Los resumimos con **percentiles**:

- **Percentil 50 (mediana)**: la mitad de los escenarios terminó por encima y la otra mitad por debajo. Es el escenario "del medio".
- **Percentil 10**: solo 10% de los escenarios terminó peor. Es un mal escenario razonable, no el peor posible.
- **Percentil 90**: solo 10% terminó mejor. Es un buen escenario, no el mejor posible.

La banda entre el percentil 10 y el 90 contiene el 80% de los escenarios. Fíjate cómo se ensancha con los años, y cómo se ensancha más cuando subes la renta variable.

También verás la **probabilidad de terminar con menos de lo que aportaste**: la proporción de escenarios en que el saldo final fue menor que la suma de tu inversión inicial y todos tus aportes.

## Lo que el simulador no sabe

- Usa supuestos fijos. En la realidad, los retornos esperados y las correlaciones cambian.
- Supone retornos con distribución normal. Los mercados reales tienen caídas extremas con más frecuencia.
- No descuenta comisiones, impuestos ni inflación: los montos son nominales.
- Supone que rebalanceas cada año y que nunca vendes por pánico.

Úsalo para entender cómo cambia el **rango** de resultados cuando cambias la asignación o el plazo, no para predecir cuánto vas a tener.
