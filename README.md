# API de Produtos da Amazon (Não Oficial)

![NPM](https://img.shields.io/npm/l/amazon-buddy.svg?style=for-the-badge) ![npm](https://img.shields.io/npm/v/amazon-buddy.svg?style=for-the-badge)

Ferramenta muito útil capaz de extrair quase a mesma quantidade de dados que a API oficial de Produtos da Amazon.

## Se você gosta desta ferramenta, por favor, marque-a com uma estrela

---

<a href="https://www.buymeacoffee.com/Usom2qC" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-blue.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 134px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

---

## Funcionalidades

-   **Extrair dados de produtos dos resultados de pesquisa (por categoria, por país)**
-   **Extrair muitos dados de um único produto usando o ID ASIN**
-   **Extrair dados de avaliações de produtos usando o ID ASIN**
-   **Extrair lista de categorias**
-   **Suporta todos os Marketplaces da Amazon disponíveis**
-   Ordenar resultados apenas por produtos patrocinados
-   Ordenar resultados apenas por produtos com desconto
-   Os resultados podem ser salvos em arquivos JSON/CSV
-   Você pode extrair até **500 produtos** e **1000 avaliações**

**Lista de Produtos**
![alt text](https://i.imgur.com/ES5M4Rx.png)
**Lista de Avaliações**
![alt text](https://i.imgur.com/HuBW3rl.png)

**Nota:**

-   Parâmetro vazio = valor vazio

**Erros Possíveis**

-   Se encontrar algum, me avise.

## Instalação

**Instalar via NPM**

```sh
$ npm i -g amazon-buddy
```

**Instalar via YARN**

```sh
$ yarn global add amazon-buddy
```

## USO

**Terminal**

```sh
$ amazon-buddy --help

Uso: amazon-buddy <comando> [opções]

Comandos:
  amazon-buddy products      coletar produtos usando palavra-chave
  amazon-buddy reviews [id]  coletar avaliações de produtos usando ID ASIN
  amazon-buddy asin [id]     detalhes de um único produto
  amazon-buddy categories    obter lista de categorias
  amazon-buddy countries     obter lista de países

Opções:
  --help, -h      ajuda                                                [booleano]
  --version       Mostrar número da versão                             [booleano]
  --async, -a     Número de tarefas assíncronas          [string] [padrão: "5"]
  --keyword, -k   Palavra-chave de pesquisa da Amazon ex. 'Xbox one' [string] [padrão: ""]
  --number, -n    Número de produtos para extrair. Máximo de 100 produtos ou 300
                  avaliações                                [número] [padrão: 20]
  --filetype      Tipo do arquivo de saída onde os dados serão salvos. 'all' -
                  salvar dados nos arquivos 'json' e 'csv'
                            [escolhas: "csv", "json", "all", ""] [padrão: "csv"]
  --sort          Se estiver pesquisando produtos, a lista será ordenada pela
                  pontuação mais alta (número de avaliações * classificação). Se estiver pesquisando
                  avaliações, elas serão ordenadas pela classificação.
                                                      [booleano] [padrão: false]
  --discount, -d  Extrair apenas produtos com desconto
                                                      [booleano] [padrão: false]
  --sponsored     Extrair apenas produtos patrocinados      [booleano] [padrão: false]
  --min-rating    Classificação mínima permitida                   [número] [padrão: 1]
  --max-rating    Classificação máxima permitida                   [número] [padrão: 5]
  --country       No formato ISO 3166 (código Alpha-2). Para obter a lista de países
                  disponíveis, digite e use (índice) da tabela mostrada como valor:
                  amazon-buddy countries                [string] [padrão: "US"]
  --category      Para obter a lista de categorias disponíveis, digite e use (índice) da
                  tabela mostrada como valor: amazon-buddy categories
                                                       [string] [padrão: "aps"]
  --random-ua     Randomizar versão do user agent. Isso ajuda a prevenir o bloqueio
                  de requisições pelo lado da Amazon       [booleano] [padrão: false]
  --user-agent    Definir user-agent personalizado                   [string] [padrão: ""]
  --timeout, -t   Tempo limite entre requisições. O tempo limite é definido em ms: 1000 ms = 1


Exemplos:
  amazon-buddy products -k 'Xbox one'
  amazon-buddy products -k 'Xbox one' --country 'GB'
  amazon-buddy reviews B01GW3H3U8
  amazon-buddy asin B01GW3H3U8
  amazon-buddy categories
  amazon-buddy countries
```

#### Exemplo 1

Extrair 40 produtos do resultado de pesquisa da Amazon usando a palavra-chave "vacuum cleaner" e salvar o resultado no arquivo CSV

```sh
$ amazon-buddy products -k 'vacuum cleaner' -n 40 --filetype csv
```

**Saída:
1552945544582_products.csv**

#### Exemplo 2

Extrair 40 produtos do resultado de pesquisa da Amazon usando a palavra-chave "vacuum cleaner" e exibir o resultado bruto no terminal

```sh
$ amazon-buddy products -k 'vacuum cleaner' -n 40 --filetype ''
```

#### Exemplo 3

Extrair 40 produtos do resultado de pesquisa da Amazon usando a palavra-chave "vacuum cleaner" da Amazon.NL (Holanda) e exibir o resultado bruto no terminal

```sh
$ amazon-buddy products -k 'vacuum cleaner' -n 40 --filetype '' --country NL
```

#### Exemplo 4

Extrair 40 produtos do resultado de pesquisa da Amazon da categoria "Apps & Games" usando a palavra-chave "games" da Amazon.ES (ESPANHA) e exibir o resultado bruto no terminal

```sh
$ amazon-buddy products -k 'games' -n 40 --filetype '' --country ES --category mobile-apps
```

#### Exemplo 5

Extrair 100 avaliações de um produto usando ASIN.
**_NOTA: ASIN é um ID de produto exclusivo da Amazon, pode ser encontrado na URL do produto ou se você extraiu a lista de produtos com nossa ferramenta, você o encontrará nos arquivos CSV/JSON_**

```sh
$ amazon-buddy reviews B01GW3H3U8 -n 100
```

**Saída:
reviews(B01GW3H3U8)\_1589470878252**

#### Exemplo 6

Extrair 300 produtos da palavra-chave "Xbox one" com classificação mínima de 3 e máxima de 4 e salvar tudo no arquivo CSV

```sh
$ amazon-buddy products -k 'xbox one' -n 300 --min-rating 3 --max-rating 4
```

**Saída:
1552945544582_products.csv**

#### Exemplo 7

Mostrar lista de todos os países disponíveis

```sh
$ amazon-buddy countries
```

**Saída:**
![alt text](https://i.imgur.com/SyPRHcN.png)

#### Exemplo 8

Mostrar lista de todas as categorias disponíveis da Amazon.CO.UK

```sh
$ amazon-buddy categories --country GB
```

**Saída:**
![alt text](https://i.imgur.com/k4MBg2h.png)

## Módulo

### Métodos

```javascript
.products() - pesquisa de produtos
.reviews() - pesquisa de avaliações
.asin() - detalhes de um único produto
.categories() - categorias disponíveis
```

### Exemplo

```javascript
const amazonScraper = require('amazon-buddy');

(async () => {
    try {
        // Coletar 50 produtos de uma palavra-chave 'xbox one'
        // O país padrão é US
        const products = await amazonScraper.products({ keyword: 'Xbox One', number: 50 });

        // Coletar 50 produtos de uma palavra-chave 'xbox one' da Amazon.NL
        const products = await amazonScraper.products({ keyword: 'Xbox One', number: 50, country: 'NL' });

        // Coletar 50 produtos de uma palavra-chave 'xbox one' da Amazon.CO.UK
        const products = await amazonScraper.products({ keyword: 'Xbox One', number: 50, country: 'GB' });

        // Coletar produtos que estão localizados na página número 2
        const reviews = await amazonScraper.products({ keyword: 'Xbox One', bulk: false, page: 2 });

        // Coletar 50 produtos de uma palavra-chave 'xbox one' com classificação entre 3-5 estrelas
        const products_rank = await amazonScraper.products({ keyword: 'Xbox One', number: 50, rating: [3, 5] });

        // Coletar 50 avaliações de um ID de produto B01GW3H3U8
        const reviews = await amazonScraper.reviews({ asin: 'B01GW3H3U8', number: 50 });

        // Coletar 50 avaliações de um ID de produto B01GW3H3U8 com classificação entre 1-2 estrelas
        const reviews_rank = await amazonScraper.reviews({ asin: 'B01GW3H3U8', number: 50, rating: [1, 2] });

        // Obter detalhes de um único produto usando o ID ASIN
        const product_by_asin = await amazonScraper.asin({ asin: 'B01GW3H3U8' });

        // Obter categorias da amazon.COM.AU
        const categories_AU = await amazonScraper.categories({ country: 'AU' });

        // Obter categorias da amazon.CN
        const categories_CN = await amazonScraper.categories({ country: 'CN' });
    } catch (error) {
        console.log(error);
    }
})();
```

### Saída de .products()

```javascript
[{
    position: { page: 1, position: 1, global_position: 1 },
    asin: 'B07CSLG8ST',
    price: {
        discounted: false,
        current_price: 574,
        currency: 'USD',
        before_price: 0,
        savings_amount: 0,
        savings_percent: 0
    },
    reviews: { total_reviews: 317, rating: 4.6 },
    url: 'https://www.amazon.com/dp/B07CSLG8ST',
    score: '1458.20',
    sponsored: false,
    amazonChoice: false,
    bestSeller: false,
    amazonPrime: false,
    title: 'Newest Flagship Microsoft Xbox One S 1TB HDD Bundle with Two (2X) Wireless Controllers, 1-Month Game Pass Trial, 14-Day Xbox Live Gold Trial - White',
    thumbnail: 'https://m.media-amazon.com/images/I/51-JAEI1jzL._AC_UY218_.jpg'
},...]
```

### Saída de .reviews()

```javascript
[{
    id: 'R3OZ9T0YATJ5UM',
    review_data: 'Reviewed in the United States on May 31, 2018',
    name: 'Danyelle Arbour',
    rating: 5,
    title: 'I would 100% suggest this to everyone.',
    review:
        'I love this. It just arrived today, I immediately plugged it ' +
        'into my computer and it has the best picture. My old webcam I ' +
        'got like 8 years ago and it was so pixellated then it suddenly ' +
        'was just white with pink streaks. I hopped on amazon because I ' +
        'really desperately needed a new cam but at a very tight budget ' +
        'and this one fit the bill. I would 100% suggest this to ' +
        'everyone. Very easy to adjust the angle and it sets up with ' +
        'zero effort.',
},...]
```

### Saída de .asin()

```javascript
{
    title: 'New Apple MacBook Pro (16-inch, 16GB RAM, 512GB Storage, 2.6GHz Intel Core i7) - Space Gray',
    description: '',
    feature_bullets: [
        'Ninth-generation 6-Core Intel Core i7 Processor',
        'Stunning 16-inch Retina Display with True Tone technology',
        'Touch Bar and Touch ID',
        'AMD Radeon Pro 5300M Graphics with GDDR6 memory',
        'Ultrafast SSD',
        'Intel UHD Graphics 630',
        'Six-speaker system with force-cancelling woofers',
        'Four Thunderbolt 3 (USB-C) ports',
        'Up to 11 hours of battery life',
        '802.11AC Wi-Fi',
    ],
    variants: [
        {
            asin: 'B081FWLDZ2',
            images: [
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/31Ky7oRBGtL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/31Ky7oRBGtL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/71UItVa0VmL._AC_SL1500_.jpg',
                    variant: 'MAIN',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/71UItVa0VmL._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/71UItVa0VmL._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/71UItVa0VmL._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/71UItVa0VmL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/71UItVa0VmL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/71UItVa0VmL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/71UItVa0VmL._AC_SX522_.jpg': ['522', '522'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/418onp2C2%2BL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/418onp2C2%2BL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/81p5n9MO4QL._AC_SL1500_.jpg',
                    variant: 'PT01',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/81p5n9MO4QL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/81p5n9MO4QL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/81p5n9MO4QL._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/81p5n9MO4QL._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/81p5n9MO4QL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/81p5n9MO4QL._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/81p5n9MO4QL._AC_SX466_.jpg': ['466', '466'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/51U4uOwYbUL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/51U4uOwYbUL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/91rcadsWWwL._AC_SL1500_.jpg',
                    variant: 'PT02',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/91rcadsWWwL._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/91rcadsWWwL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/91rcadsWWwL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/91rcadsWWwL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/91rcadsWWwL._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/91rcadsWWwL._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/91rcadsWWwL._AC_SX385_.jpg': ['385', '385'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/51MFgSmK%2B1L._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/51MFgSmK%2B1L._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/91dZ8gjhO9L._AC_SL1500_.jpg',
                    variant: 'PT03',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/91dZ8gjhO9L._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/91dZ8gjhO9L._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/91dZ8gjhO9L._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/91dZ8gjhO9L._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/91dZ8gjhO9L._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/91dZ8gjhO9L._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/91dZ8gjhO9L._AC_SX679_.jpg': ['679', '679'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/31tkOrl17nL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/31tkOrl17nL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/81-X9dGhCkL._AC_SL1500_.jpg',
                    variant: 'PT04',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/81-X9dGhCkL._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/81-X9dGhCkL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/81-X9dGhCkL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/81-X9dGhCkL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/81-X9dGhCkL._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/81-X9dGhCkL._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/81-X9dGhCkL._AC_SX385_.jpg': ['385', '385'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/21nvGq8dsRL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/21nvGq8dsRL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/71HU1BlSy7L._AC_SL1500_.jpg',
                    variant: 'PT05',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/71HU1BlSy7L._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/71HU1BlSy7L._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/71HU1BlSy7L._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/71HU1BlSy7L._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/71HU1BlSy7L._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/71HU1BlSy7L._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/71HU1BlSy7L._AC_SX679_.jpg': ['679', '679'],
                    },
                },
            ],
            title: 'Intel Core i7 512GB Silver',
            link: 'https://www.amazon.com/dp/B081FWLDZ2/?th=1&psc=1',
            is_current_product: false,
            price: '',
        },
        {
            asin: 'B081FZV45H',
            images: [
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/41S63IQRFXL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/41S63IQRFXL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/71pC69I3lzL._AC_SL1500_.jpg',
                    variant: 'MAIN',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/71pC69I3lzL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/71pC69I3lzL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/71pC69I3lzL._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/71pC69I3lzL._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/71pC69I3lzL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/71pC69I3lzL._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/71pC69I3lzL._AC_SX466_.jpg': ['466', '466'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/41UD%2B0RIxmL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/41UD%2B0RIxmL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/81aot0jAfFL._AC_SL1500_.jpg',
                    variant: 'PT01',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/81aot0jAfFL._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/81aot0jAfFL._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/81aot0jAfFL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/81aot0jAfFL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/81aot0jAfFL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/81aot0jAfFL._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/81aot0jAfFL._AC_SX425_.jpg': ['425', '425'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/51pODxHeboL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/51pODxHeboL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/91GRfDGDJIL._AC_SL1500_.jpg',
                    variant: 'PT02',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/91GRfDGDJIL._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GRfDGDJIL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GRfDGDJIL._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GRfDGDJIL._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GRfDGDJIL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GRfDGDJIL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GRfDGDJIL._AC_SX425_.jpg': ['425', '425'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/519Lka7j2EL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/519Lka7j2EL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/91GsCwayBPL._AC_SL1500_.jpg',
                    variant: 'PT03',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/91GsCwayBPL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GsCwayBPL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GsCwayBPL._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GsCwayBPL._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GsCwayBPL._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GsCwayBPL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GsCwayBPL._AC_SX425_.jpg': ['425', '425'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/31om7IXMIbL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/31om7IXMIbL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/81mJ-Mdc-OL._AC_SL1500_.jpg',
                    variant: 'PT04',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/81mJ-Mdc-OL._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/81mJ-Mdc-OL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/81mJ-Mdc-OL._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/81mJ-Mdc-OL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/81mJ-Mdc-OL._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/81mJ-Mdc-OL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/81mJ-Mdc-OL._AC_SX385_.jpg': ['385', '385'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/21HDW0eoP7L._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/21HDW0eoP7L._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/718Pz9bYxWL._AC_SL1500_.jpg',
                    variant: 'PT05',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/718Pz9bYxWL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/718Pz9bYxWL._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/718Pz9bYxWL._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/718Pz9bYxWL._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/718Pz9bYxWL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/718Pz9bYxWL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/718Pz9bYxWL._AC_SX522_.jpg': ['522', '522'],
                    },
                },
            ],
            title: 'Intel Core i7 512GB Space Gray',
            link: 'https://www.amazon.com/dp/B081FZV45H/?th=1&psc=1',
            is_current_product: true,
            price: '',
        },
        {
            asin: 'B081FTNGNC',
            images: [
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/31Ky7oRBGtL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/31Ky7oRBGtL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/71UItVa0VmL._AC_SL1500_.jpg',
                    variant: 'MAIN',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/71UItVa0VmL._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/71UItVa0VmL._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/71UItVa0VmL._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/71UItVa0VmL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/71UItVa0VmL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/71UItVa0VmL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/71UItVa0VmL._AC_SX522_.jpg': ['522', '522'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/418onp2C2%2BL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/418onp2C2%2BL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/81p5n9MO4QL._AC_SL1500_.jpg',
                    variant: 'PT01',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/81p5n9MO4QL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/81p5n9MO4QL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/81p5n9MO4QL._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/81p5n9MO4QL._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/81p5n9MO4QL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/81p5n9MO4QL._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/81p5n9MO4QL._AC_SX466_.jpg': ['466', '466'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/51U4uOwYbUL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/51U4uOwYbUL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/91rcadsWWwL._AC_SL1500_.jpg',
                    variant: 'PT02',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/91rcadsWWwL._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/91rcadsWWwL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/91rcadsWWwL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/91rcadsWWwL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/91rcadsWWwL._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/91rcadsWWwL._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/91rcadsWWwL._AC_SX385_.jpg': ['385', '385'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/51MFgSmK%2B1L._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/51MFgSmK%2B1L._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/91dZ8gjhO9L._AC_SL1500_.jpg',
                    variant: 'PT03',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/91dZ8gjhO9L._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/91dZ8gjhO9L._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/91dZ8gjhO9L._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/91dZ8gjhO9L._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/91dZ8gjhO9L._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/91dZ8gjhO9L._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/91dZ8gjhO9L._AC_SX679_.jpg': ['679', '679'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/31tkOrl17nL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/31tkOrl17nL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/81-X9dGhCkL._AC_SL1500_.jpg',
                    variant: 'PT04',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/81-X9dGhCkL._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/81-X9dGhCkL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/81-X9dGhCkL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/81-X9dGhCkL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/81-X9dGhCkL._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/81-X9dGhCkL._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/81-X9dGhCkL._AC_SX385_.jpg': ['385', '385'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/21nvGq8dsRL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/21nvGq8dsRL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/71HU1BlSy7L._AC_SL1500_.jpg',
                    variant: 'PT05',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/71HU1BlSy7L._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/71HU1BlSy7L._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/71HU1BlSy7L._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/71HU1BlSy7L._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/71HU1BlSy7L._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/71HU1BlSy7L._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/71HU1BlSy7L._AC_SX679_.jpg': ['679', '679'],
                    },
                },
            ],
            title: 'Intel Core i9 1TB Silver',
            link: 'https://www.amazon.com/dp/B081FTNGNC/?th=1&psc=1',
            is_current_product: false,
            price: '',
        },
        {
            asin: 'B081FV1Y57',
            images: [
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/41S63IQRFXL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/41S63IQRFXL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/71pC69I3lzL._AC_SL1500_.jpg',
                    variant: 'MAIN',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/71pC69I3lzL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/71pC69I3lzL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/71pC69I3lzL._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/71pC69I3lzL._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/71pC69I3lzL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/71pC69I3lzL._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/71pC69I3lzL._AC_SX466_.jpg': ['466', '466'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/41UD%2B0RIxmL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/41UD%2B0RIxmL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/81aot0jAfFL._AC_SL1500_.jpg',
                    variant: 'PT01',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/81aot0jAfFL._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/81aot0jAfFL._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/81aot0jAfFL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/81aot0jAfFL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/81aot0jAfFL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/81aot0jAfFL._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/81aot0jAfFL._AC_SX425_.jpg': ['425', '425'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/51pODxHeboL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/51pODxHeboL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/91GRfDGDJIL._AC_SL1500_.jpg',
                    variant: 'PT02',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/91GRfDGDJIL._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GRfDGDJIL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GRfDGDJIL._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GRfDGDJIL._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GRfDGDJIL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GRfDGDJIL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GRfDGDJIL._AC_SX425_.jpg': ['425', '425'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/519Lka7j2EL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/519Lka7j2EL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/91GsCwayBPL._AC_SL1500_.jpg',
                    variant: 'PT03',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/91GsCwayBPL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GsCwayBPL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GsCwayBPL._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GsCwayBPL._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GsCwayBPL._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GsCwayBPL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/91GsCwayBPL._AC_SX425_.jpg': ['425', '425'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/31om7IXMIbL._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/31om7IXMIbL._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/81mJ-Mdc-OL._AC_SL1500_.jpg',
                    variant: 'PT04',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/81mJ-Mdc-OL._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/81mJ-Mdc-OL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/81mJ-Mdc-OL._AC_SX522_.jpg': ['522', '522'],
                        'https://images-na.ssl-images-amazon.com/images/I/81mJ-Mdc-OL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/81mJ-Mdc-OL._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/81mJ-Mdc-OL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/81mJ-Mdc-OL._AC_SX385_.jpg': ['385', '385'],
                    },
                },
                {
                    large: 'https://images-na.ssl-images-amazon.com/images/I/21HDW0eoP7L._AC_.jpg',
                    thumb: 'https://images-na.ssl-images-amazon.com/images/I/21HDW0eoP7L._AC_SR38,50_.jpg',
                    hiRes: 'https://images-na.ssl-images-amazon.com/images/I/718Pz9bYxWL._AC_SL1500_.jpg',
                    variant: 'PT05',
                    main: {
                        'https://images-na.ssl-images-amazon.com/images/I/718Pz9bYxWL._AC_SX569_.jpg': ['569', '569'],
                        'https://images-na.ssl-images-amazon.com/images/I/718Pz9bYxWL._AC_SX385_.jpg': ['385', '385'],
                        'https://images-na.ssl-images-amazon.com/images/I/718Pz9bYxWL._AC_SX466_.jpg': ['466', '466'],
                        'https://images-na.ssl-images-amazon.com/images/I/718Pz9bYxWL._AC_SX425_.jpg': ['425', '425'],
                        'https://images-na.ssl-images-amazon.com/images/I/718Pz9bYxWL._AC_SX679_.jpg': ['679', '679'],
                        'https://images-na.ssl-images-amazon.com/images/I/718Pz9bYxWL._AC_SX342_.jpg': ['342', '342'],
                        'https://images-na.ssl-images-amazon.com/images/I/718Pz9bYxWL._AC_SX522_.jpg': ['522', '522'],
                    },
                },
            ],
            title: 'Intel Core i9 1TB Space Gray',
            link: 'https://www.amazon.com/dp/B081FV1Y57/?th=1&psc=1',
            is_current_product: false,
            price: '',
        },
    ],
    asin: 'B081FZV45H',
    url: 'https://www.amazon.com/dp/B081FZV45H',
    reviews: { total_reviews: 1224, rating: '4.6', answered_questions: 297 },
    price: { symbol: '$', currency: 'USD', current_price: 2149, discounted: true, before_price: 2399, savings_amount: 250, savings_percent: 10.42 },
    bestsellers_rank: [],
    main_image: 'https://images-na.ssl-images-amazon.com/images/I/41S63IQRFXL._AC_SY879_.jpg',
    total_images: 6,
    images: [
        'https://images-na.ssl-images-amazon.com/images/I/41S63IQRFXL._AC_SY879_.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/41UD%2B0RIxmL._AC_SY879_.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/51pODxHeboL._AC_SY879_.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/519Lka7j2EL._AC_SY879_.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/31om7IXMIbL._AC_SY879_.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/21HDW0eoP7L._AC_SY879_.jpg',
    ],
    total_videos: 0,
    videos: [],
    delivery_message: 'FREE delivery: Sunday, Sep 6Details',
    product_information: {
        dimensions: '9.68 x 14.09 x 0.64 inches',
        weight: '8.23 pounds',
        available_from: 'November 13, 2019',
        available_from_utc: '2019-11-12T23:00:00.000Z',
        available_for_months: 10,
        available_for_days: 291,
        manufacturer: 'Apple Computer',
        model_number: 'MVVJ2LL/A',
        department: '',
        sold_by: 'Amazon.com',
        fulfilled_by: 'Amazon.com',
        qty_per_order: 2,
        store_id: '',
        brand: 'Visit the Apple Store',
    },
    badges: { amazon_сhoice: true, amazon_prime: false },
};
```

### Saída de .categories()

```javascript
{
    aps: { name: 'All Departments', category: 'aps' },
    'arts-crafts-intl-ship': { name: 'Arts & Crafts', category: 'arts-crafts-intl-ship' },
    'automotive-intl-ship': { name: 'Automotive', category: 'automotive-intl-ship' },
    'baby-products-intl-ship': { name: 'Baby', category: 'baby-products-intl-ship' },
    'beauty-intl-ship': { name: 'Beauty & Personal Care', category: 'beauty-intl-ship' },
    'stripbooks-intl-ship': { name: 'Books', category: 'stripbooks-intl-ship' },
    'computers-intl-ship': { name: 'Computers', category: 'computers-intl-ship' },
    'digital-music': { name: 'Digital Music', category: 'digital-music' },
    'electronics-intl-ship': { name: 'Electronics', category: 'electronics-intl-ship' },
    'digital-text': { name: 'Kindle Store', category: 'digital-text' },
    'instant-video': { name: 'Prime Video', category: 'instant-video' },
    'fashion-womens-intl-ship': { name: "Women's Fashion", category: 'fashion-womens-intl-ship' },
    'fashion-mens-intl-ship': { name: "Men's Fashion", category: 'fashion-mens-intl-ship' },
    'fashion-girls-intl-ship': { name: "Girls' Fashion", category: 'fashion-girls-intl-ship' },
    'fashion-boys-intl-ship': { name: "Boys' Fashion", category: 'fashion-boys-intl-ship' },
    'deals-intl-ship': { name: 'Deals', category: 'deals-intl-ship' },
    'hpc-intl-ship': { name: 'Health & Household', category: 'hpc-intl-ship' },
    'kitchen-intl-ship': { name: 'Home & Kitchen', category: 'kitchen-intl-ship' },
    'industrial-intl-ship': { name: 'Industrial & Scientific', category: 'industrial-intl-ship' },
    'luggage-intl-ship': { name: 'Luggage', category: 'luggage-intl-ship' },
    'movies-tv-intl-ship': { name: 'Movies & TV', category: 'movies-tv-intl-ship' },
    'music-intl-ship': { name: 'Music, CDs & Vinyl', category: 'music-intl-ship' },
    'pets-intl-ship': { name: 'Pet Supplies', category: 'pets-intl-ship' },
    'software-intl-ship': { name: 'Software', category: 'software-intl-ship' },
    'sporting-intl-ship': { name: 'Sports & Outdoors', category: 'sporting-intl-ship' },
    'tools-intl-ship': { name: 'Tools & Home Improvement', category: 'tools-intl-ship' },
    'toys-and-games-intl-ship': { name: 'Toys & Games', category: 'toys-and-games-intl-ship' },
    'videogames-intl-ship': { name: 'Video Games', category: 'videogames-intl-ship' },
}
```

### Opções

```javascript
const options = {
    //Palavra-chave de pesquisa: {string padrão: ""}
    keyword: '',

    //Número de produtos para extrair: {int padrão: 10}
    number: 10,

    // Se {bulk} for definido como {false}, você só poderá extrair produtos por página. Note que {number} será ignorado
    // Muito útil se você precisar extrair produtos de uma página específica
    bulk: true,

    // Número da {page} do resultado da pesquisa
    // Você pode definir este valor para 5 e o scraper coletará todos os produtos a partir da {page} número 5
    page: 0,

    // Salvar resultado em um arquivo: {boolean padrão: ''}
    // Você pode definir ['json', 'csv', 'all', '']
    // 'all' - salvar resultado em arquivos JSON e CSV
    filetype: '',

    // Definir proxy: {string padrão: []}
    // Array de proxies. Se mais de 1, cada requisição http usará um proxy aleatório do array
    proxy: ['username:password@ip:port', 'username:password@ip:port'],

    //Ordenar por classificação. [minRating, maxRating]: {array padrão: [1,5]}
    rating: [1, 5],

    //Ordenação. Se estiver pesquisando um produto, a lista será ordenada por uma pontuação mais alta (número de avaliações*classificação). Se estiver pesquisando avaliações, elas serão ordenadas pela classificação.: {boolean padrão: false}
    sort: false,

    //Extrair apenas produtos com desconto: {boolean padrão: false}
    discount: false,

    //Extrair apenas produtos patrocinados: {boolean padrão: false}
    sponsored: false,

    //A Amazon é suportada em 16 países
    //A lista de todos os países está publicada abaixo
    //O valor deve estar no formato ISO 3166 (código Alpha-2)
    //{string padrão: "US"}
    country: 'GB',

    // Número de tarefas assíncronas {number padrão: 5}
    // Quanto mais, mais rápido, mas não exagere, pois geralmente 5 é suficiente
    asyncTasks: 5,

    //A pesquisa de produtos pode ser realizada na categoria específica
    //Para obter a lista de categorias, você pode usar o método .categories()
    category: 'digital-text',

    //Alguns metadados do produto estão vinculados ao CEP
    //Quando você define o CEP, uma nova sessão é gerada pela Amazon
    //Ao definir os valores dos cookies, você receberá dados mais precisos (preços, etc.)
    //Exemplo de cookie que pode ser extraído do navegador: session-id=222-22222-22222; session-id-time=222221l; ubid-main=444-4444-4444444
    cookie: '',

    //Randomizar versão do user agent. Isso ajuda a prevenir o bloqueio de requisições pelo lado da Amazon
    randomUa: false,

    //Tempo limite entre requisições. O tempo limite é definido em ms: 1000 ms = 1 segundo
    timeout: 0,
};
```

### Lista de países suportados

```javascript
{
    US: {
        country: 'Estados Unidos da América',
        currency: 'USD',
        host: 'www.amazon.com',
    },
    AU: {
        country: 'Austrália',
        currency: 'AUD',
        host: 'www.amazon.com.au',
    },
    BR: {
        country: 'Brasil',
        currency: 'BRL',
        host: 'www.amazon.com.br',
    },
    CA: {
        country: 'Canadá',
        currency: 'CAD',
        host: 'www.amazon.ca',
    },
    CN: {
        country: 'China',
        currency: 'CNY',
        host: 'www.amazon.cn',
    },
    FR: {
        country: 'França',
        currency: 'EUR',
        host: 'www.amazon.fr',
    },
    DE: {
        country: 'Alemanha',
        currency: 'EUR',
        host: 'www.amazon.de',
    },
    IN: {
        country: 'Índia',
        currency: 'INR',
        host: 'www.amazon.in',
    },
    IT: {
        country: 'Itália',
        currency: 'EUR',
        host: 'www.amazon.it',
    },
    MX: {
        country: 'México',
        currency: 'MXN',
        host: 'www.amazon.com.mx',
    },
    NL: {
        country: 'Holanda',
        currency: 'EUR',
        host: 'www.amazon.nl',
    },
    SG: {
        country: 'Singapura',
        currency: 'SGD',
        host: 'www.amazon.sg',
    },
    ES: {
        country: 'Espanha',
        currency: 'EUR',
        host: 'www.amazon.es',
    },
    TR: {
        country: 'Turquia',
        currency: 'TRY',
        host: 'www.amazon.com.tr',
    },
    AE: {
        country: 'Emirados Árabes Unidos',
        currency: 'AED',
        host: 'www.amazon.ae',
    },
    GB: {
        country: 'Reino Unido',
        currency: 'GBP',
        host: 'www.amazon.co.uk',
    },
    JP: {
        country: 'Japão',
        currency: 'JPY',
        host: 'www.amazon.jp',
    },
}
```

---

## Licença

**MIT**

**Software Livre**
