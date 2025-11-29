
// Spanish Verbs (General / Latin America focus)
export const COMMON_VERBS_ES = [
  // --- TOP 100 ESSENTIAL ---
  "ser", "estar", "tener", "haber", "hacer", "ir", "decir", "poder", "ver", "dar",
  "saber", "querer", "quedar", "deber", "pasar", "venir", "llegar", "hablar", "dejar",
  "creer", "llevar", "empezar", "parecer", "entender", "necesitar", "andar", "pedir",
  "pensar", "sentir", "conocer", "volver", "mirar", "traer", "escribir", "esperar",
  "caer", "perder", "oír", "entrar", "ganar", "recordar", "comer", "trabajar",
  "morir", "vivir", "llamar", "creer", "aparecer", "parar", "abrir", "recibir",
  "terminar", "servir", "sacar", "jugar", "conseguir", "cambiar", "leer", "aprender",
  "ayudar", "subir", "bajar", "pagar", "gustar", "dormir", "viajar", "jugar",
  "comprar", "vender", "beber", "correr", "estudiar", "cantar", "bailar", "olvidar",
  "usar", "intentar", "mostrar", "preferir", "mandar", "aceptar", "decidir",
  "responder", "encontrar", "buscar", "explicar", "participar", "visitar",
  "almorzar", "cenar", 

  // --- ACTIONS & MOVEMENT ---
  "caminar", "saltar", "brincar", "bucear", "nadar", "flotar", "volar", "planear",
  "aterrizar", "despegar", "manejar", "conducir", "pilotar", "navegar", "estacionar", "frenar",
  "acelerar", "chocar", "atropellar", "cruzar", "atravesar", "seguir", "guiar",
  "acompañar", "perseguir", "huir", "escapar", "desaparecer", "regresar",
  "partir", "permanecer", "continuar", "estancar", "avanzar", "retroceder", "retornar",
  "salir", "acercar", "alejar", "desviar", "resbalar", "tropezar", "arrastrar",

  // --- PHYSICAL INTERACTION ---
  "tomar", "agarrar", "soltar", "sujetar", "empujar", "tirar", "jalar",
  "levantar", "bajar", "agachar", "acostar", "sentar", "arrodillar", "inclinar",
  "virar", "girar", "rodar", "mover", "tocar", "apoyar", "apretar",
  "aflojar", "aplastar", "rasgar", "agujerear", "pegar", "atar",
  "desatar", "envolver", "desenvolver", "cubrir", "descubrir", "tapar",
  "destapar", "llenar", "vaciar", "derramar", "esparcir", "juntar", "reunir",
  "mezclar", "separar", "dividir", "partir", "romper", "golpear", "sacudir",

  // --- COMMUNICATION & THOUGHT ---
  "conversar", "dialogar", "chismear", "susurrar", "gritar", "vociferar",
  "pronunciar", "deletrear", "traducir", "interpretar", "resumir", "describir",
  "narrar", "contar", "informar", "avisar", "comunicar", "anunciar", "declarar",
  "afirmar", "negar", "contestar", "cuestionar", "preguntar", "indagar", "dudar",
  "sospechar", "desconfiar", "confiar", "prometer", "jurar", "mentir", "engañar",
  "ilusionar", "convencer", "persuadir", "aconsejar", "sugerir", "recomendar",
  "criticar", "elogiar", "agradecer", "disculpar", "perdonar", "ofender", "insultar",
  "amenazar", "acordar", "concordar", "discrepar", "discutir", "debatir", "pelear",

  // --- EMOTIONS & FEELINGS ---
  "amar", "odiar", "adorar", "detestar", "gustar", "apasionar", "encantar",
  "admirar", "envidiar", "celar", "despreciar", "humillar", "respetar", "valorar",
  "considerar", "ignorar", "molestar", "irritar", "incomodar", "estorbar",
  "perturbar", "calmar", "tranquilizar", "consolar", "animar", "desanimar",
  "alegrar", "entristecer", "llorar", "sonreír", "reír", "carcajear", "suspirar",
  "temblar", "escalofriar", "sudar", "transpirar", "sonrojar", "palidecer", "asustar",
  "temer", "recelar", "preocupar", "estresar", "relajar", "descansar", "aprovechar",

  // --- WORK, BUSINESS & STUDY ---
  "emplear", "despedir", "contratar", "gestionar", "liderar", "organizar", "planear", "planificar",
  "ejecutar", "evaluar", "calcular", "medir", "pesar", "negociar", "firmar",
  "sellar", "archivar", "imprimir", "copiar", "escanear", "enviar", "recibir",
  "atender", "llamar", "telefonear", "marcar", "agendar", "cancelar", "posponer",
  "presentar", "exponer", "resolver", "solucionar", "invertir", "gastar", "economizar",
  "ahorrar", "lucrar", "facturar", "cobrar", "prestar", "alquilar", "rentar", "comercializar",
  "exportar", "importar", "fabricar", "producir", "crear", "inventar", "innovar",
  "investigar", "analizar", "observar", "examinar", "probar", "aprobar",
  "reprobar", "entrenar", "capacitar", "enseñar", "educar", "instruir", "orientar",

  // --- HOUSEHOLD & DAILY ROUTINE ---
  "despertar", "levantar", "cepillar", "peinar", "afeitar", "maquillar",
  "vestir", "calzar", "abotonar", "desabotonar", "cambiar", "arreglar", "desordenar",
  "ensuciar", "limpiar", "lavar", "secar", "planchar", "doblar", "guardar", "barrer",
  "fregar", "aspirar", "quitar", "sacudir", "pulir", "encerar", "cocinar",
  "asar", "freír", "hervir", "saltear", "condimentar", "probar", "saborear",
  "masticar", "tragar", "alimentar", "nutrir", "servir", "ofrecer", "verter",

  // --- NATURE & ENVIRONMENT ---
  "llover", "nevar", "ventear", "tronar", "relampaguear", "amanecer", "atardecer",
  "anochecer", "oscurecer", "aclarar", "brillar", "iluminar", "apagar", "quemar",
  "arder", "explotar", "estallar", "soplar", "fluir", "escurrir", "gotear",
  "inundar", "secar", "marchitar", "brotar", "florecer", "crecer", "madurar",
  "pudrir", "cosechar", "plantar", "sembrar", "regar", "podar", "cortar",

  // --- SOCIAL & LEISURE ---
  "celebrar", "festejar", "conmemorar", "brindar", "invitar", "reunir", "encontrar",
  "salir", "pasear", "divertir", "entretener", "jugar", "apostar", "competir",
  "vencer", "ganar", "perder", "empatar", "entrenar", "ejercitar",

  // --- ABSTRACT & LOGICAL ---
  "existir", "suceder", "ocurrir", "pasar", "realizar", "volver", "transformar",
  "cambiar", "alterar", "modificar", "evolucionar", "progresar", "mejorar", "empeorar",
  "aumentar", "disminuir", "reducir", "crecer", "encoger", "expandir", "extender",
  "durar", "tardar", "adelantar", "atrasar", "anticipar", "prever",
  "suponer", "imaginar", "soñar", "fantasear", "inventar", "crear", "destruir",
  "construir", "demoler", "reformar", "arreglar", "reparar", "restaurar",

  // --- SENSORY ---
  "ver", "mirar", "observar", "espiar", "vigilar", "oír", "escuchar", "oler",
  "tocar", "sentir", "palpar", "saborear", "degustar", "probar", "percibir", "notar", "reparar", "identificar", "reconocer",

  // --- MISC USEFUL VERBS ---
  "bastar", "importar", "interesar", "costar", "valer", "pesar", "medir", "oler",
  "sonar", "parecer", "significar", "representar", "simbolizar", "indicar", "mostrar"
];
