# cazu-site

Site institucional da Cazú Projetos e Construções (regularização de imóveis — São Carlos/SP).

## Estrutura

```
cazu-site/
├── index.html
├── README.md
└── assets/
    ├── css/
    │   └── styles.css
    ├── js/
    │   └── main.js
    └── img/
        ├── logo-cazu.png        ← copie seu logo atual aqui (já usado no favicon e header)
        ├── hero-illustration.svg ← ilustração criada, pode editar as cores/textos no próprio SVG
        └── selo-cazu.svg         ← selo/marca secundária, criado, reutilizável em outras peças
```

## Como publicar

1. Crie o repositório `cazu-site` no GitHub e suba essa pasta como está.
2. Copie `logo-cazu.png` (o logo que você já usa) para `assets/img/`.
3. Para o domínio próprio (`cazu.com.br`):
   - **GitHub Pages:** ative em *Settings → Pages*, branch `main`, pasta raiz; crie um arquivo `CNAME` na raiz com o conteúdo `cazu.com.br` e aponte o DNS do domínio para o GitHub Pages.
   - **Outro servidor:** suba o conteúdo da pasta `cazu-site/` (mantendo a estrutura de `assets/`) via FTP/painel do seu provedor atual.

## Fotos reais (opcional)

A versão atual usa ilustrações em SVG (sem depender de banco de imagens) para evitar qualquer problema de licença. Se quiser trocar por fotos:

- Busque em bancos gratuitos como **Unsplash** ou **Pexels** por termos como: `blueprint architecture`, `engineer reviewing documents`, `notary stamp`, `real estate paperwork`, `house floor plan`.
- Baixe e salve em `assets/img/` (ex: `hero-foto.jpg`).
- No `index.html`, troque o `src="assets/img/hero-illustration.svg"` pelo caminho da nova foto.

## Formulário

O formulário de contato envia os dados para o mesmo endpoint Power Automate já configurado (meta tag `flow-endpoint` no `<head>`), e usa a API pública do ViaCEP para autocompletar endereço a partir do CEP — nenhuma mudança de backend é necessária.
