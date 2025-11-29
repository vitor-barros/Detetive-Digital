# Detetive Digital  
**Sistema universitário de prevenção a fraudes digitais**

![Status](https://img.shields.io/badge/status-MVP-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Tech](https://img.shields.io/badge/stack-TypeScript%20%7C%20React%20%7C%20Gemini-blueviolet)

---

## 🌐 Sobre o Projeto

O **Detetive Digital** é um MVP criado para um projeto universitário com o objetivo de **prevenir fraudes digitais** e ajudar **idosos e usuários iniciantes** a identificar links ou mensagens potencialmente perigosos.

O sistema analisa qualquer texto inserido pelo usuário e indica se é **seguro**, **suspeito** ou **fraudulento**, usando inteligência artificial para gerar explicações curtas e acessíveis.

---

## ✨ Funcionalidades Principais

- Análise de links suspeitos  
- Avaliação de mensagens e textos  
- Classificação inteligente usando a API Gemini  
- Feedback simples e direto, focado em acessibilidade  
- Interface leve e rápida em React  
- Sem coleta de dados pessoais (MVP focado em privacidade)

---

## 🧰 Tecnologias Utilizadas

| Tecnologia   | Uso |
|--------------|-----|
| **TypeScript** | Tipagem e segurança |
| **React** | Interface do usuário |
| **Gemini API** | Análise de conteúdo |
| **Vite / Next.js** | Ambiente rápido de desenvolvimento |
---

## 📦 Como Rodar o Projeto

```bash
# 1. Instalar dependências
npm install

# 2. Criar o arquivo .env com sua chave
echo "GEMINI_API_KEY=SUA_CHAVE_AQUI" > .env

# 3. Rodar em modo desenvolvimento
npm run dev
