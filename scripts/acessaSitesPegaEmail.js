import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

async function pegarEmailsSites(sites) {
  const navegadorInstancia = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
  });

  const emails = await Promise.all(
    sites.map(async (site) => {
      const abaNavegador = await navegadorInstancia.newPage();
      await abaNavegador.authenticate({
        username: "",
        password: "",
      });

      try {
        abaNavegador.on("error", (err) => {
          console.log("Erro de navegação, ignorando:", err.message);
        });

        abaNavegador.on("console", (msg) => {
          if (msg.type() === "error") {
            console.log("Erro de console, ignorando:", msg.text());
          }
        });

        await abaNavegador.setRequestInterception(true);
        abaNavegador.on("request", (request) => {
          if (
            ["image", "stylesheet", "font"].includes(request.resourceType())
          ) {
            request.abort(); 
          } else {
            request.continue(); 
          }
        });

        console.log(`Acessando site: ${site}`);

        var emails = await buscarEmailsSite(site, abaNavegador);

        if (emails == "" || emails == undefined) {
          return [];
        } else {
          var texto = await buscarTextosSite(site, abaNavegador);
          return { texto: texto, emails: emails, site: site };
        }
        
      } catch (error) {
        console.error(`Erro ao acessar o site ${site}: ${error.message}`);
        return [];
      } finally {
        await abaNavegador.close();
      }
    })
  );

  await navegadorInstancia.close();
  return emails.flat();
}


async function buscarEmailsSite(site, abaNavegador) {
  try {
    await abaNavegador.goto(site, {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });

    return await abaNavegador.evaluate(() => {
      const textoBody = document.body.innerText;
      const regex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
      return textoBody.match(regex) || [];
    });
  } catch (error) {
    console.error("Erro ao buscar emails do site:", error);
    return [];
  }
}

async function buscarTextosSite(site, abaNavegador) {
  try {
    await abaNavegador.goto(site, {
      waitUntil: "domcontentloaded",
      0: 6000000000,
    });

    return await abaNavegador.evaluate(() => {
      const titulos = Array.from(document.querySelectorAll("h2")).map((el) =>
        el.textContent.trim()
      );
      const paragrafos = Array.from(document.querySelectorAll("p")).map((el) =>
        el.textContent.trim()
      );

      return {
        titulos: titulos,
        paragrafos: paragrafos,
      };
    });
  } catch (error) {
    console.error(`Erro ao buscar textos do site ${site}:`, error);
    return { titulos: [], paragrafos: [] }; // Retorna um objeto vazio em caso de erro
  }
}

export { pegarEmailsSites};
