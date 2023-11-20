import { createServer, IncomingMessage, ServerResponse } from "node:http";
import url from "node:url";
import { readFileSync } from "node:fs";

const port = 3000;
const host = "localhost";

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
    const u = url.parse(req.url!, true);
    // console.log(u);
    // const queryString = u.query;
    const nome = u.query.nome as string;

    // res.write("Richiesta ricevuta all'url: " + req.method + " " + req.url);
    // res.end();

    try {
        // console.log(u.pathname);
        switch (u.pathname) {
            case "/":
                res.writeHead(200, { "Content-Type": "text/html" });
                res.write("<html><head><title>Ciao!</title></head><body><h1>Ciao [[nome]]!</h1></body></html>".replace("[[nome]]", nome));
                res.end();
                break;
            case "/welcome":
                res.writeHead(200, { "Content-Type": "text/html" });
                let html = readFileSync("./templates/welcome.html", { encoding: "utf8" });
                res.write(html.replace("{{name}}", nome ?? "pippo"));
                res.end();
                break;
            case "/api/v2/mario":
                const mario = {
                    nome: "Mario",
                    cognome: "Verdi"
                }

                res.writeHead(200, { "Content-Type": "application/json" })
                res.end(JSON.stringify(mario, null, 2));
                break;
            case "/ng":
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(readFileSync("./templates/index.html", { encoding: "utf8" }));
                break;
            default:
                res.writeHead(404);
                res.end("Pagine non trovata");
                break;
        }
    } catch (error) {
        console.error(error);
        res.writeHead(500);
        res.end("Errore del server. Contatta l'amministratore di sistema.");
    }
}

// creo il server
const server = createServer(requestListener);

// do vita al server
server.listen(port, host, () => console.log(`Server in ascolto su http://${host}:${port}`));