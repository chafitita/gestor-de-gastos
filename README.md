# Proyecto: Gestor de gastos

### APP [Gestor de gastos](https://dsi-gestor-de-gastos.netlify.app/)

Dentro de este proyecto, la idea es brindarle al usuario la capacidad de tener un control sobre los gastos, de forma porcentual permitiéndole tomar mejores decisiones financieras, visualizar gráficamente las categorías en las que mas dinero se invierte, observar ingresos y egresos de dinero.

#### Tecnologias utilizadas:
- React + vite: Es un lenguaje conocido y flexible, por lo que para este proyecto me parece el mas indicado.
- React router: Esta libreria es útil para manejar las distintas vistas de la apliación.
- Figma: Herramienta conocida y de fácil uso para el prototipado de la interfaz de usuario.
- StarUML: Herramienta conocida para la creación de los distintos diagramas utilizados.
- Camunda Modeler: Herramienta conocida para la creación de diagramas BPMN.
  

#### Requerimientos funcionales:

- El sistema debe permitir agregar categorías para los gastos.
- El sistema debe mostrar datos en formato porcentual.
- El sistema debe permitir hacer cambios de divisas.
- El sistema debe mostrar gráficos por categorías de gastos diarios, semanales, mensuales y anuales.
- El sistema debe permitir registrar ingresos.
- El sistema debe permitir registrar egresos.

#### Requerimientos no funcionales:

- Implementación web.
- El tiempo de respuesta debe ser menor a 5 segundos.

#### Diagrama de casos de uso:

<img src="https://github.com/user-attachments/assets/2f1d57ea-798a-4e51-8437-f7543b525ac1" width="720">

#### BPMN 

Caso de uso "Registrar categorización de dinero":
![registrar categorización de dinero](https://github.com/user-attachments/assets/a47f3439-836f-4805-ab6c-5ee463b8df33)
<br>
#### Descripción de CU
| flujo pricipal                                             | flujo alternativo                                                                                                                    |
|------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| 1. El usuario ingresa <br>a la web                         |                                                                                                                                      |
| 2. Ingresa un monto y <br>es mayor a 1                     | 2.1 Ingresa un monto y<br>es menor a 1<br>2.2 Se le notifica al<br>usuario que debe ingresar<br>un monto mayor a 1<br>2.3 FIN DEL CU |
| 3. Selecciona un tipo <br>de transacción                   |                                                                                                                                      |
| 4. Selecciona una categoría<br>de la lista                 | 4.1 Selecciona la opción<br>de "Agregar una categoría"<br>4.2 Extiende al CU "Crear<br>categoría"                                    |
| 5. Se le notifica que la<br>transacción a sido agregada    |                                                                                                                                      |
| 6. Se registra la nueva <br>transacción en el localstorage |                                                                                                                                      |
| 7. FIN DEL CU                                              |                                                                                                                                      |
|                                                            |                                                                                                                                      |

Caso de uso "Crear categoría"
![crear categoría](https://github.com/user-attachments/assets/83fc5281-ef51-4be0-9763-d6891a81ce0e)
<br>
#### Descripción de CU
| flujo pricipal                                                    | flujo alternativo                                                                                                                     |
|-------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| 1. El usuario ingresa <br>a la web                                |                                                                                                                                       |
| 2. Ingresa un monto                                               |                                                                                                                                       |
| 3. Selecciona un tipo<br>de transacción                           |                                                                                                                                       |
| 4. Selecciona la opción<br>"Agregar una categoría"                |                                                                                                                                       |
| 5. Clickea en la opción<br>de "Crear categoría"                   |                                                                                                                                       |
| 6. Ingresa el nombre de<br>la nueva categoría y esta<br>no existe | 6.1 Ingresa el nombre de<br>la nueva categoría y esta<br>existe<br>6.2 Se le notifica que la<br>categoría ya existe<br>6.3 FIN DEL CU |
| 7. Se registra la nueva <br>categoría en el localstorage          |                                                                                                                                       |
| 8. FIN DEL CU                                                     |                                                                                                                                       |

#### Test:
[Planilla de testeos](https://docs.google.com/spreadsheets/d/1DXB9XJ65iz6PfVFWiciyzDRo-oDrGlB91sCZZRegKWw/edit?usp=sharing)
