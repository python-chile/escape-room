import type { ChallengeTest } from "./types";

export const oakChallenges: ChallengeTest[] = [
  {
    title: "Habitación 00: cargar datos",
    path: "/estaciones/02-laboratorio-oak/00-inicio",
    code: `import pandas as pd

url = "/pokemon.csv"

df = pd.read_csv(url)

print(df.head())`,
    nextHref: "/estaciones/02-laboratorio-oak/01-explorador-de-datos",
  },
  {
    title: "Habitación 01: explorar datos",
    path: "/estaciones/02-laboratorio-oak/01-explorador-de-datos",
    code: `import pandas as pd

url = "/pokemon.csv"

df = pd.read_csv(url)

df.info()

desc = df.describe()

print(desc)`,
    nextHref: "/estaciones/02-laboratorio-oak/02-tipos-de-pokemon",
  },
  {
    title: "Habitación 02: tipos de Pokémon",
    path: "/estaciones/02-laboratorio-oak/02-tipos-de-pokemon",
    code: `import pandas as pd
import matplotlib.pyplot as plt

url = "/pokemon.csv"

df = pd.read_csv(url)

conteo = df["Type 1"].value_counts()

conteo.plot(kind="bar")

plt.title("Cantidad de Pokémon por tipo")
plt.xlabel("Tipo")
plt.ylabel("Cantidad")
plt.xticks(rotation=45)

respuesta = len(conteo)

print(respuesta)`,
    nextHref: "/estaciones/02-laboratorio-oak/03-estadisticas-de-combate",
    chart: true,
  },
  {
    title: "Habitación 03: estadísticas de combate",
    path: "/estaciones/02-laboratorio-oak/03-estadisticas-de-combate",
    code: `import pandas as pd

url = "/pokemon.csv"

df = pd.read_csv(url)

promedio = df.groupby("Type 1")[
    ["HP", "Attack", "Defense", "Speed"]
].mean()

respuesta_ataque = promedio["Attack"].idxmax()
respuesta_defensa = promedio["Defense"].idxmin()

print(respuesta_ataque)
print(respuesta_defensa)`,
    nextHref: "/estaciones/02-laboratorio-oak/04-visualizacion-de-combate",
  },
  {
    title: "Habitación 04: visualización de combate",
    path: "/estaciones/02-laboratorio-oak/04-visualizacion-de-combate",
    code: `import pandas as pd
import matplotlib.pyplot as plt

url = "/pokemon.csv"

df = pd.read_csv(url)

col_x = "Attack"
col_y = "Defense"
color = "orange"

df["suma"] = df[col_x] + df[col_y]

plt.figure(figsize=(10, 6))
plt.scatter(df[col_x], df[col_y], color=color)
plt.title(f"{col_x} vs {col_y} de Pokémon")
plt.xlabel(col_x)
plt.ylabel(col_y)
plt.grid()

tabla_top5 = df[
    ["Name", col_x, col_y, "suma"]
].sort_values("suma", ascending=False).head(5)

respuesta = df.loc[df["suma"].idxmax(), "Name"]

print(tabla_top5)
print(respuesta)`,
    nextHref: "/estaciones/02-laboratorio-oak/final",
    chart: true,
  },
];
