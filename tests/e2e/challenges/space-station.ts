import type { ChallengeTest } from "./types";

export const spaceStationChallenges: ChallengeTest[] = [
  {
    title: "Habitación 00: código de acceso",
    path: "/estaciones/01-estacion-espacial/00-inicio",
    code: `codigo_acceso = "PySchool2025"

print(codigo_acceso)`,
    nextHref: "/estaciones/01-estacion-espacial/01-variable-string",
  },
  {
    title: "Habitación 01: variable string",
    path: "/estaciones/01-estacion-espacial/01-variable-string",
    code: `respuesta = "Cerrar"

print(respuesta)`,
    nextHref: "/estaciones/01-estacion-espacial/02-operacion-numerica-simple",
  },
  {
    title: "Habitación 02: operación numérica simple",
    path: "/estaciones/01-estacion-espacial/02-operacion-numerica-simple",
    code: `a = 201
b = 759
c = 2
d = 3

respuesta = (a + b) * c**d

print(respuesta)`,
    nextHref: "/estaciones/01-estacion-espacial/03-operacion-numerica-compleja",
  },
  {
    title: "Habitación 03: operación numérica compleja",
    path: "/estaciones/01-estacion-espacial/03-operacion-numerica-compleja",
    code: `a = 1.23
b = 2.34
c = 1
d = 43
e = 2
f = 3
g = 2
h = 1.5

respuesta = ((a + b) / (c + (d / e))) + (f * g**h)

print(respuesta)`,
    nextHref: "/estaciones/01-estacion-espacial/04-promedio-de-numeros",
  },
  {
    title: "Habitación 04: promedio de números",
    path: "/estaciones/01-estacion-espacial/04-promedio-de-numeros",
    code: `import statistics

numeros = [19.5, 22.3, 12, 10.01, 32, 29.99, 20.89]

respuesta = statistics.mean(numeros)

print(respuesta)`,
    nextHref: "/estaciones/01-estacion-espacial/05-bucle-for",
  },
  {
    title: "Habitación 05: bucle for",
    path: "/estaciones/01-estacion-espacial/05-bucle-for",
    code: `a = 1
b = 1001

suma = 0

for numero in range(a, b):
    suma = numero + suma

respuesta = suma

print(respuesta)`,
    nextHref: "/estaciones/01-estacion-espacial/06-indices-en-lista",
  },
  {
    title: "Habitación 06: índices en lista",
    path: "/estaciones/01-estacion-espacial/06-indices-en-lista",
    code: `import statistics

lista_fibonacci = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]

promedio = statistics.mean([
    lista_fibonacci[0],
    lista_fibonacci[2],
    lista_fibonacci[10],
    lista_fibonacci[-2],
])

print(promedio)`,
    nextHref: "/estaciones/01-estacion-espacial/07-ordenar-lista",
  },
  {
    title: "Habitación 07: ordenar lista",
    path: "/estaciones/01-estacion-espacial/07-ordenar-lista",
    code: `coordenadas = [540, 320, 890, 150, 430, 270]

lista_ordenada = coordenadas.copy()
lista_ordenada.sort()

valor_central = (lista_ordenada[2] + lista_ordenada[3]) // 2

respuesta = [lista_ordenada[0], valor_central, lista_ordenada[-1]]

print(respuesta)`,
    nextHref: "/estaciones/01-estacion-espacial/08-condicionales",
  },
  {
    title: "Habitación 08: condicionales",
    path: "/estaciones/01-estacion-espacial/08-condicionales",
    code: `def autorizar_acceso(acceso, resistencia):
    if acceso is True and resistencia == "Alta":
        return True

    return False`,
    nextHref: "/estaciones/01-estacion-espacial/09-bucle-for-condicionales",
  },
  {
    title: "Habitación 09: bucle for y condicionales",
    path: "/estaciones/01-estacion-espacial/09-bucle-for-condicionales",
    code: `objetos = [
    "linterna",
    "audífonos",
    "monitor principal",
    "motor de enfriador",
    "monitor de repuesto",
    "antena",
    "filtro gases",
    "lentes infrarojo",
    "teclado",
]

reparados = [
    "monitor de repuesto",
    "audífonos",
    "motor de enfriador",
]

por_reparar = []

for objeto in objetos:
    if objeto not in reparados:
        por_reparar.append(objeto)

print(por_reparar)`,
    nextHref: "/estaciones/01-estacion-espacial/10-condicionales-string",
  },
  {
    title: "Habitación 10: condicionales y string",
    path: "/estaciones/01-estacion-espacial/10-condicionales-string",
    code: `def transformar_palabras(palabra):
    if "meteorito" in palabra:
        return palabra.lower()

    if "asteroide" in palabra:
        return palabra.upper()

    return palabra`,
    nextHref: "/estaciones/01-estacion-espacial/11-concatenacion",
  },
  {
    title: "Habitación 11: concatenación",
    path: "/estaciones/01-estacion-espacial/11-concatenacion",
    code: `mensaje = [
    "Misión",
    "PySchool 2025",
    "progreso a mitad",
    "con pequeñas dificultades",
    "pronto",
    "nuevo",
    "reporte",
]

respuesta = " ".join(mensaje)

print(respuesta)`,
    nextHref: "/estaciones/01-estacion-espacial/12-crear-diccionario",
  },
  {
    title: "Habitación 12: crear diccionario",
    path: "/estaciones/01-estacion-espacial/12-crear-diccionario",
    code: `respuesta = {
    "PS004": 80,
    "PS014": 120,
    "PS104": 50,
}

print(respuesta)`,
    nextHref: "/estaciones/01-estacion-espacial/13-manejo-de-lista",
  },
  {
    title: "Habitación 13: manejo de lista",
    path: "/estaciones/01-estacion-espacial/13-manejo-de-lista",
    code: `archivos = [
    "lab_ps01",
    "rendimiento_ec00",
    "pruebas_tc12",
    "quimicos_ps01",
    "bateria_tc12",
    "paneles_ec00",
    "reporte_ec00",
    "reparaciones_salas_tc12",
    "sustancias_ps01",
]

respuesta = {}

for archivo in archivos:
    sufijo = archivo[-4:]

    if sufijo not in respuesta:
        respuesta[sufijo] = []

    respuesta[sufijo].append(archivo)

print(respuesta)`,
    nextHref: "/estaciones/01-estacion-espacial/14-decodificacion-diccionario",
  },
  {
    title: "Habitación 14: decodificación con diccionario",
    path: "/estaciones/01-estacion-espacial/14-decodificacion-diccionario",
    code: `mensaje = [
    ".", "._..", "__._.", "_._.", "___", "_..", "..", "__.", "___",
    "__._.", "...", ".", "_._.", "._.", ".", "_", "___", "__._.",
    "__._", ".._", ".", "__._.", "...", ".", "__._.", "_..", ".",
    "_...", ".", "__._.", "___", "_._.", ".._", ".__.", "._", "._.",
    "__._.", ".", "_.", "__._.", ".", "._..", "__._.", ".._", "._..",
    "_", "..", "__", "___", "__._.", "_..", ".", "...", "._", ".._.",
    "..", "___", "__._.", ".", "...", "__._.", "..___", "...._",
]

diccionario = {
    "._": "a", "_...": "b", "_._.": "c", "_..": "d", ".": "e",
    ".._.": "f", "__.": "g", "....": "h", "..": "i", ".___": "j",
    "_._": "k", "._..": "l", "__": "m", "_.": "n", "___": "o",
    ".__.": "p", "__._": "q", "._.": "r", "...": "s", "_": "t",
    ".._": "u", "..._": "v", ".__": "w", "_.._": "x", "_.__": "y",
    "__..": "z", "__._.": " ", "_____": "0", ".____": "1",
    "..___": "2", "...__": "3", "...._": "4", ".....": "5",
    "_....": "6", "__...": "7", "___..": "8", "____.": "9",
}

caracteres = []

for simbolo in mensaje:
    caracteres.append(diccionario[simbolo])

respuesta = "".join(caracteres)

print(respuesta)`,
    nextHref: "/estaciones/01-estacion-espacial/15-bucle-for-anidado",
  },
  {
    title: "Habitación 15: bucle for anidado",
    path: "/estaciones/01-estacion-espacial/15-bucle-for-anidado",
    code: `respuesta = []

for x in range(1, 31):
    for y in range(1, 31):
        if x + y == 50:
            respuesta.append((x, y))

print(respuesta)`,
    nextHref: "/estaciones/01-estacion-espacial/16-bucle-for-condicionales",
  },
  {
    title: "Habitación 16: bucle for y condicionales",
    path: "/estaciones/01-estacion-espacial/16-bucle-for-condicionales",
    code: `temperaturas = [-2, 0, 25, -1, 16]

def monitoreo_temperatura(temperaturas):
    niveles = []

    for temperatura in temperaturas:
        if temperatura <= -2:
            niveles.append("muy bajo")
        elif temperatura <= 12:
            niveles.append("bajo")
        elif temperatura <= 18:
            niveles.append("medio")
        else:
            niveles.append("alto")

    return niveles

respuesta = monitoreo_temperatura(temperaturas)

print(respuesta)`,
    nextHref:
      "/estaciones/01-estacion-espacial/17-operacion-matematica-funciones",
  },
  {
    title: "Habitación 17: números primos",
    path: "/estaciones/01-estacion-espacial/17-operacion-matematica-funciones",
    code: `def es_primo(numero):
    if numero < 2:
        return False

    for divisor in range(2, int(numero**0.5) + 1):
        if numero % divisor == 0:
            return False

    return True

suma = 0
contador = 0
numero = 2

while contador < 24:
    if es_primo(numero):
        suma += numero
        contador += 1

    numero += 1

respuesta = suma

print(respuesta)`,
    nextHref: "/estaciones/01-estacion-espacial/final",
  },
];
