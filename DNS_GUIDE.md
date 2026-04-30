# Guida Configurazione Dominio e SSL per dream-3d.com

Questa guida ti aiuta a risolvere l'errore "La connessione non è privata" e a configurare correttamente il dominio su Shopify.

## 1. Configurazione DNS (presso il tuo provider di dominio)

Accedi al pannello di controllo dove hai acquistato il dominio (es. Aruba, GoDaddy, Namecheap, Google Domains) e modifica i record DNS come segue:

### Record A (Punta al dominio principale)
- **Host/Nome:** `@` (o lascia vuoto)
- **Tipo:** `A`
- **Valore/Destinazione:** `23.227.38.65`
- **TTL:** 3600 (o 1 ora)

> **Importante:** Elimina qualsiasi altro Record A che non punti a questo indirizzo IP.

### Record CNAME (Punta al sottodominio www)
- **Host/Nome:** `www`
- **Tipo:** `CNAME`
- **Valore/Destinazione:** `shops.myshopify.com`
- **TTL:** 3600

---

## 2. Verifica su Shopify

Dopo aver modificato i DNS (può richiedere da pochi minuti a 24 ore per propagarsi):

1. Vai su **Shopify Admin** > **Impostazioni** (in basso a sinistra) > **Domini**.
2. Clicca sul tuo dominio `dream-3d.com`.
3. Se vedi un messaggio "SSL in sospeso" (SSL Pending), è normale. Aspetta qualche ora.
4. Se vedi "Dominio non connesso", clicca su **Verifica connessione**.

## 3. Risoluzione Problemi Comuni

### Errore "La connessione non è privata"
Questo errore appare quando il certificato SSL non è ancora attivo.
- **Causa:** I DNS sono appena stati cambiati o Shopify sta ancora generando il certificato.
- **Soluzione:** Aspetta 24 ore. Se persiste, contatta il supporto Shopify o prova a rimuovere e riaggiungere il dominio nel pannello Shopify.

### Errore "Redirect Loop"
- **Causa:** Hai impostato il redirect sia su Shopify che sul provider del dominio.
- **Soluzione:** Assicurati che il redirect da `http` a `https` sia gestito SOLO da Shopify (è automatico).

---

## 4. Verifica Finale
Visita `https://dream-3d.com` e `https://www.dream-3d.com`. Entrambi dovrebbero caricare il sito senza errori e mostrare il lucchetto di sicurezza nel browser.
