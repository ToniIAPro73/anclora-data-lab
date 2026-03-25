# Anclora Data Lab: investigación exhaustiva para el documento maestro de especificaciones

**Anclora Data Lab tiene ante sí una ventana de oportunidad única en el mercado PropTech europeo.** No existe actualmente ninguna plataforma de inteligencia inmobiliaria dedicada al segmento residencial de lujo en mercados resort como Baleares. Mientras plataformas como CASAFARI y PriceHubble dominan el espacio generalista europeo, y las grandes marcas de lujo (Engel &amp; Völkers, Sotheby's) generan informes propietarios sin acceso digital interactivo, ningún competidor ofrece analítica institucional interactiva focalizada en inversores HNWI del mercado balear. Con precios que han subido un **45-50% en cinco años** y una oferta de propiedades de lujo que ha caído del 17% al **menos del 4% del inventario total**, el mercado necesita una herramienta de inteligencia de grado institucional accesible.

Este informe consolida la investigación necesaria para fundamentar el documento maestro de especificaciones técnicas y de producto de Anclora Data Lab, abarcando siete áreas críticas: el panorama competitivo, las fuentes de datos disponibles, las métricas que demandan los inversores, los modelos de monetización óptimos, las tendencias PropTech relevantes, el estado del mercado balear y los requisitos funcionales de referencia.

---

## 1. Panorama competitivo: un mercado fragmentado sin líder en lujo residencial

El ecosistema de plataformas de inteligencia inmobiliaria presenta una fragmentación notable entre soluciones institucionales globales y herramientas locales españolas, con una brecha evidente en el segmento residencial de lujo.

**A nivel global**, MSCI Real Assets (anteriormente Real Capital Analytics) domina la inteligencia de flujos de capital con datos de transacciones en **más de 170 países** y $50 billones en transacciones CRE, pero opera exclusivamente a nivel institucional/comercial con precios enterprise no publicados. CoStar Group controla aproximadamente el **70% de cuota de mercado** entre usuarios institucionales CRE en EE.UU./UK, con licencias de **$3.000-$12.000+/año por usuario**, pero carece de cobertura en mercados residenciales europeos. Mashvisor ofrece el modelo más cercano al que Anclora persigue — análisis de inversión residencial con scoring algorítmico ("Mashmeter"), comparativas STR vs. LTR, y mapas de calor — pero está limitado exclusivamente al mercado estadounidense con precios de **$49,99-$99,99/mes**.

**PriceHubble** destaca como el líder europeo en AVMs (Automated Valuation Models) con presencia en 11 países y **más de 800 empresas clientes**. Su arquitectura de regresión multi-spline, certificación ISO 27001 y reciente lanzamiento de AI Agents Suite (Companion, Copilot, Autopilot) y Model Context Protocol representan el estado del arte en PropTech europeo. Sin embargo, PriceHubble opera exclusivamente B2B para bancos e instituciones financieras, sin interfaz directa para inversores individuales.

**En el mercado español**, la fragmentación es particularmente aguda. CASAFARI es la plataforma de datos inmobiliarios más completa de Europa con **más de 200 millones de listings** en 20+ países, deduplicación inteligente y API unificada. Es utilizada por Engel &amp; Völkers y Sotheby's en Baleares, lo que la convierte en el competidor más directo. Idealista domina los datos de portal con la mayor base de listings activos en España, aunque solo ofrece precios de demanda (asking prices), no transacciones reales. Tinsa Digital proporciona datos de tasación desde 1985 con un índice de referencia para el mercado residencial español. Brainsre se autodenomina "el Bloomberg del inmobiliario" con analítica predictiva big data, modelo freemium y cobertura nacional.

La conclusión competitiva es contundente: **no existe ninguna plataforma dedicada que combine inteligencia de mercado interactiva, scoring de oportunidades y analítica de grado institucional para el segmento residencial de lujo** en mercados resort europeos. Las firmas de lujo publican informes PDF estáticos; las plataformas de datos cubren el mercado generalista. Anclora Data Lab puede ocupar este espacio vacante.

| Plataforma | Geografía | Lujo | Balear | Modelo | Precio referencia |
|------------|-----------|------|--------|--------|-------------------|
| MSCI Real Assets | Global (170+ países) | No | Macro | Enterprise | Custom ($$$$) |
| CoStar | EE.UU./UK | No | No | Enterprise | $3K-$12K+/año |
| PriceHubble | Europa (11 países) | No | Parcial | B2B SaaS/API | Custom |
| CASAFARI | Europa (20+ países) | Vía partners | **Sí** | Suscripción + API | Custom (mid) |
| Idealista/Data | España/PT/IT | No | **Sí** | B2B suscripción | Custom |
| Tinsa Digital | España | No | **Sí** | B2B licensing | Custom |
| Brainsre | España | No | **Sí** | Freemium + suscripción | Free explorer + paid |
| Mashvisor | Solo EE.UU. | No | No | Tiered suscripción | $50-$100/mes |
| **Anclora Data Lab** | **Baleares → Mediterráneo** | **Sí** | **Core** | **Freemium premium** | **TBD** |

---

## 2. Fuentes de datos: un pipeline robusto con acceso gratuito a datos críticos

La investigación identifica **más de 20 fuentes de datos explotables** para el mercado balear, organizadas en cuatro capas de integración prioritaria.

**Capa 1 — Fundamento (datos core, APIs disponibles, gratuitos):** El Catastro ofrece datos a nivel de propiedad con APIs REST/SOAP gratuitas, bulk downloads en formato CAT/Shapefile y servicios INSPIRE WFS/WMS. Librerías Python (`pycatastro`) facilitan la integración. Cubre el 100% de las propiedades pero excluye valores catastrales y titularidad de las descargas públicas. El **Portal Estadístico del Notariado** (penotariado.com, lanzado octubre 2025) es la fuente más valiosa y subestimada: proporciona **precios reales de transacción** a nivel de código postal con 12+ años de histórico, desglose por nacionalidad de compradores y datos de hipotecas — todo gratuito con registro. Es metodológicamente superior a los precios de demanda de portales. El INE aporta el Índice de Precios de Vivienda trimestral, estadísticas de hipotecas mensuales y transmisiones de propiedad, todo accesible vía API JSON. IBESTAT proporciona la granularidad insular (Mallorca vs. Ibiza vs. Menorca) que ninguna otra fuente nacional ofrece, incluyendo un nuevo **Observatorio de la Vivienda** con cinco bloques de datos y encuesta a más de 4.000 hogares.

**Capa 2 — Inteligencia de mercado:** Idealista ofrece API oficial (acceso controlado, requiere aprobación) para datos de listings en tiempo real. Engel &amp; Völkers genera el informe más completo del segmento de lujo balear con datos propietarios de ~500 transacciones anuales y €838M de facturación en 2024. AirDNA cubre analítica de alquiler vacacional con **~2.844 propiedades rastreadas en Palma** (60% ocupación, $282 ADR) y API disponible con precios enterprise. La AETIB publica estadísticas turísticas mensuales con datos de llegadas, gasto y ocupación por isla.

**Capa 3 — Regulatorio y territorial:** El Registro de Empresas Turísticas de Baleares documenta todas las licencias ETV/ET activas (sin API, requiere scraping). IDEIB (Infraestructura de Dades Espacials) ofrece capas GIS con zonas ANEI/ARIP, usos del suelo y cartografía — servicios WMS/WFS gratuitos. Los PTI (Planes Territoriales Insulares) de cada isla definen zonas edificables, protecciones y capacidad turística.

**Capa 4 — Contexto macro:** AENA publica estadísticas mensuales de pasajeros (Palma PMI alcanzó **33,3M de pasajeros en 2024**, récord histórico). El Banco de España consolida indicadores del mercado de vivienda combinando INE, Notariado, Idealista y Sociedad de Tasación. El Colegio de Registradores aporta el dato crítico de **nacionalidad de compradores** (28-33% extranjeros en Baleares).

El pipeline de datos más eficiente y gratuito sigue esta secuencia: **Catastro (API) → INE (API) → IBESTAT (API) → Portal del Notariado (web scraping) → AETIB (informes)**. La mayor laguna es la ausencia de una API unificada que combine todas estas fuentes — precisamente el valor que Anclora Data Lab puede crear.

---

## 3. Las métricas que buscan los inversores difieren radicalmente por perfil

**HNWIs y Family Offices** evalúan inmuebles a través del prisma de la preservación patrimonial y la asignación de activos. Sus métricas primarias son el **IRR (Internal Rate of Return)** como estándar de oro para inversiones a largo plazo — el segmento de lujo balear típicamente apunta a un 10-15% IRR para estrategias core/core-plus — y el **Equity Multiple** (objetivo 1,5x-2,0x sobre un hold de 5-7 años). Exigen informes de portfolio consolidados que neten SPVs contra capas de fondos feeder con conversión multi-divisa, análisis asset-liability, y conformidad con GIPS. La due diligence requiere verificación de titularidad, auditorías ambientales, análisis de estructuración fiscal y evaluación de riesgo regulatorio. Para el mercado balear específicamente, monitorizan la velocidad de precios (tasa de cambio de €/m² por trimestre), días en mercado, y el calendario regulatorio (abolición Golden Visa, moratorias ETV, propuestas de impuestos a compradores extranjeros).

**Fondos institucionales** operan bajo estándares de reporting codificados: **NCREIF PREA** (actualizado en 2025 con reporting ampliado a nivel de activo), **INREV Guidelines** para vehículos europeos no listados, y **GRESB** como benchmark ESG. Los estándares NCREIF 2025 requieren jerarquía estandarizada de IRR combinada con TVPI, DPI y RVPI en todo reporting a LPs, más el **TGER (Total Global Expense Ratio)** desarrollado conjuntamente con INREV y ANREV. En el contexto balear, los cap rates de lujo se comprimen al **3-5%** debido a los altos valores de activos, con DSCR mínimos de 1,25x y LTV típicos del 50-65%. El dato crítico para fondos es el **SFDR** — aproximadamente el 39% de los fondos inmobiliarios europeos están clasificados bajo Artículo 8 ("light green"), y la Comisión Europea está revisando SFDR para reemplazar Artículos 8/9 con tres nuevas categorías.

**Inversores retail premium (€100K-€500K)** necesitan métricas simplificadas: yield bruto de alquiler (4-5% en long-term, significativamente superior con licencia ETV), yield neto (2-3,5% tras gastos y fiscalidad), apreciación proyectada de capital (8-12% anual reciente en Baleares), y calculadoras de coste total de adquisición (10-13% del precio en España: ITP, notaría, registro, abogados). Herramientas de comparación €/m² entre zonas y simuladores de ocupación estacional son esenciales.

**Señales macro críticas para Baleares** incluyen la conectividad aérea (nueva ruta Miami-Palma atrayendo compradores estadounidenses; vuelos de invierno iniciándose 3 semanas antes en 2025), el impacto de la abolición de la **Golden Visa** (efectiva 3 de abril de 2025, aunque con impacto directo limitado: solo ~2.000 solicitudes/año en toda España frente a 87.000+ compras de extranjeros en 2023), efectos cambiarios GBP/EUR y USD/EUR sobre compradores británicos y americanos, y riesgo climático creciente (tormenta de agosto 2024 en Mallorca con vientos de 110+ km/h, escasez hídrica en las islas).

---

## 4. Modelo de monetización óptimo: freemium premium con exclusividad escalable

El análisis de pricing de plataformas comparables revela un espectro amplio: desde los $49,99/mes de Mashvisor Lite hasta los $50.000+/año de licencias enterprise de MSCI o CoStar. Para Anclora Data Lab, el posicionamiento premium y la integración en un ecosistema más amplio sugieren un modelo híbrido.

**Benchmarks de referencia concretos:**

- Mashvisor: $49,99 (Lite) / $74,99 (Standard) / $99,99 (Pro) por mes
- Reonomy: $400/mes o $4.800/año por usuario
- LoopNet: $130–$1.100+/mes
- ATTOM Data API: desde $95/mes
- BatchData: $500–$5.000+/mes según volumen

**Modelo recomendado para Anclora Data Lab — "Freemium Premium con Escalabilidad Institucional":**

El **Tier Explorer (gratuito, sin registro)** debe seguir la estrategia ya definida en la documentación existente de Anclora: acceso sin fricciones a dashboards de mercado con datos agregados (€/m² por zona, tendencias anuales, indicadores macro), mapas de calor interactivos con datos limitados, y 2-3 informes de mercado publicados trimestralmente. Objetivo: **generación de leads y autoridad de marca**.

El **Tier Investor (€99-€149/mes, registro requerido)** incluiría analítica completa por zona y propiedad individual, scoring de oportunidades de inversión, alertas personalizadas (nuevos listings, cambios de precio, ventas comparables), simuladores de rendimiento (STR vs. LTR, IRR, CoC), generación de hasta 10 informes PDF/mes, y acceso a la interfaz conversacional con IA. Este tier competiría directamente con Mashvisor Pro pero para mercado de lujo europeo.

El **Tier Family Office (€499-€749/mes o €4.999-€7.499/año)** añadiría portfolio analytics multi-activo, informes GIPS-compliant automatizados, datos ESG/sostenibilidad por propiedad, acceso a datos de transacciones históricas del Notariado (procesados), alertas de cambios regulatorios, y generación ilimitada de informes con marca blanca.

El **Tier Institutional/API (€12.000-€25.000/año, custom)** proporcionaría acceso completo vía API REST, bulk data exports, integración con CRMs (HubSpot/Salesforce), dashboards personalizados, soporte dedicado, y SLA con uptime garantizado.

Un **modelo complementario de invitación/exclusividad** para el Portal B2B de Partners (ya documentado en la arquitectura existente de Anclora) crearía un canal de monetización adicional vía comisiones de referencia, acceso a inventario off-market y servicios BaaS.

---

## 5. Tendencias PropTech 2024-2026: la IA conversacional ya no es diferenciador sino tabla base

El mercado PropTech global alcanza **~$40-44.000 millones en 2024-2025** con proyección a $179-198.000 millones para 2034-2035 (CAGR 16%). Las tendencias más relevantes para Anclora convergen en cinco ejes.

**La IA conversacional para búsqueda inmobiliaria se ha convertido en estándar.** En noviembre de 2025, Redfin lanzó búsqueda conversacional con Sierra, permitiendo consultas en lenguaje natural tipo "casa estilo rancho con piscina en Austin." Homes.com, Realtor.com y Zillow lanzaron funcionalidades similares ese mismo año. PriceHubble introdujo su AI Agents Suite con tres niveles de autonomía (Companion, Copilot, Autopilot) y un **Model Context Protocol** en beta para Q1 2026. Que Anclora utilice Claude API para consultas en lenguaje natural ya no es diferenciador — es requisito mínimo. El diferenciador será la **calidad del contexto balear** inyectado al modelo y la generación de tesis de inversión automatizadas.

**Los AVMs para lujo requieren un enfoque distinto.** Los modelos estándar fallan en el segmento de lujo por escasez de comparables (menos transacciones por encima de €4M) y factores cualitativos no capturados por datos estructurados (calidad de vistas marinas, proximidad a beach clubs, estilo arquitectónico). PriceHubble ya integra computer vision para extraer características de fotografías de propiedades, reconociendo más de 300 atributos. Para Baleares, un AVM efectivo debe combinar regresión multi-spline con embeddings de atributos cualitativos procesados por pgvector en Supabase.

**ESG/sostenibilidad es ahora factor de inversión obligatorio.** Según Knight Frank, el **49% de compradores de lujo** consideran las calificaciones energéticas esenciales; CBRE documenta que edificios certificados ESG obtienen un **6% de prima en alquileres** y 14-16% más en valores de capital en Europa. La EPBD europea exige clase energética E para 2030 y D para 2033 en todo el parque de viviendas. En Ibiza, la producción fotovoltaica creció **7,5x en 2023**, aunque las renovables representan solo el 2,8% del total energético. Integrar scoring ESG por propiedad es una oportunidad de diferenciación inmediata para Anclora.

**La tokenización inmobiliaria crece exponencialmente pero requiere infraestructura de datos.** Deloitte proyecta el mercado tokenizado de **$300.000M en 2024 a $4 billones en 2035**. MiCA está plenamente en vigor desde diciembre 2024, aunque la mayoría de tokens inmobiliarios se estructuran como securities bajo MiFID II/AIFMD. En España, los tokens no pueden conferir titularidad directa de propiedad (requiere escritura notarial), sino que representan derechos económicos sobre SPVs. **Anclora puede posicionarse como la capa de datos/inteligencia** que las plataformas de tokenización necesitan: valoraciones verificadas, datos de mercado y analytics para pricing de activos tokenizados.

**El marco regulatorio europeo se endurece.** GDPR/LOPDGDD exigen designación de DPO para procesamiento a gran escala. La AEPD puede imponer multas de hasta el 4% de facturación global. Las infracciones LOPDGDD se clasifican en leves (prescripción 1 año), graves (2 años) y muy graves (3 años). El software debe especificar su nivel de protección de datos: básico, medio o alto. Para una plataforma que maneja datos de HNWIs, la certificación ISO 27001 (estándar de PriceHubble) y el hosting con residencia de datos en la UE son requisitos no negociables.

---

## 6. El mercado de lujo balear se encuentra en un punto de inflexión estructural

El mercado inmobiliario de lujo en Baleares atraviesa una situación sin precedentes definida por la convergencia de oferta críticamente limitada y demanda internacional sostenida.

**Los precios han alcanzado máximos históricos en todas las islas.** Mallorca registra un promedio de **€4.512/m²** general y **€5.800/m²** para propiedades vacacionales (enero 2024), con la zona suroeste superando los **€13.400/m²** en el segmento de lujo. En Ibiza, el promedio insular es de **€7.043/m²** (subida del 5,86% en 2024) con un CAGR 2017-2024 del 8,08%. Las villas de lujo en Es Cubells/Cap Martinet alcanzan los **€20.000/m²**. Menorca, más accesible, muestra €2.733/m² en Mahón con un 11% de crecimiento interanual. Sant Joan de Labritja (Ibiza) ostenta el precio municipal más alto de todas las Baleares: **€8.959/m²**.

**El volumen de transacciones se ha normalizado tras el boom post-pandemia.** Las Baleares registraron **13.624 transmisiones** en 2024, un 4% menos que 2023 y un 23,5% por debajo del pico de 2022 (17.813). Sin embargo, el segmento de €1,5M+ se vende más rápido que el rango medio — en Ibiza, más del 50% de las propiedades se venden en menos de 3 meses. La normalización del volumen, combinada con precios al alza, indica un mercado de vendedores con poder de fijación de precios sostenido.

**El perfil de compradores mantiene una dominancia europea con diversificación emergente.** Los alemanes lideran ampliamente, especialmente en Mallorca. Los británicos mantienen presencia significativa en las tres islas pese al Brexit. Los escandinavos (suecos, noruegos, daneses) representan un segmento creciente, particularmente en Menorca. Los compradores polacos han experimentado un **crecimiento del 60%**. La entrada de compradores estadounidenses se acelera con la nueva ruta Miami-Palma, y emerge interés de Oriente Medio en Ibiza. El **35,1% de todas las transacciones baleares en 2022 fueron internacionales**.

**Las zonas premium muestran dinámicas microregionales diferenciadas:**

En Mallorca, **Deià** registró el salto más dramático: de €6.895/m² a €9.112/m² en un solo año (+32%), impulsado por escasez extrema y protecciones patrimoniales/ambientales de la Serra de Tramuntana. **Son Vida** permanece como enclave ultra-exclusivo con tres campos de golf de clase mundial (Arabella). **Puerto de Andratx** alcanza €5.629/m² de media general, con el waterfront sustancialmente por encima. **Calvià** (Santa Ponsa, Bendinat) a €6.925/m² está en camino de superar a Andratx como la zona más cara.

En Ibiza, el casco histórico de **Eivissa** muestra €7.465/m² (+16,5% interanual), con Cap Martinet como el enclave más exclusivo de la isla. La zona sur (Es Cubells, Cala Jondal) promedió €9.500/m² para villas y fincas. **Sant Joan de Labritja** ostenta los precios más altos del archipiélago por su carácter rural exclusivo con oferta mínima.

En Menorca, **Mahón** lidera con €2.733/m² y Ciutadella con €2.600+/m². La isla muestra primas de hasta el 30% por vistas al mar. Su estatus de **Reserva de la Biosfera UNESCO** limita severamente el desarrollo pero protege el carácter que atrae a su demografía compradora — menos especulativa y más orientada a lifestyle.

**El entorno regulatorio es el factor de mayor impacto prospectivo.** La **moratoria ETV** vigente desde febrero 2022 (extendida al menos hasta 2026) prohíbe nuevas licencias de alquiler turístico. El **Decreto Ley 4/2025** (abril 2025) añadió la prohibición de nuevo alojamiento turístico en edificios plurifamiliares. Solo se puede entrar en el mercado de alquiler vacacional comprando propiedades con licencia existente, que ya comandan una **prima del ~20%**. Las multas por alquiler sin licencia van de €5.000 a €50.000+. La Golden Visa fue abolida el 3 de abril de 2025, aunque con impacto directo limitado. La propuesta de **impuesto del 100% a compras de extranjeros** — discutida para Baleares, Canarias y Cataluña — no está aprobada y se considera improbable pero genera incertidumbre.

**Las proyecciones 2025-2026** apuntan a incrementos moderados del **5-7% para el mercado general** y **7-10% para el segmento premium** (Yes! Mallorca Property, Balearic Properties). BBVA Research proyecta +7% para vivienda en España en 2026. La dinámica de oferta-demanda permanece estructuralmente favorable: España necesita unas 600.000 viviendas (2022-2025), las propiedades de lujo representan menos del 4% del inventario (vs. 17% en 2020), y los costes y plazos de construcción siguen escalando (26+ meses para licencia en Ibiza). Las compras internacionales de segundas residencias de lujo por encima de €10M crecieron un **11% en 2025** en la Europa costera.

---

## 7. Requisitos funcionales: la arquitectura debe servir a cuatro audiencias con necesidades distintas

Basado en el benchmarking de las plataformas líderes y alineado con la documentación estratégica existente de Anclora, los requisitos funcionales se organizan en seis bloques.

**Visualización geoespacial y dashboards interactivos.** Mapbox GL JS es el estándar de la industria utilizado por PriceHubble para mapas interactivos con heatmaps, modelos 3D y vídeos embebidos. Las capas esenciales para Baleares incluyen: precio €/m² por municipio/zona, yield de alquiler (STR vs. LTR), intensidad de demanda, densidad turística, proximidad a infraestructura, zonas protegidas ANEI/ARIP superpuestas, y análisis de vistas al mar. El dashboard principal debe mostrar: evolución YoY de precios a nivel municipal, volumen de transacciones con tendencia, desglose de compradores por nacionalidad, y balance oferta-demanda. CoStar referencia 6M+ de registros con analytics sobre 3.000+ mercados/submercados; CASAFARI ofrece seguimiento del ciclo de vida de listings (nuevos, cambios de precio, off-market).

**Analítica y generación automatizada de informes.** PriceHubble genera informes de valoración white-label exportables como PDF/digital sharing con funcionalidad de templates. ARGUS Intelligence (Altus Group) es el estándar institucional para valoración, previsión de flujos de caja y reporting. Para Anclora, Claude API debe generar las secciones narrativas de los informes incluyendo: resumen de valoración, comparación de mercado, métricas de inversión (IRR, CoC, Cap Rate), evaluación ESG, factores de riesgo y análisis de zona. La generación de informes en **múltiples idiomas** (ES, EN, DE, FR como mínimo; sueco, danés y polaco como deseable) es crítica para la audiencia balear.

**Sistema de alertas e inteligencia de mercado personalizada.** CASAFARI envía alertas customizadas por email para benchmarking de portfolio; CoStar permite guardar criterios de búsqueda con notificaciones instantáneas. El sistema de alertas de Anclora debe implementarse vía webhooks con triggers configurables: cambios de precio en zonas objetivo, nuevos listings que coincidan con criterios del inversor, ventas comparables completadas, cambios regulatorios (moratorias, fiscalidad, licencias ETV). Un **scoring de oportunidades de inversión** propio — combinando análisis de precio relativo al mercado (descuento %), potencial de yield, pronóstico de apreciación, score ESG, score de liquidez (días en mercado) y índice de prima de ubicación — representaría un diferenciador significativo.

**API e integraciones.** Siguiendo el modelo API-first de CASAFARI y PriceHubble, los endpoints core deben cubrir: búsqueda/detalle de propiedades, valoración (AVM), analytics de mercado, ventas comparables, gestión de alertas, operaciones de portfolio y generación de informes. Autenticación vía OAuth 2.0 con API keys para machine-to-machine y JWT para sesiones de usuario. Rate limiting y metering de uso para acceso tiered. Integraciones nativas con CRMs (HubSpot/Salesforce) utilizados por agencias inmobiliarias, y capacidad white-label con widgets embebibles (calculadora de valoración, snapshot de mercado) y soporte para dominios personalizados de partners.

**Funcionalidades potenciadas por Claude API.** La interfaz conversacional debe superar el estándar actual (búsqueda en lenguaje natural tipo Redfin) hacia la **generación automatizada de tesis de inversión**: para cualquier propiedad o portfolio, Claude genera un análisis estructurado con contexto de mercado, análisis comparativo, proyecciones financieras (múltiples escenarios), evaluación de riesgo, consideraciones ESG y opciones de estrategia de salida. El contexto debe incluir: terminología local (finca, possessió, chalet adosado), nombres de barrios, segmentos de mercado y regulación vigente. La implementación con pgvector en Supabase permite búsqueda semántica sobre embeddings de propiedades para identificar similitudes no evidentes en datos estructurados.

**Seguridad y compliance para audiencia HNWI.** ISO 27001 como estándar mínimo (referencia: PriceHubble). Cumplimiento GDPR/LOPDGDD con designación de DPO. Cifrado en reposo y en tránsito. Control de acceso basado en roles (RBAC) con perfiles de inversor, asesor y administrador. Autenticación de dos factores (2FA) obligatoria para datos sensibles. Residencia de datos en la UE (regiones EU de Supabase). Principio de privacidad por diseño: recopilación mínima de datos, consentimiento transparente, soporte del derecho de supresión. Conformidad con requisitos AML para plataformas de datos inmobiliarios — aunque existe una laguna importante en España, donde las transacciones inmobiliarias pueden realizarse sin involucrar a un profesional obligado.

---

## Conclusión: Anclora Data Lab puede definir una nueva categoría de producto

El análisis revela una convergencia extraordinaria de factores favorables. El mercado inmobiliario de lujo balear está estructuralmente constreñido por el lado de la oferta y sostenido por demanda internacional diversificada, creando una necesidad real de inteligencia de mercado sofisticada. Ningún competidor actual combina analítica institucional interactiva con foco en lujo residencial y cobertura granular balear — esto no es una mejora incremental sino una **categoría de producto inexistente**. Las fuentes de datos disponibles son sorprendentemente ricas y en su mayoría gratuitas, con el Portal Estadístico del Notariado (lanzado octubre 2025) proporcionando precios reales de transacción a nivel de código postal como recurso transformador. El stack tecnológico definido (Next.js 15, React 19, Supabase con pgvector, Claude API, Vercel) está perfectamente alineado con las tendencias PropTech 2025-2026, desde AI Agents hasta MCP protocols.

Tres decisiones estratégicas definirán el éxito del producto. Primera, la calidad del AVM para el segmento de lujo — donde la escasez de comparables exige modelos híbridos que combinen datos estructurados con análisis cualitativo de atributos premium. Segunda, la velocidad de integración de fuentes de datos oficiales (Catastro + Notariado + IBESTAT) como ventaja competitiva difícil de replicar por competidores generalistas. Tercera, el balance entre acceso gratuito para construcción de marca (siguiendo la estrategia de reciprocidad psicológica ya documentada) y monetización suficiente para sostener el desarrollo en un mercado nicho. El modelo freemium premium con tiers entre €99/mes y €25.000/año, complementado con el Portal B2B de Partners como canal de monetización paralelo, ofrece el equilibrio óptimo entre alcance y exclusividad.

Anclora Data Lab no compite con CASAFARI ni con Idealista — compite con los informes PDF estáticos de Engel &amp; Völkers, con las hojas de cálculo manuales de los family offices, y con la opacidad informativa que históricamente ha beneficiado a los intermediarios del mercado balear de lujo. Al democratizar la inteligencia de grado institucional para inversores premium, la plataforma simultáneamente captura leads de altísimo valor para el ecosistema Anclora y establece una autoridad de datos que se refuerza con cada usuario adicional.