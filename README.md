# LSZ Plomberie — Site vitrine

Site one-page pour **LSZ Plomberie**, plombier chauffagiste à Voiron (38500) et région voironnaise.
_« La plomberie qui coule de source. »_

Stack : **HTML5 + CSS + JS vanilla + Tailwind CSS (CDN)**. Aucune installation requise, aucun build.

---

## Lancer le site en local

Le site est 100 % statique. Deux options :

**1. Le plus simple** — double-cliquer sur `index.html` (s'ouvre dans le navigateur).

**2. Avec un petit serveur local** (recommandé, évite certains blocages de la carte/polices) :

```bash
# Python 3
python -m http.server 8000
# puis ouvrir http://localhost:8000

# ou avec Node
npx serve
```

> Tailwind est chargé via CDN : une connexion internet est nécessaire au premier affichage
> (polices Google + Tailwind). Voir plus bas pour passer en build local si besoin de perf maximale.

---

## Arborescence

```
plombier 1/
├── index.html          # page unique (toutes les sections)
├── css/
│   └── styles.css      # composants réutilisables + animations (complète Tailwind)
├── js/
│   └── main.js         # menu mobile, header au scroll, reveal, année footer
├── assets/
│   ├── logo.png        # LOGO À DÉPOSER ICI (voir ci-dessous)
│   └── realisations/   # vos photos de chantiers (à créer)
└── README.md
```

---

## À COMPLÉTER (placeholders restants)

| Élément | Où | Action |
|---|---|---|
| **Logo** | `assets/logo.png` | Déposer le logo LSZ (bouclier bleu/rouge). Tant qu'il manque, un badge « LSZ » bleu/rouge s'affiche automatiquement à la place. Format conseillé : PNG carré ~512×512, fond transparent. |
| **Favicon** | `assets/logo.png` | Utilise le logo par défaut. Pour un vrai favicon, remplacer par `assets/favicon.png` et mettre à jour la balise `<link rel="icon">`. |
| **Photo hero (avant/après)** | `assets/realisations/avant.jpg` + `apres.jpg` | Branchées. Pour changer : garder les mêmes noms de fichiers (voir `assets/LISEZ-MOI.txt`, méthode A). Deux photos même cadrage 4:5. |
| **Réalisations** | `assets/realisations/` (`sdb1`, `chauf1`, `neuf`, `toilette1`.jpg) | Branchées dans la galerie. Pour changer : remplacer les fichiers en gardant le même nom (voir `assets/LISEZ-MOI.txt`). |
| **Carte Google Maps** | section `#zones` | L'iframe pointe déjà sur l'adresse. Pour une carte « établissement » officielle, copier le code d'intégration depuis votre fiche Google Business Profile. |
| **SIRET** | footer | Remplacer `[à compléter]`. |
| **Certifications** | — | Aucune fournie (RGE / Qualibat / QualiPAC laissées vides). Si obtenues, on peut ajouter une bande « labels ». |
| **Avis clients** | section `#avis` | 5 vrais avis Google intégrés (Marie-Anne, Julien, Melanie, Isabelle, Joris). Le bouton « Voir tous les avis » pointe vers une recherche Google — remplacer par l'URL réelle de votre fiche Google Business Profile. |
| **Domaine** | `index.html` (`<head>`) | Les URLs `https://www.lszplomberie.fr/` (canonical, Open Graph, schema.org) sont des exemples — remplacer par le vrai domaine une fois en ligne. |

---

## Coordonnées intégrées

- **Téléphone** : 06 32 71 33 54 — lien `tel:+33632713354` présent sur **tous** les emplacements (header, hero, services, zones, contact, footer, bouton flottant mobile).
- **Email** : accueil.lszplomberie@outlook.com (lien `mailto:`)
- **Adresse** : 7 chemin Croix Rousse, 38500 Voiron
- **Instagram** : https://www.instagram.com/lszplomberie.voiron
- **Horaires** : Lun–Ven 07:00–18:00 · Sam 08:00–17:00 · Dim fermé

---

## SEO & accessibilité

- Balises `title` / `meta description` avec la ville (Voiron).
- Données structurées **schema.org `Plumber` (LocalBusiness)** : adresse, téléphone, horaires, zones desservies, services, réseaux.
- HTML5 sémantique, attributs `alt`, navigation clavier, `skip link`, contrastes AA.
- `prefers-reduced-motion` respecté (animations coupées si l'utilisateur le demande).
- Images en `loading="lazy"`, aucun script bloquant (JS en `defer`).

### Optimisation IA / SEO local (fichiers ajoutés)

- **Section FAQ** avec réponses courtes (40–60 mots) + schema `FAQPage` → cible les
  AI Overviews Google et les réponses ChatGPT / Perplexity.
- **Schema enrichi** : `AggregateRating` 5/5 + les 5 avis Google réels (`Review`).
- **`robots.txt`** — autorise les robots d'IA (GPTBot, PerplexityBot, ClaudeBot,
  Google-Extended, Bingbot) pour permettre la citation dans les réponses IA.
- **`sitemap.xml`** — plan du site (une page).
- **`llms.txt`** — fiche de contexte lisible par les IA (services, zone, coordonnées).
- **Meta géo** (`geo.region`, `geo.position`, `ICBM`) pour le référencement local.

> IMPORTANT — le domaine `https://www.lszplomberie.fr/` est un exemple. Une fois le
> vrai domaine connu, remplacez-le dans : `index.html` (canonical, Open Graph, schema),
> `robots.txt`, `sitemap.xml` et `llms.txt`. Mettez aussi à jour `lastmod` dans
> `sitemap.xml` à chaque modification importante.
> Pensez à créer/mettre à jour la fiche **Google Business Profile** (avis, photos,
> horaires) : c'est le plus gros levier de visibilité locale, devant le site lui-même.

---

## Interactions premium (JS natif, sans dépendance)

Tout est en vanilla JS ([js/main.js](js/main.js)), optimisé `transform`/`opacity`, `requestAnimationFrame`
et `IntersectionObserver`. Aucun listener de scroll lourd. `prefers-reduced-motion` respecté,
effets curseur désactivés sur tactile (`pointer: fine`).

- **Barre de progression** de lecture en haut de page.
- **Nav active au scroll** (scrollspy) : le lien de la section visible s'illumine.
- **Compteur animé** ("16 communes" s'incrémente à l'apparition).
- **Trait dessiné** sous « de source » (SVG stroke) au scroll.
- **Boutons magnétiques** : les CTA se rapprochent du curseur.
- **Spotlight** : halo suivant le curseur sur les cartes (services, avis, atouts).
- **Tilt 3D** sur la carte « Chauffage hydraulique ».
- **Aurora animée** (halos qui dérivent) + **grain** subtil.
- **Reflet balayant** sur le bouton principal, indice « Glissez » sur le comparateur.
- **Avis** : pile de cartes qui s'empilent au scroll (`position: sticky`).

## Conformité & pages légales

Deux pages ont été ajoutées (obligatoires en France) :

- **`mentions-legales.html`** — éditeur, hébergeur, responsable de publication, assurance, etc.
- **`confidentialite.html`** — RGPD, données, cookies, services tiers, droits.

Liens présents dans le footer de toutes les pages. Les champs entre
<span>`[crochets rouges]`</span> sont à compléter avant mise en ligne :

| À remplir | Où |
|---|---|
| Forme juridique, capital, SIRET, RCS/RM, TVA | `mentions-legales.html` §1 |
| Responsable de la publication (nom) | `mentions-legales.html` §2 |
| Hébergeur (nom, adresse, téléphone) | `mentions-legales.html` §3 |
| Assurance pro / garantie décennale | `mentions-legales.html` §6 |
| Ville du tribunal compétent | `mentions-legales.html` §8 |
| Dates de mise à jour | les deux pages |
| Durée de conservation des données | `confidentialite.html` §3 |
| Année de création, années d'expérience, `[Prénom Nom]` | section « À propos » de `index.html` |
| Photo de l'artisan | `assets/artisan.jpg` (sinon initiales auto) |

**Carte Google Maps — RGPD** : la carte ne se charge plus automatiquement. Elle apparaît
après un clic sur « Afficher la carte » (aucun cookie tiers avant consentement). Pas de
bandeau cookies nécessaire tant qu'aucun outil de suivi (Analytics, Pixel) n'est ajouté.

## Option : build Tailwind local (performance maximale)

Le CDN suffit pour un site vitrine. Pour un CSS minifié embarqué (chargement plus rapide,
fonctionne hors-ligne) :

```bash
npm install -D tailwindcss
npx tailwindcss init
# configurer content: ["./index.html","./js/**/*.js"] + les couleurs de marque
npx tailwindcss -i ./css/tailwind.src.css -o ./css/tailwind.build.css --minify
```

Puis remplacer, dans `index.html`, le `<script src="https://cdn.tailwindcss.com">` et son bloc
`tailwind.config` par `<link rel="stylesheet" href="css/tailwind.build.css">`.

---

## Palette de marque

| Rôle | Couleur |
|---|---|
| Bleu principal | `#004aad` |
| Rouge accent | `#ff3131` |
| Encre (texte / fond sombre) | `#0c1015` |
| Gris texte | `#5b6470` |
