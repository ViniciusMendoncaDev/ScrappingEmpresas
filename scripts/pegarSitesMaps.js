import puppeteer from 'puppeteer';
import { pegarEmailsSites} from './acessaSitesPegaEmail.js';
import informacoesEmpresas from '../model/InformacoesEmpresasModel.js';


var navegadorInstancia = ''
var abaNavegador = ''

async function pegaLinksSitesMaps(busca, cidade) {
    
    var urlMaps = "https://www.google.com/search?sca_esv=2dd386abfc4b3461&rlz=1C1CHZN_pt-BRBR965BR965&tbm=lcl&sxsrf=ADLYWIInbJcyqWvslvgtaU5asf7kdT10nA:1735909773622&q=" + busca + "+" + cidade + "&rflfq=1&num=10&sa=X&sqi=2&ved=2ahUKEwiOz6zrz9mKAxVZq5UCHWa4NT4QjGp6BAhIEAE&biw=1366&bih=633&dpr=1#rlfi=hd:;si:;mv:[[-21.9175218,-50.5025309],[-21.939049999999998,-50.5269139]];tbs:lrf:!1m4!1u3!2m2!3m1!1e1!1m4!1u2!2m2!2m1!1e1!2m1!1e2!2m1!1e3!3sIAE,lf:1,lf_ui:2"
    await estanciaNavegadorEPagina()

    var listalinksPegos = []

    const linksPrimeiraPag =  await processaPrimeiraPaginaMaps(abaNavegador, listalinksPegos, urlMaps)
    listalinksPegos = linksPrimeiraPag 

    var linksPaginacaoMaps = await extrairLinksPaginacaoMaps(urlMaps)

    console.log("linksPaginacaoMaps")
    console.log(linksPaginacaoMaps)


    var linksTodasPaginas = await pegarLinksTodasPaginas(linksPaginacaoMaps, listalinksPegos)
    console.log("linksTodasPaginas")
    console.log(linksTodasPaginas)

    listalinksPegos = linksTodasPaginas

    var emails = await pegarEmailsSites(listalinksPegos);

    await navegadorInstancia.close();
     
    var arrayDocumentoFormatado = formatarArrayDocumento(emails, busca, cidade)

    var statusDadosSalvos = await salvarDocumentoFormatado(arrayDocumentoFormatado)

    return {status:"true", msg: statusDadosSalvos}
}


async function extrairLinksPaginacaoMaps(urlMaps) { 

    await estanciaNavegadorEPagina()
    await abaNavegador.goto(urlMaps, { waitUntil: "domcontentloaded" });

    var result = await pegaLinksTabelaPaginacao(abaNavegador)
   
    result.pop();

    await navegadorInstancia.close();
    return result
}


async function pegaLinksTabelaPaginacao(abaNavegador) {  
    await abaNavegador.waitForSelector("table");

    return abaNavegador.evaluate(() => {
        
        const linhasTabela = document.querySelectorAll("table tbody tr");

        var result = [];

        linhasTabela.forEach((linha) => {
            const colunasTabela = linha.querySelectorAll("td");

            colunasTabela.forEach((coluna) => {
                const elementosTagA = coluna.querySelectorAll("a");

                elementosTagA.forEach((elementoTagA) => {
                    result.push(elementoTagA.href);
                });
            });
        });
        
        return result;
    });
}


async function pegarLinksTodasPaginas(linksPaginacaoMaps, listalinksPegos) {
    await estanciaNavegadorEPagina();
    var pag = 2; 
    var result = [...listalinksPegos]; 

    for (const linkPaginacaoMaps of linksPaginacaoMaps) {
        try {
            await abaNavegador.goto(linkPaginacaoMaps, { waitUntil: 'domcontentloaded', timeout: 20000 });
        } catch (error) {
            console.error("Erro ao acessar a URL do Google Maps:", error.message);
            await abaNavegador.close();
            process.exit(1); 
        }

        const linksSitesPegos = await percorreLinksDosSitesNaPagina(abaNavegador);
        result = result.concat(linksSitesPegos);
        pag += 1; 
    }
    
    return result;
}

async function estanciaNavegadorEPagina(){ 
    navegadorInstancia = await puppeteer.launch({ headless: false, ignoreHTTPSErrors: true });
    abaNavegador = await navegadorInstancia.newPage();

    await abaNavegador.authenticate({
        username: '',  
        password: '',  
    });
}

async function processaPrimeiraPaginaMaps(abaPrimeiraPagina, listalinksPegos, urlMaps) { //top
    try {
        await abaPrimeiraPagina.goto(urlMaps, { waitUntil: 'domcontentloaded', timeout: 20000 });

        const linksPrimeiraPagina = await percorreLinksDosSitesNaPagina(abaPrimeiraPagina);
        var result = listalinksPegos.concat(linksPrimeiraPagina);
        await abaPrimeiraPagina.close();


        return result
    } catch (error) {
        console.error("Erro ao acessar a primeira página do Google Maps:", error.message);
        await abaPrimeiraPagina.close();

        exit;

    }
}


async function percorreLinksDosSitesNaPagina(abaNavegador) {
    var indiceDivSites = 2
    const indiceMaximo = 60
    var listalinksSitesPegos = []
    console.log("1")

    while (indiceDivSites <= indiceMaximo) {
        let FullXPathDivSite = `/html/body/div[2]/div/div[7]/div[1]/div/div[2]/div[2]/div/div/div/div/div/div/div/div/div[1]/div[3]/div[${indiceDivSites}]/div[2]/div/a[1]`;

        try {
            const linkSite = await abaNavegador.evaluate((xpath) => {
                const consultaLink = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                return consultaLink ? consultaLink.href : null;
            }, FullXPathDivSite);

            var linkValido = await removeLinksInvalidos(linkSite)

            if (linkValido) {
                listalinksSitesPegos.push(linkValido)
            }

        } catch (error) {
            console.log(`Erro ao buscar o link para o índice ${indiceDivSites}: ${error.message}`);
        }

        indiceDivSites += 2;
    }

    console.log(listalinksSitesPegos)
    return listalinksSitesPegos
}


async function removeLinksInvalidos(linkSite) { //top
    const dominiosInvalidos = ["google", "facebook", "youtube", "instagram"];

    if (linkSite && !dominiosInvalidos.some((dominio) => linkSite.includes(dominio))) {
        return linkSite
    }
}

function formatarArrayDocumento(arrayDocumento, busca, cidade){
    var result = []
     arrayDocumento.forEach(info => {
        var titulos = info.texto.titulos
        var paragrafos = info.texto.paragrafos
        var titulosConcatenados = ""
        var paragrafosConcatenados = ""

        titulos.forEach(titulo => {
            titulosConcatenados += titulo
        })

        paragrafos.forEach(paragrafo => {
            paragrafosConcatenados += paragrafo
        })

        result.push({titulos: titulosConcatenados, paragrafos: paragrafosConcatenados, email:info.emails, site:info.site, busca:busca, cidade:cidade })
        
     });

     return result
    
}

async function salvarDocumentoFormatado(arrayDocumento){
    var status = false
    var dadosSalvos =  {sucesso:0, erro:0}
    for (const info of arrayDocumento) {
        status = await informacoesEmpresas.salvar(info.titulos, info.paragrafos, info.email[0], info.site, info.busca, info.cidade )
         if(status){
             dadosSalvos.sucesso += 1
         } else{
             dadosSalvos.erro += 1
         }
    }
    return `Sucesso!! ${dadosSalvos.sucesso} dados salvos. ${dadosSalvos.erro} falhas ao salvar` 

} 

export default pegaLinksSitesMaps




