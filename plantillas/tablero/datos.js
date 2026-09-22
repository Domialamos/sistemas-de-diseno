// Generado por plantillas/tablero/construir.mjs. No editar a mano: la fuente son tipos/ y ejemplos/.
window.PLANTILLAS = {
 "generadoEl": "2026-09-22",
 "familias": [
  "Asesoría",
  "Societario",
  "Operaciones",
  "Interno"
 ],
 "tipos": [
  {
   "tipo": "carta",
   "nombre": "Carta",
   "familia": "Asesoría",
   "descripcion": "Carta formal: lugar y fecha, destinatario, referencia, cuerpo, despedida y firma.",
   "requeridos": [
    "fecha",
    "destinatario.nombre",
    "referencia",
    "parrafos",
    "firmante.nombre"
   ],
   "portada": false,
   "ejemplo": {
    "ciudad": "Santiago",
    "fecha": "2026-09-22",
    "destinatario": {
     "tratamiento": "Señor",
     "nombre": "[Nombre del destinatario]",
     "apellido": "[Apellido]",
     "cargo": "Gerente General",
     "empresa": "Banco Modelo",
     "direccion": "[Dirección], Santiago"
    },
    "referencia": "Aviso de cambio de control · Contrato de financiamiento de [fecha]",
    "parrafos": [
     "En representación de **Deudora Modelo SpA** (la \"Deudora\") y conforme a la cláusula sexta del contrato de financiamiento suscrito con Banco Modelo el [fecha] (el \"Contrato\"), informamos que con fecha [fecha de cierre] Inversiones Ejemplo Limitada adquirió el 55% de las acciones emitidas con derecho a voto de la Deudora.",
     "La operación constituye un cambio de control en los términos de la cláusula segunda del Contrato. Acompañamos a esta carta los antecedentes del adquirente y sus estados financieros auditados al 31 de diciembre de 2025, para la evaluación prevista en la cláusula novena.",
     "Solicitamos que el Banco manifieste su aprobación dentro del plazo de treinta días contemplado en el Contrato. Quedamos a disposición para entregar cualquier información adicional que requieran."
    ],
    "despedida": "Sin otro particular, saluda atentamente,",
    "firmante": {
     "nombre": "[Nombre]",
     "cargo": "Gerente General",
     "detalle": "Deudora Modelo SpA"
    },
    "copia": "[Nombre], Área Mercantil",
    "adjuntos": [
     "Antecedentes del adquirente",
     "Estados financieros auditados al 31-12-2025"
    ]
   },
   "previews": [
    "previews/carta-1.jpg"
   ],
   "paginas": 1
  },
  {
   "tipo": "informe",
   "nombre": "Informe",
   "familia": "Asesoría",
   "descripcion": "Revisión o due diligence con más de una materia: portada, índice, resumen ejecutivo, secciones numeradas, semáforo.",
   "requeridos": [
    "titulo",
    "cliente",
    "fecha",
    "secciones"
   ],
   "portada": true,
   "ejemplo": {
    "titulo": "Revisión societaria y de cumplimiento",
    "subtitulo": "Sociedad Modelo S.A. y filiales · Estado al cierre del primer semestre",
    "cliente": "Inversiones Ejemplo Limitada",
    "fecha": "2026-09-22",
    "preparadoPor": "[Nombre] · Área Mercantil",
    "referencia": "[N.º interno]",
    "resumen": {
     "tarjetas": [
      {
       "n": 2,
       "label": "Materias críticas",
       "color": "B3261E"
      },
      {
       "n": 3,
       "label": "Materias a subsanar",
       "color": "C98A1B"
      },
      {
       "n": 9,
       "label": "Materias conformes",
       "color": "2E7D32"
      }
     ],
     "contenido": [
      "Se revisó la documentación societaria y de cumplimiento de **Sociedad Modelo S.A.** y de sus dos filiales, con el objeto de determinar su estado al 30 de junio de 2026 y las acciones necesarias antes del cierre de la operación proyectada.",
      "La sociedad matriz mantiene sus libros y registros al día. Las dos materias críticas se concentran en una filial: la vigencia de los poderes de su gerente general y una citación a junta publicada fuera de plazo."
     ],
     "recomendacion": "Regularizar los poderes de la filial mediante sesión de directorio antes del cierre y ratificar en junta extraordinaria los acuerdos adoptados en la junta cuya citación fue extemporánea."
    },
    "secciones": [
     {
      "titulo": "Antecedentes y alcance",
      "contenido": [
       "El encargo comprende la revisión de estatutos, actas de directorio y de juntas, registro de accionistas, poderes vigentes y cumplimiento de obligaciones de información, respecto de las tres sociedades del grupo.",
       {
        "lista": [
         "Sociedad Modelo S.A. (matriz)",
         "Filial Modelo Uno SpA",
         "Filial Modelo Dos Limitada"
        ],
        "tipo": "letra"
       },
       {
        "nota": "La revisión se efectuó sobre copias proporcionadas por el cliente y certificados con vigencia no superior a 30 días a la fecha de corte."
       }
      ]
     },
     {
      "titulo": "Análisis por materia",
      "contenido": [
       {
        "h2": "1. Poderes y representación"
       },
       "Los poderes del gerente general de Filial Modelo Uno SpA fueron otorgados por un plazo de dos años que expiró en marzo de 2026, sin que conste renovación en el libro de actas.",
       {
        "diagnostico": "La filial ha celebrado contratos con posterioridad a esa fecha por un apoderado sin poder vigente. Los actos son ratificables, pero mientras no se ratifiquen existe un riesgo de inoponibilidad frente a terceros."
       },
       {
        "recomendacion": "Sesión de directorio que renueve los poderes y ratifique expresamente los actos celebrados desde marzo, con nómina de los contratos ratificados como anexo del acta."
       },
       {
        "h2": "2. Juntas de accionistas"
       },
       {
        "tabla": {
         "cabecera": [
          "Sociedad",
          "Última junta ordinaria",
          "Citación",
          "Estado"
         ],
         "filas": [
          [
           "Sociedad Modelo S.A.",
           "28-04-2026",
           "En plazo",
           {
            "sem": "verde"
           }
          ],
          [
           "Filial Modelo Uno SpA",
           "30-04-2026",
           "Fuera de plazo",
           {
            "sem": "rojo"
           }
          ],
          [
           "Filial Modelo Dos Limitada",
           "No aplica",
           "No aplica",
           {
            "sem": "gris"
           }
          ]
         ],
         "anchos": [
          0.32,
          0.24,
          0.22,
          0.22
         ]
        }
       },
       {
        "h2": "3. Registro de accionistas y libros"
       },
       "Los registros de accionistas de la matriz y de la filial SpA están al día. El libro de actas de directorio de la matriz tiene todas sus actas firmadas hasta la sesión de agosto de 2026."
      ]
     },
     {
      "titulo": "Conclusiones y recomendaciones",
      "contenido": [
       {
        "lista": [
         "Renovar los poderes de Filial Modelo Uno SpA y ratificar los actos celebrados sin poder vigente.",
         "Celebrar junta extraordinaria de Filial Modelo Uno SpA que ratifique los acuerdos de la junta de abril.",
         {
          "texto": "Materias a subsanar sin urgencia:",
          "sub": [
           "Actualizar el domicilio de la matriz en el registro de comercio.",
           "Completar la firma de dos actas de directorio de 2025.",
           "Regularizar la inscripción de un aumento de capital en el registro de accionistas."
          ]
         }
        ],
        "tipo": "decimal"
       }
      ]
     }
    ],
    "anexos": [
     "Nómina de documentos revisados",
     "Certificados de vigencia tenidos a la vista",
     "Borrador de acta de directorio de renovación de poderes"
    ],
    "limitacion": "Este informe se emite sobre la base de los antecedentes indicados y de la normativa vigente a su fecha. No constituye una opinión sobre hechos o documentos no tenidos a la vista."
   },
   "previews": [
    "previews/informe-1.jpg",
    "previews/informe-3.jpg"
   ],
   "paginas": 7
  },
  {
   "tipo": "memorandum",
   "nombre": "Memorándum",
   "familia": "Asesoría",
   "descripcion": "Consulta puntual con respuesta fundada, en dos o tres páginas: ficha, síntesis, antecedentes, consulta, análisis, conclusión.",
   "requeridos": [
    "para",
    "de",
    "fecha",
    "referencia",
    "sintesis"
   ],
   "portada": false,
   "ejemplo": {
    "para": "[Nombre] · Gerente de Finanzas, Deudora Modelo SpA",
    "de": "[Nombre] · Área Mercantil",
    "copia": "[Nombre] · Socio a cargo",
    "fecha": "2026-09-22",
    "referencia": "Aviso de cambio de control bajo el contrato de financiamiento",
    "sintesis": "La operación consultada configura un cambio de control según la definición de la cláusula segunda del contrato de financiamiento y obliga a dar aviso escrito al Banco dentro de cinco días hábiles desde que se produzca. El aviso no requiere consentimiento previo, pero el Banco puede exigir el prepago si no lo aprueba dentro de treinta días. Recomendamos dar el aviso antes de firmar y negociar la aprobación en el mismo acto.",
    "antecedentes": [
     "Deudora Modelo SpA (la \"Deudora\") mantiene vigente un contrato de financiamiento con Banco Modelo por [monto], suscrito el [fecha] (el \"Contrato\").",
     "La Deudora proyecta una operación por la cual Inversiones Ejemplo Limitada adquirirá el 55% de sus acciones, con cierre estimado para el [fecha]."
    ],
    "consulta": [
     "Si la operación proyectada constituye un cambio de control bajo el Contrato y, en tal caso, qué obligaciones genera para la Deudora y en qué plazos."
    ],
    "analisis": [
     "La cláusula segunda del Contrato define cambio de control como la adquisición, directa o indirecta, por una persona o grupo, de más del 50% de las acciones con derecho a voto de la Deudora. La operación proyectada supera ese umbral.",
     {
      "cita": "\"Cambio de Control: la adquisición, directa o indirecta, por cualquier persona o grupo de personas que actúen concertadamente, de más del cincuenta por ciento de las acciones emitidas con derecho a voto de la Deudora.\" (cláusula segunda, definiciones)"
     },
     "La cláusula sexta obliga a informar al Banco por escrito de todo cambio de control dentro de los cinco días hábiles siguientes a que se produzca. La cláusula novena, por su parte, incluye el cambio de control no aprobado por el Banco entre las causales que facultan a exigir el prepago, con un plazo de treinta días para que el Banco manifieste su aprobación o rechazo.",
     {
      "lista": [
       "El aviso es una obligación de informar, no de obtener consentimiento previo.",
       "La consecuencia del rechazo es el prepago anticipado, no la resolución del Contrato."
      ],
      "tipo": "letra"
     }
    ],
    "conclusion": [
     "La operación es un cambio de control. La Deudora debe avisar por escrito dentro de cinco días hábiles desde el cierre y queda expuesta al prepago si el Banco no la aprueba en treinta días."
    ],
    "recomendacion": "Dar el aviso al Banco antes de la firma, acompañado de la información financiera del adquirente, y negociar que la aprobación conste en el mismo instrumento de aviso. Responsable: gerencia de finanzas con apoyo de esta área. Plazo: antes del [fecha de firma]."
   },
   "previews": [
    "previews/memorandum-1.jpg"
   ],
   "paginas": 2
  },
  {
   "tipo": "acta-junta",
   "nombre": "Acta de junta de accionistas",
   "familia": "Societario",
   "descripcion": "Junta ordinaria o extraordinaria: convocatoria, asistencia con acciones y porcentajes, mesa, tabla, acuerdos numerados, cierre y firmas.",
   "requeridos": [
    "sociedad",
    "fecha",
    "hora",
    "asistentes",
    "presidente",
    "secretario",
    "acuerdos"
   ],
   "portada": false,
   "ejemplo": {
    "sociedad": "Sociedad Modelo S.A.",
    "tipoJunta": "extraordinaria",
    "ciudad": "Santiago de Chile",
    "fecha": "2026-10-06",
    "hora": "10:00",
    "lugar": "[domicilio social]",
    "convocatoria": "La junta fue convocada por acuerdo del directorio adoptado en su sesión N.º 142 de 15 de septiembre de 2026. Los avisos de citación se publicaron en [diario] los días [fechas], y la citación se envió por correo a los accionistas con la anticipación estatutaria. Se dejó constancia de que se cumplieron las formalidades de convocatoria.",
    "asistentes": [
     {
      "accionista": "Inversiones Ejemplo Limitada",
      "representante": "[Nombre], según poder de [fecha]",
      "acciones": 550000,
      "porcentaje": "55,00%"
     },
     {
      "accionista": "[Accionista 2]",
      "representante": "Por sí",
      "acciones": 300000,
      "porcentaje": "30,00%"
     },
     {
      "accionista": "[Accionista 3]",
      "representante": "[Nombre], según poder de [fecha]",
      "acciones": 100000,
      "porcentaje": "10,00%"
     }
    ],
    "totalAcciones": 1000000,
    "presidente": "[Nombre del Presidente]",
    "secretario": "[Nombre del secretario]",
    "calificacionPoderes": "Los poderes de los accionistas representados fueron calificados y aprobados sin observaciones.",
    "tabla": [
     {
      "materia": "Ratificación de acuerdos",
      "exposicion": "El Presidente explicó que la citación a la junta ordinaria de [fecha] se publicó fuera del plazo estatutario y que, para despejar cualquier duda sobre la validez de sus acuerdos, se propone ratificarlos."
     },
     {
      "materia": "Reforma de estatutos",
      "exposicion": "Se propone modificar el artículo [N] de los estatutos, relativo al domicilio social."
     }
    ],
    "acuerdos": [
     {
      "titulo": "Ratificación",
      "texto": "Ratificar íntegramente los acuerdos adoptados en la junta ordinaria de accionistas celebrada el [fecha], incluidos la aprobación de la memoria, el balance y los estados financieros del ejercicio 2025, la distribución de utilidades y la designación de auditores externos."
     },
     {
      "titulo": "Reforma de estatutos",
      "texto": "Modificar el artículo [N] de los estatutos sociales, fijando el domicilio de la Sociedad en la comuna de [comuna], Región Metropolitana, sin perjuicio de las agencias o sucursales que pueda establecer en otros lugares del país o del extranjero, y aprobar el texto refundido de los estatutos que se agrega como anexo."
     },
     {
      "titulo": "Facultades",
      "texto": "Facultar al portador de copia autorizada del acta de esta junta para reducirla a escritura pública, en todo o en parte, y requerir las inscripciones, subinscripciones, anotaciones y publicaciones que correspondan."
     }
    ],
    "firmantesActa": "los accionistas don/doña [Nombre] y don/doña [Nombre]",
    "horaCierre": "10:45"
   },
   "previews": [
    "previews/acta-junta-1.jpg"
   ],
   "paginas": 2
  },
  {
   "tipo": "acta-directorio",
   "nombre": "Acta de sesión de directorio",
   "familia": "Societario",
   "descripcion": "Sesión ordinaria o extraordinaria: asistencia y quórum, mesa, acta anterior, tabla, acuerdos numerados, cierre y firmas.",
   "requeridos": [
    "sociedad",
    "numero",
    "fecha",
    "hora",
    "directores",
    "presidente",
    "secretario",
    "acuerdos"
   ],
   "portada": false,
   "ejemplo": {
    "sociedad": "Sociedad Modelo S.A.",
    "tipoSesion": "ordinaria",
    "numero": "142",
    "ciudad": "Santiago de Chile",
    "fecha": "2026-09-15",
    "hora": "09:30",
    "lugar": "las oficinas de la Sociedad ubicadas en [dirección]",
    "modalidad": "con participación de uno de los directores por medios tecnológicos que permitieron su comunicación simultánea y permanente",
    "directores": [
     {
      "nombre": "[Nombre del Presidente]",
      "calidad": "Presidente",
      "asistencia": "Presente"
     },
     {
      "nombre": "[Nombre del director 2]",
      "calidad": "Director",
      "asistencia": "Presente"
     },
     {
      "nombre": "[Nombre del director 3]",
      "calidad": "Director",
      "asistencia": "Presente por medios tecnológicos"
     },
     {
      "nombre": "[Nombre del director 4]",
      "calidad": "Director",
      "asistencia": "Ausente, excusado"
     },
     {
      "nombre": "[Nombre del director 5]",
      "calidad": "Director",
      "asistencia": "Presente"
     }
    ],
    "presidente": "[Nombre del Presidente]",
    "secretario": "[Nombre del secretario]",
    "actaAnterior": {
     "numero": "141",
     "fecha": "2026-08-18",
     "observaciones": "sin observaciones"
    },
    "tabla": [
     {
      "materia": "Renovación de poderes del gerente general",
      "exposicion": "El Presidente expuso que los poderes otorgados en la sesión N.º 118 expiraron en marzo de 2026 y que corresponde renovarlos y ratificar los actos celebrados desde entonces."
     },
     {
      "materia": "Contrato de financiamiento con Banco Modelo",
      "exposicion": "El gerente general presentó los términos principales del financiamiento por [monto], su plazo, garantías y covenants."
     },
     {
      "materia": "Citación a junta extraordinaria de accionistas",
      "exposicion": "Se propuso citar a junta para ratificar los acuerdos de la junta ordinaria de abril."
     }
    ],
    "acuerdos": [
     {
      "titulo": "Poderes",
      "texto": "Renovar por dos años los poderes del gerente general don/doña [Nombre] en los mismos términos de la sesión N.º 118, y ratificar todos los actos y contratos celebrados por él/ella en representación de la Sociedad entre el [fecha] y esta fecha, según la nómina que se agrega como anexo A de esta acta."
     },
     {
      "titulo": "Financiamiento",
      "texto": "Aprobar la celebración del contrato de financiamiento con Banco Modelo por [monto], en los términos del borrador presentado, y facultar al gerente general para suscribirlo, otorgar las garantías acordadas y firmar todos los documentos accesorios."
     },
     {
      "titulo": "Junta extraordinaria",
      "texto": "Citar a junta extraordinaria de accionistas para el [fecha], a las [hora] horas, en [lugar], con el objeto de ratificar los acuerdos adoptados en la junta ordinaria de [fecha], y facultar al Presidente para efectuar las publicaciones y comunicaciones que correspondan.",
      "votacion": "unanimidad de los directores presentes"
     }
    ],
    "horaCierre": "11:05",
    "reduccion": "Se faculta al portador de copia autorizada de esta acta, o de la parte pertinente de ella, para reducirla a escritura pública y requerir las inscripciones, anotaciones y publicaciones que procedan."
   },
   "previews": [
    "previews/acta-directorio-1.jpg"
   ],
   "paginas": 2
  },
  {
   "tipo": "certificado",
   "nombre": "Certificado",
   "familia": "Societario",
   "descripcion": "Certificado del secretario, de vigencia de poderes o de acuerdos: certificante, lo que se certifica en puntos numerados, lugar, fecha y firma.",
   "requeridos": [
    "sociedad",
    "certificante.nombre",
    "certificante.cargo",
    "certifica",
    "fecha"
   ],
   "portada": false,
   "ejemplo": {
    "sociedad": "Deudora Modelo SpA",
    "rut": "[RUT]",
    "titulo": "Certificado de vigencia de poderes y acuerdos",
    "certificante": {
     "nombre": "[Nombre del secretario]",
     "cargo": "Secretario del Directorio"
    },
    "certifica": [
     "Que la Sociedad es una sociedad por acciones constituida por escritura pública de [fecha], otorgada en la Notaría de [ciudad] de don/doña [Notario], cuyo extracto se inscribió a fojas [N] N.º [N] del Registro de Comercio de [ciudad] del año [año] y se publicó en el Diario Oficial de [fecha].",
     "Que los estatutos sociales vigentes son los que constan en el texto refundido aprobado por junta extraordinaria de accionistas de [fecha], y que no han sido modificados con posterioridad.",
     "Que en sesión de directorio N.º [N], de [fecha], cuya acta se encuentra firmada y transcrita en el libro respectivo, se aprobó la celebración del contrato de financiamiento con Banco Modelo por [monto] y se facultó a don/doña [Nombre], en su calidad de gerente general, para suscribirlo y otorgar las garantías acordadas.",
     "Que los poderes indicados en el número anterior se encuentran vigentes a esta fecha y no han sido revocados, limitados ni modificados.",
     "Que a esta fecha no existe acuerdo social ni resolución judicial o administrativa, de la que la Sociedad tenga conocimiento, que disponga su disolución, liquidación o reorganización."
    ],
    "anexos": [
     "copia del acta de la sesión de directorio N.º [N]",
     "texto refundido de los estatutos"
    ],
    "ciudad": "Santiago de Chile",
    "fecha": "2026-09-22",
    "finalidad": "para ser presentado ante Banco Modelo en el marco del contrato de financiamiento indicado"
   },
   "previews": [
    "previews/certificado-1.jpg"
   ],
   "paginas": 1
  },
  {
   "tipo": "poder",
   "nombre": "Poder",
   "familia": "Societario",
   "descripcion": "Mandato o poder especial: comparecencia del mandante, designación del mandatario, facultades numeradas, vigencia y firmas.",
   "requeridos": [
    "mandante.nombre",
    "mandatario.nombre",
    "facultades",
    "fecha"
   ],
   "portada": false,
   "ejemplo": {
    "titulo": "Poder especial para la firma del contrato de financiamiento",
    "ciudad": "Santiago de Chile",
    "fecha": "2026-09-22",
    "mandante": {
     "nombre": "Deudora Modelo SpA",
     "rut": "[RUT]",
     "representante": "don/doña [Nombre], gerente general",
     "domicilio": "[dirección], comuna de [comuna]"
    },
    "mandatario": {
     "nombre": "[Nombre del mandatario]",
     "rut": "[RUT]",
     "domicilio": "[dirección]"
    },
    "facultades": [
     "Suscribir, en nombre y representación del Mandante, el contrato de financiamiento con Banco Modelo por hasta [monto], en los términos aprobados por el directorio en su sesión N.º [N] de [fecha].",
     "Suscribir los pagarés, contratos de garantía, declaraciones y demás documentos accesorios que el contrato de financiamiento requiera, y solicitar las inscripciones que procedan.",
     "Entregar y recibir notificaciones, certificados y comunicaciones relacionadas con el contrato de financiamiento.",
     "Delegar en todo o en parte el presente poder y revocar las delegaciones que efectúe."
    ],
    "limites": [
     "El Mandatario no podrá aceptar condiciones financieras distintas de las aprobadas por el directorio, ni constituir garantías sobre bienes no comprendidos en dicha aprobación.",
     "El presente poder no faculta para novar, transigir ni renunciar derechos del Mandante."
    ],
    "vigencia": "El presente poder tendrá vigencia desde esta fecha y hasta la firma del contrato de financiamiento y sus documentos accesorios, y en todo caso hasta el [fecha], sin perjuicio de su revocación anticipada por el Mandante, la que producirá efectos desde su comunicación por escrito al Mandatario."
   },
   "previews": [
    "previews/poder-1.jpg"
   ],
   "paginas": 1
  },
  {
   "tipo": "checklist-cierre",
   "nombre": "Checklist de cierre",
   "familia": "Operaciones",
   "descripcion": "Closing checklist de una operación: ficha, conteo de estados, tabla por etapa (firma, condiciones precedentes, cierre, post-cierre) con responsable y fecha.",
   "requeridos": [
    "operacion",
    "cliente",
    "fecha",
    "etapas"
   ],
   "portada": false,
   "ejemplo": {
    "operacion": "Adquisición del 55% de Filial Modelo Uno SpA",
    "bajada": "Documentos de la operación, por etapa",
    "cliente": "Inversiones Ejemplo Limitada",
    "partes": "Inversiones Ejemplo Limitada (compradora) · [Vendedores] · Filial Modelo Uno SpA (sociedad objetivo)",
    "fecha": "2026-09-22",
    "fechaCierre": "2026-10-15",
    "responsable": "[Nombre] · Área Mercantil",
    "etapas": [
     {
      "nombre": "Firma",
      "items": [
       {
        "documento": "Contrato de compraventa de acciones",
        "responsable": "Garrigues",
        "estado": "listo",
        "fecha": "2026-09-19"
       },
       {
        "documento": "Pacto de accionistas",
        "responsable": "Garrigues",
        "estado": "en curso",
        "fecha": "2026-09-26",
        "observaciones": "Pendiente cláusula de salida"
       },
       {
        "documento": "Poderes de los firmantes",
        "responsable": "Cada parte",
        "estado": "listo",
        "fecha": "2026-09-19"
       },
       {
        "documento": "Certificados de vigencia de las sociedades",
        "responsable": "Garrigues",
        "estado": "listo",
        "fecha": "2026-09-18"
       }
      ]
     },
     {
      "nombre": "Condiciones precedentes",
      "descripcion": "Deben cumplirse antes del cierre, según la cláusula [N] del contrato de compraventa.",
      "items": [
       {
        "documento": "Acta de directorio de la objetivo: renovación de poderes y ratificación de actos",
        "responsable": "Vendedores",
        "estado": "pendiente",
        "fecha": "2026-10-01"
       },
       {
        "documento": "Consentimiento de Banco Modelo al cambio de control",
        "responsable": "Vendedores",
        "estado": "en curso",
        "fecha": "2026-10-08",
        "observaciones": "Aviso enviado el 22-09"
       },
       {
        "documento": "Acta de junta extraordinaria de ratificación",
        "responsable": "Vendedores",
        "estado": "pendiente",
        "fecha": "2026-10-06"
       },
       {
        "documento": "Certificado de deuda laboral y previsional actualizado",
        "responsable": "Vendedores",
        "estado": "pendiente",
        "fecha": "2026-10-13"
       }
      ]
     },
     {
      "nombre": "Cierre",
      "items": [
       {
        "documento": "Traspaso de acciones firmado",
        "responsable": "Vendedores",
        "estado": "pendiente",
        "fecha": "2026-10-15"
       },
       {
        "documento": "Inscripción del traspaso en el registro de accionistas",
        "responsable": "Sociedad objetivo",
        "estado": "pendiente",
        "fecha": "2026-10-15"
       },
       {
        "documento": "Comprobante de pago del precio",
        "responsable": "Compradora",
        "estado": "pendiente",
        "fecha": "2026-10-15"
       },
       {
        "documento": "Renuncias y designación de nuevos directores",
        "responsable": "Sociedad objetivo",
        "estado": "pendiente",
        "fecha": "2026-10-15"
       }
      ]
     },
     {
      "nombre": "Post-cierre",
      "items": [
       {
        "documento": "Aviso de cambio de control a contrapartes contractuales",
        "responsable": "Sociedad objetivo",
        "estado": "pendiente",
        "fecha": "2026-10-22"
       },
       {
        "documento": "Actualización de registros ante organismos",
        "responsable": "Garrigues",
        "estado": "pendiente",
        "fecha": "2026-10-30"
       },
       {
        "documento": "Archivo de la operación (closing binder)",
        "responsable": "Garrigues",
        "estado": "pendiente",
        "fecha": "2026-11-15"
       }
      ]
     }
    ]
   },
   "previews": [
    "previews/checklist-cierre-1.jpg"
   ],
   "paginas": 2
  },
  {
   "tipo": "contrato",
   "nombre": "Contrato",
   "familia": "Operaciones",
   "descripcion": "Instrumento privado: comparecencia de las partes, cláusulas PRIMERO, SEGUNDO…, personerías, ejemplares, firmas y anexos.",
   "requeridos": [
    "titulo",
    "partes",
    "clausulas",
    "fecha"
   ],
   "portada": false,
   "ejemplo": {
    "titulo": "Contrato de prestación de servicios de asesoría",
    "rotulo": "Instrumento privado",
    "denominacion": "contrato de prestación de servicios",
    "ciudad": "Santiago de Chile",
    "fecha": "2026-09-22",
    "partes": [
     {
      "rol": "Prestadora",
      "nombre": "Asesorías Modelo Limitada",
      "rut": "[RUT]",
      "representante": "don/doña [Nombre]",
      "rutRepresentante": "[RUT]",
      "domicilio": "[dirección], comuna de [comuna]",
      "abreviatura": "Prestadora"
     },
     {
      "rol": "Cliente",
      "nombre": "Sociedad Modelo S.A.",
      "rut": "[RUT]",
      "representante": "don/doña [Nombre]",
      "rutRepresentante": "[RUT]",
      "domicilio": "[dirección], comuna de [comuna]",
      "abreviatura": "Cliente"
     }
    ],
    "clausulas": [
     {
      "titulo": "Antecedentes",
      "contenido": [
       "El Cliente requiere servicios de asesoría en materia de [materia] y la Prestadora declara contar con la experiencia y los medios necesarios para prestarlos."
      ]
     },
     {
      "titulo": "Objeto",
      "contenido": [
       "Por este acto la Prestadora se obliga a prestar al Cliente los servicios que se describen en el **Anexo 1** (los \"Servicios\"), y el Cliente se obliga a pagar por ellos el precio convenido en la cláusula cuarta."
      ]
     },
     {
      "titulo": "Plazo",
      "contenido": [
       "El presente Contrato regirá desde esta fecha y por un plazo de [N] meses, renovable por períodos iguales y sucesivos salvo que cualquiera de las Partes comunique a la otra su voluntad de no renovarlo con al menos treinta días de anticipación al vencimiento del período respectivo."
      ]
     },
     {
      "titulo": "Precio y forma de pago",
      "contenido": [
       "El Cliente pagará a la Prestadora un honorario mensual de [monto], más el impuesto al valor agregado si correspondiere, contra factura emitida dentro de los primeros cinco días de cada mes.",
       {
        "lista": [
         "El pago se efectuará dentro de los treinta días siguientes a la recepción conforme de la factura.",
         "Los gastos en que incurra la Prestadora por cuenta del Cliente se reembolsarán contra rendición documentada, previa aprobación escrita."
        ],
        "tipo": "letra"
       }
      ]
     },
     {
      "titulo": "Obligaciones de la Prestadora",
      "contenido": [
       {
        "lista": [
         "Prestar los Servicios con la diligencia y el estándar profesional exigibles a un especialista en la materia.",
         "Informar al Cliente, con la periodicidad acordada en el Anexo 1, el avance de los Servicios.",
         "Guardar reserva de toda información del Cliente a la que acceda con ocasión de los Servicios."
        ],
        "tipo": "decimal"
       }
      ]
     },
     {
      "titulo": "Obligaciones del Cliente",
      "contenido": [
       {
        "lista": [
         "Entregar oportunamente la información y los antecedentes necesarios para la prestación de los Servicios.",
         "Pagar el precio en la forma y plazo convenidos."
        ],
        "tipo": "decimal"
       }
      ]
     },
     {
      "titulo": "Confidencialidad",
      "contenido": [
       "Las Partes se obligan a mantener en estricta reserva la información que reciban de la otra con ocasión de este Contrato, y a no divulgarla ni usarla para fines distintos de su ejecución, durante su vigencia y por [N] años después de su término."
      ]
     },
     {
      "titulo": "Término anticipado",
      "contenido": [
       "Cualquiera de las Partes podrá poner término anticipado al Contrato en caso de incumplimiento grave de las obligaciones de la otra que no sea subsanado dentro de los quince días siguientes al requerimiento escrito respectivo."
      ]
     },
     {
      "titulo": "Domicilio y jurisdicción",
      "contenido": [
       "Para todos los efectos de este Contrato las Partes fijan su domicilio en la ciudad y comuna de Santiago y se someten a la competencia de sus tribunales ordinarios de justicia."
      ]
     }
    ],
    "personerias": [
     "La personería de don/doña [Nombre] para representar a Asesorías Modelo Limitada consta en escritura pública de [fecha], otorgada en la Notaría de [ciudad] de don/doña [Notario].",
     "La personería de don/doña [Nombre] para representar a Sociedad Modelo S.A. consta en acta de sesión de directorio de [fecha], reducida a escritura pública el [fecha] en la Notaría de [ciudad] de don/doña [Notario]."
    ],
    "anexos": [
     {
      "titulo": "Anexo 1",
      "descripcion": "Descripción de los Servicios, entregables y periodicidad de los informes."
     }
    ]
   },
   "previews": [
    "previews/contrato-1.jpg"
   ],
   "paginas": 3
  },
  {
   "tipo": "estudio-titulos",
   "nombre": "Estudio de títulos",
   "familia": "Operaciones",
   "descripcion": "Inmueble: individualización e inscripción vigente, cadena de títulos por diez años o más, gravámenes, prohibiciones y litigios, documentos revisados, conclusión y recomendaciones.",
   "requeridos": [
    "inmueble.descripcion",
    "inmueble.conservador",
    "solicitante",
    "fecha",
    "titulos",
    "conclusion"
   ],
   "portada": false,
   "ejemplo": {
    "inmueble": {
     "nombreCorto": "Oficina 1201, Edificio Modelo",
     "descripcion": "Oficina número 1201 del piso 12 y estacionamiento número 45 del subterráneo 2 del Edificio Modelo, ubicado en [dirección], comuna de [comuna], Región Metropolitana",
     "comuna": "[comuna]",
     "rol": "[rol de avalúo]",
     "conservador": "Conservador de Bienes Raíces de Santiago",
     "inscripcion": {
      "fojas": "[N]",
      "numero": "[N]",
      "anio": "2021"
     },
     "propietario": "Sociedad Modelo S.A."
    },
    "solicitante": "Inversiones Ejemplo Limitada",
    "fecha": "2026-09-22",
    "periodo": "Últimos diez años (2016 a 2026)",
    "textoTitulos": "La cadena de títulos de los últimos diez años es continua y las inscripciones se corresponden entre sí sin saltos ni superposiciones.",
    "titulos": [
     {
      "anio": 2016,
      "acto": "Compraventa",
      "partes": "[Vendedor original] a Inmobiliaria Ejemplo SpA",
      "inscripcion": "Fs. [N] N.º [N] Registro de Propiedad 2016"
     },
     {
      "anio": 2018,
      "acto": "Compraventa",
      "partes": "Inmobiliaria Ejemplo SpA a [Comprador 2]",
      "inscripcion": "Fs. [N] N.º [N] Registro de Propiedad 2018"
     },
     {
      "anio": 2021,
      "acto": "Compraventa",
      "partes": "[Comprador 2] a Sociedad Modelo S.A.",
      "inscripcion": "Fs. [N] N.º [N] Registro de Propiedad 2021 (vigente)"
     }
    ],
    "gravamenes": [
     {
      "tipo": "Hipoteca de primer grado",
      "beneficiario": "Banco Modelo",
      "inscripcion": "Fs. [N] N.º [N] Registro de Hipotecas 2021",
      "vigente": true,
      "estado": "Vigente"
     },
     {
      "tipo": "Hipoteca de primer grado",
      "beneficiario": "[Banco anterior]",
      "inscripcion": "Fs. [N] N.º [N] Registro de Hipotecas 2018",
      "vigente": false,
      "estado": "Alzada en 2021"
     }
    ],
    "prohibiciones": [
     {
      "tipo": "Prohibición de gravar y enajenar",
      "beneficiario": "Banco Modelo",
      "inscripcion": "Fs. [N] N.º [N] Registro de Prohibiciones 2021",
      "vigente": true,
      "estado": "Vigente"
     }
    ],
    "otros": [
     "El inmueble forma parte de un condominio acogido a la ley de copropiedad inmobiliaria. Se tuvo a la vista el reglamento de copropiedad y el certificado de gastos comunes al día emitido por la administración.",
     "El certificado de avalúo fiscal indica que las contribuciones se encuentran pagadas hasta la cuota de [período]."
    ],
    "documentosRevisados": [
     "Copia de inscripción de dominio con certificado de vigencia de [fecha]",
     "Certificado de hipotecas y gravámenes de [fecha]",
     "Certificado de prohibiciones e interdicciones de [fecha]",
     "Escrituras públicas de compraventa de 2016, 2018 y 2021",
     "Reglamento de copropiedad y certificado de gastos comunes",
     "Certificado de avalúo fiscal y de deuda de contribuciones"
    ],
    "conclusion": "Los títulos del inmueble se encuentran ajustados a derecho y el dominio de Sociedad Modelo S.A. está debidamente inscrito. La hipoteca y la prohibición vigentes a favor de Banco Modelo deben alzarse o ser aceptadas por el comprador antes de la compraventa.",
    "recomendaciones": [
     "Condicionar la firma de la compraventa al alzamiento de la hipoteca y de la prohibición, o a la carta de resguardo del Banco.",
     "Obtener certificados actualizados con vigencia no superior a 30 días a la fecha de la escritura.",
     "Verificar en la administración del edificio la inexistencia de deudas de gastos comunes a la fecha de la escritura."
    ],
    "firmante": {
     "nombre": "[Nombre]",
     "cargo": "Abogada · Área Mercantil"
    }
   },
   "previews": [
    "previews/estudio-titulos-1.jpg"
   ],
   "paginas": 3
  },
  {
   "tipo": "due-diligence",
   "nombre": "Informe de due diligence",
   "familia": "Operaciones",
   "descripcion": "Revisión por módulos (societario, contratos, laboral, etc.): portada, índice, resumen con conteo automático de hallazgos, matriz por módulo con riesgo y recomendación.",
   "requeridos": [
    "objetivo",
    "cliente",
    "fecha",
    "modulos"
   ],
   "portada": true,
   "ejemplo": {
    "objetivo": "Filial Modelo Uno SpA",
    "titulo": "Due diligence legal de Filial Modelo Uno SpA",
    "subtitulo": "Adquisición del 55% por Inversiones Ejemplo Limitada · Fase confirmatoria",
    "cliente": "Inversiones Ejemplo Limitada",
    "fecha": "2026-09-22",
    "fechaCorte": "2026-09-15",
    "preparadoPor": "[Nombre] · Área Mercantil",
    "alcance": "Societario, contratos relevantes, laboral y cumplimiento",
    "resumen": [
     "La sociedad objetivo está válidamente constituida y sus libros se encuentran al día. Los dos hallazgos críticos son subsanables antes del cierre y se recomienda condicionar la firma a su regularización.",
     {
      "recomendacion": "Incluir como condiciones precedentes del cierre la renovación de poderes con ratificación de actos y la obtención del consentimiento del Banco al cambio de control."
     }
    ],
    "modulos": [
     {
      "nombre": "Societario",
      "alcance": "Constitución, modificaciones, órganos sociales, poderes, registro de accionistas y actas de los últimos cinco años.",
      "hallazgos": [
       {
        "materia": "Constitución y vigencia",
        "hallazgo": "Sociedad constituida el [fecha], con extracto inscrito y publicado en plazo. Certificado de vigencia de [fecha] sin anotaciones.",
        "riesgo": "verde",
        "recomendacion": "Sin acción."
       },
       {
        "materia": "Poderes",
        "hallazgo": "Los poderes del gerente general expiraron en marzo de 2026. Se celebraron cuatro contratos con posterioridad sin poder vigente.",
        "riesgo": "rojo",
        "recomendacion": "Sesión de directorio que renueve poderes y ratifique los cuatro contratos, como condición precedente."
       },
       {
        "materia": "Juntas",
        "hallazgo": "La citación a la junta ordinaria de abril de 2026 se publicó fuera del plazo estatutario.",
        "riesgo": "ambar",
        "recomendacion": "Junta extraordinaria que ratifique los acuerdos, ya citada para el 6 de octubre."
       },
       {
        "materia": "Registro de accionistas",
        "hallazgo": "Al día. El último traspaso está inscrito y firmado.",
        "riesgo": "verde"
       }
      ],
      "conclusion": "El módulo societario queda conforme una vez ejecutadas la renovación de poderes y la junta de ratificación."
     },
     {
      "nombre": "Contratos relevantes",
      "alcance": "Contratos con valor anual superior a [monto] y todos los que contengan cláusulas de cambio de control, exclusividad o no competencia.",
      "hallazgos": [
       {
        "materia": "Financiamiento Banco Modelo",
        "hallazgo": "El contrato exige aviso de cambio de control en cinco días hábiles y permite al Banco exigir el prepago si no aprueba la operación en treinta días.",
        "riesgo": "rojo",
        "recomendacion": "Obtener el consentimiento previo del Banco antes de la firma, como condición precedente."
       },
       {
        "materia": "Arriendo de oficinas",
        "hallazgo": "Contrato vigente hasta 2028 sin cláusula de cambio de control. Renta al día.",
        "riesgo": "verde"
       },
       {
        "materia": "Distribución exclusiva",
        "hallazgo": "Cláusula de exclusividad territorial por tres años, con penalidad por incumplimiento de [monto]. No afecta la operación pero limita el plan de expansión del comprador.",
        "riesgo": "ambar",
        "recomendacion": "Evaluar renegociación posterior al cierre; informar al comprador."
       }
      ]
     },
     {
      "nombre": "Laboral",
      "alcance": "Contratos de trabajo, finiquitos, cotizaciones previsionales y litigios de los últimos tres años.",
      "hallazgos": [
       {
        "materia": "Cotizaciones",
        "hallazgo": "Certificado de cumplimiento de obligaciones laborales y previsionales sin deuda a la fecha de corte.",
        "riesgo": "verde"
       },
       {
        "materia": "Litigios",
        "hallazgo": "Una demanda por despido injustificado en tramitación, con cuantía estimada de [monto].",
        "riesgo": "ambar",
        "recomendacion": "Provisionar en el precio o cubrir con indemnidad específica del vendedor."
       }
      ]
     }
    ],
    "documentosRevisados": [
     "Escritura de constitución y modificaciones de Filial Modelo Uno SpA",
     "Certificados de vigencia, hipotecas y prohibiciones a la fecha de corte",
     "Libros de actas de directorio y de juntas 2021-2026",
     "Contrato de financiamiento con Banco Modelo y sus anexos",
     "Contratos de arriendo y de distribución exclusiva",
     "Certificado de cumplimiento de obligaciones laborales y previsionales"
    ]
   },
   "previews": [
    "previews/due-diligence-1.jpg",
    "previews/due-diligence-3.jpg"
   ],
   "paginas": 7
  },
  {
   "tipo": "opinion-legal",
   "nombre": "Opinión legal",
   "familia": "Operaciones",
   "descripcion": "Legal opinion para financiamientos y operaciones: destinatario, documentos revisados, supuestos, opinión numerada, calificaciones y limitaciones.",
   "requeridos": [
    "destinatario",
    "fecha",
    "operacion",
    "documentos",
    "opiniones",
    "firmante.nombre"
   ],
   "portada": false,
   "ejemplo": {
    "destinatario": "Banco Modelo",
    "cliente": "Deudora Modelo SpA",
    "sociedad": "Deudora Modelo SpA",
    "fecha": "2026-09-22",
    "referencia": "[N.º interno]",
    "operacion": "Contrato de financiamiento por [monto] entre Deudora Modelo SpA y Banco Modelo",
    "bajada": "Opinión sobre existencia, facultades y exigibilidad",
    "documentos": [
     "Escritura pública de constitución de la Sociedad y sus modificaciones, con sus inscripciones y publicaciones.",
     "Certificado de vigencia de la Sociedad emitido por el Registro de Comercio de [ciudad] con fecha [fecha].",
     "Acta de la sesión de directorio de [fecha] que aprobó la celebración del Contrato y otorgó los poderes para suscribirlo.",
     "Copia firmada del Contrato de financiamiento de fecha [fecha].",
     "Certificado del secretario de la Sociedad de fecha [fecha] sobre vigencia de poderes."
    ],
    "opiniones": [
     "La Sociedad es una sociedad por acciones válidamente constituida y existente conforme a las leyes de la República de Chile.",
     "La Sociedad tiene capacidad y facultades societarias para celebrar el Contrato y cumplir las obligaciones que asume en él.",
     "La celebración y el cumplimiento del Contrato fueron debidamente autorizados por los órganos sociales competentes, y las personas que lo suscribieron en representación de la Sociedad contaban con poder suficiente y vigente a la fecha de su firma.",
     "El Contrato constituye una obligación legal, válida y vinculante de la Sociedad, exigible en su contra conforme a sus términos.",
     "La celebración del Contrato no contraviene los estatutos de la Sociedad ni, según nuestro conocimiento, contrato alguno del que la Sociedad sea parte y que nos haya sido exhibido."
    ],
    "firmante": {
     "nombre": "[Nombre del socio]",
     "cargo": "Socio",
     "detalle": "[Estudio]"
    }
   },
   "previews": [
    "previews/opinion-legal-1.jpg"
   ],
   "paginas": 2
  },
  {
   "tipo": "tabla-obligaciones",
   "nombre": "Tabla de obligaciones y plazos",
   "familia": "Operaciones",
   "descripcion": "Obligaciones extraídas de un contrato: cláusula, tipo, responsable, plazo, fecha y consecuencia. Cuenta vencidas, próximas (30 días) y sin fecha contra la fecha de corte.",
   "requeridos": [
    "contrato",
    "fecha",
    "obligaciones"
   ],
   "portada": false,
   "ejemplo": {
    "contrato": "Contrato de financiamiento · Deudora Modelo SpA y Banco Modelo",
    "bajada": "Obligaciones extraídas del texto íntegro, con fecha de corte",
    "partes": "Deudora Modelo SpA (Deudora) · Banco Modelo (Banco) · [Avalista]",
    "fechaContrato": "2026-03-01",
    "fecha": "2026-09-22",
    "preparadoPor": "[Nombre] · Área Mercantil",
    "ventanaDias": 30,
    "obligaciones": [
     {
      "clausula": "3.1",
      "obligacion": "Pagar las cuotas de capital e intereses en las fechas del calendario de pagos",
      "tipo": "Pagar",
      "responsable": "Deudora",
      "plazo": "Semestral, 30-03 y 30-09",
      "fechaLimite": "2026-09-30",
      "consecuencia": "Interés penal y causal de aceleración (cl. 9.1)"
     },
     {
      "clausula": "3.4",
      "obligacion": "Pagar la comisión de compromiso sobre el monto no desembolsado",
      "tipo": "Pagar",
      "responsable": "Deudora",
      "plazo": "Trimestral",
      "fechaLimite": "2026-09-30"
     },
     {
      "clausula": "4.2",
      "obligacion": "Desembolsar el segundo tramo cumplidas las condiciones precedentes",
      "tipo": "Hacer",
      "responsable": "Banco",
      "plazo": "Dentro de 5 días hábiles desde la solicitud",
      "fechaLimite": "2026-10-15"
     },
     {
      "clausula": "6.1",
      "obligacion": "Entregar estados financieros anuales auditados",
      "tipo": "Informar",
      "responsable": "Deudora",
      "plazo": "120 días desde el cierre del ejercicio",
      "fechaLimite": "2027-04-30",
      "consecuencia": "Incumplimiento subsanable en 15 días (cl. 9.2)"
     },
     {
      "clausula": "6.2",
      "obligacion": "Entregar estados financieros trimestrales",
      "tipo": "Informar",
      "responsable": "Deudora",
      "plazo": "60 días desde el cierre del trimestre",
      "fechaLimite": "2026-08-29",
      "consecuencia": "Incumplimiento subsanable en 15 días (cl. 9.2)"
     },
     {
      "clausula": "6.3",
      "obligacion": "Entregar certificado de cumplimiento de covenants firmado por el gerente de finanzas",
      "tipo": "Informar",
      "responsable": "Deudora",
      "plazo": "Junto con cada entrega de estados financieros",
      "fechaLimite": "2026-08-29"
     },
     {
      "clausula": "6.5",
      "obligacion": "Informar por escrito todo cambio de control",
      "tipo": "Informar",
      "responsable": "Deudora",
      "plazo": "5 días hábiles desde que se produzca",
      "tipoPlazo": "Condicional",
      "consecuencia": "Prepago exigible si el Banco no aprueba en 30 días (cl. 9.4)"
     },
     {
      "clausula": "6.6",
      "obligacion": "Informar cualquier litigio por cuantía superior a [monto]",
      "tipo": "Informar",
      "responsable": "Deudora",
      "plazo": "10 días hábiles desde la notificación",
      "tipoPlazo": "Condicional"
     },
     {
      "clausula": "7.1",
      "obligacion": "Mantener vigentes los seguros sobre los activos en garantía",
      "tipo": "Hacer",
      "responsable": "Deudora",
      "plazo": "Durante toda la vigencia",
      "tipoPlazo": "Permanente",
      "consecuencia": "Causal de aceleración (cl. 9.1)"
     },
     {
      "clausula": "7.2",
      "obligacion": "Mantener una razón de endeudamiento no superior a [X] veces",
      "tipo": "Hacer",
      "responsable": "Deudora",
      "plazo": "Medición semestral",
      "fechaLimite": "2026-12-31",
      "consecuencia": "Causal de aceleración (cl. 9.1)"
     },
     {
      "clausula": "7.3",
      "obligacion": "Renovar la boleta de garantía antes de su vencimiento",
      "tipo": "Hacer",
      "responsable": "Deudora",
      "plazo": "30 días antes del vencimiento",
      "fechaLimite": "2026-09-10",
      "consecuencia": "Causal de aceleración (cl. 9.1)"
     },
     {
      "clausula": "8.1",
      "obligacion": "No constituir gravámenes sobre los activos sin consentimiento del Banco",
      "tipo": "No hacer",
      "responsable": "Deudora",
      "plazo": "Durante toda la vigencia",
      "tipoPlazo": "Permanente"
     },
     {
      "clausula": "8.2",
      "obligacion": "No distribuir dividendos mientras exista un incumplimiento pendiente",
      "tipo": "No hacer",
      "responsable": "Deudora",
      "plazo": "Durante toda la vigencia",
      "tipoPlazo": "Permanente"
     },
     {
      "clausula": "8.3",
      "obligacion": "No enajenar activos esenciales",
      "tipo": "No hacer",
      "responsable": "Deudora",
      "plazo": "Durante toda la vigencia",
      "tipoPlazo": "Permanente"
     },
     {
      "clausula": "10.1",
      "obligacion": "Mantener vigente la fianza y codeuda solidaria",
      "tipo": "Hacer",
      "responsable": "Avalista",
      "plazo": "Hasta el pago total",
      "tipoPlazo": "Permanente"
     },
     {
      "clausula": "12.2",
      "obligacion": "Notificar cambio de domicilio para efectos del contrato",
      "tipo": "Informar",
      "responsable": "Deudora",
      "plazo": "Dentro de 5 días desde el cambio",
      "tipoPlazo": "Condicional"
     }
    ]
   },
   "previews": [
    "previews/tabla-obligaciones-1.jpg"
   ],
   "paginas": 4
  },
  {
   "tipo": "minuta",
   "nombre": "Minuta de reunión",
   "familia": "Interno",
   "descripcion": "Reunión con cliente o equipo: ficha, asistentes, temas tratados, acuerdos con responsable y plazo, próximos pasos.",
   "requeridos": [
    "reunion",
    "fecha",
    "asistentes",
    "temas"
   ],
   "portada": false,
   "ejemplo": {
    "reunion": "Reunión de avance · Adquisición de Filial Modelo Uno SpA",
    "bajada": "Coordinación semanal con el cliente",
    "fecha": "2026-09-22",
    "hora": "09:00 a 09:45",
    "lugar": "Videollamada",
    "asistentes": [
     "[Nombre] · Inversiones Ejemplo Limitada",
     "[Nombre] · Inversiones Ejemplo Limitada",
     "[Nombre] · Área Mercantil",
     "[Nombre] · Área Mercantil"
    ],
    "redacta": "[Nombre] · Área Mercantil",
    "distribucion": "Asistentes",
    "temas": [
     {
      "tema": "Estado del due diligence",
      "resumen": "Se presentó el resumen ejecutivo con dos hallazgos críticos: poderes vencidos de la objetivo y consentimiento pendiente de Banco Modelo al cambio de control. El cliente aceptó incluir ambos como condiciones precedentes."
     },
     {
      "tema": "Pacto de accionistas",
      "resumen": "Queda pendiente la cláusula de salida. El cliente enviará su posición sobre el mecanismo de venta conjunta durante la semana."
     },
     {
      "tema": "Calendario de cierre",
      "resumen": "Se mantiene el 15 de octubre como fecha objetivo, condicionada a la junta de ratificación del 6 de octubre y a la respuesta del Banco."
     }
    ],
    "acuerdos": [
     {
      "acuerdo": "Enviar al Banco el aviso de cambio de control con los antecedentes del adquirente",
      "responsable": "Vendedores, con revisión de Garrigues",
      "plazo": "2026-09-24"
     },
     {
      "acuerdo": "Enviar posición sobre la cláusula de salida del pacto",
      "responsable": "Cliente",
      "plazo": "2026-09-26"
     },
     {
      "acuerdo": "Circular versión revisada del pacto de accionistas",
      "responsable": "Garrigues",
      "plazo": "2026-09-30"
     },
     {
      "acuerdo": "Actualizar el checklist de cierre y compartirlo",
      "responsable": "Garrigues",
      "plazo": "Semanal, los lunes"
     }
    ],
    "pendientes": [
     "Confirmar con el Banco si la aprobación del cambio de control puede otorgarse antes de la firma.",
     "Definir si la demanda laboral en curso se cubre con indemnidad o con ajuste de precio."
    ],
    "proximaReunion": "Lunes 29 de septiembre de 2026, 09:00, videollamada."
   },
   "previews": [
    "previews/minuta-1.jpg"
   ],
   "paginas": 2
  }
 ]
};
